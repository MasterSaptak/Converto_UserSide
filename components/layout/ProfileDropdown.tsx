'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useInstallPWA } from '@/hooks/useInstallPWA';
import { User, Settings, LogOut, Loader2, Sun, Moon, Download, X, Share, Plus, SquareArrowOutUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { canInstall, isInstalled, isIOS, install, showIOSInstructions, setShowIOSInstructions } = useInstallPWA();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    router.push('/login');
  };

  const displayName = profile?.username || profile?.full_name || user?.email?.split('@')[0] || 'User';
  const emailDisplay = user?.email || '';
  const avatarUrl = profile?.avatar_url;

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={cn("relative border-2 border-foreground bg-card hover:bg-secondary transition-colors focus:outline-none flex items-center justify-center overflow-hidden h-[40px] w-[40px] rounded-full", avatarUrl ? "p-0" : "p-2")}
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User className="h-5 w-5" />
          )}
        </button>

        {isOpen && (
          <div className="absolute top-[120%] right-0 w-72 border-2 border-foreground bg-card shadow-[6px_6px_0px_var(--color-foreground)] z-50 flex flex-col pointer-events-auto">
            {/* Header */}
            <div className="p-4 border-b-2 border-foreground bg-secondary flex items-center gap-3">
              <div className="h-10 w-10 border-2 border-foreground bg-background shrink-0 flex items-center justify-center overflow-hidden rounded-full">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-5 w-5 opacity-50" />
                )}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-bold uppercase tracking-wider text-sm truncate">{displayName}</span>
                <span className="text-[9px] uppercase font-bold tracking-widest opacity-60 truncate block w-full" title={emailDisplay}>
                  {emailDisplay}
                </span>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-col p-2">
              <Link 
                href="/profile" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors font-bold uppercase text-xs tracking-widest"
              >
                <User className="w-4 h-4 opacity-70" />
                Profile
              </Link>
              <Link 
                href="#" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors font-bold uppercase text-xs tracking-widest"
              >
                <Settings className="w-4 h-4 opacity-70" />
                Settings
              </Link>

              {/* Dark/Light Mode Toggle */}
              <button 
                onClick={toggleTheme}
                className="flex items-center justify-between p-3 hover:bg-secondary transition-colors font-bold uppercase text-xs tracking-widest w-full text-left"
              >
                <span className="flex items-center gap-3">
                  {theme === 'dark' ? <Sun className="w-4 h-4 opacity-70" /> : <Moon className="w-4 h-4 opacity-70" />}
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
                <div className="w-10 h-5 border-2 border-foreground bg-secondary relative overflow-hidden">
                  <div className={`absolute top-0.5 w-3 h-3 bg-primary transition-all duration-300 ${theme === 'dark' ? 'left-5' : 'left-0.5'}`}></div>
                </div>
              </button>

              {/* Install App Button */}
              {canInstall && (
                <button 
                  onClick={install}
                  className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors font-bold uppercase text-xs tracking-widest w-full text-left text-primary"
                >
                  <Download className="w-4 h-4 opacity-70" />
                  Install App
                </button>
              )}
              {isInstalled && (
                <div className="flex items-center gap-3 p-3 font-bold uppercase text-xs tracking-widest text-emerald-600 opacity-60">
                  <Download className="w-4 h-4" />
                  App Installed ✓
                </div>
              )}
            </div>

            {/* Footer / Sign Out */}
            <div className="border-t-2 border-dashed border-muted p-2">
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="w-full flex items-center gap-3 p-3 hover:bg-destructive/10 text-red-600 transition-colors font-bold uppercase text-xs tracking-widest disabled:opacity-50 text-left"
              >
                {isSigningOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4 opacity-70" />}
                {isSigningOut ? 'Signing Out...' : 'Sign Out'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* iOS Install Instructions Modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-card border-2 border-foreground w-full max-w-sm shadow-[8px_8px_0px_var(--color-foreground)]">
            <div className="p-5 border-b-2 border-foreground bg-secondary flex justify-between items-center">
              <span className="font-bold uppercase tracking-widest text-sm">Install Converto</span>
              <button onClick={() => setShowIOSInstructions(false)} className="p-1 hover:bg-background transition-colors border-2 border-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-5">
              <p className="text-xs font-bold uppercase tracking-wider opacity-80">
                To install Converto on your iPhone or iPad:
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 border-2 border-foreground bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold font-heading text-sm">1</div>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold uppercase text-xs tracking-wider">Tap the Share button</span>
                    <span className="text-[10px] opacity-60 font-bold uppercase tracking-wider flex items-center gap-1">
                      Look for <SquareArrowOutUp className="w-3 h-3 inline" /> at the bottom of Safari
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 border-2 border-foreground bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold font-heading text-sm">2</div>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold uppercase text-xs tracking-wider">Scroll & tap &quot;Add to Home Screen&quot;</span>
                    <span className="text-[10px] opacity-60 font-bold uppercase tracking-wider flex items-center gap-1">
                      Look for <Plus className="w-3 h-3 inline" /> Add to Home Screen
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 border-2 border-foreground bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold font-heading text-sm">3</div>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold uppercase text-xs tracking-wider">Tap &quot;Add&quot;</span>
                    <span className="text-[10px] opacity-60 font-bold uppercase tracking-wider">
                      Converto will appear on your home screen
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowIOSInstructions(false)}
                className="w-full bg-primary text-primary-foreground border-2 border-foreground py-3 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors shadow-[4px_4px_0px_var(--color-foreground)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 mt-2"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
