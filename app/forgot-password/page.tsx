'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

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
        Password Reset // v2.0
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
              Forgot Password
            </h1>
          </div>

          {/* Form */}
          {!success ? (
            <form onSubmit={handleReset} className="p-6 md:p-8 flex flex-col gap-5">
              {error && (
                <div className="border-2 border-red-600 bg-red-50 p-4 text-xs font-bold uppercase tracking-wider text-red-600">
                  {error}
                </div>
              )}

              <p className="text-sm opacity-80 mb-2">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <div className="flex flex-col gap-2">
                <label htmlFor="reset-email" className="text-[10px] uppercase font-bold tracking-[0.2em]">
                  Email Address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border-2 border-foreground bg-background px-4 py-3 text-sm font-mono font-bold placeholder:opacity-30 focus:outline-none focus:border-primary focus:ring-0 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full border-2 border-foreground bg-primary text-primary-foreground px-6 py-4 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-foreground)] transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending Link...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="p-6 md:p-8 flex flex-col items-center justify-center gap-4 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mb-2" />
              <h2 className="text-xl font-bold uppercase tracking-tight">Check Your Email</h2>
              <p className="text-sm opacity-80 mb-4">
                We've sent a password reset link to <strong>{email}</strong>.
              </p>
              <Link 
                href="/login"
                className="border-2 border-foreground px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-secondary transition-colors w-full"
              >
                Return to Login
              </Link>
            </div>
          )}

          {/* Footer */}
          <div className="border-t-2 border-dashed border-muted p-6 md:p-8 flex justify-center">
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">
              Remember your password?{' '}
              <Link href="/login" className="text-primary hover:underline underline-offset-4 transition-colors">
                Sign In
              </Link>
            </span>
          </div>
        </div>

        {/* Bottom tag */}
        <div className="mt-6 text-center text-[10px] uppercase font-bold tracking-widest opacity-30">
          © Converto 2024 // Encrypted & Secure
        </div>
      </div>
    </div>
  );
}
