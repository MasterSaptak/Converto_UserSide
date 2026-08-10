import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    await req.json();
    return NextResponse.json({ intentId: 'mock_intent_' + Date.now() });
  } catch {
    return NextResponse.json({ error: 'Failed to parse request' }, { status: 400 });
  }
}
