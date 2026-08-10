'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, ArrowRight, Loader2, Mail } from 'lucide-react';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          phone_number: phone,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
        <div className="absolute bottom-0 left-0 w-full h-2 bg-primary" />
        <div className="w-full max-w-[460px]">
          <div className="border-2 border-foreground bg-white dark:bg-zinc-900 shadow-[8px_8px_0px_var(--color-foreground)]">
            <div className="bg-emerald-50 border-b-2 border-emerald-800 p-6 md:p-8">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-emerald-800 block mb-2">Success</span>
              <h1 className="text-3xl md:text-4xl font-bold font-heading uppercase tracking-tight leading-[0.9] text-emerald-800">
                Check Your Email
              </h1>
            </div>
            <div className="p-6 md:p-8 flex flex-col items-center gap-6">
              <div className="w-16 h-16 border-2 border-emerald-800 bg-emerald-100 flex items-center justify-center">
                <Mail className="w-8 h-8 text-emerald-800" />
              </div>
              <div className="text-center flex flex-col gap-2">
                <p className="text-sm font-bold font-mono">
                  We&apos;ve sent a verification link to:
                </p>
                <p className="text-sm font-bold font-mono text-primary bg-secondary px-3 py-2 border-2 border-foreground">
                  {email}
                </p>
                <p className="text-xs font-bold uppercase tracking-widest opacity-60 mt-2">
                  Please check your inbox and verify your account to continue.
                </p>
              </div>
              <Link 
                href="/login"
                className="w-full border-2 border-foreground bg-primary text-primary-foreground px-6 py-4 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-foreground)] transition-all mt-2"
              >
                Go to Login
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
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
        New Account // v2.0
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
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 block mb-2">Registration</span>
            <h1 className="text-3xl md:text-4xl font-bold font-heading uppercase tracking-tight leading-[0.9]">
              Create Account
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="p-6 md:p-8 flex flex-col gap-5">
            {error && (
              <div className="border-2 border-red-600 bg-red-50 p-4 text-xs font-bold uppercase tracking-wider text-red-600">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="signup-username" className="text-[10px] uppercase font-bold tracking-[0.2em]">
                Username
              </label>
              <input
                id="signup-username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your display name"
                className="w-full border-2 border-foreground bg-background px-4 py-3 text-sm font-mono font-bold placeholder:opacity-30 focus:outline-none focus:border-primary focus:ring-0 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="signup-email" className="text-[10px] uppercase font-bold tracking-[0.2em]">
                Email Address
              </label>
              <input
                id="signup-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border-2 border-foreground bg-background px-4 py-3 text-sm font-mono font-bold placeholder:opacity-30 focus:outline-none focus:border-primary focus:ring-0 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="signup-password" className="text-[10px] uppercase font-bold tracking-[0.2em]">
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
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

            <div className="flex flex-col gap-2">
              <label htmlFor="signup-phone" className="text-[10px] uppercase font-bold tracking-[0.2em]">
                Phone Number
              </label>
              <input
                id="signup-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
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
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t-2 border-dashed border-muted"></div>
              <span className="flex-shrink-0 px-4 text-[10px] uppercase font-bold tracking-widest opacity-40 bg-white dark:bg-zinc-900">Or</span>
              <div className="flex-grow border-t-2 border-dashed border-muted"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full border-2 border-foreground bg-white dark:bg-zinc-800 text-foreground px-6 py-4 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-foreground)] transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
          </form>

          {/* Footer */}
          <div className="border-t-2 border-dashed border-muted p-6 md:p-8 flex justify-center">
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">
              Already have an account?{' '}
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
