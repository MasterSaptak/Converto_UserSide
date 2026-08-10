// =====================================================
// CONVERTO — Shared Notification Hook
// =====================================================
// Shared between UserSide and ServerSide.
// Keep this file identical in both projects.
// =====================================================

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import type { SupabaseClient, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { 
  Notification, 
  UseNotificationsConfig, 
  UseNotificationsReturn, 
  NotificationFilter 
} from './types';

export function useSharedNotifications(
  supabase: SupabaseClient,
  config: UseNotificationsConfig
): UseNotificationsReturn {
  const { mode, limit = 50 } = config;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Prevent duplicate toasts on realtime reconnects
  const shownToasts = useRef(new Set<string>());

  // 1. Fetch initial data
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user robustly without throwing if no session
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError || !session?.user) {
        setUserId(null);
        setNotifications([]);
        setLoading(false);
        return;
      }
      
      const currentUserId = session.user.id;
      setUserId(currentUserId);

      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      // Mode-specific filtering matching RLS policy
      if (mode === 'user') {
        query = query.or(`profile_id.eq.${currentUserId},and(profile_id.is.null,target_role.in.(customer,all))`);
      } else if (mode === 'staff') {
        query = query.or(`profile_id.eq.${currentUserId},and(profile_id.is.null,target_role.in.(staff,all))`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setNotifications((data as Notification[]) || []);

    } catch (err: unknown) {
      console.error('Failed to fetch notifications:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [supabase, mode, limit]);

  // 2. Setup Realtime Subscription
  useEffect(() => {
    fetchNotifications();

    if (!userId && mode === 'user') return;

    // Unique channel name to avoid conflicts
    const channelName = `public:notifications-${mode}-${Math.random().toString(36).substring(7)}`;

    // ─────────────────────────────────────────────────────────────────────────
    // Filtering happens SERVER-SIDE (see the bindings below), not just in JS.
    //
    // This used to be a single unfiltered subscription to the whole table with
    // all filtering done here in the callback. That was survivable while every
    // notification was written one at a time. It stopped being survivable with
    // v23's content publish, which inserts one row PER RECIPIENT: a 5,000-person
    // announcement would push 5,000 INSERT events to every connected client,
    // each one re-rendering this hook and checking the toast set. Postgres
    // filters now drop those rows before they ever reach the browser.
    //
    // The JS checks below are kept as defence in depth — a broadcast row still
    // has to be matched against `target_role`, which the server filter can't do.
    // ─────────────────────────────────────────────────────────────────────────
    const handlePayload = (
      payload: RealtimePostgresChangesPayload<Notification>
    ) => {
          if (payload.eventType === 'INSERT') {
            const newNotif = payload.new as Notification;
            
            // Mode-specific realtime filtering
            if (mode === 'user') {
              if (newNotif.target_role === 'staff') return; // Ignore staff notifications
              if (newNotif.profile_id !== userId && newNotif.profile_id !== null) {
                return; // Not for this user
              }
            } else if (mode === 'staff') {
              if (newNotif.target_role === 'customer') return; // Ignore customer notifications
              if (newNotif.profile_id && newNotif.profile_id !== userId) {
                return; // Targeted to another specific staff member
              }
            }
            
            setNotifications((prev) => {
              if (prev.some(n => n.id === newNotif.id)) return prev;
              return [newNotif, ...prev];
            });

            // Show toast only once
            if (!shownToasts.current.has(newNotif.id)) {
              shownToasts.current.add(newNotif.id);
              toast(newNotif.title, {
                description: newNotif.message,
                action: newNotif.action_url ? {
                  label: 'View',
                  onClick: () => window.location.href = newNotif.action_url!
                } : undefined,
              });
            }
          }

          if (payload.eventType === 'UPDATE') {
            const updatedNotif = payload.new as Notification;
            
            if (mode === 'user') {
              if (updatedNotif.target_role === 'staff') return;
              if (updatedNotif.profile_id !== userId && updatedNotif.profile_id !== null) {
                return;
              }
            } else if (mode === 'staff') {
              if (updatedNotif.target_role === 'customer') return;
            }

            setNotifications((prev) => 
              prev.map(n => n.id === updatedNotif.id ? updatedNotif : n)
            );
          }

          if (payload.eventType === 'DELETE') {
            setNotifications((prev) => prev.filter(n => n.id !== payload.old?.id));
          }
    };

    const channel = supabase.channel(channelName);

    // Rows addressed to this user specifically. Every notification v23 writes is
    // per-user, so this is the binding that carries essentially all traffic.
    if (userId) {
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `profile_id=eq.${userId}` },
        handlePayload
      );
    }

    // Legacy broadcast rows (profile_id IS NULL). Nothing writes these any more —
    // v23 fans out per-user precisely because a broadcast shares ONE is_read flag
    // between everybody — but historic rows still exist and must keep arriving.
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'notifications', filter: 'profile_id=is.null' },
      handlePayload
    );

    // DELETE is subscribed unfiltered on purpose. Postgres only ships the primary
    // key in a delete payload unless the table is REPLICA IDENTITY FULL, so a
    // `profile_id=eq.…` filter would silently never match and deletions would stop
    // syncing across tabs. Deletes are rare and carry no body, so this does not
    // reintroduce the flood the filters above exist to prevent. A duplicate DELETE
    // from both bindings is harmless — the handler filters by id and is idempotent.
    channel.on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'notifications' },
      handlePayload
    );

    channel.subscribe((status) => {
      if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
        console.warn(`Notification channel (${mode}) disconnected:`, status);
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, mode, userId, fetchNotifications]);

  // 3. Actions (Optimistic Updates + Supabase call)
  
  const markAsRead = async (id: string) => {
    setNotifications((prev) => 
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (error) {
      console.error('Failed to mark as read:', error);
      fetchNotifications(); // revert
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map(n => ({ ...n, is_read: true })));

    let query = supabase.from('notifications').update({ is_read: true }).eq('is_read', false);
    
    if (userId) {
      query = query.eq('profile_id', userId); 
    }

    const { error } = await query;

    if (error) {
      console.error('Failed to mark all as read:', error);
      fetchNotifications();
    }
  };

  const deleteNotification = async (id: string) => {
    setNotifications((prev) => prev.filter(n => n.id !== id));

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete notification:', error);
      fetchNotifications();
    }
  };

  const clearReadNotifications = async () => {
    setNotifications((prev) => prev.filter(n => !n.is_read));

    let query = supabase.from('notifications').delete().eq('is_read', true);
    if (userId) {
      query = query.eq('profile_id', userId);
    }

    const { error } = await query;

    if (error) {
      console.error('Failed to clear read notifications:', error);
      fetchNotifications();
    }
  };

  // 4. Memoized derived state
  
  // Sort by created_at desc
  const sortedNotifications = useMemo(() => {
    return [...notifications].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [notifications]);

  const unreadCount = useMemo(() => {
    return sortedNotifications.reduce((count, n) => count + (n.is_read ? 0 : 1), 0);
  }, [sortedNotifications]);

  const filterNotifications = useCallback((filter: NotificationFilter) => {
    if (filter === 'all') return sortedNotifications;
    if (filter === 'unread') return sortedNotifications.filter(n => !n.is_read);
    return sortedNotifications.filter(n => n.category === filter);
  }, [sortedNotifications]);

  return {
    notifications: sortedNotifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearReadNotifications,
    filterNotifications,
    refresh: fetchNotifications,
  };
}
