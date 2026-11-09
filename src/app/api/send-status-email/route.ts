import { NextResponse } from 'next/server';
import { sendOrderStatusUpdateEmail, type SendStatusUpdateEmailParams } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as SendStatusUpdateEmailParams;
    if (!data || !data.orderNumber || !data.customerEmail) {
      return NextResponse.json(
        { success: false, error: 'Invalid status email payload' },
        { status: 400 }
      );
    }

    const result = await sendOrderStatusUpdateEmail(data);
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    console.error('[API send-status-email error]:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

