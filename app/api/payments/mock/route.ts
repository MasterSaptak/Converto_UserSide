/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// This proxy route handles mock payment processing entirely on the UserSide
// by directly updating the Supabase database, avoiding cross-origin fetch issues.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(req: Request) {
  try {
    const { orderId, intentId, status, method } = await req.json()

    if (status !== 'succeeded') {
      return NextResponse.json({ success: false, message: 'Unhandled status' })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch the request + its active quote
    const { data: request } = await supabase
      .from('service_requests')
      .select('id, service_case_id, currency')
      .eq('id', orderId)
      .single()

    if (!request) {
      return NextResponse.json({ success: false, error: 'Request not found' }, { status: 404 })
    }

    // Get the active quote amount
    const { data: quote } = await supabase
      .from('quotes')
      .select('id, amount, currency_code')
      .eq('request_id', orderId)
      .in('status', ['sent', 'approved'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const paymentAmount = quote?.amount ?? 0
    const paymentCurrency = quote?.currency_code ?? request.currency ?? 'USD'

    // Move the request to 'processing' stage
    const { data: processingStage } = await supabase
      .from('pipeline_stages')
      .select('id')
      .eq('code', 'processing')
      .single()

    const { data: taskStartedStatus } = await supabase
      .from('pipeline_statuses')
      .select('id')
      .eq('code', 'task_started')
      .single()

    if (processingStage && taskStartedStatus) {
      await supabase
        .from('service_requests')
        .update({
          pipeline_stage_id: processingStage.id,
          pipeline_status_id: taskStartedStatus.id,
          status: 'Payment Confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
    } else {
      await supabase
        .from('service_requests')
        .update({
          status: 'Payment Confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
    }

    // Mark the quote as approved
    if (quote) {
      await supabase
        .from('quotes')
        .update({ status: 'approved', approved_at: new Date().toISOString() })
        .eq('id', quote.id)
    }

    // Insert a payment record
    if (request.service_case_id) {
      const paymentUid = `PAY-${Date.now().toString(36).toUpperCase()}`
      await supabase
        .from('payments')
        .insert({
          service_case_id: request.service_case_id,
          amount: paymentAmount,
          currency: paymentCurrency,
          method: method || 'mock',
          status: 'completed',
          reference: intentId,
          payment_uid: paymentUid,
        })
    }

    // Log the payment in timeline
    await supabase
      .from('service_request_timeline')
      .insert({
        request_id: orderId,
        action: 'payment_received',
        description: `Payment of ${paymentAmount} ${paymentCurrency} confirmed via ${method || 'mock'} (Ref: ${intentId})`,
        is_internal: false
      })

    // Log in activity_feed
    if (request.service_case_id) {
      await supabase
        .from('activity_feed')
        .insert({
          service_case_id: request.service_case_id,
          action_type: 'Payment Received',
          description: `Payment of ${paymentAmount} ${paymentCurrency} confirmed via ${method || 'payment engine'}. Reference: ${intentId}`,
          actor_type: 'system',
          visibility: 'all'
        })
    }

    return NextResponse.json({ success: true, message: 'Payment processed' })

  } catch (error: any) {
    console.error('Payment proxy error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
