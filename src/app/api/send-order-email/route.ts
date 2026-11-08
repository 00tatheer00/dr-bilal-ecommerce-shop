import { NextResponse } from 'next/server';
import { sendOrderEmails, type SendOrderEmailsParams } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as SendOrderEmailsParams;
    if (!data || !data.orderNumber) {
      return NextResponse.json({ success: false, error: 'Invalid order payload' }, { status: 400 });
    }

    const result = await sendOrderEmails(data);
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    console.error('[API send-order-email error]:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
