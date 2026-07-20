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
        .select('*, service:services(*)')
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
}

export async function submitServiceRequest(params: SubmitRequestParams): Promise<{
  data: ServiceRequest | null;
  error: string | null;
}> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, error: 'Not authenticated. Please log in.' };
  }

  // Look up the service by slug
  const { data: service, error: serviceError } = await supabase
    .from('services')
    .select('id')
    .eq('slug', params.serviceSlug)
    .single();

  if (serviceError || !service) {
    return { data: null, error: 'Service not found.' };
  }

  // Insert the service request
  const { data: request, error: insertError } = await supabase
    .from('service_requests')
    .insert({
      profile_id: user.id,
      service_id: service.id,
      amount: params.amount || null,
      currency: params.currency || null,
      metadata: params.metadata,
      notes: params.notes || null,
      status: 'Submitted',
      priority: 'Normal',
    })
    .select('*')
    .single();

  if (insertError) {
    return { data: null, error: insertError.message };
  }

  // Log the activity
  await supabase.from('activity_logs').insert({
    profile_id: user.id,
    entity_type: 'service_request',
    entity_id: request.id,
    action: 'REQUEST_SUBMITTED',
    details: `Submitted ${params.serviceSlug} request`,
    metadata: { service_slug: params.serviceSlug },
  });

  return { data: request as ServiceRequest, error: null };
}
