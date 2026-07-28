'use client';

// =====================================================
// CONVERTO PLATFORM — Customer quote approval + payment
// =====================================================
// Quotes are per service and approved individually. Once one or more are
// approved, a single payment settles all of them.

import { useState, useMemo, useTransition } from 'react';
import {
  FileSignature, CheckCircle2, XCircle, Wallet, Upload, Clock,
  AlertTriangle, Receipt,
} from 'lucide-react';
import {
  useCaseBilling, approveQuote, rejectQuote, payFromWallet, declareOfflinePayment,
} from '@/hooks/useQuotes';
import type { Quote } from '@/types/database';

const QUOTE_STYLES: Record<string, string> = {
  sent:       'bg-blue-200 text-foreground',
  approved:   'bg-green-200 text-foreground',
  rejected:   'bg-red-200 text-foreground',
  expired:    'bg-orange-200 text-foreground',
  superseded: 'bg-secondary text-foreground opacity-60',
};

const PAYMENT_STYLES: Record<string, string> = {
  awaiting_confirmation: 'bg-yellow-200 text-foreground',
  completed:             'bg-green-200 text-foreground',
  failed:                'bg-red-200 text-foreground',
  refunded:              'bg-orange-200 text-foreground',
};

export function BillingSection({
  caseId, currency, serviceNameByRequestId,
}: {
  caseId: string;
  currency: string;
  serviceNameByRequestId: Record<string, string>;
}) {
  const { quotes, payments, walletAccounts, loading, error, refetch } = useCaseBilling(caseId);
  const [isPending, startTransition] = useTransition();

  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [payOpen, setPayOpen] = useState(false);
  const [reference, setReference] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Only quotes still awaiting a decision, or already agreed.
  const liveQuotes = useMemo(
    () => quotes.filter((q) => ['sent', 'approved', 'rejected'].includes(q.status)),
    [quotes]
  );

  const paidQuoteIds = useMemo(() => {
    // A quote is settled if any non-failed payment covers it. Payments carry no
    // allocation join here, so approximate with "a completed/pending payment
    // exists that covers the approved total" — staff reconcile on confirmation.
    const settledTotal = payments
      .filter((p) => ['awaiting_confirmation', 'completed'].includes(p.status))
      .reduce((s, p) => s + Number(p.amount), 0);
    if (settledTotal <= 0) return new Set<string>();

    const ids = new Set<string>();
    let remaining = settledTotal;
    for (const q of quotes.filter((x) => x.status === 'approved')) {
      if (remaining >= Number(q.amount)) { ids.add(q.id); remaining -= Number(q.amount); }
    }
    return ids;
  }, [quotes, payments]);

  const payableQuotes = useMemo(
    () => quotes.filter((q) => q.status === 'approved' && !paidQuoteIds.has(q.id)),
    [quotes, paidQuoteIds]
  );

  const payableTotal = payableQuotes.reduce((s, q) => s + Number(q.amount), 0);

  const walletAccount = walletAccounts.find((a) => a.currency_code === currency);
  const walletBalance = Number(walletAccount?.available_balance ?? 0);
  const walletCovers = walletAccount != null && walletBalance >= payableTotal && payableTotal > 0;

  function handleApprove(quoteId: string) {
    startTransition(async () => {
      const { error: err } = await approveQuote(quoteId);
      if (err) { setNotice(err); return; }
      setNotice(null);
      refetch();
    });
  }

  function handleReject(quoteId: string) {
    startTransition(async () => {
      const { error: err } = await rejectQuote(quoteId, rejectReason);
      if (err) { setNotice(err); return; }
      setRejectingId(null); setRejectReason(''); setNotice(null);
      refetch();
    });
  }

  function handleWalletPay() {
    startTransition(async () => {
      const { error: err } = await payFromWallet(caseId, payableQuotes.map((q) => q.id));
      if (err) { setNotice(err); return; }
      setNotice(null); setPayOpen(false);
      refetch();
    });
  }

  function handleOfflinePay() {
    startTransition(async () => {
      const { error: err } = await declareOfflinePayment({
        caseId,
        quoteIds: payableQuotes.map((q) => q.id),
        amount: payableTotal,
        currency,
        reference,
        proofFile: proofFile ?? undefined,
      });
      if (err) { setNotice(err); return; }
      setNotice(null); setPayOpen(false); setReference(''); setProofFile(null);
      refetch();
    });
  }

  if (loading) return null;

  if (error) {
    return (
      <section className="border-2 border-red-500 bg-red-50 p-4 text-xs font-bold uppercase tracking-widest text-red-700">
        Could not load your quotes: {error}
      </section>
    );
  }

  if (liveQuotes.length === 0 && payments.length === 0) return null;

  return (
    <section className="flex flex-col gap-4 min-w-0">
      <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] opacity-60">
        <FileSignature className="w-4 h-4" /> Quotes & Payment
      </h2>

      {notice && (
        <div className="border-2 border-red-500 bg-red-50 p-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <p className="text-[11px] font-bold uppercase tracking-wider text-red-700 break-words">{notice}</p>
        </div>
      )}

      {/* Quotes, one per service */}
      {liveQuotes.map((q: Quote) => (
        <div key={q.id} className="border-2 border-foreground bg-white p-4 flex flex-col gap-3 min-w-0">
          <div className="flex items-start justify-between gap-3 min-w-0">
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 font-mono">
                {q.quote_uid ?? '—'}
              </span>
              <h3 className="font-bold font-heading uppercase tracking-tight truncate">
                {q.request_id ? serviceNameByRequestId[q.request_id] ?? 'Service' : 'Service'}
              </h3>
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1.5 border-2 border-foreground shrink-0 ${QUOTE_STYLES[q.status] ?? ''}`}>
              {q.status}
            </span>
          </div>

          <span className="font-mono text-2xl font-bold">
            {Number(q.amount).toFixed(2)} {q.currency_code ?? currency}
          </span>

          {q.notes && <p className="text-xs opacity-70 break-words">{q.notes}</p>}

          {q.status === 'sent' && q.valid_until && (
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">
              Valid until {new Date(q.valid_until).toLocaleDateString('en-GB', { timeZone: 'Asia/Dhaka' })}
            </span>
          )}

          {q.status === 'rejected' && q.rejection_reason && (
            <p className="text-[10px] font-bold uppercase tracking-wider text-red-600 break-words">
              You asked for: {q.rejection_reason}
            </p>
          )}

          {q.status === 'sent' && (
            rejectingId === q.id ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={2}
                  placeholder="What would you like changed?"
                  className="w-full border-2 border-foreground p-2 text-[16px] sm:text-sm outline-none"
                />
                <div className="flex gap-2">
                  <button onClick={() => handleReject(q.id)} disabled={isPending}
                    className="flex-1 border-2 border-foreground bg-red-200 px-3 py-2.5 font-bold uppercase tracking-widest text-[10px] disabled:opacity-40">
                    Send Feedback
                  </button>
                  <button onClick={() => { setRejectingId(null); setRejectReason(''); }}
                    className="border-2 border-foreground bg-white px-3 py-2.5 font-bold uppercase tracking-widest text-[10px]">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => handleApprove(q.id)} disabled={isPending}
                  className="flex-1 border-2 border-foreground bg-primary text-primary-foreground px-3 py-3 font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:shadow-[4px_4px_0px_var(--color-foreground)] hover:-translate-y-0.5 transition-all disabled:opacity-40">
                  <CheckCircle2 className="w-4 h-4" /> Approve
                </button>
                <button onClick={() => setRejectingId(q.id)} disabled={isPending}
                  className="border-2 border-foreground bg-white px-3 py-3 font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 disabled:opacity-40">
                  <XCircle className="w-4 h-4" /> Request Change
                </button>
              </div>
            )
          )}
        </div>
      ))}

      {/* Pay for everything approved, in one go */}
      {payableTotal > 0 && (
        <div className="border-2 border-foreground bg-secondary/30 p-4 flex flex-col gap-3 min-w-0">
          <div className="flex items-center justify-between gap-3 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
              Due now ({payableQuotes.length} {payableQuotes.length === 1 ? 'service' : 'services'})
            </span>
            <span className="font-mono text-xl font-bold">{payableTotal.toFixed(2)} {currency}</span>
          </div>

          {!payOpen ? (
            <button onClick={() => setPayOpen(true)}
              className="border-2 border-foreground bg-primary text-primary-foreground px-4 py-3 font-bold uppercase tracking-widest text-[11px] hover:shadow-[4px_4px_0px_var(--color-foreground)] hover:-translate-y-0.5 transition-all">
              Pay Now
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Wallet, when it actually covers the amount */}
              <button
                onClick={handleWalletPay}
                disabled={isPending || !walletCovers}
                className="border-2 border-foreground bg-white px-4 py-3 flex items-center justify-between gap-2 disabled:opacity-40 hover:shadow-[4px_4px_0px_var(--color-foreground)] hover:-translate-y-0.5 transition-all"
              >
                <span className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
                  <Wallet className="w-4 h-4" /> Pay from wallet
                </span>
                <span className="font-mono text-xs font-bold">
                  {walletAccount ? `${walletBalance.toFixed(2)} ${currency}` : 'No wallet'}
                </span>
              </button>
              {walletAccount && !walletCovers && (
                <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                  Wallet balance is short by {(payableTotal - walletBalance).toFixed(2)} {currency}
                </p>
              )}

              <div className="border-2 border-foreground bg-white p-3 flex flex-col gap-2">
                <span className="font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                  <Receipt className="w-4 h-4" /> Paid by bKash / bank / cash
                </span>
                <input
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Transaction ID / reference"
                  className="w-full border-2 border-foreground p-2 text-[16px] sm:text-sm outline-none"
                />
                <label className="flex items-center gap-2 border-2 border-dashed border-foreground p-2.5 cursor-pointer">
                  <Upload className="w-4 h-4 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-widest truncate min-w-0">
                    {proofFile ? proofFile.name : 'Attach payment screenshot'}
                  </span>
                  <input type="file" accept="image/*,application/pdf" className="hidden"
                    onChange={(e) => setProofFile(e.target.files?.[0] ?? null)} />
                </label>
                <button onClick={handleOfflinePay} disabled={isPending || !reference.trim()}
                  className="border-2 border-foreground bg-foreground text-background px-4 py-2.5 font-bold uppercase tracking-widest text-[10px] disabled:opacity-40">
                  Submit for confirmation
                </button>
                <p className="text-[9px] font-bold uppercase tracking-wider opacity-50 leading-relaxed">
                  Our team verifies the payment before your services start.
                </p>
              </div>

              <button onClick={() => setPayOpen(false)}
                className="text-[10px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100">
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* Payment history */}
      {payments.map((p) => (
        <div key={p.id} className="border-2 border-foreground bg-white p-4 flex flex-col gap-2 min-w-0">
          <div className="flex items-center justify-between gap-3 min-w-0">
            <span className="flex items-center gap-2 min-w-0">
              {p.method === 'wallet' ? <Wallet className="w-4 h-4 shrink-0 opacity-60" /> : <Receipt className="w-4 h-4 shrink-0 opacity-60" />}
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest opacity-50 truncate">
                {p.payment_uid ?? '—'}
              </span>
            </span>
            <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1.5 border-2 border-foreground shrink-0 ${PAYMENT_STYLES[p.status] ?? 'bg-secondary'}`}>
              {p.status === 'awaiting_confirmation' ? 'Verifying' : p.status}
            </span>
          </div>
          <span className="font-mono text-lg font-bold">
            {Number(p.amount).toFixed(2)} {p.currency ?? currency}
          </span>
          {p.status === 'awaiting_confirmation' && (
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest opacity-60">
              <Clock className="w-3.5 h-3.5" /> Waiting for our team to verify
            </span>
          )}
          {p.status === 'failed' && p.rejection_reason && (
            <p className="text-[10px] font-bold uppercase tracking-wider text-red-600 break-words">
              {p.rejection_reason}
            </p>
          )}
        </div>
      ))}
    </section>
  );
}
