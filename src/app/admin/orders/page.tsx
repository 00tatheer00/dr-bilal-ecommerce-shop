import React from 'react';
import Link from 'next/link';
import { getAdminOrders } from '@/actions/admin-orders';
import { formatPrice } from '@/lib/utils';
import { Search, Eye } from 'lucide-react';

interface Props {
  searchParams: Promise<{
    status?: string;
    payment?: string;
    search?: string;
  }>;
}

function parsePaymentDetails(instructions?: string | null) {
  if (!instructions) return { method: 'cod', label: 'COD', reference: null };
  if (instructions.includes('Easypaisa')) {
    const trxMatch = instructions.match(/TRX ID:\s*([^\s|\]]+)/i);
    return {
      method: 'easypaisa',
      label: 'Easypaisa',
      reference: trxMatch ? trxMatch[1] : null,
    };
  }
  if (instructions.includes('MCB') || instructions.includes('Bank Transfer')) {
    const refMatch = instructions.match(/Ref:\s*([^\s|\]]+)/i);
    return {
      method: 'bank_transfer',
      label: 'MCB Bank',
      reference: refMatch ? refMatch[1] : null,
    };
  }
  return { method: 'cod', label: 'COD', reference: null };
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const params = await searchParams;
  const orders = await getAdminOrders({
    status: params.status,
    paymentStatus: params.payment,
    search: params.search,
  });

  const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Title */}
      <div className="border-b border-border pb-6">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
          Order Management
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Review guest customer orders, track courier dispatches, and reconcile Cash on Delivery payments.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-border bg-bg-primary p-4 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between text-xs">
        {/* Search */}
        <form method="GET" action="/admin/orders" className="relative w-full md:w-80">
          <input
            type="text"
            name="search"
            defaultValue={params.search || ''}
            placeholder="Search by order ref, customer or phone..."
            className="w-full rounded-lg border border-border bg-bg-surface px-3 py-2 pl-9 text-text-primary focus:border-brand focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-secondary" />
        </form>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <Link
            href="/admin/orders"
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium capitalize transition-colors ${
              !params.status
                ? 'bg-brand text-text-inverse border-brand'
                : 'bg-bg-surface text-text-secondary border-border hover:bg-bg-secondary'
            }`}
          >
            All
          </Link>
          {statuses.map((st) => (
            <Link
              key={st}
              href={`/admin/orders?status=${st}`}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium capitalize transition-colors ${
                params.status === st
                  ? 'bg-brand text-text-inverse border-brand'
                  : 'bg-bg-surface text-text-secondary border-border hover:bg-bg-secondary'
              }`}
            >
              {st}
            </Link>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border border-border bg-bg-primary shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-bg-secondary text-text-secondary uppercase tracking-wider font-semibold border-b border-border">
              <tr>
                <th className="p-3.5">Order Ref</th>
                <th className="p-3.5">Customer & Phone</th>
                <th className="p-3.5">City</th>
                <th className="p-3.5">Items</th>
                <th className="p-3.5">Order Total</th>
                <th className="p-3.5">Payment Method</th>
                <th className="p-3.5">Payment Status</th>
                <th className="p-3.5">Fulfillment</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-text-primary">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-text-secondary">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const paymentInfo = parsePaymentDetails(order.special_instructions);
                  return (
                    <tr key={order.id} className="hover:bg-bg-surface/40 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-brand">
                        {order.order_number}
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold block">{order.customer_name}</span>
                        <span className="font-mono text-[11px] text-text-secondary">
                          {order.customer_phone}
                        </span>
                      </td>
                      <td className="p-3.5 text-text-secondary">{order.city}</td>
                      <td className="p-3.5 text-text-secondary">
                        {order.items?.length || 1} item(s)
                      </td>
                      <td className="p-3.5 font-bold text-text-primary">
                        {formatPrice(order.total_cents)}
                      </td>
                      <td className="p-3.5">
                        {paymentInfo.method === 'easypaisa' && (
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#00c389]/15 text-[#008a60]">
                              Easypaisa
                            </span>
                            {paymentInfo.reference && (
                              <span className="font-mono text-[10px] block text-text-secondary mt-0.5">
                                TRX: {paymentInfo.reference}
                              </span>
                            )}
                          </div>
                        )}
                        {paymentInfo.method === 'bank_transfer' && (
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#1b3a6b]/15 text-[#1b3a6b]">
                              MCB Bank
                            </span>
                            {paymentInfo.reference && (
                              <span className="font-mono text-[10px] block text-text-secondary mt-0.5">
                                Ref: {paymentInfo.reference}
                              </span>
                            )}
                          </div>
                        )}
                        {paymentInfo.method === 'cod' && (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-700">
                            Cash on Delivery
                          </span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            order.payment_status === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
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
                    <td className="p-3.5 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-bg-surface hover:bg-brand hover:text-white transition-colors font-medium text-xs"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Details
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

