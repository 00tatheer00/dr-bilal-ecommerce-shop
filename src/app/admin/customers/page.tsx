import React from 'react';
import { getAdminOrders } from '@/actions/admin-orders';
import { formatPrice } from '@/lib/utils';

export default async function AdminCustomersPage() {
  const orders = await getAdminOrders();

  // Aggregate customer data from guest orders grouped by normalized phone
  const customerMap = new Map<
    string,
    {
      name: string;
      phone: string;
      email: string | null;
      city: string;
      orderCount: number;
      totalSpentCents: number;
      lastOrderDate: string;
    }
  >();

  for (const order of orders) {
    const key = order.customer_phone.replace(/[\s-]/g, '');
    const existing = customerMap.get(key);

    if (existing) {
      existing.orderCount += 1;
      existing.totalSpentCents += order.total_cents;
      if (new Date(order.created_at) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = order.created_at;
        existing.city = order.city;
      }
    } else {
      customerMap.set(key, {
        name: order.customer_name,
        phone: order.customer_phone,
        email: order.customer_email || null,
        city: order.city,
        orderCount: 1,
        totalSpentCents: order.total_cents,
        lastOrderDate: order.created_at,
      });
    }
  }

  const customers = Array.from(customerMap.values());

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="border-b border-border pb-6">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
          Customer Directory
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Aggregated guest patron profiles, order frequencies, and lifetime value in PKR.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-bg-primary shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-bg-secondary text-text-secondary uppercase tracking-wider font-semibold border-b border-border">
            <tr>
              <th className="p-3.5">Customer Name</th>
              <th className="p-3.5">Phone / WhatsApp</th>
              <th className="p-3.5">Primary City</th>
              <th className="p-3.5">Orders Placed</th>
              <th className="p-3.5">Total Value</th>
              <th className="p-3.5 text-right">Last Order</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-text-primary">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-text-secondary">
                  No customer orders recorded yet.
                </td>
              </tr>
            ) : (
              customers.map((c, idx) => (
                <tr key={idx} className="hover:bg-bg-surface/40 transition-colors">
                  <td className="p-3.5 font-bold text-sm text-text-primary">
                    {c.name}
                    {c.email && (
                      <span className="text-[11px] font-normal text-text-secondary block">
                        {c.email}
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 font-mono text-brand font-semibold">
                    {c.phone}
                  </td>
                  <td className="p-3.5 text-text-secondary">{c.city}</td>
                  <td className="p-3.5">
                    <span className="rounded bg-brand-light px-2 py-0.5 font-semibold text-brand">
                      {c.orderCount} order(s)
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-text-primary">
                    {formatPrice(c.totalSpentCents)}
                  </td>
                  <td className="p-3.5 text-right text-text-secondary font-mono">
                    {new Date(c.lastOrderDate).toLocaleDateString('en-PK')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

