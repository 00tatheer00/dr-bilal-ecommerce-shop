import { checkoutFormSchema, type CheckoutInput } from '@/lib/validations/order';
import { createClient } from '@/lib/supabase/server';
import { sampleProducts } from '@/lib/sample-data';
import { generateOrderNumber } from '@/lib/utils';

export interface CheckoutResult {
  success: boolean;
  orderNumber?: string;
  trackingToken?: string;
  totalMinor?: number;
  subtotalMinor?: number;
  deliveryChargeMinor?: number;
  paymentMethod?: 'cod' | 'easypaisa' | 'bank_transfer';
  paymentReference?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
  isMock?: boolean;
}

export async function submitGuestOrder(data: CheckoutInput): Promise<CheckoutResult> {
  // 1. Zod Validation
  const validation = checkoutFormSchema.safeParse(data);

  if (!validation.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of validation.error.issues) {
      const field = issue.path[0] as string;
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return {
      success: false,
      error: 'Please correct the highlighted errors before submitting.',
      fieldErrors,
    };
  }

  const {
    customerName,
    customerPhone,
    customerEmail,
    addressLine1,
    addressLine2,
    city,
    province,
    specialInstructions,
    paymentMethod,
    paymentReference,
    senderAccountName,
    items,
    idempotencyKey,
  } = validation.data;

  // Build structured payment instruction snapshot
  const paymentTagParts: string[] = [];
  if (paymentMethod === 'easypaisa') {
    paymentTagParts.push('Method: Easypaisa (03125880988)');
    if (paymentReference) paymentTagParts.push(`TRX ID: ${paymentReference}`);
    if (senderAccountName) paymentTagParts.push(`Sender: ${senderAccountName}`);
  } else if (paymentMethod === 'bank_transfer') {
    paymentTagParts.push('Method: MCB Bank Transfer');
    if (paymentReference) paymentTagParts.push(`Ref: ${paymentReference}`);
    if (senderAccountName) paymentTagParts.push(`Sender: ${senderAccountName}`);
  } else {
    paymentTagParts.push('Method: Cash on Delivery (COD)');
  }

  const structuredPaymentNote = `[${paymentTagParts.join(' | ')}]`;
  const combinedInstructions = specialInstructions
    ? `${structuredPaymentNote} ${specialInstructions}`
    : structuredPaymentNote;

  // 2. Attempt remote Supabase RPC execution
  const supabase = await createClient();

  if (supabase) {
    try {
      const rpcItems = items.map((i) => ({
        variant_id: i.variantId,
        quantity: i.quantity,
      }));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: rpcResult, error: rpcError } = await (supabase as any).rpc(
        'create_guest_order',
        {
          p_customer_name: customerName,
          p_customer_phone: customerPhone,
          p_customer_email: customerEmail || null,
          p_address_line1: addressLine1,
          p_address_line2: addressLine2 || null,
          p_city: city,
          p_province: province || null,
          p_special_instructions: combinedInstructions,
          p_items: rpcItems,
          p_idempotency_key: idempotencyKey || null,
        }
      );

      if (rpcError) {
        return {
          success: false,
          error: rpcError.message || 'Failed to place order. Please try again.',
        };
      }

      const res = rpcResult as {
        success: boolean;
        order_number: string;
        tracking_token: string;
        total_minor: number;
        subtotal_minor: number;
        delivery_charge_minor: number;
      };

      return {
        success: true,
        orderNumber: res.order_number,
        trackingToken: res.tracking_token,
        totalMinor: res.total_minor,
        subtotalMinor: res.subtotal_minor,
        deliveryChargeMinor: res.delivery_charge_minor,
        paymentMethod,
        paymentReference: paymentReference || undefined,
      };
    } catch {
      // Fallback to local calculation if connection was interrupted
    }
  }

  // 3. Secure Server-Side Fallback (Mock / Offline Mode)
  // Calculate authoritative prices directly on the server to prevent client-side tampering
  let calculatedSubtotal = 0;

  for (const item of items) {
    let foundVariant = null;
    for (const prod of sampleProducts) {
      const v = prod.variants?.find((varItem) => varItem.id === item.variantId);
      if (v) {
        foundVariant = v;
        break;
      }
    }

    if (!foundVariant) {
      return {
        success: false,
        error: 'One or more items in your cart is no longer available.',
      };
    }

    calculatedSubtotal += foundVariant.price_cents * item.quantity;
  }

  const deliveryCharge = calculatedSubtotal >= 500000 ? 0 : 25000;
  const calculatedTotal = calculatedSubtotal + deliveryCharge;
  const generatedNumber = generateOrderNumber();
  const mockTrackingToken = `tok_${Math.random().toString(36).substring(2, 15)}`;

  return {
    success: true,
    orderNumber: generatedNumber,
    trackingToken: mockTrackingToken,
    totalMinor: calculatedTotal,
    subtotalMinor: calculatedSubtotal,
    deliveryChargeMinor: deliveryCharge,
    paymentMethod,
    paymentReference: paymentReference || undefined,
    isMock: true,
  };
}
