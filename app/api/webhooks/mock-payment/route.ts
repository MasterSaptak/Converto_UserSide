import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { orderId, requestId, status } = await req.json();
    const targetId = orderId || requestId;
    
    if (targetId) {
      const { data: targetStatus } = await supabase
        .from('pipeline_statuses')
        .select('id')
        .eq('code', 'payment_confirmed')
        .single();
      
      if (targetStatus) {
        await supabase
          .from('service_requests')
          .update({ status: targetStatus.id, pipeline_status_id: targetStatus.id })
          .eq('id', targetId);
      } else {
        console.error("MOCK PAYMENT WEBHOOK: Could not find 'payment_confirmed' status in database. Make sure it exists and is readable.");
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
