const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8');
const envVars = {};
env.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabase = createClient(envVars['NEXT_PUBLIC_SUPABASE_URL'], envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY']);

async function test() {
  const { data, error } = await supabase
    .from('service_requests')
    .select('*, service:services(*), stage:pipeline_stages(*), status_obj:pipeline_statuses(*), quotes!quotes_request_id_fkey(*)')
    .limit(1);

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success:', data);
  }
}

test();
