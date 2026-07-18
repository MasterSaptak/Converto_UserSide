'use client';

import { ShieldCheck, User, Users, UserCheck, CreditCard, LogOut, Loader2, Copy, Check, Upload, Link as LinkIcon, Save, X, Medal, Trophy, Award, Gem, Shield, Crown, MapPin, Mail, Phone, Calendar, Hash, Globe } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRewards } from "@/hooks/useRewards";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { REWARD_TIERS } from "@/lib/currencies";

const TIER_STYLES: Record<string, { icon: any, bg: string, text: string }> = {
  'Bronze': { icon: Medal, bg: 'bg-[#CD7F32]', text: 'text-white' },
  'Silver': { icon: Medal, bg: 'bg-[#C0C0C0]', text: 'text-black' },
  'Gold': { icon: Trophy, bg: 'bg-[#FFD700]', text: 'text-black' },
  'Platinum': { icon: Award, bg: 'bg-[#E5E4E2]', text: 'text-black' },
  'Diamond': { icon: Gem, bg: 'bg-[#b9f2ff]', text: 'text-black' },
  'Ruby': { icon: Gem, bg: 'bg-[#E0115F]', text: 'text-white' },
  'Sapphire': { icon: Gem, bg: 'bg-[#0F52BA]', text: 'text-white' },
  'Emerald': { icon: Gem, bg: 'bg-[#50C878]', text: 'text-black' },
  'Titanium': { icon: Shield, bg: 'bg-[#878681]', text: 'text-white' },
  'Black Card': { icon: Crown, bg: 'bg-black', text: 'text-white' },
}

export default function ProfilePage() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { rewards, tierInfo, isLoading: isRewardsLoading } = useRewards();
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
    <div className="flex-1 flex flex-col gap-4 animate-in fade-in duration-500 pb-28 md:pb-10 px-4 md:px-6 overflow-hidden md:overflow-visible w-full max-w-4xl mx-auto min-w-0">
      
      {/* Toast Message */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 p-3 rounded-xl border-2 border-foreground shadow-[2px_2px_0px_var(--color-foreground)] animate-in slide-in-from-top-4 flex items-center gap-2 font-bold text-xs ${message.type === 'success' ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'}`}>
          {message.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          {message.text}
          <button onClick={() => setMessage(null)} className="ml-2 opacity-50 hover:opacity-100"><X className="w-3 h-3" /></button>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between gap-4 bg-white border-2 border-foreground p-3 md:p-4 rounded-2xl shadow-[4px_4px_0px_var(--color-foreground)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary border-2 border-foreground rounded-full flex items-center justify-center">
            <User className="w-5 h-5 opacity-50" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold font-heading uppercase leading-none tracking-tight">Account Profile</h1>
            <span className="text-[9px] uppercase font-bold tracking-widest opacity-60">Manage your details & rewards</span>
          </div>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="border-2 border-foreground rounded-xl bg-primary text-primary-foreground px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:scale-105 hover:-translate-y-1 hover:shadow-[2px_2px_0px_var(--color-foreground)] transition-all shrink-0"
          >
            Edit
          </button>
        )}
      </header>
      
      {/* Main Grid Container - Added min-w-0 to prevent blowouts */}
      <div className="grid lg:grid-cols-[300px_1fr] gap-4 items-start w-full min-w-0">
        
        {/* Left Column: Profile Card */}
        <div className="border-2 border-foreground rounded-2xl bg-white p-4 relative shadow-[4px_4px_0px_var(--color-foreground)] min-w-0">
          
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-100 text-emerald-800 border-2 border-emerald-800 rounded-full px-2 py-0.5 z-10">
            <ShieldCheck className="w-2.5 h-2.5" />
            <span className="text-[8px] font-bold uppercase tracking-widest">Verified</span>
          </div>

          {!isEditing ? (
            <div className="flex flex-col items-center text-center mt-2">
              <div className="w-16 h-16 border-2 border-foreground bg-secondary mb-3 flex items-center justify-center rounded-full overflow-hidden shrink-0 group hover:scale-110 transition-transform">
                {profile?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 opacity-40" />
                )}
              </div>
              
              <h2 className="text-xl font-bold font-heading uppercase truncate w-full px-2">{displayName}</h2>
              <div className="text-[9px] uppercase font-bold tracking-widest opacity-60 mb-4 flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" /> {profile?.country || 'No Location'}
              </div>
              
              <div className="w-full border-t-2 border-dashed border-muted pt-3 flex flex-col gap-1.5 text-left">
                {/* Details List */}
                <div className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary/50 transition-colors group/item min-w-0">
                  <Hash className="w-3.5 h-3.5 opacity-40 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] uppercase font-bold tracking-widest opacity-60 block">User ID</span>
                    <span className="text-[10px] font-mono font-bold truncate block">{user?.id || '—'}</span>
                  </div>
                  <button onClick={copyToClipboard} className="opacity-0 group-hover/item:opacity-100 hover:text-primary transition-opacity shrink-0 p-1">
                    {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>

                <div className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary/50 transition-colors min-w-0">
                  <Mail className="w-3.5 h-3.5 opacity-40 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] uppercase font-bold tracking-widest opacity-60 block">Email</span>
                    <span className="text-[10px] font-mono font-bold truncate block">{user?.email || '—'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary/50 transition-colors min-w-0">
                  <Phone className="w-3.5 h-3.5 opacity-40 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] uppercase font-bold tracking-widest opacity-60 block">Phone</span>
                    <span className="text-[10px] font-mono font-bold truncate block">{profile?.phone || '—'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary/50 transition-colors min-w-0">
                  <Globe className="w-3.5 h-3.5 opacity-40 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] uppercase font-bold tracking-widest opacity-60 block">Region Settings</span>
                    <span className="text-[10px] font-mono font-bold truncate block">{profile?.preferred_currency || 'USD'} • {profile?.timezone || 'UTC'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary/50 transition-colors min-w-0">
                  <Calendar className="w-3.5 h-3.5 opacity-40 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] uppercase font-bold tracking-widest opacity-60 block">Joined</span>
                    <span className="text-[10px] font-mono font-bold truncate block">{getFormattedJoinDate()}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="flex flex-col gap-3">
              <h3 className="font-bold uppercase text-[10px] tracking-[0.2em] mb-1">Edit Profile</h3>
              
              {/* Avatar Edit Compact */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 border-2 border-foreground bg-secondary flex items-center justify-center rounded-full overflow-hidden shrink-0">
                  {displayAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={displayAvatar} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 opacity-40" />
                  )}
                </div>
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[9px] font-bold uppercase tracking-widest border-2 border-foreground px-2 py-1 flex items-center justify-center gap-1 hover:bg-secondary transition-colors">
                    <Upload className="w-3 h-3" /> Upload
                  </button>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                  <div className="flex items-center border-2 border-foreground bg-background px-1.5 overflow-hidden">
                    <LinkIcon className="w-3 h-3 opacity-40 shrink-0" />
                    <input type="url" placeholder="Image URL..." value={formData.avatar_url} onChange={(e) => { setFormData({...formData, avatar_url: e.target.value}); setAvatarFile(null); }} className="w-full bg-transparent px-1.5 py-1 text-[9px] font-mono font-bold placeholder:opacity-30 focus:outline-none min-w-0" />
                  </div>
                </div>
              </div>

              {/* Form Inputs Compact */}
              <div className="grid grid-cols-1 gap-2.5 mt-2">
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] uppercase font-bold tracking-widest opacity-80">Name</label>
                  <input type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className="w-full border-2 border-foreground bg-background px-2 py-1.5 text-xs font-mono font-bold focus:outline-none focus:border-primary" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] uppercase font-bold tracking-widest opacity-80">Username</label>
                  <input type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full border-2 border-foreground bg-background px-2 py-1.5 text-xs font-mono font-bold focus:outline-none focus:border-primary" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] uppercase font-bold tracking-widest opacity-80">Phone</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full border-2 border-foreground bg-background px-2 py-1.5 text-xs font-mono font-bold focus:outline-none focus:border-primary" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[9px] uppercase font-bold tracking-widest opacity-80">Currency</label>
                    <select value={formData.preferred_currency} onChange={(e) => setFormData({...formData, preferred_currency: e.target.value})} className="w-full border-2 border-foreground bg-background px-1 py-1.5 text-[10px] font-mono font-bold focus:outline-none">
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="INR">INR</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[9px] uppercase font-bold tracking-widest opacity-80">Timezone</label>
                    <input type="text" value={formData.timezone} onChange={(e) => setFormData({...formData, timezone: e.target.value})} className="w-full border-2 border-foreground bg-background px-2 py-1.5 text-[10px] font-mono font-bold focus:outline-none" />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-2 pt-3 border-t-2 border-dashed border-muted">
                <button type="button" onClick={() => setIsEditing(false)} disabled={isSaving} className="flex-1 border-2 border-foreground bg-white text-foreground py-2 font-bold uppercase tracking-widest text-[9px] hover:bg-secondary transition-colors">Cancel</button>
                <button type="submit" disabled={isSaving} className="flex-1 border-2 border-foreground bg-primary text-primary-foreground py-2 font-bold uppercase tracking-widest text-[9px] hover:-translate-y-1 hover:shadow-[2px_2px_0px_var(--color-foreground)] transition-all flex items-center justify-center gap-1.5">
                  {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                  Save
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Rewards & Actions min-w-0 required for flex/grid children */}
        <div className="flex flex-col gap-4 min-w-0 w-full">
          
          {/* Rewards Module Compact */}
          <div className="border-2 border-foreground rounded-2xl bg-white p-4 md:p-5 relative overflow-hidden group shadow-[4px_4px_0px_var(--color-foreground)] w-full min-w-0">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/3 group-hover:scale-[2] transition-transform duration-700 pointer-events-none"></div>
            
            {/* Top Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 border-2 border-foreground rounded-xl flex items-center justify-center text-xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 shadow-[2px_2px_0px_var(--color-foreground)] ${currentTierStyle.bg} ${currentTierStyle.text}`}>
                  <CurrentTierIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-widest opacity-60">Current Tier</div>
                  <div className="text-xl font-heading font-bold leading-none mt-1">{tierInfo.current.name}</div>
                </div>
              </div>
              <div className="sm:text-right">
                <div className="text-[9px] font-bold uppercase tracking-widest opacity-60">Lifetime Points</div>
                <div className="text-2xl font-heading font-bold text-primary leading-none mt-1">
                  {isRewardsLoading ? '...' : (rewards?.lifetime_c_points || 0).toLocaleString()} C
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-secondary border-2 border-foreground rounded-full overflow-hidden mb-1.5">
              <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${tierInfo.progress}%` }}></div>
            </div>
            {tierInfo.next ? (
              <div className="text-[9px] uppercase font-bold tracking-widest opacity-60 mb-5">
                {(tierInfo.next.minPoints - (rewards?.lifetime_c_points || 0)).toLocaleString()} C to {tierInfo.next.name}
              </div>
            ) : (
              <div className="text-[9px] uppercase font-bold tracking-widest opacity-60 mb-5">Maximum Tier Reached</div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
              <div className="bg-secondary/30 border border-foreground/10 p-2.5 rounded-xl hover:bg-secondary/60 transition-colors min-w-0">
                <span className="text-[8px] uppercase font-bold tracking-widest opacity-60 block">Available</span>
                <span className="text-xs font-bold font-mono truncate block">{(rewards?.available_c_points || 0).toLocaleString()} C</span>
              </div>
              <div className="bg-secondary/30 border border-foreground/10 p-2.5 rounded-xl hover:bg-secondary/60 transition-colors min-w-0">
                <span className="text-[8px] uppercase font-bold tracking-widest opacity-60 block">Spent</span>
                <span className="text-xs font-bold font-mono truncate block">{(rewards?.spent_c_points || 0).toLocaleString()} C</span>
              </div>
              <div className="bg-secondary/30 border border-foreground/10 p-2.5 rounded-xl hover:bg-secondary/60 transition-colors min-w-0">
                <span className="text-[8px] uppercase font-bold tracking-widest opacity-60 block">Streak</span>
                <span className="text-xs font-bold font-mono truncate block">{rewards?.current_streak || 0} Days</span>
              </div>
              <div className="bg-secondary/30 border border-foreground/10 p-2.5 rounded-xl hover:bg-secondary/60 transition-colors min-w-0">
                <span className="text-[8px] uppercase font-bold tracking-widest opacity-60 block">Txns</span>
                <span className="text-xs font-bold font-mono truncate block">{rewards?.total_transactions || 0}</span>
              </div>
            </div>

            {/* Scrollable Tier Journey */}
            <div className="border-t-2 border-dashed border-muted pt-4 min-w-0">
              <div className="text-[9px] font-bold uppercase tracking-widest opacity-60 mb-2.5">Tier Journey</div>
              
              {/* Added styled scrollbar classes */}
              <div className="flex gap-2.5 overflow-x-auto pb-3 snap-x relative z-10 custom-scrollbar min-w-0 w-full">
                {REWARD_TIERS.map((tier) => {
                  const isCurrent = tier.name === tierInfo.current.name;
                  const isPast = (rewards?.lifetime_c_points || 0) >= tier.minPoints && !isCurrent;
                  const style = TIER_STYLES[tier.name] || { icon: Trophy, bg: 'bg-primary', text: 'text-primary-foreground' };
                  const Icon = style.icon;
                  
                  return (
                    <div key={tier.name} className={`flex flex-col items-center justify-center min-w-[85px] py-2.5 px-1 rounded-xl border-2 snap-center shrink-0 transition-all ${isCurrent ? 'border-foreground bg-secondary scale-[1.02] shadow-[2px_2px_0px_var(--color-foreground)]' : isPast ? 'border-foreground/30 opacity-70 bg-white' : 'border-foreground/10 bg-secondary/20'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1.5 border-2 ${isPast || isCurrent ? 'border-foreground' : 'border-foreground/20'} ${style.bg} ${style.text}`}>
                         <Icon className="w-3 h-3" />
                      </div>
                      <span className="text-[9px] font-bold uppercase truncate w-full text-center px-1">{tier.name}</span>
                      <span className="text-[8px] font-mono opacity-60">{tier.minPoints.toLocaleString()} C</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Settings Grid Compact */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full min-w-0">
            <Link href="#" className="border-2 border-foreground rounded-xl bg-white p-3 flex flex-col items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-[2px_2px_0px_var(--color-foreground)] transition-all group text-center h-[80px]">
              <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <div className="font-bold uppercase text-[8px] tracking-widest leading-tight">Saved<br/>Passengers</div>
            </Link>
            <Link href="#" className="border-2 border-foreground rounded-xl bg-white p-3 flex flex-col items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-[2px_2px_0px_var(--color-foreground)] transition-all group text-center h-[80px]">
              <UserCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <div className="font-bold uppercase text-[8px] tracking-widest leading-tight">Beneficiaries</div>
            </Link>
            <Link href="#" className="border-2 border-foreground rounded-xl bg-white p-3 flex flex-col items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-[2px_2px_0px_var(--color-foreground)] transition-all group text-center h-[80px]">
              <CreditCard className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <div className="font-bold uppercase text-[8px] tracking-widest leading-tight">Payment<br/>Methods</div>
            </Link>
            <Link href="/profile/security" className="border-2 border-foreground rounded-xl bg-white p-3 flex flex-col items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-[2px_2px_0px_var(--color-foreground)] transition-all group text-center h-[80px]">
              <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <div className="font-bold uppercase text-[8px] tracking-widest leading-tight">Security &<br/>2FA</div>
            </Link>
            <button
              onClick={handleSignOut}
              className="col-span-2 md:col-span-4 border-2 border-red-600 rounded-xl bg-red-50 text-red-600 p-3 flex flex-row items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-[2px_2px_0px_currentColor] transition-all group h-[45px]"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <div className="font-bold uppercase text-[9px] tracking-widest">Sign Out</div>
            </button>
          </div>
          
        </div>
      </div>
      
      {/* Global styles for custom slim scrollbar inside this component */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.4);
        }
      `}</style>
    </div>
  );
}
