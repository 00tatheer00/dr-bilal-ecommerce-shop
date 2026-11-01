'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAdminSession } from '@/actions/admin-auth';
import { sampleProducts } from '@/lib/sample-data';
import { revalidatePath } from 'next/cache';

export interface AdminInventoryItem {
  variantId: string;
  productId: string;
  productName: string;
  sku: string;
  size: string | null;
  color: string | null;
  stockQuantity: number;
  lowStockThreshold: number;
  priceMinor: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
}

export interface StockAdjustmentResult {
  success: boolean;
  error?: string;
  newBalance?: number;
}

/**
 * Fetch all inventory items across product variants
 */
export async function getAdminInventory(options?: {
  search?: string;
  lowStockOnly?: boolean;
}): Promise<AdminInventoryItem[]> {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    throw new Error('Unauthorized');
  }

  const client = createAdminClient() || (await createClient());
  if (client) {
    try {
      const { data, error } = await (client as any)
        .from('product_variants')
        .select(`
          id,
          product_id,
          sku,
          size,
          color,
          price_minor,
          stock_quantity,
          low_stock_threshold,
          products (
            id,
            name
          )
        `)
        .eq('is_active', true)
        .order('stock_quantity', { ascending: true });

      if (!error && data && data.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let list: AdminInventoryItem[] = data.map((v: any) => ({
          variantId: v.id,
          productId: v.product_id,
          productName: v.products?.name || 'Handcrafted Bangle',
          sku: v.sku,
          size: v.size,
          color: v.color,
          stockQuantity: v.stock_quantity,
          lowStockThreshold: v.low_stock_threshold || 3,
          priceMinor: v.price_minor,
          isLowStock: v.stock_quantity <= (v.low_stock_threshold || 3) && v.stock_quantity > 0,
          isOutOfStock: v.stock_quantity <= 0,
        }));

        if (options?.lowStockOnly) {
          list = list.filter((i) => i.isLowStock || i.isOutOfStock);
        }

        if (options?.search) {
          const s = options.search.toLowerCase();
          list = list.filter(
            (i) => i.productName.toLowerCase().includes(s) || i.sku.toLowerCase().includes(s)
          );
        }

        return list;
      }
    } catch {
      // Fallback
    }
  }

  // Fallback to sample catalog
  const list: AdminInventoryItem[] = [];
  for (const p of sampleProducts) {
    for (const v of p.variants || []) {
      const isLowStock = v.stock_quantity <= (v.low_stock_threshold || 5) && v.stock_quantity > 0;
      const isOutOfStock = v.stock_quantity <= 0;
      if (!options?.lowStockOnly || isLowStock || isOutOfStock) {
        list.push({
          variantId: v.id,
          productId: p.id,
          productName: p.name,
          sku: v.sku,
          size: v.size,
          color: v.color,
          stockQuantity: v.stock_quantity,
          lowStockThreshold: v.low_stock_threshold || 5,
          priceMinor: v.price_cents,
          isLowStock,
          isOutOfStock,
        });
      }
    }
  }

  if (options?.search) {
    const s = options.search.toLowerCase();
    return list.filter(
      (i) => i.productName.toLowerCase().includes(s) || i.sku.toLowerCase().includes(s)
    );
  }

  return list;
}

/**
 * Adjust variant stock with required reason logging to inventory_movements
 */
export async function adjustVariantStock(
  variantId: string,
  quantityDelta: number,
  reason: 'restock' | 'manual_adjustment' | 'audit' | 'order_cancelled'
): Promise<StockAdjustmentResult> {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    return { success: false, error: 'Unauthorized.' };
  }

  if (quantityDelta === 0) {
    return { success: false, error: 'Adjustment quantity cannot be zero.' };
  }

  const adminClient = createAdminClient();
  if (adminClient) {
    try {
      // 1. Fetch current variant
      const { data: variant, error: fetchErr } = await (adminClient as any)
        .from('product_variants')
        .select('*')
        .eq('id', variantId)
        .single();

      if (fetchErr || !variant) {
        return { success: false, error: 'Variant not found.' };
      }

      const newBalance = (variant as any).stock_quantity + quantityDelta;
      if (newBalance < 0) {
        return {
          success: false,
          error: `Cannot reduce stock below zero. Current stock is ${(variant as any).stock_quantity}.`,
        };
      }

      // 2. Update stock
      const { error: updateErr } = await (adminClient as any)
        .from('product_variants')
        .update({
          stock_quantity: newBalance,
          updated_at: new Date().toISOString(),
        })
        .eq('id', variantId);

      if (updateErr) return { success: false, error: updateErr.message };

      // 3. Log movement
      await (adminClient as any).from('inventory_movements').insert({
        variant_id: variantId,
        quantity_delta: quantityDelta,
        balance_after: newBalance,
        reason,
      });

      revalidatePath('/admin/inventory');
      revalidatePath('/admin/products');
      return { success: true, newBalance };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to adjust stock.' };
    }
  }

  revalidatePath('/admin/inventory');
  return { success: true, newBalance: 10 + quantityDelta };
}
