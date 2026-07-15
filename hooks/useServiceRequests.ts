'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { ServiceRequest, Service } from '@/types/database';

interface UseServiceRequestsOptions {
  limit?: number;
  status?: string;
}

export function useServiceRequests(options?: UseServiceRequestsOptions) {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    let query = supabase
      .from('service_requests')
      .select('*, service:services(*), quote:quotes(*)')
      .eq('profile_id', user.id)
      .order('created_at', { ascending: false });

    if (options?.status) {
      query = query.eq('status', options.status);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setRequests((data as ServiceRequest[]) || []);
    }
    setLoading(false);
  }, [options?.status, options?.limit]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return { requests, loading, error, refetch: fetchRequests };
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('created_at');

      setServices((data as Service[]) || []);
      setLoading(false);
    }
    fetch();
  }, []);

  return { services, loading };
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
