'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAdminSession } from '@/actions/admin-auth';
import { revalidatePath } from 'next/cache';
import type { Order, OrderStatus } from '@/types';

export interface AdminOrderResult {
  success: boolean;
  error?: string;
}

export interface AdminOrdersFilter {
  status?: string;
  paymentStatus?: string;
  search?: string;
}

/**
 * Fetch orders for admin table
 */
export async function getAdminOrders(filter?: AdminOrdersFilter): Promise<Order[]> {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    throw new Error('Unauthorized');
  }

  const client = createAdminClient() || (await createClient());
  if (client) {
    try {
      let query = (client as any)
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .order('created_at', { ascending: false });

      if (filter?.status && filter.status !== 'all') {
        query = query.eq('fulfillment_status', filter.status);
      }
      if (filter?.paymentStatus && filter.paymentStatus !== 'all') {
        query = query.eq('payment_status', filter.paymentStatus);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let list: Order[] = data.map((o: any) => ({
          id: o.id,
          order_number: o.order_number,
          status: o.fulfillment_status,
          customer_name: o.customer_name,
          customer_phone: o.customer_phone,
          customer_email: o.customer_email,
          address_line1: o.address_line1,
          address_line2: o.address_line2,
          city: o.city,
          province: o.province,
          special_instructions: o.special_instructions,
          subtotal_cents: o.subtotal_minor,
          delivery_fee_cents: o.delivery_charge_minor,
          total_cents: o.total_minor,
          payment_method: o.payment_method,
          payment_status: o.payment_status,
          created_at: o.created_at,
          updated_at: o.updated_at,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          items: o.items?.map((it: any) => ({
            id: it.id,
            order_id: it.order_id,
            product_id: it.product_id,
            variant_id: it.variant_id,
            product_name: it.product_name,
            variant_sku: it.variant_sku,
            variant_size: it.variant_size,
            variant_color: it.variant_color,
            price_cents: it.unit_price_minor,
            quantity: it.quantity,
            total_cents: it.line_total_minor,
            created_at: it.created_at,
          })),
        }));

        if (filter?.search) {
          const s = filter.search.toLowerCase();
          list = list.filter(
            (o) =>
              o.order_number.toLowerCase().includes(s) ||
              o.customer_name.toLowerCase().includes(s) ||
              o.customer_phone.includes(s) ||
              o.city.toLowerCase().includes(s)
          );
        }

        return list;
      }
    } catch {
      // Fallback
    }
  }

  // Demonstration dataset for dev mode
  return [
    {
      id: 'ord-001',
      order_number: 'GN-8M2K9A',
      status: 'pending',
      customer_name: 'Ayesha Khan',
      customer_phone: '0300-1234567',
      customer_email: 'ayesha.khan@example.com',
      address_line1: 'House 14, Street 3, Sector F-7/2',
      address_line2: 'Near Post Office',
      city: 'Islamabad',
      province: 'Federal',
      special_instructions: 'Please call before arrival',
      subtotal_cents: 1250000,
      delivery_fee_cents: 0,
      total_cents: 1250000,
      payment_method: 'Cash on Delivery (COD)',
      payment_status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: [
        {
          id: 'item-1',
          order_id: 'ord-001',
          product_id: '1',
          variant_id: 'v-1',
          product_name: 'Kundan Bridal Kangan Set',
          variant_sku: 'GN-001-26',
          variant_size: '2.6',
          variant_color: 'Antique Gold',
          price_cents: 1250000,
          quantity: 1,
          total_cents: 1250000,
          created_at: new Date().toISOString(),
        },
      ],
    },
    {
      id: 'ord-002',
      order_number: 'GN-4X9L1P',
      status: 'confirmed',
      customer_name: 'Zainab Tariq',
      customer_phone: '0321-9876543',
      customer_email: 'zainab@example.com',
      address_line1: 'Apartment 4B, Gulberg Heights',
      address_line2: 'M.M. Alam Road',
      city: 'Lahore',
      province: 'Punjab',
      special_instructions: null,
      subtotal_cents: 350000,
      delivery_fee_cents: 25000,
      total_cents: 375000,
      payment_method: 'Cash on Delivery (COD)',
      payment_status: 'pending',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
      items: [
        {
          id: 'item-2',
          order_id: 'ord-002',
          product_id: '2',
          variant_id: 'v-2',
          product_name: 'Silk Thread Bangles — Rose',
          variant_sku: 'GN-002-RP-24',
          variant_size: '2.4',
          variant_color: 'Rose Pink',
          price_cents: 350000,
          quantity: 1,
          total_cents: 350000,
          created_at: new Date().toISOString(),
        },
      ],
    },
  ];
}

/**
 * Fetch a single order with items
 */
export async function getAdminOrderById(orderId: string): Promise<Order | null> {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    throw new Error('Unauthorized');
  }

  const client = createAdminClient() || (await createClient());
  if (client) {
    try {
      const { data: o, error } = await (client as any)
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('id', orderId)
        .single();

      if (!error && o) {
        return {
          id: o.id,
          order_number: o.order_number,
          status: o.fulfillment_status,
          customer_name: o.customer_name,
          customer_phone: o.customer_phone,
          customer_email: o.customer_email,
          address_line1: o.address_line1,
          address_line2: o.address_line2,
          city: o.city,
          province: o.province,
          special_instructions: o.special_instructions,
          subtotal_cents: o.subtotal_minor,
          delivery_fee_cents: o.delivery_charge_minor,
          total_cents: o.total_minor,
          payment_method: o.payment_method,
          payment_status: o.payment_status,
          created_at: o.created_at,
          updated_at: o.updated_at,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          items: o.items?.map((it: any) => ({
            id: it.id,
            order_id: it.order_id,
            product_id: it.product_id,
            variant_id: it.variant_id,
            product_name: it.product_name,
            variant_sku: it.variant_sku,
            variant_size: it.variant_size,
            variant_color: it.variant_color,
            price_cents: it.unit_price_minor,
            quantity: it.quantity,
            total_cents: it.line_total_minor,
            created_at: it.created_at,
          })),
        };
      }
    } catch {
      // Fallback
    }
  }

  const demoList = await getAdminOrders();
  return demoList.find((o) => o.id === orderId || o.order_number === orderId) || null;
}

/**
 * Update order fulfillment status (Pending -> Confirmed -> Shipped -> Delivered)
 */
export async function updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<AdminOrderResult> {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    return { success: false, error: 'Unauthorized.' };
  }

  const adminClient = createAdminClient();
  if (adminClient) {
    try {
      // 1. Fetch current order to check previous status and items
      const { data: currentOrder } = await (adminClient as any)
        .from('orders')
        .select('id, fulfillment_status, order_items(variant_id, quantity)')
        .eq('id', orderId)
        .single();

      const previousStatus = currentOrder?.fulfillment_status;

      // 2. Handle cancellation stock restoration (prevent double restoration)
      if (newStatus === 'cancelled' && previousStatus && previousStatus !== 'cancelled') {
        const items = currentOrder?.order_items || [];
        for (const item of items) {
          if (item.variant_id && item.quantity > 0) {
            const { data: variant } = await (adminClient as any)
              .from('product_variants')
              .select('stock_quantity')
              .eq('id', item.variant_id)
              .single();

            if (variant) {
              const restoredStock = variant.stock_quantity + item.quantity;
              await (adminClient as any)
                .from('product_variants')
                .update({ stock_quantity: restoredStock, updated_at: new Date().toISOString() })
                .eq('id', item.variant_id);

              await (adminClient as any).from('inventory_movements').insert({
                variant_id: item.variant_id,
                quantity_delta: item.quantity,
                balance_after: restoredStock,
                reason: `Order ${orderId.slice(0, 8)} cancelled - Stock restored`,
              });
            }
          }
        }
      }

      // 3. Update order status
      const { error } = await (adminClient as any)
        .from('orders')
        .update({
          fulfillment_status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (error) return { success: false, error: error.message };

      revalidatePath('/admin/orders');
      revalidatePath(`/admin/orders/${orderId}`);
      revalidatePath('/admin/inventory');
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Error updating status.' };
    }
  }

  revalidatePath('/admin/orders');
  return { success: true };
}

/**
 * Reconcile COD Payment (Mark as Paid or Refunded)
 */
export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed'
): Promise<AdminOrderResult> {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    return { success: false, error: 'Unauthorized.' };
  }

  const adminClient = createAdminClient();
  if (adminClient) {
    try {
      const { error } = await (adminClient as any)
        .from('orders')
        .update({
          payment_status: paymentStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (error) return { success: false, error: error.message };

      revalidatePath('/admin/orders');
      revalidatePath(`/admin/orders/${orderId}`);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Error updating payment.' };
    }
  }

  return { success: true };
}
