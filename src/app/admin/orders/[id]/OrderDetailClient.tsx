'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { updateOrderStatus, updatePaymentStatus } from '@/actions/admin-orders';
import { formatPrice } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types';
import Button from '@/components/ui/Button';
import { ArrowLeft, MapPin, Package } from 'lucide-react';

interface Props {
  initialOrder: Order;
}

export default function OrderDetailClient({ initialOrder }: Props) {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await updateOrderStatus(order.id, newStatus);
      if (res.success) {
        setOrder((prev) => ({ ...prev, status: newStatus }));
        setMessage(`Order status updated to ${newStatus}.`);
      } else {
        setMessage(res.error || 'Failed to update order status.');
      }
    } catch {
      setMessage('Error updating status.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentToggle = async (newPaymentStatus: 'pending' | 'paid' | 'refunded') => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await updatePaymentStatus(order.id, newPaymentStatus);
      if (res.success) {
        setOrder((prev) => ({ ...prev, payment_status: newPaymentStatus }));
        setMessage(`Payment status reconciled to ${newPaymentStatus}.`);
      } else {
        setMessage(res.error || 'Failed to update payment status.');
      }
    } catch {
      setMessage('Error updating payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-1.5 rounded-lg border border-border bg-bg-primary hover:bg-bg-surface text-text-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-xl font-bold text-text-primary">
                Order {order.order_number}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
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
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Placed on {new Date(order.created_at).toLocaleString('en-PK')}
            </p>
          </div>
        </div>

        {/* Action Dropdowns */}
        <div className="flex items-center gap-2">
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
            disabled={loading}
            className="rounded-lg border border-border bg-bg-primary px-3 py-1.5 text-xs font-semibold uppercase text-brand focus:outline-none"
          >
            <option value="pending">Pending Verification</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing / Box Packaging</option>
            <option value="shipped">Dispatched / Shipped</option>
            <option value="delivered">Delivered to Customer</option>
            <option value="cancelled">Cancelled & Restocked</option>
          </select>
        </div>
      </div>

      {message && (
        <div className="rounded-lg bg-bg-primary border border-border p-3 text-xs text-brand font-medium">
          {message}
        </div>
      )}

      {/* Main Order Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Items Snapshot */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-xl border border-border bg-bg-primary p-6 shadow-xs space-y-4">
            <h2 className="font-heading text-sm font-bold text-text-primary border-b border-border pb-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-brand" />
              Ordered Bangle Pieces ({order.items?.length || 0})
            </h2>

            <div className="divide-y divide-border">
              {order.items?.map((item) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between text-xs">
                  <div>
                    <h3 className="font-semibold text-text-primary text-sm">
                      {item.product_name}
                    </h3>
                    <div className="flex items-center gap-2 text-text-secondary mt-1">
                      <span className="font-mono text-[11px] bg-bg-surface px-1.5 py-0.5 rounded">
                        SKU: {item.variant_sku}
                      </span>
                      {item.variant_size && (
                        <span>Size: <strong>{item.variant_size}</strong></span>
                      )}
                      {item.variant_color && (
                        <span>Color: <strong>{item.variant_color}</strong></span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-text-secondary block">
                      {formatPrice(item.unit_price_cents ?? item.price_cents ?? 0)} × {item.quantity}
                    </span>
                    <span className="font-bold text-sm text-brand block mt-0.5">
                      {formatPrice(item.total_price_cents ?? item.total_cents ?? 0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Totals Breakdown */}
            <div className="border-t border-border pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="font-medium text-text-primary">{formatPrice(order.subtotal_cents)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Delivery Charge</span>
                <span className="font-medium text-text-primary">
                  {order.delivery_fee_cents === 0 ? 'FREE' : formatPrice(order.delivery_fee_cents)}
                </span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between items-baseline font-bold text-sm text-text-primary">
                <span>Grand Total (Payable on COD)</span>
                <span className="font-heading text-xl text-brand">
                  {formatPrice(order.total_cents)}
                </span>
              </div>
            </div>
          </div>

          {/* COD Payment Status Reconciliation Box */}
          <div className="rounded-xl border border-border bg-bg-primary p-6 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-text-secondary block">
                Cash on Delivery Reconciliation
              </span>
              <p className="text-xs text-text-secondary mt-0.5">
                Current Payment Status: <strong className="uppercase text-text-primary">{order.payment_status}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              {order.payment_status === 'pending' ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handlePaymentToggle('paid')}
                  loading={loading}
                  className="bg-emerald-700 hover:bg-emerald-800"
                >
                  Mark Cash Collected (Paid)
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePaymentToggle('pending')}
                  loading={loading}
                >
                  Revert to Pending
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Delivery Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-xl border border-border bg-bg-primary p-6 shadow-xs space-y-4 text-xs">
            <h2 className="font-heading text-sm font-bold text-text-primary border-b border-border pb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand" />
              Delivery Destination
            </h2>

            <div>
              <span className="text-text-secondary block">Customer Name:</span>
              <span className="font-semibold text-text-primary text-sm block">
                {order.customer_name}
              </span>
            </div>

            <div>
              <span className="text-text-secondary block">Mobile / WhatsApp:</span>
              <span className="font-mono text-brand font-semibold text-sm block">
                {order.customer_phone}
              </span>
            </div>

            {order.customer_email && (
              <div>
                <span className="text-text-secondary block">Email:</span>
                <span className="text-text-primary block">{order.customer_email}</span>
              </div>
            )}

            <div className="border-t border-border pt-3">
              <span className="text-text-secondary block">Street Address:</span>
              <p className="font-medium text-text-primary leading-relaxed mt-0.5">
                {order.address_line1}
                {order.address_line2 ? `, ${order.address_line2}` : ''}
              </p>
              <p className="font-semibold text-brand mt-1">
                {order.city}, {order.province || 'Pakistan'}
              </p>
            </div>

            {order.special_instructions && (
              <div className="border-t border-border pt-3 bg-bg-secondary p-3 rounded-lg">
                <span className="font-bold text-text-primary block mb-0.5">Special Instructions:</span>
                <p className="italic text-text-secondary">{order.special_instructions}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
