'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, CheckCircle2, Crown } from 'lucide-react';

const FALLBACK_BANGLE_THUMBS = [
  'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=300&auto=format&fit=crop&q=80',
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
            icon={<Crown className="h-12 w-12 text-[#D4A017]" />}
          />
        </Container>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16">
      <Container size="xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#8B1A4A] to-[#6D1038] flex items-center justify-center text-white shadow-sm">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold text-text-primary">
              Your Shopping Bag
            </h1>
            <p className="text-xs text-text-secondary mt-0.5">
              {items.length} {items.length === 1 ? 'handcrafted piece' : 'handcrafted pieces'} ready for order
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-5">
            {/* Free Delivery Bar */}
            <div className="rounded-2xl border border-[#D4A017]/30 bg-gradient-to-r from-[#FFF3E6] via-bg-primary to-[#FCE4EC] p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs font-medium mb-2">
                {freeDeliveryRemaining > 0 ? (
                  <span className="text-text-secondary">
                    Add <strong className="text-brand font-bold">{formatPrice(freeDeliveryRemaining)}</strong> more to get Free Delivery
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#D4A017]" /> Free Delivery Unlocked!
                  </span>
                )}
                <span className="font-bold text-[#D4A017]">{Math.round(freeDeliveryPercent)}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-border/80">
                <div
                  className="h-full bg-gradient-to-r from-[#D4A017] to-[#8B1A4A] rounded-full transition-all duration-500"
                  style={{ width: `${freeDeliveryPercent}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="divide-y divide-border rounded-2xl border border-border bg-white shadow-xs overflow-hidden">
              {items.map((item) => {
                const itemImg = getCartItemImage(item.product_slug, item.image_url || undefined);
                return (
                  <div key={item.variant_id} className="flex flex-col sm:flex-row gap-5 p-5 sm:p-6 items-start sm:items-center">
                    {/* Real Bangles Image */}
                    <Link
                      href={`/shop/${item.product_slug}`}
                      className="relative h-24 w-24 shrink-0 rounded-2xl overflow-hidden border border-[#D4A017]/30 bg-bg-secondary group"
                    >
                      <Image
                        src={itemImg}
                        alt={item.product_name}
                        fill
                        sizes="96px"
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex flex-1 flex-col justify-between w-full">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link
                            href={`/shop/${item.product_slug}`}
                            className="font-heading font-bold text-base text-text-primary hover:text-brand transition-colors"
                          >
                            {item.product_name}
                          </Link>
                          <div className="flex items-center gap-2 mt-1.5 text-xs">
                            {item.variant_size && (
                              <span className="rounded-md bg-[#FFF3E6] border border-[#D4A017]/20 px-2 py-0.5 font-bold text-brand text-[11px]">
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

                        <button
                          onClick={() => removeItem(item.variant_id)}
                          className="text-text-secondary hover:text-error transition-colors p-1"
                          aria-label={`Remove ${item.product_name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center rounded-xl border border-border bg-bg-surface shadow-xs">
                          <button
                            onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                            className="p-1.5 text-text-secondary hover:text-brand transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-text-primary">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                            className="p-1.5 text-text-secondary hover:text-brand transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-base font-bold text-brand">
                          {formatPrice(item.price_cents * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 rounded-3xl border border-[#D4A017]/30 bg-white p-6 sm:p-7 space-y-6 shadow-lg">
            <h2 className="font-heading text-lg font-bold text-text-primary border-b border-border pb-3">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="font-bold text-text-primary">{formatPrice(subtotalCents)}</span>
              </div>
              <div className="flex items-center justify-between text-text-secondary">
                <span>Delivery Charges</span>
                <span className="font-bold text-text-primary">
                  {deliveryFeeCents === 0 ? (
                    <span className="text-emerald-700">FREE</span>
                  ) : (
                    formatPrice(deliveryFeeCents)
                  )}
                </span>
              </div>
              <div className="border-t border-border pt-3 flex items-center justify-between text-base">
                <span className="font-bold text-text-primary">Estimated Total</span>
                <span className="font-heading font-bold text-xl text-brand">{formatPrice(totalCents)}</span>
              </div>
            </div>

            <Link href="/checkout" prefetch={true} className="block w-full">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                className="bg-gradient-to-r from-[#B81D4E] via-[#8E0E3B] to-[#B81D4E] hover:from-[#8E0E3B] hover:to-[#5C0724] text-white font-bold shadow-lg border border-[#F6D365]/40 btn-luxury-shine"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>

            {/* Trust Points */}
            <div className="border-t border-border pt-5 space-y-2.5 text-xs text-text-secondary">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-[#D4A017] shrink-0" />
                <span>Cash on Delivery available nationwide</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#D4A017] shrink-0" />
                <span>Open parcel check upon delivery</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
