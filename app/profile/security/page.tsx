'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Save, ArrowLeft, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function SecurityPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSaving(true);
    
    // In Supabase, if the user is authenticated, we can update their password.
    // We don't necessarily need the old password for updateUser, but some providers require re-authentication.
    // For standard Supabase auth, just updating password works.
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess('Password updated successfully');
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
    
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-4 md:p-8 relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
      
      {/* Header */}
      <header className="flex justify-between items-end mb-12 pb-4 border-b-2 border-foreground relative">
        <div className="absolute bottom-0 left-0 w-1/4 h-1 bg-primary"></div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 block mb-2">Account</span>
          <h1 className="text-4xl md:text-5xl font-bold font-heading uppercase tracking-tight leading-[0.9]">
            Security & 2FA
          </h1>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          <Link href="/profile" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Profile
          </Link>

          <div className="border-2 border-foreground bg-white shadow-[8px_8px_0px_var(--color-foreground)] p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b-2 border-dashed border-muted">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold uppercase tracking-widest font-heading">Change Password</h2>
            </div>

            <form onSubmit={handleChangePassword} className="flex flex-col gap-5">
              {error && (
                <div className="border-2 border-red-600 bg-red-50 p-4 text-xs font-bold uppercase tracking-wider text-red-600">
                  {error}
                </div>
              )}
              {success && (
                <div className="border-2 border-green-600 bg-green-50 p-4 text-xs font-bold uppercase tracking-wider text-green-600">
                  {success}
                </div>
              )}

              {/* In Supabase we don't strictly need current password to update password via session, but UI typically asks for it. 
                  Leaving it here for UI completeness though it's optional for the API call. */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold tracking-[0.2em]">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border-2 border-foreground bg-background px-4 py-3 pr-12 text-sm font-mono font-bold focus:outline-none focus:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 opacity-40 hover:opacity-100 transition-opacity"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold tracking-[0.2em]">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border-2 border-foreground bg-background px-4 py-3 pr-12 text-sm font-mono font-bold focus:outline-none focus:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 opacity-40 hover:opacity-100 transition-opacity"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold tracking-[0.2em]">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border-2 border-foreground bg-background px-4 py-3 pr-12 text-sm font-mono font-bold focus:outline-none focus:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 opacity-40 hover:opacity-100 transition-opacity"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-4 mt-4 pt-4 border-t-2 border-dashed border-muted">
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 border-2 border-foreground bg-primary text-primary-foreground px-4 py-3 font-bold uppercase tracking-widest text-xs hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-foreground)] transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
}
