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

export async function sendCustomerChatMessage(text: string) {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Not authenticated' };
    }

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Find if the user has an active conversation
    let conversationId = null;
    const { data: participants } = await supabase
      .from('communication_participants')
      .select('conversation_id')
      .eq('user_id', user.id)
      .eq('user_type', 'customer');

    if (participants && participants.length > 0) {
      const convIds = participants.map(p => p.conversation_id);
      const { data: activeConvs } = await supabase
        .from('communication_conversations')
        .select('id')
        .in('id', convIds)
        .neq('status', 'closed')
        .order('last_message_at', { ascending: false, nullsFirst: false })
        .limit(1);
        
      if (activeConvs && activeConvs.length > 0) {
        conversationId = activeConvs[0].id;
      }
    }

    // Create a new conversation if one doesn't exist
    if (!conversationId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user.id)
        .single();
        
      const subject = profile ? `Live Chat - ${profile.full_name || profile.email}` : 'Live Chat Support';

      const { data: newConv, error: convError } = await supabaseAdmin
        .from('communication_conversations')
        .insert({
          subject: subject,
          status: 'open',
          priority: 'medium',
          channel: 'support'
        })
        .select('id')
        .single();

      if (convError || !newConv) {
        console.error("Conversation creation error:", convError);
        return { error: 'Failed to create conversation' };
      }
      
      conversationId = newConv.id;

      // Add the user as a participant
      await supabaseAdmin
        .from('communication_participants')
        .insert({
          conversation_id: conversationId,
          user_id: user.id,
          user_type: 'customer',
          is_initiator: true
        });
    }

    // Insert the message
    const { data: message, error: msgError } = await supabase
      .from('communication_messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        sender_type: 'customer',
        visibility: 'customer',
        text: text
      })
      .select('id')
      .single();

    if (msgError) {
      console.error(msgError);
      return { error: 'Failed to send message' };
    }

    // Update conversation last_message_at
    await supabase
      .from('communication_conversations')
      .update({
        last_message_at: new Date().toISOString()
      })
      .eq('id', conversationId);

    return { 
      message_id: message.id,
      conversation_id: conversationId 
    };
  } catch (err: unknown) {
    if (err instanceof Error) return { error: err.message };
    return { error: 'An unknown error occurred' };
  }
}

export async function getActiveConversation() {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { conversation_id: null };

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

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
        .neq('status', 'closed')
        .order('last_message_at', { ascending: false, nullsFirst: false })
        .limit(1);
        
      if (activeConvs && activeConvs.length > 0) {
        return { conversation_id: activeConvs[0].id };
      }
    }
    return { conversation_id: null };
  } catch (err) {
    console.error(err);
    return { conversation_id: null };
  }
}

export async function getMessages(convId: string) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Verify user is part of the conversation
    const { data: participant } = await supabaseAdmin
      .from('communication_participants')
      .select('id')
      .eq('conversation_id', convId)
      .eq('user_id', user.id)
      .single();

    if (!participant) return [];

    const { data: msgs, error } = await supabaseAdmin
      .from('communication_messages')
      .select('*')
      .eq('conversation_id', convId)
      .eq('visibility', 'customer')
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    if (error) {
      console.error(error);
      return [];
    }
    return msgs || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}
