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

export async function submitServiceRequest(params: SubmitRequestParams): Promise<{
  data: ServiceRequest | null;
  caseId: string | null;
  error: string | null;
}> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, caseId: null, error: 'Not authenticated. Please log in.' };
  }

  // 1-Tap Universal Builder via Postgres RPC
  const { data: result, error } = await supabase.rpc('fn_create_service_request', {
    p_service_slug: params.serviceSlug,
    p_profile_id: user.id,
    p_amount: params.amount || null,
    p_currency: params.currency || 'USD',
    p_metadata: params.metadata || {},
    p_notes: params.notes || null,
    p_case_id: params.caseId || null,
    p_case_title: params.caseTitle?.trim() || null,
    p_is_draft: false
  });

  if (error) {
    console.error('[submitServiceRequest] RPC error:', error);
    return { data: null, caseId: null, error: error.message };
  }

  const payload = result as { case_id: string; request_id: string };

  // Fetch the created request fully joined
  const { data: request, error: fetchError } = await supabase
    .from('service_requests')
    .select('*, service:services(*), stage:pipeline_stages(*), status_obj:pipeline_statuses(*)')
    .eq('id', payload.request_id)
    .single();

  if (fetchError) {
    console.error('[submitServiceRequest] fetch newly created error:', fetchError);
    return { data: null, caseId: payload.case_id, error: 'Request created but failed to load fully.' };
  }

  return { data: request as ServiceRequest, caseId: payload.case_id, error: null };
}
