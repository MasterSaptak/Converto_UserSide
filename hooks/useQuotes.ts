import { useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import type { Quote, Payment, PaymentMethod } from '@/types/database';

/**
 * Quotes and payments for one case.
 *
 * Quotes are per service — each is approved on its own timeline. Payment is a
 * single payment settling every approved, unpaid quote at once, so the customer
 * approves several times but pays once.
 */
export function useCaseBilling(caseId: string | null) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ['case_billing', caseId], [caseId]);

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!caseId || !user) return null;

      const [quotesRes, paymentsRes, methodsRes, walletRes] = await Promise.all([
        // RLS hides drafts, so anything returned here has genuinely been sent.
        supabase
          .from('quotes')
          .select('id, quote_uid, request_id, service_case_id, amount, currency_code, status, valid_until, notes, sent_at, approved_at, rejected_at, rejection_reason, breakdown')
          .eq('service_case_id', caseId)
          .order('created_at', { ascending: false }),
        supabase
          .from('payments')
          .select('id, payment_uid, service_case_id, amount, currency, status, method, reference, proof_url, rejection_reason, created_at')
          .eq('service_case_id', caseId)
          .order('created_at', { ascending: false }),
        supabase
          .from('payment_methods')
          .select('id, name, slug, is_active, config')
          .eq('is_active', true),
        supabase
          .from('wallets')
          .select('id, wallet_accounts(id, currency_code, available_balance)')
          .eq('profile_id', user.id)
          .maybeSingle(),
      ]);

      if (quotesRes.error) throw quotesRes.error;

      return {
        quotes: (quotesRes.data ?? []) as unknown as Quote[],
        payments: (paymentsRes.data ?? []) as unknown as Payment[],
        methods: (methodsRes.data ?? []) as unknown as PaymentMethod[],
        walletAccounts: ((walletRes.data as unknown as {
          wallet_accounts?: { id: string; currency_code: string; available_balance: number }[]
        } | null)?.wallet_accounts) ?? [],
      };
    },
    enabled: !!caseId && !!user,
  });

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
    // The case itself carries the total and status, which both move when a
    // quote is approved or a payment lands.
    queryClient.invalidateQueries({ queryKey: ['service_case', caseId] });
  }, [queryClient, queryKey, caseId]);

  return {
    quotes: data?.quotes ?? [],
    payments: data?.payments ?? [],
    methods: data?.methods ?? [],
    walletAccounts: data?.walletAccounts ?? [],
    loading: isLoading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    refetch,
  };
}

/** Approve a quote. RLS permits only sent → approved on the customer's own case. */
export async function approveQuote(quoteId: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('quotes')
    .update({ status: 'approved', approved_at: new Date().toISOString() })
    .eq('id', quoteId)
    .eq('status', 'sent');   // guard: a stale tab must not re-approve

  return { error: error?.message ?? null };
}

export async function rejectQuote(quoteId: string, reason: string): Promise<{ error: string | null }> {
  if (!reason.trim()) return { error: 'Please say what you would like changed.' };

  const { error } = await supabase
    .from('quotes')
    .update({
      status: 'rejected',
      rejected_at: new Date().toISOString(),
      rejection_reason: reason.trim(),
    })
    .eq('id', quoteId)
    .eq('status', 'sent');

  return { error: error?.message ?? null };
}

/**
 * Pay approved quotes from wallet balance.
 *
 * Goes through an RPC rather than reading the balance and updating it from the
 * client: check-then-deduct over two round trips lets two concurrent payments
 * both pass the check and overdraw the wallet. The function locks the wallet row.
 */
export async function payFromWallet(
  caseId: string,
  quoteIds: string[]
): Promise<{ paymentId: string | null; error: string | null }> {
  const { data, error } = await supabase.rpc('fn_pay_case_from_wallet', {
    p_case_id: caseId,
    p_quote_ids: quoteIds,
  });

  if (error) return { paymentId: null, error: error.message };
  return { paymentId: data as string, error: null };
}

/**
 * Declare an offline payment (bKash / bank / cash).
 *
 * Created as `awaiting_confirmation` — RLS forbids a customer creating a
 * completed payment. Staff verify the proof and confirm; that is the only way
 * money is recognised.
 */
export async function declareOfflinePayment(params: {
  caseId: string;
  quoteIds: string[];
  amount: number;
  currency: string;
  reference: string;
  proofFile?: File;
}): Promise<{ paymentId: string | null; error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { paymentId: null, error: 'Not authenticated.' };

  const { data: payment, error: payError } = await supabase
    .from('payments')
    .insert({
      service_case_id: params.caseId,
      profile_id: user.id,
      amount: params.amount,
      currency: params.currency,
      status: 'awaiting_confirmation',
      method: 'manual',
      reference: params.reference.trim() || null,
    })
    .select('id, payment_uid')
    .single();

  if (payError || !payment) return { paymentId: null, error: payError?.message ?? 'Could not record the payment.' };

  const { error: allocError } = await supabase
    .from('payment_allocations')
    .insert(params.quoteIds.map((quoteId) => ({
      payment_id: payment.id,
      quote_id: quoteId,
      // Allocation amounts are reconciled by staff on confirmation; recording
      // the payment at all is what matters here.
      amount: 0,
    })));

  if (allocError) {
    // Without allocations the payment settles nothing, so don't leave it behind
    // looking like a real pending payment.
    await supabase.from('payments').delete().eq('id', payment.id);
    return { paymentId: null, error: `Could not link the payment to your quotes: ${allocError.message}` };
  }

  if (params.proofFile) {
    // Path must start with the user's id — the storage policy checks exactly that.
    const ext = params.proofFile.name.split('.').pop() ?? 'jpg';
    const path = `${user.id}/${payment.payment_uid ?? payment.id}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('payment-proofs')
      .upload(path, params.proofFile, { upsert: true });

    if (uploadError) {
      // The payment is recorded; staff can still chase the proof separately.
      return { paymentId: payment.id, error: `Payment recorded, but the proof upload failed: ${uploadError.message}` };
    }

    const { data: signed } = await supabase.storage
      .from('payment-proofs')
      .createSignedUrl(path, 60 * 60 * 24 * 365);

    await supabase
      .from('payments')
      .update({ proof_url: signed?.signedUrl ?? path, proof_uploaded_at: new Date().toISOString() })
      .eq('id', payment.id);
  }

  return { paymentId: payment.id, error: null };
}
