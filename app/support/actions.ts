'use server'

import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'

/**
 * Helper to get a Supabase client.
 * Prefers createAdminClient if SUPABASE_SERVICE_ROLE_KEY is set,
 * otherwise safely falls back to standard SSR server client (which uses RLS).
 */
async function getClient() {
  const supabase = await createServerClient();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (serviceKey) {
    try {
      return createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceKey
      );
    } catch (e) {
      console.warn("Failed to create admin client, using server client fallback:", e);
    }
  }
  return supabase;
}

export async function fetchUserAvatars(userIds: string[]) {
  if (!userIds || userIds.length === 0) return {};
  
  try {
    const client = await getClient();

    const { data } = await client
      .from('profiles')
      .select('id, avatar_url')
      .in('id', userIds);
      
    return (data || []).reduce((acc: Record<string, string>, p: { id: string, avatar_url: string | null }) => {
      if (p.avatar_url) acc[p.id] = p.avatar_url;
      return acc;
    }, {} as Record<string, string>);
  } catch (err) {
    console.error("fetchUserAvatars error:", err);
    return {};
  }
}

/**
 * Send a customer chat message using the atomic RPC function.
 * This handles: finding/creating conversation, adding participant,
 * inserting message, updating conversation pointers, and notifying staff
 * — all in a single atomic database call.
 */
export async function sendCustomerChatMessage(text: string) {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Not authenticated' };
    }

    // Bound the notification patch below to rows created by THIS call.
    const sentAt = new Date().toISOString();

    // Call the atomic RPC — this handles everything in one transaction
    const { data, error: rpcError } = await supabase.rpc('fn_customer_send_chat_message', {
      p_text: text.trim()
    });

    if (rpcError) {
      console.error("RPC error:", rpcError);
      return { error: rpcError.message || 'Failed to send message' };
    }

    // Add the conversation deep link to the staff notification the RPC just created.
    //
    // Why this exists: fn_customer_send_chat_message writes the staff notification with
    // a bare `action_url = '/support'` and an empty `metadata`, so the notification does
    // not record WHICH conversation it is about. The admin Support Hub then falls back to
    // auto-selecting the newest conversation — which merely *looks* correct (the newest
    // conversation is usually the one that triggered the notification) and leaves the
    // mobile view stranded on the ticket list, since only the `?id=` code path switches
    // it to the chat view.
    //
    // Proper long-term fix is `action_url := '/support?id=' || v_conversation_id` inside
    // the RPC itself; this patches it from the action layer instead. Best-effort only —
    // the message is already committed, so a failure here must never surface as a send
    // error. Filtering on `action_url = '/support'` keeps it idempotent and stops it from
    // ever overwriting an already-correct link.
    if (data?.conversation_id) {
      try {
        const admin = await getClient();
        await admin
          .from('notifications')
          .update({
            action_url: `/support?id=${data.conversation_id}`,
            metadata: { conversation_id: data.conversation_id },
          })
          .eq('target_role', 'staff')
          .eq('category', 'chat')
          .eq('action_url', '/support')
          .gte('created_at', sentAt);
      } catch (patchErr) {
        console.warn('Could not attach deep link to staff notification:', patchErr);
      }
    }

    // RPC returns { conversation_id, message_id, created_at }
    return {
      conversation_id: data.conversation_id,
      message_id: data.message_id,
      created_at: data.created_at,
    };
  } catch (err: unknown) {
    console.error("sendCustomerChatMessage error:", err);
    if (err instanceof Error) return { error: err.message };
    return { error: 'An unknown error occurred' };
  }
}

/**
 * Get the active (non-closed, non-deleted) conversation for the current user.
 * Uses getClient() to safely handle environments with or without SERVICE_ROLE_KEY.
 */
export async function getActiveConversation() {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { conversation_id: null };

    const client = await getClient();

    // Find conversations where this user is a participant
    const { data: participants } = await client
      .from('communication_participants')
      .select('conversation_id')
      .eq('user_id', user.id)
      .eq('user_type', 'customer');

    if (participants && participants.length > 0) {
      const convIds = participants.map(p => p.conversation_id);
      const { data: activeConvs } = await client
        .from('communication_conversations')
        .select('id')
        .in('id', convIds)
        .in('status', ['open', 'waiting_on_customer', 'resolved'])
        .eq('is_deleted', false)
        .order('last_message_at', { ascending: false, nullsFirst: false })
        .limit(1);
        
      if (activeConvs && activeConvs.length > 0) {
        return { conversation_id: activeConvs[0].id };
      }
    }
    return { conversation_id: null };
  } catch (err) {
    console.error("getActiveConversation error:", err);
    return { conversation_id: null };
  }
}

/**
 * Get messages for a conversation. Checks that conversation is not deleted.
 * Uses getClient() to safely handle environments with or without SERVICE_ROLE_KEY.
 */
export async function getMessages(convId: string) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const client = await getClient();

    // Verify conversation exists and is not deleted
    const { data: conv } = await client
      .from('communication_conversations')
      .select('id, is_deleted')
      .eq('id', convId)
      .maybeSingle();

    if (!conv || conv.is_deleted) return [];

    // Verify user is part of the conversation
    const { data: participant } = await client
      .from('communication_participants')
      .select('id')
      .eq('conversation_id', convId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (!participant) return [];

    const { data: msgs, error } = await client
      .from('communication_messages')
      .select('*')
      .eq('conversation_id', convId)
      .eq('visibility', 'customer')
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("getMessages error:", error);
      return [];
    }
    return msgs || [];
  } catch (err) {
    console.error("getMessages error:", err);
    return [];
  }
}
