'use server'

import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'

export async function fetchUserAvatars(userIds: string[]) {
  if (!userIds || userIds.length === 0) return {};
  
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data } = await supabaseAdmin
    .from('profiles')
    .select('id, avatar_url')
    .in('id', userIds);
    
  return (data || []).reduce((acc: Record<string, string>, p: { id: string, avatar_url: string | null }) => {
    if (p.avatar_url) acc[p.id] = p.avatar_url;
    return acc;
  }, {} as Record<string, string>);
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

    // Call the atomic RPC — this handles everything in one transaction
    const { data, error: rpcError } = await supabase.rpc('fn_customer_send_chat_message', {
      p_text: text.trim()
    });

    if (rpcError) {
      console.error("RPC error:", rpcError);
      return { error: rpcError.message || 'Failed to send message' };
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
 * Uses admin client to bypass RLS complexity.
 */
export async function getActiveConversation() {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { conversation_id: null };

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Find conversations where this user is a participant
    const { data: participants } = await supabaseAdmin
      .from('communication_participants')
      .select('conversation_id')
      .eq('user_id', user.id)
      .eq('user_type', 'customer');

    if (participants && participants.length > 0) {
      const convIds = participants.map(p => p.conversation_id);
      const { data: activeConvs } = await supabaseAdmin
        .from('communication_conversations')
        .select('id')
        .in('id', convIds)
        .in('status', ['open', 'waiting_on_customer'])
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
 * Get messages for a conversation. Uses admin client to reliably
 * fetch all customer-visible messages. Checks that conversation is not deleted.
 */
export async function getMessages(convId: string) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Verify conversation exists and is not deleted
    const { data: conv } = await supabaseAdmin
      .from('communication_conversations')
      .select('id, is_deleted')
      .eq('id', convId)
      .maybeSingle();

    if (!conv || conv.is_deleted) return [];

    // Verify user is part of the conversation
    const { data: participant } = await supabaseAdmin
      .from('communication_participants')
      .select('id')
      .eq('conversation_id', convId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (!participant) return [];

    const { data: msgs, error } = await supabaseAdmin
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
