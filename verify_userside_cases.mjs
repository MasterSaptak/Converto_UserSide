// Verifies the customer-facing 1-Tap case flow AS A REAL CUSTOMER.
// Run:  node verify_userside_cases.mjs
//
// This matters because the customer app talks to Supabase with the ANON key and
// a user session, so every read and write is subject to RLS. A service-role test
// would pass while the real app fails. It creates a throwaway auth user, signs
// in as them, exercises the flow, and deletes the user at the end.

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Minimal .env.local reader — `dotenv` is not a dependency of this app and a
// verification script is not a reason to add one.
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')]
    })
)

const URL = env.NEXT_PUBLIC_SUPABASE_URL
const ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SERVICE = env.SUPABASE_SERVICE_ROLE_KEY

const admin = createClient(URL, SERVICE, { auth: { autoRefreshToken: false, persistSession: false } })

let failures = 0
const ok = (m) => console.log(`  \x1b[32mPASS\x1b[0m  ${m}`)
const fail = (m) => { failures++; console.log(`  \x1b[31mFAIL\x1b[0m  ${m}`) }
const skip = (m) => console.log(`  \x1b[33mSKIP\x1b[0m  ${m}`)

const email = `v18-verify-${Date.now()}@converto-test.local`
const password = `Test-${crypto.randomUUID()}`
let userId = null

console.log('\n0. Test customer')
{
  const { data, error } = await admin.auth.admin.createUser({
    email, password, email_confirm: true,
  })
  if (error) {
    console.log(`  \x1b[31mFAIL\x1b[0m  could not create test user: ${error.message}`)
    process.exit(1)
  }
  userId = data.user.id
  ok(`created ${email}`)

  // A `profiles` row is normally made by a trigger on signup. Ensure it exists
  // and is NOT staff, so we are testing the customer policy path.
  await admin.from('profiles').upsert({ id: userId, email, full_name: 'Verify Bot', is_staff: false })
  const { data: p } = await admin.from('profiles').select('is_staff').eq('id', userId).single()
  p && p.is_staff === false ? ok('profile exists and is non-staff') : fail('profile missing or flagged staff')
}

// Sign in exactly as the browser would.
const customer = createClient(URL, ANON, { auth: { persistSession: false } })
{
  const { error } = await customer.auth.signInWithPassword({ email, password })
  if (error) { fail(`sign-in: ${error.message}`); await cleanup(); process.exit(1) }
  ok('signed in with the anon key')
}

const { data: service } = await admin.from('services').select('id, name, slug').eq('slug', 'exchange').single()

let caseId = null
let requestId = null

// ── 1. Case creation under RLS ──────────────────────────────────────────────
console.log('\n1. Customer opens a case (RLS)')
{
  const { data, error } = await customer
    .from('service_cases')
    .insert({
      title: service.name, customer_id: userId, handling_mode: 'SELF_SERVICE',
      status: 'active', priority: 'Normal', currency: 'USD', created_by: userId,
    })
    .select('id, case_uid')
    .single()

  if (error) fail(`case insert: ${error.message}`)
  else { caseId = data.id; ok(`case created (${data.case_uid})`) }
}

// A customer must not be able to open a case in someone else's name.
{
  const { error } = await customer.from('service_cases').insert({
    title: 'Impersonation attempt', customer_id: '00000000-0000-0000-0000-000000000001',
    handling_mode: 'SELF_SERVICE',
  })
  error ? ok('cannot create a case for another customer') : fail('created a case for another customer')
}

// ── 2. Request creation under RLS ───────────────────────────────────────────
console.log('\n2. Customer creates the request')
if (caseId) {
  const { data, error } = await customer
    .from('service_requests')
    .insert({
      profile_id: userId, service_id: service.id, service_case_id: caseId,
      service_type: 'exchange', amount: 500, currency: 'USD',
      metadata: { from_currency: 'USD', to_currency: 'BDT' },
      status: 'Submitted', priority: 'Normal', is_draft: false,
    })
    .select('id')
    .single()

  if (error) fail(`request insert: ${error.message}`)
  else { requestId = data.id; ok('request created inside the case') }
}

// ── 3. Reading it back (the case list query) ────────────────────────────────
console.log('\n3. Customer reads their cases')
{
  const { data, error } = await customer
    .from('service_cases')
    .select('id, case_uid, title, status, total_amount, currency, service_requests(id, service:services(id, name, slug))')
    .eq('customer_id', userId)

  if (error) fail(`case list query: ${error.message}`)
  else {
    data.length === 1 ? ok('sees exactly their own case') : fail(`saw ${data.length} cases, expected 1`)
    data[0]?.service_requests?.length === 1
      ? ok('joined service_requests resolved')
      : fail('service_requests did not join')
  }

  // Cases belonging to other customers must be invisible.
  const { count } = await admin.from('service_cases').select('*', { count: 'exact', head: true })
  const { data: visible } = await customer.from('service_cases').select('id')
  count > (visible?.length ?? 0)
    ? ok(`RLS hides other customers' cases (${visible?.length}/${count} visible)`)
    : fail('customer can see every case')
}

// ── 4. Line items & documents are read-only for customers ───────────────────
console.log('\n4. Line items and documents')
if (caseId) {
  await admin.from('request_line_items').insert({
    service_case_id: caseId, service_request_id: requestId,
    kind: 'fee', label: 'Transfer Fee', quantity: 1, unit_amount: 5, currency: 'USD',
  })
  await admin.from('required_documents').insert({
    service_case_id: caseId, service_request_id: requestId,
    name: 'Photo ID', is_mandatory: true, status: 'requested',
  })

  const { data: items, error: itemErr } = await customer
    .from('request_line_items').select('id, label, amount').eq('service_case_id', caseId)
  itemErr ? fail(`line item read: ${itemErr.message}`) : ok(`reads ${items.length} line item(s)`)

  const { data: docs, error: docErr } = await customer
    .from('required_documents').select('id, name, status').eq('service_case_id', caseId)
  docErr ? fail(`document read: ${docErr.message}`) : ok(`reads ${docs.length} document(s)`)

  // Customers must not be able to invent their own charges.
  const { error: writeErr } = await customer.from('request_line_items').insert({
    service_case_id: caseId, kind: 'discount', label: 'Self-granted discount',
    quantity: 1, unit_amount: -1000, currency: 'USD',
  })
  writeErr ? ok('cannot add their own line items') : fail('customer created a line item')

  // …nor sign off their own documents (the v18 WITH CHECK).
  if (docs?.[0]) {
    const { error: verifyErr } = await customer
      .from('required_documents').update({ status: 'verified' }).eq('id', docs[0].id)
    const { data: after } = await admin
      .from('required_documents').select('status').eq('id', docs[0].id).single()
    after.status !== 'verified'
      ? ok('cannot self-verify a document')
      : fail(`self-verified a document${verifyErr ? '' : ' (update was accepted)'}`)
  }
}

// ── 5. Submission audit entry (needs v19 §B2) ───────────────────────────────
console.log('\n5. Submission audit entry')
if (caseId && requestId) {
  const { error } = await customer.from('activity_feed').insert({
    service_case_id: caseId, service_request_id: requestId,
    action_type: 'Request Submitted', description: `Submitted ${service.name} request`,
    created_by: userId, actor_type: 'customer', visibility: 'customer',
    metadata: { service_slug: 'exchange' },
  })
  if (error) fail(`activity log blocked — apply schema_v19_case_notes_fix.sql §B2 (${error.code})`)
  else ok('customer logged their own submission')
}

// ── 6. Rollback path (needs v19 §B1) ────────────────────────────────────────
console.log('\n6. Empty-case rollback')
{
  const { data: orphan } = await customer
    .from('service_cases')
    .insert({ title: 'Rollback probe', customer_id: userId, handling_mode: 'SELF_SERVICE' })
    .select('id').single()

  if (!orphan) skip('could not create the probe case')
  else {
    await customer.from('service_cases').delete().eq('id', orphan.id)
    const { data: still } = await admin.from('service_cases').select('id').eq('id', orphan.id).maybeSingle()
    if (still) {
      fail('empty case NOT deleted — apply schema_v19_case_notes_fix.sql §B1')
      await admin.from('service_cases').delete().eq('id', orphan.id)
    } else ok('customer can roll back an empty case')

    // …but must not be able to delete a case that has requests.
    if (caseId) {
      await customer.from('service_cases').delete().eq('id', caseId)
      const { data: survived } = await admin.from('service_cases').select('id').eq('id', caseId).maybeSingle()
      survived ? ok('cannot delete a case that has requests') : fail('deleted a non-empty case')
    }
  }
}

await cleanup()

console.log(failures === 0
  ? '\n\x1b[32m✔ UserSide case flow verified under real customer RLS.\x1b[0m\n'
  : `\n\x1b[31m✘ ${failures} check(s) failed.\x1b[0m\n`)
process.exit(failures === 0 ? 0 : 1)

async function cleanup() {
  console.log('\n7. Cleanup')
  if (caseId) await admin.from('service_cases').delete().eq('id', caseId)
  await admin.from('activity_feed').delete().eq('created_by', userId)
  if (userId) {
    const { error } = await admin.auth.admin.deleteUser(userId)
    error ? fail(`could not delete test user: ${error.message}`) : ok('test user and case removed')
  }
}
