'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { DesktopHeader } from '@/components/layout/DesktopHeader';
import { Loader2 } from 'lucide-react';
import { LiveFooter } from '@/components/layout/LiveFooter';

const AUTH_ROUTES = ['/login', '/signup'];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  useEffect(() => {
    if (loading) return;

    if (!user && !isAuthRoute) {
      router.replace('/login');
    }

    if (user && isAuthRoute) {
      router.replace('/');
    }
  }, [user, loading, isAuthRoute, router]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 border-2 border-foreground bg-primary" />
          <span className="text-xl font-bold uppercase tracking-widest font-heading">Converto</span>
        </div>
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">Loading System...</span>
      </div>
    );
  }

  // Auth pages — render without chrome
  if (isAuthRoute) {
    if (user) return null; // Will redirect
    return <>{children}</>;
  }

  // Protected pages — must be authenticated
  if (!user) return null; // Will redirect

  return (
    <div className="flex relative min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen pb-24 md:pb-0 relative">
        <DesktopHeader />
        <MobileHeader />
        <main className="flex-1 flex flex-col p-4 md:p-12 md:pt-24 overflow-y-auto">
          {children}
        </main>
        <div className="px-4 md:px-12 bg-background">
          <LiveFooter />
        </div>
        <BottomNav />
      </div>
    </div>
  );
}
