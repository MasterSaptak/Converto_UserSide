'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Supabase will automatically parse the hash fragment and establish a session.
    // We just wait for the session to be ready, then redirect to the dashboard.
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push('/');
      }
    });

    // Fallback: if no event fires within a short time, just go home
    const timer = setTimeout(() => {
      router.push('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <h1 className="text-xl font-bold uppercase tracking-widest font-heading">
          Authenticating...
        </h1>
        <p className="text-sm opacity-60 font-mono">
          Please wait while we log you in.
        </p>
      </div>
    </div>
  );
}
