'use client';

import { ShieldCheck, User, Users, UserCheck, CreditCard, LogOut, Loader2, Copy, Check, Upload, Link as LinkIcon, Save, X, Medal, Trophy, Award, Gem, Shield, Crown, MapPin, Mail, Phone, Calendar, Hash, Globe, LucideIcon, TreePine, Mountain, Anvil, Hexagon, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRewards } from "@/hooks/useRewards";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { REWARD_TIERS } from "@/lib/currencies";
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';

import { motion, AnimatePresence } from 'framer-motion';

const TIER_STYLES: Record<string, { icon: LucideIcon, bg: string, text: string }> = {
  'Wood': { icon: TreePine, bg: 'bg-[#8B5A2B]', text: 'text-white' },
  'Stone': { icon: Mountain, bg: 'bg-[#A9A9A9]', text: 'text-white' },
  'Iron': { icon: Anvil, bg: 'bg-[#434B4D]', text: 'text-white' },
  'Bronze': { icon: Medal, bg: 'bg-[#CD7F32]', text: 'text-white' },
  'Silver': { icon: Award, bg: 'bg-[#C0C0C0]', text: 'text-black' },
  'Gold': { icon: Trophy, bg: 'bg-[#FFD700]', text: 'text-black' },
  'Platinum': { icon: Crown, bg: 'bg-slate-800', text: 'text-white' },
  'Diamond': { icon: Gem, bg: 'bg-cyan-500', text: 'text-white' },
  'Obsidian': { icon: Hexagon, bg: 'bg-[#3b1261]', text: 'text-white' },
  'Ruby': { icon: Gem, bg: 'bg-[#E0115F]', text: 'text-white' },
  'Sapphire': { icon: Gem, bg: 'bg-[#0F52BA]', text: 'text-white' },
  'Emerald': { icon: Gem, bg: 'bg-[#50C878]', text: 'text-black' },
  'Amethyst': { icon: Sparkles, bg: 'bg-[#9966CC]', text: 'text-white' },
  'Titanium': { icon: Shield, bg: 'bg-[#878681]', text: 'text-white' },
  'Vibranium': { icon: Zap, bg: 'bg-[#8a2be2]', text: 'text-white' },
  'Antimatter': { icon: Globe, bg: 'bg-black border-purple-500', text: 'text-purple-400' },
  'Black Card': { icon: Crown, bg: 'bg-black', text: 'text-yellow-500' },
}

export default function ProfilePage() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { rewards, tierInfo, isLoading: isRewardsLoading } = useRewards();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
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

  // Initialize form data
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

      await refreshProfile();

      setMessage({ type: 'success', text: 'Profile saved!' });
      setIsEditing(false);
      setAvatarFile(null);
    } catch (err: unknown) {
      const error = err as Error;
      setMessage({ type: 'error', text: error.message || 'Update failed' });
    } finally {
      setIsSaving(false);
    }
  };

  const getFormattedJoinDate = () => {
    if (!user?.created_at) return '—';
    const d = new Date(user.created_at);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const displayName = profile?.username || profile?.full_name || user?.email?.split('@')[0] || 'User';
  const displayAvatar = avatarFile ? URL.createObjectURL(avatarFile) : (profile?.avatar_url || formData.avatar_url);

  const currentTierStyle = TIER_STYLES[tierInfo.current.name] || { icon: Trophy, bg: 'bg-primary', text: 'text-primary-foreground' };
  const CurrentTierIcon = currentTierStyle.icon;

  return (
    <div className="flex-1 flex flex-col gap-4 md:gap-6 animate-in fade-in duration-500 pb-28 md:pb-12 px-3 md:px-8 overflow-hidden md:overflow-visible w-full max-w-7xl mx-auto min-w-0">

      {/* Toast Message */}
      {message && (
        <div className={`fixed top-4 md:top-6 right-4 md:right-6 z-50 p-3 md:p-4 rounded-xl border-2 md:border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] animate-in slide-in-from-top-4 flex items-center gap-2 md:gap-3 font-bold text-xs md:text-sm ${message.type === 'success' ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'}`}>
          {message.type === 'success' ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : <X className="w-4 h-4 md:w-5 md:h-5" />}
          {message.text}
          <button onClick={() => setMessage(null)} className="ml-2 md:ml-3 opacity-50 hover:opacity-100"><X className="w-3 h-3 md:w-4 md:h-4" /></button>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between gap-3 md:gap-4 bg-white border-2 md:border-4 border-foreground p-4 md:p-6 rounded-2xl shadow-[4px_4px_0px_var(--color-foreground)] md:shadow-[6px_6px_0px_var(--color-foreground)]">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-14 md:h-14 bg-secondary border-2 border-foreground rounded-full flex items-center justify-center">
            <User className="w-5 h-5 md:w-7 md:h-7 opacity-50" />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-bold font-heading uppercase leading-none tracking-tight">Account Profile</h1>
            <span className="text-[9px] md:text-sm uppercase font-bold tracking-widest opacity-60">Manage your details & rewards</span>
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="border-2 md:border-4 border-foreground rounded-xl bg-primary text-primary-foreground px-4 py-2 md:px-6 md:py-3 text-[10px] md:text-sm font-black uppercase tracking-widest hover:scale-105 hover:-translate-y-1 hover:shadow-[2px_2px_0px_var(--color-foreground)] md:hover:shadow-[4px_4px_0px_var(--color-foreground)] transition-all shrink-0"
          >
            Edit <span className="hidden md:inline">Profile</span>
          </button>
        )}
      </header>

      {/* Main Grid Container */}
      <div className="grid lg:grid-cols-[400px_1fr] gap-4 md:gap-6 items-start w-full min-w-0">

        {/* Left Column: Profile Card */}
        <div className="border-2 md:border-4 border-foreground rounded-2xl md:rounded-3xl bg-white p-5 md:p-8 relative shadow-[4px_4px_0px_var(--color-foreground)] md:shadow-[6px_6px_0px_var(--color-foreground)] min-w-0">

          <div className="absolute top-3 right-3 md:top-4 md:right-4 flex items-center gap-1 md:gap-1.5 bg-emerald-100 text-emerald-800 border-2 border-emerald-800 rounded-full px-2 py-0.5 md:px-3 md:py-1 z-10">
            <ShieldCheck className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-[8px] md:text-xs font-black uppercase tracking-widest">Verified</span>
          </div>

          {!isEditing ? (
            <div className="flex flex-col items-center text-center mt-1 md:mt-2">
              <div className="w-20 h-20 md:w-32 md:h-32 border-2 md:border-4 border-foreground bg-secondary mb-3 md:mb-4 flex items-center justify-center rounded-full overflow-hidden shrink-0 group hover:scale-110 transition-transform shadow-[2px_2px_0px_var(--color-foreground)] md:shadow-[4px_4px_0px_var(--color-foreground)]">
                {profile?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 md:w-12 md:h-12 opacity-40" />
                )}
              </div>

              <h2 className="text-xl md:text-3xl font-black font-heading uppercase truncate w-full px-2 mb-1">{displayName}</h2>
              <div className="text-[10px] md:text-sm uppercase font-bold tracking-widest opacity-60 mb-4 md:mb-6 flex items-center gap-1 md:gap-1.5">
                <MapPin className="w-3 h-3 md:w-4 md:h-4" /> {profile?.country || 'No Location'}
              </div>

              <div className="w-full border-t-2 md:border-t-4 border-dashed border-muted pt-4 md:pt-5 flex flex-col gap-2 md:gap-3 text-left">
                {/* Details List */}
                <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl hover:bg-secondary/50 transition-colors group/item min-w-0">
                  <Hash className="w-4 h-4 md:w-5 md:h-5 opacity-40 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] md:text-xs uppercase font-black tracking-widest opacity-60 block mb-0.5 md:mb-1">User ID</span>
                    <span className="text-xs md:text-base font-mono font-bold truncate block">{user?.id || '—'}</span>
                  </div>
                  <button onClick={copyToClipboard} className="opacity-0 group-hover/item:opacity-100 hover:text-primary transition-opacity shrink-0 p-1 md:p-2">
                    {copied ? <Check className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" /> : <Copy className="w-4 h-4 md:w-5 md:h-5" />}
                  </button>
                </div>

                <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl hover:bg-secondary/50 transition-colors min-w-0">
                  <Mail className="w-4 h-4 md:w-5 md:h-5 opacity-40 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] md:text-xs uppercase font-black tracking-widest opacity-60 block mb-0.5 md:mb-1">Email</span>
                    <span className="text-xs md:text-base font-mono font-bold truncate block">{user?.email || '—'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl hover:bg-secondary/50 transition-colors min-w-0">
                  <Phone className="w-4 h-4 md:w-5 md:h-5 opacity-40 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] md:text-xs uppercase font-black tracking-widest opacity-60 block mb-0.5 md:mb-1">Phone</span>
                    <span className="text-xs md:text-base font-mono font-bold truncate block">{profile?.phone || '—'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl hover:bg-secondary/50 transition-colors min-w-0">
                  <Globe className="w-4 h-4 md:w-5 md:h-5 opacity-40 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] md:text-xs uppercase font-black tracking-widest opacity-60 block mb-0.5 md:mb-1">Region Settings</span>
                    <span className="text-xs md:text-base font-mono font-bold truncate block">{profile?.preferred_currency || 'USD'} • {profile?.timezone || 'UTC'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl hover:bg-secondary/50 transition-colors min-w-0">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 opacity-40 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] md:text-xs uppercase font-black tracking-widest opacity-60 block mb-0.5 md:mb-1">Joined</span>
                    <span className="text-xs md:text-base font-mono font-bold truncate block">{getFormattedJoinDate()}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="flex flex-col gap-3 md:gap-4">
              <h3 className="font-black uppercase text-xs md:text-base tracking-[0.2em] mb-1 md:mb-2">Edit Profile</h3>

              {/* Avatar Edit Compact */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
                <div className="w-16 h-16 md:w-20 md:h-20 border-2 md:border-4 border-foreground bg-secondary flex items-center justify-center rounded-full overflow-hidden shrink-0 shadow-[2px_2px_0px_var(--color-foreground)] md:shadow-[4px_4px_0px_var(--color-foreground)]">
                  {displayAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={displayAvatar} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 md:w-8 md:h-8 opacity-40" />
                  )}
                </div>
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[10px] md:text-xs font-black uppercase tracking-widest border-2 md:border-4 border-foreground px-3 py-1.5 md:px-4 md:py-2 flex items-center justify-center gap-2 hover:bg-secondary transition-colors">
                    <Upload className="w-3 h-3 md:w-4 md:h-4" /> Upload Image
                  </button>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                  <div className="flex items-center border-2 md:border-4 border-foreground bg-background px-2 md:px-3 overflow-hidden">
                    <LinkIcon className="w-3 h-3 md:w-4 md:h-4 opacity-40 shrink-0" />
                    <input type="url" placeholder="Image URL..." value={formData.avatar_url} onChange={(e) => { setFormData({ ...formData, avatar_url: e.target.value }); setAvatarFile(null); }} className="w-full bg-transparent px-2 py-1.5 md:py-2 text-[10px] md:text-xs font-mono font-bold placeholder:opacity-30 focus:outline-none min-w-0" />
                  </div>
                </div>
              </div>

              {/* Form Inputs Compact */}
              <div className="grid grid-cols-1 gap-3 md:gap-4 mt-2 md:mt-4">
                <div className="flex flex-col gap-1 md:gap-1.5">
                  <label className="text-[9px] md:text-xs uppercase font-black tracking-widest opacity-80">Full Name</label>
                  <input type="text" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="w-full border-2 md:border-4 border-foreground bg-background px-3 py-2 md:px-4 md:py-3 text-xs md:text-base font-mono font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-[2px_2px_0px_var(--color-foreground)] md:shadow-[4px_4px_0px_var(--color-foreground)]" />
                </div>
                <div className="flex flex-col gap-1 md:gap-1.5">
                  <label className="text-[9px] md:text-xs uppercase font-black tracking-widest opacity-80">Username</label>
                  <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full border-2 md:border-4 border-foreground bg-background px-3 py-2 md:px-4 md:py-3 text-xs md:text-base font-mono font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-[2px_2px_0px_var(--color-foreground)] md:shadow-[4px_4px_0px_var(--color-foreground)]" />
                </div>
                <div className="flex flex-col gap-1 md:gap-1.5">
                  <label className="text-[9px] md:text-xs uppercase font-black tracking-widest opacity-80">Phone</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full border-2 md:border-4 border-foreground bg-background px-3 py-2 md:px-4 md:py-3 text-xs md:text-base font-mono font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-[2px_2px_0px_var(--color-foreground)] md:shadow-[4px_4px_0px_var(--color-foreground)]" />
                </div>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="flex flex-col gap-1 md:gap-1.5">
                    <label className="text-[9px] md:text-xs uppercase font-black tracking-widest opacity-80">Currency</label>
                    <select value={formData.preferred_currency} onChange={(e) => setFormData({ ...formData, preferred_currency: e.target.value })} className="w-full border-2 md:border-4 border-foreground bg-background px-2 py-2 md:px-3 md:py-3 text-xs md:text-base font-mono font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-[2px_2px_0px_var(--color-foreground)] md:shadow-[4px_4px_0px_var(--color-foreground)]">
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="INR">INR</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1 md:gap-1.5">
                    <label className="text-[9px] md:text-xs uppercase font-black tracking-widest opacity-80">Timezone</label>
                    <input type="text" value={formData.timezone} onChange={(e) => setFormData({ ...formData, timezone: e.target.value })} className="w-full border-2 md:border-4 border-foreground bg-background px-3 py-2 md:px-4 md:py-3 text-xs md:text-base font-mono font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-[2px_2px_0px_var(--color-foreground)] md:shadow-[4px_4px_0px_var(--color-foreground)]" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 md:gap-4 mt-4 md:mt-6 pt-4 md:pt-6 border-t-2 md:border-t-4 border-dashed border-muted">
                <button type="button" onClick={() => setIsEditing(false)} disabled={isSaving} className="flex-1 border-2 md:border-4 border-foreground bg-white text-foreground py-3 md:py-4 font-black uppercase tracking-widest text-[10px] md:text-sm hover:bg-secondary transition-colors shadow-[2px_2px_0px_var(--color-foreground)] md:shadow-[4px_4px_0px_var(--color-foreground)]">Cancel</button>
                <button type="submit" disabled={isSaving} className="flex-1 border-2 md:border-4 border-foreground bg-primary text-primary-foreground py-3 md:py-4 font-black uppercase tracking-widest text-[10px] md:text-sm hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-foreground)] md:hover:shadow-[6px_6px_0px_var(--color-foreground)] transition-all flex items-center justify-center gap-1.5 md:gap-2 shadow-[2px_2px_0px_var(--color-foreground)] md:shadow-[4px_4px_0px_var(--color-foreground)]">
                  {isSaving ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : <Save className="w-4 h-4 md:w-5 md:h-5" />}
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Rewards & Actions min-w-0 required for flex/grid children */}
        <div className="flex flex-col gap-4 md:gap-6 min-w-0 w-full">

          {/* Rewards Module Compact */}
          <div className="border-2 md:border-4 border-foreground rounded-2xl md:rounded-3xl bg-white p-4 md:p-8 relative overflow-hidden group shadow-[4px_4px_0px_var(--color-foreground)] md:shadow-[6px_6px_0px_var(--color-foreground)] w-full min-w-0">
            <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/3 group-hover:scale-[2] transition-transform duration-700 pointer-events-none"></div>

            {/* Top Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 md:gap-5 mb-5 md:mb-6 relative z-10">
              <div className="flex items-center gap-3 md:gap-4">
                <AnimatePresence mode="popLayout">
                  <motion.div 
                    key={tierInfo.current.name}
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                    className={`w-12 h-12 md:w-20 md:h-20 border-2 md:border-4 border-foreground rounded-xl md:rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 shadow-[2px_2px_0px_var(--color-foreground)] md:shadow-[4px_4px_0px_var(--color-foreground)] ${currentTierStyle.bg} ${currentTierStyle.text}`}
                  >
                    <CurrentTierIcon className="w-6 h-6 md:w-10 md:h-10" />
                  </motion.div>
                </AnimatePresence>
                <div>
                  <div className="text-[10px] md:text-sm font-black uppercase tracking-widest opacity-60 mb-0.5 md:mb-1">Current Tier</div>
                  <div className="text-xl md:text-4xl font-heading font-black leading-none">{tierInfo.current.name}</div>
                </div>
              </div>
              <div className="sm:text-right mt-1 sm:mt-0">
                <div className="text-[10px] md:text-sm font-black uppercase tracking-widest opacity-60 mb-0.5 md:mb-1">Lifetime Points</div>
                <div className="text-2xl md:text-5xl font-heading font-black text-primary leading-none">
                  {isRewardsLoading ? '...' : <><AnimatedNumber value={rewards?.lifetime_c_points || 0} /> C</>}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 md:h-4 bg-secondary border-2 md:border-4 border-foreground rounded-full overflow-hidden mb-2 md:mb-3">
              <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${tierInfo.progress}%` }}></div>
            </div>
            {tierInfo.next ? (
              <div className="text-[10px] md:text-sm uppercase font-black tracking-widest opacity-60 mb-5 md:mb-8">
                <AnimatedNumber value={tierInfo.next.minPoints - (rewards?.available_c_points || 0)} /> C UNTIL {tierInfo.next.name}
              </div>
            ) : (
              <div className="text-[10px] md:text-sm uppercase font-black tracking-widest opacity-60 mb-5 md:mb-8">Maximum Tier Reached</div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-5 md:mb-8">
              <div className="bg-secondary/50 border md:border-2 border-foreground/30 md:border-foreground p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-secondary transition-colors min-w-0 md:shadow-[4px_4px_0px_var(--color-foreground)]">
                <span className="text-[9px] md:text-xs uppercase font-black tracking-widest opacity-60 block mb-1 md:mb-1.5">Available</span>
                <span className="text-sm md:text-xl font-black font-mono truncate block text-primary"><AnimatedNumber value={rewards?.available_c_points || 0} /> C</span>
              </div>
              <div className="bg-secondary/50 border md:border-2 border-foreground/30 md:border-foreground p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-secondary transition-colors min-w-0 md:shadow-[4px_4px_0px_var(--color-foreground)]">
                <span className="text-[9px] md:text-xs uppercase font-black tracking-widest opacity-60 block mb-1 md:mb-1.5">Spent</span>
                <span className="text-sm md:text-xl font-black font-mono truncate block"><AnimatedNumber value={rewards?.spent_c_points || 0} /> C</span>
              </div>
              <div className="bg-secondary/50 border md:border-2 border-foreground/30 md:border-foreground p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-secondary transition-colors min-w-0 md:shadow-[4px_4px_0px_var(--color-foreground)]">
                <span className="text-[9px] md:text-xs uppercase font-black tracking-widest opacity-60 block mb-1 md:mb-1.5">Streak</span>
                <span className="text-sm md:text-xl font-black font-mono truncate block">{rewards?.current_streak || 0} Days</span>
              </div>
              <div className="bg-secondary/50 border md:border-2 border-foreground/30 md:border-foreground p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-secondary transition-colors min-w-0 md:shadow-[4px_4px_0px_var(--color-foreground)]">
                <span className="text-[9px] md:text-xs uppercase font-black tracking-widest opacity-60 block mb-1 md:mb-1.5">Transactions</span>
                <span className="text-sm md:text-xl font-black font-mono truncate block">{rewards?.total_transactions || 0}</span>
              </div>
            </div>

            {/* Scrollable Tier Journey */}
            <div className="border-t-2 md:border-t-4 border-dashed border-muted pt-4 md:pt-6 min-w-0 relative z-20">
              <div className="text-[10px] md:text-sm font-black uppercase tracking-widest opacity-60 mb-3 md:mb-4">Tier Journey</div>

              <div className="flex gap-3 md:gap-4 overflow-x-auto pb-8 pt-4 snap-x relative z-10 custom-scrollbar min-w-0 w-[calc(100%+2rem)] md:w-[calc(100%+4rem)] px-4 md:px-8 -mx-4 md:-mx-8 scroll-smooth">
                {REWARD_TIERS.map((tier) => {
                  const isCurrent = tier.name === tierInfo.current.name;
                  const isPast = (rewards?.available_c_points || 0) >= tier.minPoints && !isCurrent;
                  const style = TIER_STYLES[tier.name] || { icon: Trophy, bg: 'bg-primary', text: 'text-primary-foreground' };
                  const Icon = style.icon;

                  return (
                    <div 
                      key={tier.name} 
                      className={`flex flex-col items-center justify-center min-w-[100px] md:min-w-[130px] py-3 md:py-4 px-1.5 md:px-2 rounded-xl md:rounded-2xl border-2 md:border-4 snap-center shrink-0 transition-all duration-300 ease-out group/tier cursor-pointer
                        ${isCurrent 
                          ? 'border-foreground bg-secondary scale-110 shadow-[4px_4px_0px_var(--color-foreground)] md:shadow-[6px_6px_0px_var(--color-foreground)] mx-2 md:mx-4 z-10' 
                          : isPast 
                            ? 'border-foreground/30 opacity-70 bg-white hover:opacity-100 hover:border-foreground hover:-translate-y-2 hover:shadow-[4px_4px_0px_var(--color-foreground)]' 
                            : 'border-foreground/10 bg-secondary/20 hover:border-foreground/40 hover:-translate-y-2 hover:shadow-[4px_4px_0px_var(--color-foreground)]'
                        }`}
                    >
                      <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-2 md:mb-3 border-2 md:border-4 transition-transform duration-300 ${isCurrent ? 'scale-110' : 'group-hover/tier:scale-110 group-hover/tier:rotate-12'} ${isPast || isCurrent ? 'border-foreground' : 'border-foreground/20'} ${style.bg} ${style.text}`}>
                        <Icon className="w-4 h-4 md:w-6 md:h-6" />
                      </div>
                      <span className="text-[10px] md:text-sm font-black uppercase truncate w-full text-center px-1 mb-0.5 md:mb-1">{tier.name}</span>
                      <span className="text-[9px] md:text-xs font-mono font-bold opacity-60">{tier.minPoints.toLocaleString()} C</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Settings Grid Compact */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full min-w-0">
            <Link href="#" className="border-2 md:border-4 border-foreground rounded-xl md:rounded-2xl bg-white p-3 md:p-4 flex flex-col items-center justify-center gap-2 md:gap-3 hover:-translate-y-1 hover:shadow-[3px_3px_0px_var(--color-foreground)] md:hover:shadow-[6px_6px_0px_var(--color-foreground)] transition-all group text-center h-[90px] md:h-[120px]">
              <Users className="w-5 h-5 md:w-8 md:h-8 opacity-70 group-hover:scale-110 group-hover:text-primary transition-all" />
              <div className="font-black uppercase text-[9px] md:text-xs tracking-widest leading-tight">Saved<br />Passengers</div>
            </Link>
            <Link href="#" className="border-2 md:border-4 border-foreground rounded-xl md:rounded-2xl bg-white p-3 md:p-4 flex flex-col items-center justify-center gap-2 md:gap-3 hover:-translate-y-1 hover:shadow-[3px_3px_0px_var(--color-foreground)] md:hover:shadow-[6px_6px_0px_var(--color-foreground)] transition-all group text-center h-[90px] md:h-[120px]">
              <UserCheck className="w-5 h-5 md:w-8 md:h-8 opacity-70 group-hover:scale-110 group-hover:text-primary transition-all" />
              <div className="font-black uppercase text-[9px] md:text-xs tracking-widest leading-tight">Beneficiaries</div>
            </Link>
            <Link href="#" className="border-2 md:border-4 border-foreground rounded-xl md:rounded-2xl bg-white p-3 md:p-4 flex flex-col items-center justify-center gap-2 md:gap-3 hover:-translate-y-1 hover:shadow-[3px_3px_0px_var(--color-foreground)] md:hover:shadow-[6px_6px_0px_var(--color-foreground)] transition-all group text-center h-[90px] md:h-[120px]">
              <CreditCard className="w-5 h-5 md:w-8 md:h-8 opacity-70 group-hover:scale-110 group-hover:text-primary transition-all" />
              <div className="font-black uppercase text-[9px] md:text-xs tracking-widest leading-tight">Payment<br />Methods</div>
            </Link>
            <Link href="/profile/security" className="border-2 md:border-4 border-foreground rounded-xl md:rounded-2xl bg-white p-3 md:p-4 flex flex-col items-center justify-center gap-2 md:gap-3 hover:-translate-y-1 hover:shadow-[3px_3px_0px_var(--color-foreground)] md:hover:shadow-[6px_6px_0px_var(--color-foreground)] transition-all group text-center h-[90px] md:h-[120px]">
              <ShieldCheck className="w-5 h-5 md:w-8 md:h-8 opacity-70 group-hover:scale-110 group-hover:text-primary transition-all" />
              <div className="font-black uppercase text-[9px] md:text-xs tracking-widest leading-tight">Security &<br />2FA</div>
            </Link>
            <button
              onClick={handleSignOut}
              className="col-span-2 md:col-span-4 border-2 md:border-4 border-red-600 rounded-xl md:rounded-2xl bg-red-50 text-red-600 p-3 md:p-4 flex flex-row items-center justify-center gap-2 md:gap-3 hover:-translate-y-1 hover:shadow-[3px_3px_0px_currentColor] md:hover:shadow-[6px_6px_0px_currentColor] transition-all group h-[50px] md:h-[70px]"
            >
              <LogOut className="w-4 h-4 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" />
              <div className="font-black uppercase text-[10px] md:text-base tracking-widest">Sign Out</div>
            </button>
          </div>

        </div>
      </div>

      {/* Global styles for custom slim scrollbar inside this component */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 10px;
          margin: 0 16px;
        }
        @media (min-width: 768px) {
          .custom-scrollbar::-webkit-scrollbar-track {
            margin: 0 32px;
          }
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.15);
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.3);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
}
