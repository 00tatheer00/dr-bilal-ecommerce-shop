 'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    totalItems,
    subtotalCents,
    freeDeliveryThresholdCents,
  } = useCart();

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const freeDeliveryRemaining = Math.max(0, freeDeliveryThresholdCents - subtotalCents);
  const freeDeliveryPercent = Math.min(100, (subtotalCents / freeDeliveryThresholdCents) * 100);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping Bag">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2C2C2C]/50 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-bg-primary shadow-2xl border-l border-border animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-brand" />
            <h2 className="font-heading text-lg font-semibold text-text-primary">
              Shopping Bag
            </h2>
            <span className="rounded-full bg-brand-light px-2 py-0.5 text-xs font-medium text-brand">
              {totalItems}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="rounded-full p-2 text-text-secondary hover:bg-bg-surface hover:text-text-primary transition-colors focus-visible:outline-brand"
            aria-label="Close Shopping Bag"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free Delivery Meter */}
        {items.length > 0 && (
          <div className="border-b border-border bg-bg-secondary px-6 py-3">
            <div className="flex items-center justify-between text-xs font-medium mb-1.5">
              {freeDeliveryRemaining > 0 ? (
                <span className="text-text-secondary">
                  Add <strong className="text-brand">{formatPrice(freeDeliveryRemaining)}</strong> for Free Delivery
                </span>
              ) : (
                <span className="text-success font-semibold flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> Free Delivery Unlocked!
                </span>
              )}
              <span className="text-text-secondary">{Math.round(freeDeliveryPercent)}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full bg-brand transition-all duration-300 rounded-full"
                style={{ width: `${freeDeliveryPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-border">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-bg-surface flex items-center justify-center text-text-secondary mb-4">
                <ShoppingBag className="h-8 w-8 text-gold" />
              </div>
              <h3 className="font-heading text-lg font-medium text-text-primary mb-1">
                Your Bag is Empty
              </h3>
              <p className="text-sm text-text-secondary mb-6 max-w-xs">
                Explore our handcrafted bridal and everyday bangles to find your signature pair.
              </p>
              <Link href="/shop" onClick={closeCart}>
                <Button variant="primary" size="sm">
                  Explore Bangles
                </Button>
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.variant_id} className="flex gap-4 py-4">
                {/* Visual Thumbnail */}
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-bg-secondary border border-border flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="9" />
                      <circle cx="12" cy="12" r="6" />
                    </svg>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/shop/${item.product_slug}`}
                        onClick={closeCart}
                        className="font-medium text-sm text-text-primary hover:text-brand line-clamp-1 transition-colors"
                      >
                        {item.product_name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.variant_id)}
                        className="text-text-secondary hover:text-error transition-colors p-1"
                        aria-label={`Remove ${item.product_name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Variant specs */}
                    <div className="flex items-center gap-2 mt-1 text-xs text-text-secondary">
                      {item.variant_size && (
                        <span className="rounded bg-bg-surface px-1.5 py-0.5">
                          Size: {item.variant_size}
                        </span>
                      )}
                      {item.variant_color && (
                        <span className="rounded bg-bg-surface px-1.5 py-0.5">
                          {item.variant_color}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity controls */}
                    <div className="flex items-center rounded-md border border-border bg-bg-surface">
                      <button
                        onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                        className="p-1 text-text-secondary hover:text-text-primary"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-medium text-text-primary">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                        className="p-1 text-text-secondary hover:text-text-primary"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <span className="text-sm font-semibold text-brand">
                      {formatPrice(item.price_cents * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {items.length > 0 && (
          <div className="border-t border-border bg-bg-primary px-6 py-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Subtotal</span>
              <span className="font-heading text-lg font-semibold text-text-primary">
                {formatPrice(subtotalCents)}
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              Cash on Delivery (COD) calculated at checkout.
            </p>

            <div className="flex flex-col gap-2 pt-1">
              <Link href="/checkout" onClick={closeCart} className="w-full">
                <Button variant="primary" size="md" fullWidth className="group">
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/cart" onClick={closeCart} className="w-full">
                <Button variant="ghost" size="sm" fullWidth>
                  View Full Bag
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

