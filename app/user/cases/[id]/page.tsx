'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Layers, FileText, Receipt, CheckCircle2, Clock, AlertTriangle, Upload } from 'lucide-react';
import { useCase } from '@/hooks/useCases';
import { Skeleton } from '@/components/ui/skeleton';
import { BillingSection } from './billing-section';

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft', active: 'In Progress', on_hold: 'On Hold',
  completed: 'Completed', cancelled: 'Cancelled',
};

const DOC_STATUS: Record<string, { label: string; style: string; icon: typeof Clock }> = {
  pending:   { label: 'Not Started', style: 'bg-secondary text-foreground',   icon: Clock },
  requested: { label: 'Needed',      style: 'bg-orange-200 text-foreground',  icon: Upload },
  received:  { label: 'Under Review',style: 'bg-blue-200 text-foreground',    icon: Clock },
  verified:  { label: 'Approved',    style: 'bg-green-200 text-foreground',   icon: CheckCircle2 },
  rejected:  { label: 'Rejected',    style: 'bg-red-200 text-foreground',     icon: AlertTriangle },
};

export default function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { serviceCase, lineItems, documents, loading, error } = useCase(id);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col gap-6 pb-10">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error || !serviceCase) {
    return (
      <div className="flex-1 flex flex-col gap-6 pb-10">
        <Link href="/user/cases" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100">
          <ArrowLeft className="w-4 h-4" /> Back to cases
        </Link>
        <div className="border-2 border-red-500 bg-red-50 p-6 text-xs font-bold uppercase tracking-widest text-red-700">
          {error ?? 'This case could not be found.'}
        </div>
      </div>
    );
  }

  const services = serviceCase.service_requests ?? [];
  // Customers should never see a charge that hasn't been priced yet — a zero
  // placeholder line reads as a real fee of nothing.
  const billableItems = lineItems.filter((li) => Number(li.amount) !== 0);
  const outstandingDocs = documents.filter((d) => d.status !== 'verified');

  return (
    <div className="flex-1 flex flex-col gap-8 animate-in fade-in duration-500 pb-10">
      <Link href="/user/cases" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100 w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to cases
      </Link>

      {/* Header */}
      <header className="border-b-2 border-foreground pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 min-w-0">
        <div className="min-w-0">
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 mb-2 block font-mono">
            {serviceCase.case_uid ?? '—'}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold font-heading uppercase leading-[0.95] tracking-tight break-words">
            {serviceCase.title}
          </h1>
          {serviceCase.description && (
            <p className="text-sm opacity-70 mt-2 break-words">{serviceCase.description}</p>
          )}
        </div>
        <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-2 border-2 border-foreground bg-primary text-primary-foreground">
            {STATUS_LABELS[serviceCase.status] ?? serviceCase.status}
          </span>
          {Number(serviceCase.total_amount) > 0 && (
            <span className="font-mono text-2xl md:text-3xl font-bold">
              {Number(serviceCase.total_amount).toFixed(2)} {serviceCase.currency}
            </span>
          )}
        </div>
      </header>

      {/* Services in this case */}
      <section className="flex flex-col gap-4 min-w-0">
        <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] opacity-60">
          <Layers className="w-4 h-4" /> Services ({services.length})
        </h2>
        {services.length === 0 ? (
          <div className="border-2 border-foreground bg-white p-6 text-center text-xs font-bold uppercase tracking-widest opacity-50">
            No services on this case yet
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((r) => (
              <div key={r.id} className="border-2 border-foreground bg-white p-4 flex flex-col gap-2 min-w-0">
                <div className="flex items-start justify-between gap-2 min-w-0">
                  <h3 className="font-bold font-heading uppercase tracking-tight truncate min-w-0">
                    {r.service?.name ?? 'Service'}
                  </h3>
                  <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 border-2 border-foreground bg-secondary/40 shrink-0">
                    {r.is_draft ? 'Draft' : r.status}
                  </span>
                </div>
                {r.amount != null && (
                  <span className="font-mono text-sm font-bold">
                    {Number(r.amount).toFixed(2)} {r.currency ?? serviceCase.currency}
                  </span>
                )}
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                  Started {new Date(r.created_at).toLocaleDateString('en-GB', { timeZone: 'Asia/Dhaka' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quotes & payment — approve each service, then pay once */}
      <BillingSection
        caseId={id}
        currency={serviceCase.currency}
        serviceNameByRequestId={Object.fromEntries(
          services.map((r) => [r.id, r.service?.name ?? 'Service'])
        )}
      />

      {/* Documents */}
      {documents.length > 0 && (
        <section className="flex flex-col gap-4 min-w-0">
          <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] opacity-60">
            <FileText className="w-4 h-4" /> Documents
            {outstandingDocs.length > 0 && (
              <span className="text-orange-600">· {outstandingDocs.length} outstanding</span>
            )}
          </h2>
          <div className="border-2 border-foreground bg-white divide-y-2 divide-foreground/10">
            {documents.map((d) => {
              const meta = DOC_STATUS[d.status] ?? DOC_STATUS.pending;
              const Icon = meta.icon;
              return (
                <div key={d.id} className="p-4 flex items-center justify-between gap-3 min-w-0">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm truncate">
                      {d.name}{d.is_mandatory && <span className="text-red-600 ml-1">*</span>}
                    </p>
                    {d.status === 'rejected' && d.rejection_reason && (
                      <p className="text-[10px] font-bold uppercase tracking-wider text-red-600 mt-0.5 break-words">
                        {d.rejection_reason}
                      </p>
                    )}
                  </div>
                  <span className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1.5 border-2 border-foreground shrink-0 ${meta.style}`}>
                    <Icon className="w-3 h-3" /> {meta.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Charges */}
      {billableItems.length > 0 && (
        <section className="flex flex-col gap-4 min-w-0">
          <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] opacity-60">
            <Receipt className="w-4 h-4" /> Charges
          </h2>
          <div className="border-2 border-foreground bg-white">
            <div className="divide-y-2 divide-foreground/10">
              {billableItems.map((li) => (
                <div key={li.id} className="p-4 flex items-center justify-between gap-3 min-w-0">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm truncate">{li.label}</p>
                    {Number(li.quantity) !== 1 && (
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                        {li.quantity} × {Number(li.unit_amount).toFixed(2)}
                      </p>
                    )}
                  </div>
                  <span className={`font-mono text-sm font-bold shrink-0 ${Number(li.amount) < 0 ? 'text-green-700' : ''}`}>
                    {Number(li.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-4 border-t-2 border-foreground flex items-center justify-between gap-3 bg-secondary/30 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-widest shrink-0">Total</span>
              <span className="font-mono text-lg font-bold truncate">
                {Number(serviceCase.total_amount).toFixed(2)} {serviceCase.currency}
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
