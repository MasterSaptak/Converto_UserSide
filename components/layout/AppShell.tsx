'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { DesktopHeader } from '@/components/layout/DesktopHeader';
import { Loader2 } from 'lucide-react';
import { ContentPopup } from '@/components/content/ContentPopup';

import { ResponsiveFooter } from '@/components/layout/ResponsiveFooter';

const AUTH_ROUTES = ['/login', '/signup', '/forgot-password', '/reset-password'];

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

    if (user && isAuthRoute && pathname !== '/reset-password') {
      router.replace('/');
    }
  }, [user, loading, isAuthRoute, pathname, router]);

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
    if (user && pathname !== '/reset-password') return null; // Will redirect
    return <>{children}</>;
  }

  // Protected pages — must be authenticated
  if (!user) return null; // Will redirect

  return (
    <div className="flex relative min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen min-w-0 relative">
        <DesktopHeader />
        <MobileHeader />
        <main className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex-1 min-w-0 px-4 py-5 pb-24 sm:px-5 md:px-6 md:py-8 md:pb-24 lg:p-8 lg:pt-24 xl:p-12 xl:pt-24 shrink-0">
            {children}
          </div>
          <div className="shrink-0 flex flex-col w-full mt-auto">
            <ResponsiveFooter />
          </div>
        </main>
        <BottomNav />
      </div>
      {/* Inside the authenticated branch on purpose — a marketing modal must
          never appear over the login screen. */}
      <ContentPopup />
    </div>
  );
}
