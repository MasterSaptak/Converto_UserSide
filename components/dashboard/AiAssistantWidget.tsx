'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ConvertoOrb } from '@/components/ai/ConvertoOrb';

const SUGGESTIONS = [
  'Find cheapest payment',
  'Show current offers',
  'Check my latest request',
];

export const AiAssistantWidget = React.memo(function AiAssistantWidget() {
  return (
    <div className="group relative overflow-hidden rounded-2xl border-2 border-foreground bg-gradient-to-br from-[#f4f3ff] via-white to-[#fff1f5] p-4 shadow-brutal dark:from-indigo-950 dark:via-card dark:to-rose-950/60">
      <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-indigo-400/20 blur-3xl transition-transform duration-700 group-hover:scale-125" />
      <div className="pointer-events-none absolute -bottom-12 -left-10 h-28 w-28 rounded-full bg-rose-400/15 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <ConvertoOrb size="md" state="idle" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">
              <Sparkles className="h-3 w-3" /> Converto intelligence
            </div>
            <h3 className="mt-1 truncate font-heading text-xl font-black uppercase leading-none">Converto AI</h3>
            <p className="mt-1 text-[8px] font-bold uppercase tracking-wider text-muted-foreground">Live data. Smarter guidance.</p>
          </div>
        </div>

        <div className="my-4 flex flex-col gap-1.5">
          {SUGGESTIONS.map((suggestion) => (
            <Link
              key={suggestion}
              href={`/ai?prompt=${encodeURIComponent(suggestion)}`}
              className="flex items-center justify-between rounded-lg border border-foreground/8 bg-white/55 px-2.5 py-2 text-[9px] font-black uppercase tracking-wide text-foreground/70 backdrop-blur-sm transition-all hover:border-indigo-500/25 hover:bg-white hover:text-indigo-700 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:text-indigo-200"
            >
              <span className="truncate">{suggestion}</span>
              <ArrowRight className="h-3 w-3 shrink-0 opacity-45 transition-transform" />
            </Link>
          ))}
        </div>

        <Link
          href="/ai"
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-foreground bg-gradient-to-r from-indigo-600 to-violet-700 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-[3px_3px_0px_var(--color-foreground)] transition-all hover:-translate-y-0.5 hover:shadow-[4px_5px_0px_var(--color-foreground)]"
        >
          Ask Converto AI <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
});
