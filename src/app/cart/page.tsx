'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotalCents,
    deliveryFeeCents,
    totalCents,
    freeDeliveryThresholdCents,
  } = useCart();

  const freeDeliveryRemaining = Math.max(0, freeDeliveryThresholdCents - subtotalCents);
  const freeDeliveryPercent = Math.min(100, (subtotalCents / freeDeliveryThresholdCents) * 100);

  if (items.length === 0) {
    return (
      <div className="py-16 sm:py-24">
        <Container size="md">
          <EmptyState
            title="Your Shopping Bag is Empty"
            description="Explore our exquisite bridal and everyday bangles to find your signature pair."
            actionLabel="Discover Bangles"
            actionHref="/shop"
            icon={<ShoppingBag className="h-12 w-12 text-gold" />}
          />
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-16">
      <Container size="xl">
        <h1 className="font-heading text-3xl font-bold text-text-primary mb-8">
          Your Shopping Bag ({items.length} {items.length === 1 ? 'item' : 'items'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Delivery Bar */}
            <div className="rounded-xl border border-border bg-bg-secondary p-4">
              <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                {freeDeliveryRemaining > 0 ? (
                  <span className="text-text-secondary">
                    Add <strong className="text-brand">{formatPrice(freeDeliveryRemaining)}</strong> more to get Free Delivery
                  </span>
                ) : (
                  <span className="text-success font-semibold flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4" /> Free Delivery Unlocked!
                  </span>
                )}
                <span className="text-text-secondary">{Math.round(freeDeliveryPercent)}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full bg-brand rounded-full transition-all duration-300"
                  style={{ width: `${freeDeliveryPercent}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="divide-y divide-border rounded-xl border border-border bg-bg-primary">
              {items.map((item) => (
                <div key={item.variant_id} className="flex flex-col sm:flex-row gap-4 p-5 sm:p-6">
                  {/* Thumbnail */}
                  <div className="h-24 w-24 shrink-0 rounded-lg bg-bg-secondary border border-border flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-gold" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          href={`/shop/${item.product_slug}`}
                          className="font-heading font-semibold text-base text-text-primary hover:text-brand transition-colors"
                        >
                          {item.product_name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1 text-xs text-text-secondary">
                          {item.variant_size && (
                            <span className="rounded bg-bg-surface px-2 py-0.5 font-medium">
                              Size: {item.variant_size}
                            </span>
                          )}
                          {item.variant_color && (
                            <span className="rounded bg-bg-surface px-2 py-0.5 font-medium">
                              {item.variant_color}
                            </span>
                          )}
                          <span className="text-text-secondary">SKU: {item.variant_sku}</span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.variant_id)}
                        className="text-text-secondary hover:text-error transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center rounded-lg border border-border bg-bg-surface">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                          className="p-1.5 text-text-secondary hover:text-text-primary"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-10 text-center text-xs font-semibold text-text-primary">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                          className="p-1.5 text-text-secondary hover:text-text-primary"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Total for item */}
                      <span className="font-heading font-semibold text-base text-brand">
                        {formatPrice(item.price_cents * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <Link href="/shop" className="text-xs font-semibold text-brand hover:underline">
                &larr; Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 rounded-xl border border-border bg-bg-secondary p-6 space-y-4">
            <h2 className="font-heading text-lg font-semibold text-text-primary border-b border-border pb-3">
              Order Summary
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="text-text-primary font-medium">{formatPrice(subtotalCents)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Delivery Charge</span>
                <span className="text-text-primary font-medium">
                  {deliveryFeeCents === 0 ? 'FREE' : formatPrice(deliveryFeeCents)}
                </span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Payment Method</span>
                <span className="font-medium text-brand">Cash on Delivery (COD)</span>
              </div>
            </div>

            <div className="border-t border-border pt-3 flex justify-between items-baseline">
              <span className="font-heading font-bold text-base text-text-primary">Total</span>
              <span className="font-heading font-bold text-xl text-brand">
                {formatPrice(totalCents)}
              </span>
            </div>

            <Link href="/checkout" className="block w-full pt-2">
              <Button variant="primary" size="lg" fullWidth className="group">
                Proceed to Checkout
                <ArrowRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            <div className="pt-2 text-[11px] text-text-secondary space-y-1.5 border-t border-border/80">
              <p className="flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-brand" />
                <span>Tracked express delivery across all cities in Pakistan.</span>
              </p>
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-brand" />
                <span>No advance payment needed. Pay cash on delivery.</span>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

