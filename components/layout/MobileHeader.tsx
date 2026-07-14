import { NotificationBell } from './NotificationBell';
import { User } from 'lucide-react';
import Link from 'next/link';
import { ProfileDropdown } from './ProfileDropdown';

export function MobileHeader() {
  return (
    <div className="md:hidden flex items-center justify-between p-4 border-b-2 border-foreground bg-secondary sticky top-0 z-40">
      <Link href="/" className="flex items-center gap-3 group">
        <img src="/Logo.png" alt="Converto Logo" className="w-8 h-8 border-2 border-foreground bg-white p-0.5 object-contain transition-transform group-hover:scale-105 shrink-0" />
        <div className="flex flex-col">
          <h1 className="font-bold font-heading uppercase tracking-widest text-xl group-hover:text-primary transition-colors leading-none">Converto</h1>
          <span className="text-[6px] uppercase tracking-widest font-bold opacity-60 mt-0.5">The Ultimate Payment Engine</span>
        </div>
      </Link>
      <div className="flex items-center gap-2">
        <NotificationBell />
        <ProfileDropdown />
      </div>
    </div>
  );
}
