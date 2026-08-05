'use client';

import { cn } from '@/lib/utils';

export type ConvertoOrbState = 'idle' | 'thinking' | 'speaking';

interface ConvertoOrbProps {
  state?: ConvertoOrbState;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'h-9 w-9',
  md: 'h-12 w-12',
  lg: 'h-24 w-24 sm:h-28 sm:w-28',
};

export function ConvertoOrb({ state = 'idle', size = 'md', className }: ConvertoOrbProps) {
  return (
    <div
      aria-label={`Converto AI is ${state}`}
      role="img"
      data-state={state}
      className={cn('nova-avatar relative shrink-0', SIZE_CLASSES[size], className)}
    >
      <div className="nova-avatar-aura absolute -inset-[18%] rounded-full" />
      <div className="nova-avatar-orbit absolute -inset-[9%] rounded-full border border-indigo-400/35">
        <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.9)]" />
      </div>
      <div className="nova-avatar-core absolute inset-0 overflow-hidden rounded-full border border-white/55 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_12px_35px_rgba(79,70,229,0.28)]">
        <div className="absolute inset-[9%] rounded-full border border-white/25" />
        <div className="absolute -left-[12%] top-[2%] h-[54%] w-[72%] rotate-[-22deg] rounded-full bg-white/25 blur-[3px]" />
        <div className="nova-avatar-face absolute inset-0 flex items-center justify-center gap-[12%]">
          <span className="nova-avatar-eye h-[12%] w-[8%] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)]" />
          <span className="nova-avatar-eye h-[12%] w-[8%] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)]" />
        </div>
      </div>
    </div>
  );
}
