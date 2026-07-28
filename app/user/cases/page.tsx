'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Layers, ChevronRight, Plus } from 'lucide-react';
import { useCases } from '@/hooks/useCases';
import { Skeleton } from '@/components/ui/skeleton';

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  active: 'In Progress',
  on_hold: 'On Hold',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-secondary text-foreground',
  active: 'bg-primary text-primary-foreground',
  on_hold: 'bg-orange-200 text-foreground',
  completed: 'bg-green-200 text-foreground',
  cancelled: 'bg-red-200 text-foreground',
};

const FILTERS = ['All', 'In Progress', 'Completed', 'Cancelled'] as const;

export default function MyCasesPage() {
  const { cases, loading, error } = useCases();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');

  const visible = useMemo(() => {
    if (filter === 'All') return cases;
    return cases.filter((c) => STATUS_LABELS[c.status] === filter);
  }, [cases, filter]);

  return (
    <div className="flex-1 flex flex-col gap-8 md:gap-10 animate-in fade-in duration-500 pb-10">
      <header className="border-b-2 border-foreground pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="min-w-0">
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 mb-2 block">Your Journeys</span>
          <h1 className="text-4xl md:text-6xl font-bold font-heading uppercase leading-[0.9] tracking-tight">Cases</h1>
        </div>
        <Link
          href="/services"
          className="border-2 border-foreground bg-primary text-primary-foreground px-4 py-2 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] hover:shadow-[4px_4px_0px_var(--color-foreground)] hover:-translate-y-1 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> New Request
        </Link>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`border-2 border-foreground px-4 py-2.5 font-bold uppercase tracking-widest text-[10px] transition-all ${
              filter === f
                ? 'bg-foreground text-background'
                : 'bg-white hover:shadow-[3px_3px_0px_var(--color-foreground)] hover:-translate-y-0.5'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {error && (
        <div className="border-2 border-red-500 bg-red-50 p-4 text-xs font-bold uppercase tracking-widest text-red-700">
          Could not load your cases: {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col gap-4">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
      ) : visible.length === 0 ? (
        <div className="border-2 border-foreground bg-white p-10 flex flex-col items-center gap-4 text-center">
          <Layers className="w-10 h-10 opacity-20" />
          <p className="font-bold uppercase tracking-widest text-xs opacity-60">
            {filter === 'All' ? 'You have no cases yet' : `No ${filter.toLowerCase()} cases`}
          </p>
          {filter === 'All' && (
            <Link
              href="/services"
              className="border-2 border-foreground bg-primary text-primary-foreground px-4 py-2 font-bold uppercase tracking-widest text-[10px] hover:shadow-[4px_4px_0px_var(--color-foreground)] hover:-translate-y-1 transition-all"
            >
              Start a request
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {visible.map((c) => {
            const services = c.service_requests ?? [];
            // A one-service case is just that request — don't make the customer
            // learn the word "case" until a journey actually holds more than one.
            const isMulti = services.length > 1;

            return (
              <Link
                key={c.id}
                href={`/user/cases/${c.id}`}
                className="border-2 border-foreground bg-white p-4 md:p-5 flex flex-col gap-3 hover:shadow-[6px_6px_0px_var(--color-foreground)] hover:-translate-y-1 transition-all min-w-0"
              >
                <div className="flex items-start justify-between gap-3 min-w-0">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 font-mono">
                      {c.case_uid ?? '—'}
                    </span>
                    <h2 className="text-lg md:text-xl font-bold font-heading uppercase tracking-tight truncate mt-0.5">
                      {c.title}
                    </h2>
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1.5 border-2 border-foreground shrink-0 ${STATUS_STYLES[c.status] ?? ''}`}>
                    {STATUS_LABELS[c.status] ?? c.status}
                  </span>
                </div>

                {isMulti && (
                  <div className="flex flex-wrap gap-1.5">
                    {services.map((r) => (
                      <span key={r.id} className="text-[9px] font-bold uppercase tracking-widest border-2 border-foreground px-2 py-1 bg-secondary/40">
                        {r.service?.name ?? 'Service'}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 pt-3 border-t-2 border-foreground/10 min-w-0">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest opacity-60 shrink-0">
                    <Layers className="w-3.5 h-3.5" />
                    {services.length} {services.length === 1 ? 'service' : 'services'}
                  </span>
                  <span className="flex items-center gap-2 shrink-0">
                    {Number(c.total_amount) > 0 && (
                      <span className="font-mono font-bold text-sm">
                        {Number(c.total_amount).toFixed(2)} {c.currency}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 opacity-40" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
