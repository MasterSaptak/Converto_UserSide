import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  'https://usibqzifqzfpxfvngeow.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzaWJxemlmcXpmcHhmdm5nZW93Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mzk1ODc2OCwiZXhwIjoyMDk5NTM0NzY4fQ.S8Fgyty3YoIyM25pU0J5DnxVdI9XEj6wmAWQfdi8eW0',
  { auth: { persistSession: false } }
);

async function test() {
  const { data, error } = await supabaseAdmin
    .from('communication_conversations')
    .select('*')
    .limit(1);

  console.log('SELECT RESULT:', JSON.stringify({ data, error }, null, 2));
}

test();
