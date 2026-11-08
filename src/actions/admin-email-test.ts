'use server';

import { getAdminSession } from '@/actions/admin-auth';

export async function testOrderEmailDispatch(targetEmail?: string) {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    return { success: false, error: 'Unauthorized. Please login to Admin.' };
  }

  try {
    const testOrder = {
      orderNumber: `GN-TEST-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: 'Ayesha Khan (Test Customer)',
      customerPhone: '0312-5880988',
      customerEmail: targetEmail || session.email || 'admin@gulnaarbymk.com',
      addressLine1: 'House 42, Street 8, Sector Y, DHA Phase 5',
      city: 'Lahore',
      province: 'Punjab',
      items: [
        {
          name: 'Shahi Shehnai 24K Kundan Kada Set',
          sku: 'GN-BRD-001-M',
          size: '2.6 (Medium)',
          color: 'Royal Champagne',
          quantity: 2,
          unitPriceMinor: 1250000,
          totalMinor: 2500000,
        },
      ],
      subtotalMinor: 2500000,
      deliveryChargeMinor: 0,
      totalMinor: 2500000,
      paymentMethod: 'easypaisa' as const,
      paymentReference: '78291048291',
      specialInstructions: '[Test Order from Admin Settings] Please deliver gift wrapped.',
    };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dbshop.vercel.app';
    const response = await fetch(`${siteUrl}/api/send-order-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testOrder),
    });

    const resData = await response.json();
    return {
      success: resData.success,
      message: `Test order emails generated successfully! (Customer: ${resData.result?.customerEmailSent ? 'Sent' : 'Skipped'}, Owner Alert: ${resData.result?.ownerEmailSent ? 'Sent' : 'Skipped'})`,
      details: resData,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to dispatch test emails.',
    };
  }
}
