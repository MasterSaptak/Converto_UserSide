'use client';

import { ShieldCheck, User, Users, UserCheck, CreditCard, LogOut, Loader2, Copy, Check, Upload, Link as LinkIcon, Save, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [copied, setCopied] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    phone: '',
    country: '',
    timezone: '',
    preferred_currency: 'USD',
    avatar_url: ''
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form data when profile loads or edit mode starts
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        country: profile.country || '',
        timezone: profile.timezone || '',
        preferred_currency: profile.preferred_currency || 'USD',
        avatar_url: profile.avatar_url || ''
      });
    }
  }, [profile, isEditing]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const copyToClipboard = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);
    setMessage(null);

    try {
      let finalAvatarUrl = formData.avatar_url;

      // 1. Upload avatar if file is selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${user.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        finalAvatarUrl = publicUrl;
      }

      // 2. Update profile table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          full_name: formData.full_name,
          phone: formData.phone,
          country: formData.country,
          timezone: formData.timezone,
          preferred_currency: formData.preferred_currency,
          avatar_url: finalAvatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // 3. Refresh Context
      await refreshProfile();
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      setAvatarFile(null); // Clear file
    } catch (err: unknown) {
      const error = err as Error;
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  // formatting joining date
  const getFormattedJoinDate = () => {
    if (!user?.created_at) return '—';
    const d = new Date(user.created_at);
    
    const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
    const dateStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const timeStr = d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Guess timezone abbrev
    const tzMatch = d.toString().match(/\(([A-Za-z\s].*)\)/);
    const tz = tzMatch ? tzMatch[1] : '';

    return `${dayName} / ${dateStr} / ${timeStr} ${tz}`;
  };

  const displayName = profile?.username || profile?.full_name || user?.email?.split('@')[0] || 'User';
  const displayAvatar = avatarFile ? URL.createObjectURL(avatarFile) : (profile?.avatar_url || formData.avatar_url);

  return (
    <div className="flex-1 flex flex-col gap-8 md:gap-10 animate-in fade-in duration-500 pb-10">
      
      {message && (
        <div className={`fixed top-4 right-4 z-50 p-4 border-2 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] animate-in slide-in-from-top-10 flex items-center gap-3 font-bold text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
          {message.type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
          {message.text}
          <button onClick={() => setMessage(null)} className="ml-4 opacity-50 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <header className="border-b-2 border-foreground pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 mb-2 block">Account</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading uppercase leading-[0.9] tracking-tight">Profile</h1>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="border-2 border-foreground bg-primary text-primary-foreground px-6 py-3 min-h-[48px] font-bold uppercase tracking-widest text-xs hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-foreground)] transition-all w-full md:w-auto mt-2 md:mt-0"
          >
            Edit Profile
          </button>
        )}
      </header>
      
      <div className="grid lg:grid-cols-[350px_1fr] gap-8 items-start">
        
        {/* Profile Card / Edit Form container */}
        <div className="border-2 border-foreground bg-white p-6 md:p-8 relative">
          
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-emerald-100 text-emerald-800 border-2 border-emerald-800 px-2 py-1 z-10">
            <ShieldCheck className="w-3 h-3" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Verified</span>
          </div>

          {user?.app_metadata?.provider === 'google' && (
            <div className="absolute top-4 left-4 flex items-center gap-1 bg-white text-foreground border-2 border-foreground px-2 py-1 z-10">
              <svg viewBox="0 0 24 24" className="w-3 h-3">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="text-[9px] font-bold uppercase tracking-widest">Logged in by Google</span>
            </div>
          )}

          {!isEditing ? (
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 mt-10 border-2 border-foreground bg-secondary mb-6 flex items-center justify-center rounded-full overflow-hidden shrink-0">
                {profile?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 opacity-40" />
                )}
              </div>
              
              <h2 className="text-2xl font-bold font-heading uppercase mb-1">{displayName}</h2>
              <div className="text-[10px] uppercase font-bold tracking-widest opacity-60 mb-6 flex flex-col gap-1 items-center">
                <span>{profile?.full_name || 'No Full Name'}</span>
                <span>{profile?.country || 'Unknown Location'}</span>
              </div>
              
              <div className="w-full border-t-2 border-dashed border-muted pt-6 flex flex-col gap-4 text-left">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] uppercase font-bold tracking-widest opacity-60">User ID</span>
                    <button onClick={copyToClipboard} className="flex items-center gap-1 text-[9px] uppercase font-bold text-primary hover:underline">
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <span className="text-xs font-bold font-mono truncate block bg-secondary px-2 py-1 border-2 border-foreground/10">{user?.id || '—'}</span>
                </div>

                <div>
                  <span className="text-[9px] uppercase font-bold tracking-widest opacity-60 block mb-1">Email Address</span>
                  <span className="text-xs font-bold font-mono">{user?.email || '—'}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-widest opacity-60 block mb-1">Phone Number</span>
                  <span className="text-xs font-bold font-mono">{profile?.phone || '—'}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-widest opacity-60 block mb-1">Currency & Timezone</span>
                  <span className="text-xs font-bold font-mono">{profile?.preferred_currency || 'USD'} • {profile?.timezone || 'UTC'}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-widest opacity-60 block mb-1">Joined</span>
                  <span className="text-xs font-bold font-mono uppercase">{getFormattedJoinDate()}</span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="flex flex-col gap-5">
              <h3 className="font-bold font-heading uppercase text-xl mb-2">Edit Profile</h3>
              
              {/* Avatar Edit */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Profile Avatar</span>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 border-2 border-foreground bg-secondary flex items-center justify-center rounded-full overflow-hidden shrink-0">
                    {displayAvatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={displayAvatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 opacity-40" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-bold uppercase tracking-widest border-2 border-foreground px-3 py-2 flex items-center justify-center gap-2 hover:bg-secondary transition-colors"
                    >
                      <Upload className="w-4 h-4" /> Upload Image
                    </button>
                    <input 
                      type="file" 
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden" 
                    />
                    <div className="flex items-center border-2 border-foreground bg-background px-2">
                      <LinkIcon className="w-4 h-4 opacity-40 shrink-0" />
                      <input 
                        type="url"
                        placeholder="Or Image URL..."
                        value={formData.avatar_url}
                        onChange={(e) => {
                          setFormData({...formData, avatar_url: e.target.value});
                          setAvatarFile(null); // Clear file if URL is typed
                        }}
                        className="w-full bg-transparent px-2 py-2 text-xs font-mono font-bold placeholder:opacity-30 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-80">Username</label>
                  <input 
                    type="text" 
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full border-2 border-foreground bg-background px-3 py-2 text-sm font-mono font-bold focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-80">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    className="w-full border-2 border-foreground bg-background px-3 py-2 text-sm font-mono font-bold focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-80">Email (Read Only)</label>
                  <input 
                    type="text" 
                    value={user?.email || ''}
                    disabled
                    className="w-full border-2 border-foreground bg-secondary px-3 py-2 text-sm font-mono font-bold opacity-70 cursor-not-allowed"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-80">Phone Number</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full border-2 border-foreground bg-background px-3 py-2 text-sm font-mono font-bold focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-80">Country</label>
                  <input 
                    type="text" 
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    placeholder="e.g. United Kingdom"
                    className="w-full border-2 border-foreground bg-background px-3 py-2 text-sm font-mono font-bold focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-80">Currency</label>
                    <select 
                      value={formData.preferred_currency}
                      onChange={(e) => setFormData({...formData, preferred_currency: e.target.value})}
                      className="w-full border-2 border-foreground bg-background px-2 py-2 text-sm font-mono font-bold focus:outline-none focus:border-primary"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-80">Timezone</label>
                    <input 
                      type="text" 
                      value={formData.timezone}
                      onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                      placeholder="e.g. UTC"
                      className="w-full border-2 border-foreground bg-background px-2 py-2 text-sm font-mono font-bold focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-4 pt-4 border-t-2 border-dashed border-muted">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="flex-1 border-2 border-foreground bg-white text-foreground px-4 py-3 font-bold uppercase tracking-widest text-xs hover:bg-secondary transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 border-2 border-foreground bg-primary text-primary-foreground px-4 py-3 font-bold uppercase tracking-widest text-xs hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-foreground)] transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>

            </form>
          )}

        </div>

        {/* Settings & Links */}
        <div className="flex flex-col gap-6">
          <h3 className="font-bold uppercase tracking-widest text-xs border-b-2 border-foreground pb-2">Account Settings</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            <Link href="#" className="border-2 border-foreground bg-white p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-foreground)] transition-all text-center sm:text-left">
              <Users className="w-6 h-6 shrink-0" />
              <div className="font-bold uppercase text-sm tracking-widest mt-1">Saved Passengers</div>
            </Link>
            <Link href="#" className="border-2 border-foreground bg-white p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-foreground)] transition-all text-center sm:text-left">
              <UserCheck className="w-6 h-6 shrink-0" />
              <div className="font-bold uppercase text-sm tracking-widest mt-1">Beneficiaries</div>
            </Link>
            <Link href="#" className="border-2 border-foreground bg-white p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-foreground)] transition-all text-center sm:text-left">
              <CreditCard className="w-6 h-6 shrink-0" />
              <div className="font-bold uppercase text-sm tracking-widest mt-1">Payment Methods</div>
            </Link>
            <Link href="/profile/security" className="border-2 border-foreground bg-white p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-foreground)] transition-all text-center sm:text-left">
              <ShieldCheck className="w-6 h-6 shrink-0" />
              <div className="font-bold uppercase text-sm tracking-widest mt-1">Security & 2FA</div>
            </Link>
            <button
              onClick={handleSignOut}
              className="border-2 border-red-600 bg-red-50 text-red-600 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 hover:-translate-y-1 hover:shadow-[4px_4px_0px_currentColor] transition-all text-center sm:text-left xl:col-span-2"
            >
              <LogOut className="w-6 h-6 shrink-0" />
              <div className="font-bold uppercase text-sm tracking-widest mt-1">Sign Out</div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
