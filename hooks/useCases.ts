import { useCallback, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import type { ServiceCase, RequestLineItem, RequiredDocument } from '@/types/database';

/**
 * A customer's cases (v18). Each case groups the services that belong to one
 * journey — "Medical Trip to India" holds the medical request, the visa, and
 * the flights. A single-service case is rendered as a plain request so the
 * concept stays invisible until it earns its keep.
 */
export function useCases(options?: { status?: string; limit?: number }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const queryKey = useMemo(
    () => ['service_cases', user?.id, options?.status, options?.limit],
    [user?.id, options?.status, options?.limit]
  );

  const { data: cases = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!user) return [];

      let query = supabase
        .from('service_cases')
        .select(`
          id, case_uid, title, description, customer_id, status, handling_mode,
          priority, currency, total_amount, created_at, updated_at, closed_at,
          service_requests(
            id, service_id, status, is_draft, amount, currency, created_at,
            service:services(id, name, slug, icon, color)
          )
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (options?.status) query = query.eq('status', options.status);
      if (options?.limit) query = query.limit(options.limit);

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      return (data as unknown as ServiceCase[]) || [];
    },
    enabled: !!user,
  });

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`service_cases_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'service_cases',
          filter: `customer_id=eq.${user.id}`,
        },
        () => {
          // Always refetch rather than patching the payload in: the realtime row
          // carries no joined `service_requests`, so merging it would blank out
          // the services already on screen.
          queryClient.invalidateQueries({ queryKey });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, queryClient, queryKey]);

  return {
    cases,
    loading: isLoading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    refetch,
  };
}

/** One case with its line items and document checklist. */
export function useCase(caseId: string | null) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ['service_case', caseId], [caseId]);

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!caseId || !user) return null;

      const [caseRes, itemsRes, docsRes] = await Promise.all([
        supabase
          .from('service_cases')
          .select(`
            id, case_uid, title, description, customer_id, status, handling_mode,
            priority, currency, total_amount, created_at, updated_at, closed_at,
            service_requests(
              id, service_id, status, is_draft, amount, currency, metadata, created_at,
              service:services(id, name, slug, icon, color)
            )
          `)
          .eq('id', caseId)
          .single(),
        // RLS already restricts these to cases the customer owns, so no
        // additional ownership filter is needed here.
        supabase
          .from('request_line_items')
          .select('id, service_case_id, service_request_id, kind, label, description, quantity, unit_amount, amount, currency, created_at')
          .eq('service_case_id', caseId)
          .order('sort_order'),
        supabase
          .from('required_documents')
          .select('id, service_case_id, service_request_id, name, category, is_mandatory, status, file_url, file_name, rejection_reason, due_date, created_at')
          .eq('service_case_id', caseId)
          .order('sort_order'),
      ]);

      if (caseRes.error) throw caseRes.error;

      return {
        serviceCase: caseRes.data as unknown as ServiceCase,
        lineItems: (itemsRes.data ?? []) as unknown as RequestLineItem[],
        documents: (docsRes.data ?? []) as unknown as RequiredDocument[],
      };
    },
    enabled: !!caseId && !!user,
  });

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  return {
    serviceCase: data?.serviceCase ?? null,
    lineItems: data?.lineItems ?? [],
    documents: data?.documents ?? [],
    loading: isLoading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    refetch,
  };
}
