const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

async function test() {
  const { data, error } = await supabaseAdmin
    .from('communication_conversations')
    .insert({
      subject: 'Test Script Subject',
      status: 'open',
      priority: 'medium',
      tags: ['live_chat']
    })
    .select('id')
    .single();

  if (error) {
    console.error('INSERT ERROR:', error);
  } else {
    console.log('INSERT SUCCESS:', data);
  }
}

test();
