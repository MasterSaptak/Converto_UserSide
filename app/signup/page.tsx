'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, ArrowRight, Loader2, UserPlus, Mail } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
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

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
        <div className="absolute bottom-0 left-0 w-full h-2 bg-primary" />
        <div className="w-full max-w-[460px]">
          <div className="border-2 border-foreground bg-white shadow-[8px_8px_0px_var(--color-foreground)]">
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
                  We've sent a verification link to:
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

        <div className="border-2 border-foreground bg-white shadow-[8px_8px_0px_var(--color-foreground)]">
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
