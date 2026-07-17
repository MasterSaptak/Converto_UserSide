'use client';

import { useEffect, useState } from 'react';

export function LiveFooter({ compact = false }: { compact?: boolean }) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!time) return null; // Avoid hydration mismatch

  // Format: 15 JUL 2026
  const dateStr = time.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();

  // Format: 14:02:45
  const timeStr = time.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // Calculate UTC offset like UTC+05:30
  const offset = -time.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const hours = Math.floor(Math.abs(offset) / 60).toString().padStart(2, '0');
  const minutes = (Math.abs(offset) % 60).toString().padStart(2, '0');
  const utcOffset = `UTC${sign}${hours}:${minutes}`;

  if (compact) {
    return (
      <div className="mt-4 pt-4 border-t-2 border-foreground/20 flex flex-col gap-2 text-[8px] uppercase font-bold tracking-widest select-none">
        <div className="flex flex-col gap-0.5">
          <span className="opacity-80">© SAPTECH 2026</span>
          <span className="opacity-50">DESIGNED AND DEVELOPED BY SAPTECH</span>
        </div>
        <div className="flex flex-col gap-0.5 opacity-60">
          <span>LOCAL // {timeStr}</span>
          <span>{dateStr} • {utcOffset}</span>
        </div>
      </div>
    );
  }

  return (
    <footer className="py-8 flex justify-between border-t-2 border-foreground text-[10px] uppercase font-bold tracking-widest select-none">
      <div className="flex flex-col gap-1">
        <span>© SAPTECH 2026</span>
        <span className="opacity-60">DESIGNED AND DEVELOPED BY SAPTECH</span>
      </div>
      <div className="flex flex-col items-end text-right gap-1">
        <span>LOCAL // {timeStr}</span>
        <span>{dateStr}</span>
        <span>{utcOffset}</span>
      </div>
    </footer>
  );
}
