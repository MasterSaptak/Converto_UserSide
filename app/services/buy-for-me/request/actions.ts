'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const AppIdSchema = z.string().uuid()
const SubscriptionRequestSchema = z.object({
  appId: AppIdSchema,
  accountEmail: z.union([z.literal(''), z.string().trim().email('Enter a valid account email.')]),
  notes: z.string().trim().max(2000, 'Notes must be 2,000 characters or fewer.'),
})

export interface ActiveSubscription {
  id: string
  name: string
  category: string
  description: string | null
  logo_url: string | null
  accent_color: string
}

export async function getActiveSubscription(appId: string): Promise<
  { data: ActiveSubscription; error: null } | { data: null; error: string }
> {
  const parsedId = AppIdSchema.safeParse(appId)
  if (!parsedId.success) return { data: null, error: 'This subscription link is invalid.' }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('app_subscriptions')
    .select('id, name, category, description, logo_url, accent_color')
    .eq('id', parsedId.data)
    .eq('is_active', true)
    .maybeSingle()

  if (error) return { data: null, error: 'The subscription could not be loaded.' }
  if (!data) return { data: null, error: 'This subscription is no longer available.' }
  return { data: data as ActiveSubscription, error: null }
}

export async function submitSubscriptionRequest(input: {
  appId: string
  accountEmail: string
  notes: string
}): Promise<{ success: true; requestId: string; caseId: string } | { success: false; error: string }> {
  const parsed = SubscriptionRequestSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid request.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Please sign in before submitting a request.' }

  // Resolve the row again at submission time. This prevents stale, inactive, or
  // user-supplied catalog values from being written into a service request.
  const { data: subscription, error: subscriptionError } = await supabase
    .from('app_subscriptions')
    .select('id, name, category, logo_url')
    .eq('id', parsed.data.appId)
    .eq('is_active', true)
    .maybeSingle()

  if (subscriptionError) return { success: false, error: 'Could not validate this subscription.' }
  if (!subscription) return { success: false, error: 'This subscription is no longer available.' }

  const { data: result, error } = await supabase.rpc('fn_create_service_request', {
    p_service_slug: 'buy_for_me',
    p_profile_id: user.id,
    p_amount: null,
    p_currency: 'USD',
    p_metadata: {
      request_type: 'subscription',
      app_subscription_id: subscription.id,
      app_subscription_name: subscription.name,
      app_subscription_category: subscription.category,
      app_subscription_logo_url: subscription.logo_url,
      account_email: parsed.data.accountEmail || null,
      customer_notes: parsed.data.notes || null,
    },
    p_notes: parsed.data.notes || `Subscription request: ${subscription.name}`,
    p_case_id: null,
    p_case_title: `${subscription.name} subscription`,
    p_is_draft: false,
  })

  if (error) return { success: false, error: error.message }

  const payload = result as { request_id?: string; case_id?: string } | null
  if (!payload?.request_id || !payload.case_id) {
    return { success: false, error: 'The request was created but its reference could not be loaded.' }
  }

  return { success: true, requestId: payload.request_id, caseId: payload.case_id }
}
