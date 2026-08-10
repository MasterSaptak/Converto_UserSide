import React from 'react';
import { Bot, Construction, Sparkles } from 'lucide-react';

export const AiAssistantWidget = React.memo(function AiAssistantWidget() {
  return (
    <aside
      aria-label="Converto AI is under construction"
      className="relative isolate overflow-hidden rounded-2xl border-2 border-violet-500/70 bg-gradient-to-br from-violet-100 via-white to-rose-100 p-4 shadow-[0_0_18px_rgba(124,58,237,0.35),4px_4px_0px_var(--color-foreground)] dark:from-violet-950 dark:via-card dark:to-rose-950"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 -z-10 h-28 w-28 animate-pulse rounded-full bg-violet-500/30 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-8 -z-10 h-24 w-24 animate-pulse rounded-full bg-rose-400/25 blur-2xl [animation-delay:700ms]" />
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-white/70 dark:ring-white/10" />

      <div className="flex items-start gap-3">
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-foreground bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-[3px_3px_0px_var(--color-foreground)]">
          <Bot className="h-5 w-5" aria-hidden="true" />
          <Sparkles className="absolute -right-1.5 -top-1.5 h-4 w-4 text-amber-400 drop-shadow" aria-hidden="true" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300">
            <Construction className="h-3 w-3" aria-hidden="true" />
            Building intelligence
          </div>
          <h3 className="mt-1 font-heading text-lg font-black uppercase leading-none text-foreground">
            Converto AI
          </h3>
        </div>
      </div>

      <p className="mt-3 text-[10px] font-bold leading-relaxed text-foreground/70">
        Our intelligent Converto chatbot is under construction. We&apos;re refining live rates, smarter guidance, and secure assistance before launch.
      </p>

      <div className="mt-3 flex items-center gap-2 rounded-lg border border-violet-500/20 bg-white/60 px-2.5 py-2 text-[8px] font-black uppercase tracking-[0.16em] text-violet-700 backdrop-blur-sm dark:bg-white/5 dark:text-violet-200">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
        </span>
        Coming soon to Converto
      </div>
    </aside>
  );
});
