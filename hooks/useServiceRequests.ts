import { useCallback, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import type { ServiceRequest, Service } from '@/types/database';
import { useAuth } from './useAuth';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface UseServiceRequestsOptions {
  limit?: number;
  status?: string;
}

export function useServiceRequests(options?: UseServiceRequestsOptions) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const queryKey = useMemo(
    () => ['service_requests', user?.id, options?.status, options?.limit],
    [user?.id, options?.status, options?.limit]
  );

  const { data: requests = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!user) return [];

      let query = supabase
        .from('service_requests')
        .select('*, service:services(*), stage:pipeline_stages(*), status_obj:pipeline_statuses(*)')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false });

      if (options?.status) {
        query = query.eq('status', options.status);
      }
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      return (data as ServiceRequest[]) || [];
    },
    enabled: !!user,
  });

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`service_requests_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'service_requests',
          filter: `profile_id=eq.${user.id}`,
        },
        (payload) => {
          // Optimistically update the cache
          queryClient.setQueryData<ServiceRequest[]>(queryKey, (old) => {
            if (!old) return old;
            
            if (payload.eventType === 'INSERT') {
              // Prepend new request. Note: relationships like 'service' won't be fully populated 
              // until the invalidation fetch completes.
              return [payload.new as ServiceRequest, ...old];
            }
            if (payload.eventType === 'UPDATE') {
              return old.map((req) => 
                req.id === payload.new.id ? { ...req, ...payload.new } : req
              );
            }
            if (payload.eventType === 'DELETE') {
              return old.filter((req) => req.id !== payload.old.id);
            }
            return old;
          });

          // Invalidate to fetch fully joined data in the background
          queryClient.invalidateQueries({ queryKey });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient, queryKey]);

  return { 
    requests, 
    loading: isLoading, 
    error: error instanceof Error ? error.message : error ? String(error) : null,
    refetch 
  };
}

export function useServices() {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('created_at');
      
      if (error) throw error;
      return (data as Service[]) || [];
    },
    staleTime: 5 * 60 * 1000, // Cache services for 5 minutes since they rarely change
  });

  return { services, loading: isLoading };
}

interface SubmitRequestParams {
  serviceSlug: string;
  amount?: number;
  currency?: string;
  metadata: Record<string, unknown>;
  notes?: string;
  /**
   * Attach to an existing case instead of opening a new one — this is how a
   * customer adds a second service (visa, flights) to a journey they already
   * started. Omit for the normal 1-Tap flow.
   */
  caseId?: string;
  /** Overrides the default case title (the service name). */
  caseTitle?: string;
}

/**
 * 1-Tap request submission.
 *
 * Since v18 every request belongs to a `service_case`, so this opens a case and
 * its primary request together. A single-service case renders as a plain
 * request in the UI — the customer sees no extra concept until they add a
 * second service to the same journey.
 */
export async function submitServiceRequest(params: SubmitRequestParams): Promise<{
  data: ServiceRequest | null;
  caseId: string | null;
  error: string | null;
}> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, caseId: null, error: 'Not authenticated. Please log in.' };
  }

  // Look up the service by slug
  const { data: service, error: serviceError } = await supabase
    .from('services')
    .select('id, name')
    .eq('slug', params.serviceSlug)
    .single();

  if (serviceError || !service) {
    return { data: null, caseId: null, error: 'Service not found.' };
  }

  // ── 1. Resolve the case ───────────────────────────────────────────────
  let caseId = params.caseId ?? null;
  // Tracks whether WE opened the case, so a later failure only rolls back a
  // case we created — never one the customer was already using.
  let createdCase = false;

  if (!caseId) {
    const { data: newCase, error: caseError } = await supabase
      .from('service_cases')
      .insert({
        title: params.caseTitle?.trim() || service.name,
        customer_id: user.id,
        handling_mode: 'SELF_SERVICE',
        status: 'active',
        priority: 'Normal',
        currency: params.currency || 'USD',
        created_by: user.id,
      })
      .select('id')
      .single();

    if (caseError || !newCase) {
      return { data: null, caseId: null, error: caseError?.message ?? 'Could not open a case.' };
    }
    caseId = newCase.id;
    createdCase = true;
  }

  // ── 2. Create the request inside it ───────────────────────────────────
  const { data: request, error: insertError } = await supabase
    .from('service_requests')
    .insert({
      profile_id: user.id,
      service_id: service.id,
      service_case_id: caseId,
      service_type: params.serviceSlug,
      amount: params.amount || null,
      currency: params.currency || null,
      metadata: params.metadata,
      notes: params.notes || null,
      status: 'Submitted',
      priority: 'Normal',
      is_draft: false,
    })
    .select('*')
    .single();

  if (insertError) {
    // PostgREST gives us no transaction, so an empty case would be left behind
    // and show up in the customer's list as a journey with no services.
    if (createdCase && caseId) {
      await supabase.from('service_cases').delete().eq('id', caseId);
    }
    return { data: null, caseId: null, error: insertError.message };
  }

  // ── 3. Audit trail ────────────────────────────────────────────────────
  // Was `activity_logs`, a table that has never existed in this database — and
  // the error was discarded, so it failed silently on every submission.
  const { error: logError } = await supabase.from('activity_feed').insert({
    service_case_id: caseId,
    service_request_id: request.id,
    action_type: 'Request Submitted',
    description: `Submitted ${service.name} request`,
    created_by: user.id,
    actor_type: 'customer',
    visibility: 'customer',
    metadata: { service_slug: params.serviceSlug },
  });

  // The request is committed; a failed audit write must not fail the submission.
  if (logError) {
    console.error('[activity_feed] failed to log submission:', logError.message);
  }

  return { data: request as ServiceRequest, caseId, error: null };
}
