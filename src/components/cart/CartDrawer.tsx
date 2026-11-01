'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Sparkles, Crown } from 'lucide-react';
import Button from '@/components/ui/Button';

// Bangle thumbnail fallbacks
const FALLBACK_BANGLE_THUMBS = [
  'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=200&auto=format&fit=crop&q=80',
];

function getCartItemImage(slug: string, primaryImage?: string): string {
  if (primaryImage && primaryImage.startsWith('http')) return primaryImage;
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash) + slug.charCodeAt(i);
    hash |= 0;
  }
  return FALLBACK_BANGLE_THUMBS[Math.abs(hash) % FALLBACK_BANGLE_THUMBS.length];
}

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
        className="fixed inset-0 bg-[#1A1A2E]/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-bg-primary shadow-2xl border-l border-[#D4A017]/30 animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4.5 bg-gradient-to-r from-bg-primary to-[#FFF3E6]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#8B1A4A] to-[#6D1038] flex items-center justify-center text-white shadow-xs">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-text-primary leading-none">
                Shopping Bag
              </h2>
              <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">
                GULNAAR by MK
              </span>
            </div>
            <span className="rounded-full bg-gradient-to-r from-[#D4A017] to-[#B8860B] px-2 py-0.5 text-xs font-bold text-white shadow-xs">
              {totalItems}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="rounded-xl p-2 text-text-secondary hover:bg-brand-light hover:text-brand transition-colors focus-visible:outline-brand cursor-pointer"
            aria-label="Close Shopping Bag"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free Delivery Meter */}
        {items.length > 0 && (
          <div className="border-b border-[#C5A059]/30 bg-gradient-to-r from-[#FAF9F6] via-white to-[#FDF2F4] px-6 py-3.5">
            <div className="flex items-center justify-between text-xs font-medium mb-1.5">
              {freeDeliveryRemaining > 0 ? (
                <span className="text-text-secondary">
                  Add <strong className="text-[#7A0C2E] font-bold">{formatPrice(freeDeliveryRemaining)}</strong> for Free Delivery
                </span>
              ) : (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-[#DFB76C]" /> Free Delivery Unlocked!
                </span>
              )}
              <span className="text-xs font-bold text-[#C5A059]">{Math.round(freeDeliveryPercent)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-border/80">
              <div
                className="h-full bg-gradient-to-r from-[#DFB76C] via-[#C5A059] to-[#7A0C2E] transition-all duration-500 rounded-full"
                style={{ width: `${freeDeliveryPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-border">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-12">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFF3E6] to-[#FCE4EC] border border-[#D4A017]/30 flex items-center justify-center text-brand mb-4 shadow-sm">
                <Crown className="h-9 w-9 text-[#D4A017]" />
              </div>
              <h3 className="font-heading text-xl font-bold text-text-primary mb-1">
                Your Bag is Empty
              </h3>
              <p className="text-xs text-text-secondary mb-6 max-w-xs leading-relaxed">
                Explore our handcrafted bridal sets and everyday silk bangles to find your signature pair.
              </p>
              <Link href="/shop" onClick={closeCart}>
                <Button variant="primary" size="md" className="shadow-md">
                  Explore Bangles Collection
                </Button>
              </Link>
            </div>
          ) : (
            items.map((item) => {
              const itemImg = getCartItemImage(item.product_slug, item.image_url || undefined);
              return (
                <div key={item.variant_id} className="flex gap-4 py-4 items-center">
                  {/* Real Bangles Image */}
                  <Link
                    href={`/shop/${item.product_slug}`}
                    onClick={closeCart}
                    className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-[#D4A017]/30 bg-bg-secondary group"
                  >
                    <Image
                      src={itemImg}
                      alt={item.product_name}
                      fill
                      sizes="80px"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/shop/${item.product_slug}`}
                          onClick={closeCart}
                          className="font-bold text-sm text-text-primary hover:text-brand line-clamp-1 transition-colors"
                        >
                          {item.product_name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.variant_id)}
                          className="text-text-secondary hover:text-error transition-colors p-1"
                          aria-label={`Remove ${item.product_name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Variant specs */}
                      <div className="flex items-center gap-2 mt-1 text-xs">
                        {item.variant_size && (
                          <span className="rounded-md bg-[#FFF3E6] border border-[#D4A017]/20 px-2 py-0.5 font-semibold text-brand text-[11px]">
                            Size: {item.variant_size}
                          </span>
                        )}
                        {item.variant_color && (
                          <span className="rounded-md bg-[#FFF3E6] border border-[#D4A017]/20 px-2 py-0.5 text-text-secondary text-[11px]">
                            {item.variant_color}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity controls */}
                      <div className="flex items-center rounded-xl border border-border bg-white shadow-xs">
                        <button
                          onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                          className="p-1.5 text-text-secondary hover:text-brand transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-text-primary">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                          className="p-1.5 text-text-secondary hover:text-brand transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-sm font-bold text-brand">
                        {formatPrice(item.price_cents * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer / Summary */}
        {items.length > 0 && (
          <div className="border-t border-border bg-bg-primary px-6 py-4.5 space-y-3.5 shadow-lg">
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="font-semibold text-text-primary">{formatPrice(subtotalCents)}</span>
              </div>
              <div className="flex items-center justify-between text-text-secondary">
                <span>Shipping</span>
                <span className="font-semibold text-text-primary">
                  {freeDeliveryRemaining <= 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    'Calculated at checkout'
                  )}
                </span>
              </div>
              <div className="border-t border-border pt-2 flex items-center justify-between text-sm">
                <span className="font-bold text-text-primary">Estimated Total</span>
                <span className="font-bold text-base text-brand">{formatPrice(subtotalCents)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link href="/checkout" prefetch={true} onClick={closeCart} className="w-full">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="bg-gradient-to-r from-[#7A0C2E] via-[#560820] to-[#7A0C2E] hover:from-[#560820] hover:to-[#380414] text-white font-bold shadow-lg border border-[#DFB76C]/40 btn-luxury-shine"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link href="/cart" prefetch={true} onClick={closeCart} className="w-full">
                <Button variant="ghost" size="sm" fullWidth className="text-xs text-text-secondary hover:text-[#7A0C2E]">
                  View Full Bag Details
                </Button>
              </Link>
            </div>

            <p className="text-[10px] text-center text-text-secondary flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-brand" />
              Cash on Delivery Available Across Pakistan
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
