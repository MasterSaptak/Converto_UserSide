'use client';

import { createContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  username: string | null;
  full_name: string | null;
  phone: string | null;
  country: string | null;
  timezone: string | null;
  preferred_currency: string;
  avatar_url: string | null;
  updated_at: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (currentUser: User) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
      return;
    }
    
    if (data) {
      // Auto-fill missing profile fields from auth metadata (signup data)
      const meta = currentUser.user_metadata;
      const needsUpdate: Record<string, string> = {};
      
      if (!data.username && meta?.username) needsUpdate.username = meta.username;
      if (!data.phone && meta?.phone_number) needsUpdate.phone = meta.phone_number;
      if (!data.full_name && meta?.full_name) needsUpdate.full_name = meta.full_name;

      if (Object.keys(needsUpdate).length > 0) {
        const { error: updateErr } = await supabase
          .from('profiles')
          .update({ ...needsUpdate, updated_at: new Date().toISOString() })
          .eq('id', currentUser.id);
        
        if (!updateErr) {
          setProfile({ ...data, ...needsUpdate });
          return;
        }
      }

      setProfile(data);
    } else {
      setProfile(null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user);
        }
        setLoading(false);
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
