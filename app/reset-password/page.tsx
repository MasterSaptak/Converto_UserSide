'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    // Check if the user has a valid session (e.g. they clicked the email link)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Invalid or expired password reset link. Please request a new one.');
      }
      setSessionChecked(true);
    };
    checkSession();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Password updated successfully
      router.push('/login');
    }
  };

  if (!sessionChecked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
      <div className="absolute bottom-0 left-0 w-full h-2 bg-primary" />
      <div className="absolute top-8 left-8 hidden md:flex items-center gap-3 select-none">
        <div className="h-6 w-6 border-2 border-foreground bg-primary" />
        <span className="text-xl font-bold uppercase tracking-widest font-heading">Converto</span>
      </div>
      <div className="absolute top-8 right-8 hidden md:block text-[10px] font-bold uppercase tracking-widest opacity-40">
        Update Password // v2.0
      </div>

      {/* Main card */}
      <div className="w-full max-w-[460px] relative">
        {/* Mobile logo */}
        <div className="md:hidden flex items-center gap-2 mb-8 justify-center">
          <div className="h-5 w-5 border-2 border-foreground bg-primary" />
          <span className="text-xl font-bold uppercase tracking-widest font-heading">Converto</span>
        </div>

        <div className="border-2 border-foreground bg-white dark:bg-zinc-900 shadow-[8px_8px_0px_var(--color-foreground)]">
          {/* Header */}
          <div className="bg-secondary border-b-2 border-foreground p-6 md:p-8">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 block mb-2">Authentication</span>
            <h1 className="text-3xl md:text-4xl font-bold font-heading uppercase tracking-tight leading-[0.9]">
              Set New Password
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleUpdatePassword} className="p-6 md:p-8 flex flex-col gap-5">
            {error && (
              <div className="border-2 border-red-600 bg-red-50 p-4 text-xs font-bold uppercase tracking-wider text-red-600">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="new-password" className="text-[10px] uppercase font-bold tracking-[0.2em]">
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border-2 border-foreground bg-background px-4 py-3 pr-12 text-sm font-mono font-bold placeholder:opacity-30 focus:outline-none focus:border-primary focus:ring-0 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 opacity-40 hover:opacity-100 transition-opacity"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !!error.includes('expired')}
              className="w-full border-2 border-foreground bg-primary text-primary-foreground px-6 py-4 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-foreground)] transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  Update Password
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Bottom tag */}
        <div className="mt-6 text-center text-[10px] uppercase font-bold tracking-widest opacity-30">
          © Converto 2024 // Encrypted & Secure
        </div>
      </div>
    </div>
  );
}
