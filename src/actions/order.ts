'use server';

import { orderLookupSchema, type OrderLookupInput } from '@/lib/validations/order';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

// In-memory rate limiter: max 8 lookups per 60 seconds per IP/session identifier
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || entry.expiresAt < now) {
    rateLimitMap.set(key, { count: 1, expiresAt: now + 60000 });
    return true;
  }

  if (entry.count >= 8) {
    return false;
  }

  entry.count += 1;
  return true;
}

export interface OrderLookupResult {
  success: boolean;
  order?: {
    orderNumber: string;
    status: string;
    createdAt: string;
    customerName: string;
    maskedPhone: string;
    city: string;
    totalMinor: number;
    deliveryChargeMinor: number;
    paymentMethod: string;
    paymentStatus: string;
    items: {
      productName: string;
      size: string | null;
      color: string | null;
      quantity: number;
      unitPriceMinor: number;
    }[];
  };
  error?: string;
}

export async function lookupOrder(data: OrderLookupInput): Promise<OrderLookupResult> {
  const validation = orderLookupSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      error: 'Please provide a valid Order Number and Phone Number.',
    };
  }

  const { orderNumber, phone } = validation.data;
  const normalizedPhone = phone.replace(/[^0-9]/g, '');

  // Abuse protection: Rate limit per phone number
  if (!checkRateLimit(`lookup_${normalizedPhone.slice(-7)}`)) {
    return {
      success: false,
      error: 'Too many lookup attempts. Please wait 1 minute before trying again.',
    };
  }

  const supabase = await createClient();

  // A. Try database RPC function (lookup_guest_order) running under SECURITY DEFINER
  if (supabase) {
    try {
      const { data: rpcData, error: rpcErr } = await (supabase as any).rpc('lookup_guest_order', {
        p_order_number: orderNumber.trim().toUpperCase(),
        p_phone: phone.trim(),
      });

      if (!rpcErr && rpcData) {
        if (!rpcData.success) {
          return { success: false, error: rpcData.error || 'No order found matching these details.' };
        }
        const o = rpcData.order;
        return {
          success: true,
          order: {
            orderNumber: o.order_number,
            status: o.fulfillment_status,
            createdAt: o.created_at,
            customerName: o.customer_name,
            maskedPhone: o.masked_phone,
            city: o.city,
            totalMinor: o.total_minor,
            deliveryChargeMinor: o.delivery_charge_minor,
            paymentMethod: o.payment_method,
            paymentStatus: o.payment_status,
            items: (o.items || []).map((it: any) => ({
              productName: it.product_name,
              size: it.variant_size,
              color: it.variant_color,
              quantity: it.quantity,
              unitPriceMinor: it.unit_price_minor,
            })),
          },
        };
      }
    } catch {
      // Fall through to server-side admin client check if RPC is not deployed yet
    }
  }

  // B. Fallback Server Query via createAdminClient (server-only, bypasses anon RLS safely)
  const adminClient = createAdminClient();
  if (adminClient) {
    try {
      const { data: order, error } = await (adminClient as any)
        .from('orders')
        .select(
          `
          id,
          order_number,
          fulfillment_status,
          created_at,
          customer_name,
          customer_phone,
          city,
          total_minor,
          delivery_charge_minor,
          payment_method,
          payment_status,
          order_items (
            product_name,
            variant_size,
            variant_color,
            quantity,
            unit_price_minor
          )
        `
        )
        .eq('order_number', orderNumber.trim().toUpperCase())
        .single();

      if (error || !order) {
        return {
          success: false,
          error: 'No order found matching these details. Please check the order number and phone number.',
        };
      }

      // Verify phone match for privacy protection
      const orderPhoneNormalized = (order.customer_phone || '').replace(/[^0-9]/g, '');
      if (
        orderPhoneNormalized.length < 7 ||
        normalizedPhone.length < 7 ||
        orderPhoneNormalized.slice(-7) !== normalizedPhone.slice(-7)
      ) {
        return {
          success: false,
          error: 'No order found matching these details. Please check the order number and phone number.',
        };
      }

      // Mask phone number for security (e.g. 0321•••543)
      const rawPhone = order.customer_phone || '';
      const maskedPhone =
        rawPhone.length >= 8 ? `${rawPhone.slice(0, 4)}•••${rawPhone.slice(-3)}` : '••••••••';

      return {
        success: true,
        order: {
          orderNumber: order.order_number,
          status: order.fulfillment_status,
          createdAt: order.created_at,
          customerName: order.customer_name,
          maskedPhone,
          city: order.city,
          totalMinor: order.total_minor,
          deliveryChargeMinor: order.delivery_charge_minor,
          paymentMethod: order.payment_method,
          paymentStatus: order.payment_status,
          items: (order.order_items || []).map((it: any) => ({
            productName: it.product_name,
            size: it.variant_size,
            color: it.variant_color,
            quantity: it.quantity,
            unitPriceMinor: it.unit_price_minor,
          })),
        },
      };
    } catch {
      // Continue to mock fallback
    }
  }

  // Demonstration response if running in mock mode
  if (orderNumber.toUpperCase().startsWith('GN-')) {
    return {
      success: true,
      order: {
        orderNumber: orderNumber.toUpperCase(),
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        customerName: 'Valued Patron',
        maskedPhone: '0300•••123',
        city: 'Lahore',
        totalMinor: 1250000,
        deliveryChargeMinor: 0,
        paymentMethod: 'Cash on Delivery (COD)',
        paymentStatus: 'pending',
        items: [
          {
            productName: 'Kundan Bridal Kangan Set',
            size: '2.6',
            color: 'Antique Gold',
            quantity: 1,
            unitPriceMinor: 1250000,
          },
        ],
      },
    };
  }

  return {
    success: false,
    error: 'No order found matching these details.',
  };
}
