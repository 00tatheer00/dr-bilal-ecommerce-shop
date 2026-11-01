import React from 'react';
import Link from 'next/link';
import { getAdminSession } from '@/actions/admin-auth';
import { getAdminOverviewMetrics } from '@/actions/admin-overview';
import { formatPrice } from '@/lib/utils';
import { redirect } from 'next/navigation';
import {
  ShoppingBag,
  Clock,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Plus,
  Boxes,
} from 'lucide-react';
import Button from '@/components/ui/Button';

export default async function AdminOverviewPage() {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    redirect('/admin/login');
  }

  const metrics = await getAdminOverviewMetrics();

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
            Store Overview
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Real-time business performance, order dispatch queue, and stock status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/products/new">
            <Button variant="primary" size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
          <Link href="/admin/inventory">
            <Button variant="secondary" size="sm" className="gap-1.5">
              <Boxes className="h-4 w-4" />
              Manage Stock
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Orders Today */}
        <div className="rounded-xl border border-border bg-bg-primary p-5 shadow-xs">
          <div className="flex items-center justify-between text-text-secondary">
            <span className="text-xs font-semibold uppercase tracking-wider">Orders Today</span>
            <div className="h-8 w-8 rounded-full bg-brand-light text-brand flex items-center justify-center">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold text-text-primary">
              {metrics.ordersTodayCount}
            </span>
            <span className="text-xs text-text-secondary">new today</span>
          </div>
        </div>

        {/* Card 2: Pending Orders */}
        <div className="rounded-xl border border-border bg-bg-primary p-5 shadow-xs">
          <div className="flex items-center justify-between text-text-secondary">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Orders</span>
            <div className="h-8 w-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold text-amber-700">
              {metrics.pendingOrdersCount}
            </span>
            <span className="text-xs text-text-secondary">awaiting dispatch</span>
          </div>
        </div>

        {/* Card 3: Reconciled Sales */}
        <div className="rounded-xl border border-border bg-bg-primary p-5 shadow-xs">
          <div className="flex items-center justify-between text-text-secondary">
            <span className="text-xs font-semibold uppercase tracking-wider">Collected Revenue</span>
            <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-heading text-2xl font-bold text-text-primary">
              {formatPrice(metrics.completedRevenueCents)}
            </span>
          </div>
          <p className="text-[10px] text-text-secondary mt-1">
            From verified delivered COD orders
          </p>
        </div>

        {/* Card 4: Low Stock Alerts */}
        <div className="rounded-xl border border-border bg-bg-primary p-5 shadow-xs">
          <div className="flex items-center justify-between text-text-secondary">
            <span className="text-xs font-semibold uppercase tracking-wider">Low Stock SKUs</span>
            <div className="h-8 w-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold text-red-600">
              {metrics.lowStockItemsCount}
            </span>
            <span className="text-xs text-text-secondary">variants need restock</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="rounded-xl border border-border bg-bg-primary p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="font-heading text-lg font-bold text-text-primary">
              Recent Customer Orders
            </h2>
            <p className="text-xs text-text-secondary">
              Latest guest orders requiring verification and courier dispatch.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-brand hover:underline inline-flex items-center gap-1"
          >
            View All Orders ({metrics.totalOrdersCount}) <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-bg-secondary text-text-secondary uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3">Order Ref</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Destination</th>
                <th className="p-3">Total</th>
                <th className="p-3">COD Payment</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-text-primary">
              {metrics.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-bg-surface/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-brand">{order.order_number}</td>
                  <td className="p-3">
                    <span className="font-medium block">{order.customer_name}</span>
                    <span className="text-[11px] text-text-secondary font-mono">
                      {order.customer_phone}
                    </span>
                  </td>
                  <td className="p-3 text-text-secondary">{order.city}</td>
                  <td className="p-3 font-semibold text-text-primary">
                    {formatPrice(order.total_cents)}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        order.payment_status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        order.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-brand-light text-brand'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1 text-brand hover:underline font-semibold"
                    >
                      Process &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

