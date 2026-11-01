'use server';

import { getAdminSession } from '@/actions/admin-auth';
import { getAdminOrders } from '@/actions/admin-orders';
import { getAdminInventory } from '@/actions/admin-inventory';
import type { Order } from '@/types';

export interface AdminMetrics {
  ordersTodayCount: number;
  pendingOrdersCount: number;
  completedRevenueCents: number;
  totalOrdersCount: number;
  lowStockItemsCount: number;
  recentOrders: Order[];
}

export async function getAdminOverviewMetrics(): Promise<AdminMetrics> {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    throw new Error('Unauthorized');
  }

  const allOrders = await getAdminOrders();
  const allInventory = await getAdminInventory();

  const todayStr = new Date().toISOString().slice(0, 10);
  const ordersToday = allOrders.filter((o) => o.created_at.startsWith(todayStr));
  const pendingOrders = allOrders.filter(
    (o) => o.status === 'pending' || o.status === 'confirmed'
  );

  // Revenue only from delivered or paid orders (never from cancelled or uncollected COD)
  const completedOrders = allOrders.filter(
    (o) => o.status === 'delivered' || o.payment_status === 'paid'
  );
  const completedRevenueCents = completedOrders.reduce((sum, o) => sum + o.total_cents, 0);

  const lowStockItems = allInventory.filter((i) => i.isLowStock || i.isOutOfStock);

  return {
    ordersTodayCount: ordersToday.length,
    pendingOrdersCount: pendingOrders.length,
    completedRevenueCents,
    totalOrdersCount: allOrders.length,
    lowStockItemsCount: lowStockItems.length,
    recentOrders: allOrders.slice(0, 5),
  };
}

