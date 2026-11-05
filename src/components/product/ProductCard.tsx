'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { formatPrice, getStartingPrice } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import type { Product } from '@/types';
import { Eye, Gem } from 'lucide-react';

// Fallback bangle images from Unsplash when no product image exists
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=600&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&auto=format&fit=crop&q=85',
];

interface ProductCardProps {
  product: Product;
  className?: string;
}

function getConsistentImage(productId: string): string {
  let hash = 0;
  for (let i = 0; i < productId.length; i++) {
    hash = ((hash << 5) - hash) + productId.charCodeAt(i);
    hash |= 0;
  }
  return FALLBACK_IMAGES[Math.abs(hash) % FALLBACK_IMAGES.length];
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const price = getStartingPrice(product);
  const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      setIsNew(new Date(product.created_at) > thirtyDaysAgo);
    }, 0);
    return () => clearTimeout(timer);
  }, [product.created_at]);

  const hasComparePrice = product.variants?.some((v) => v.compare_at_price_cents);
  const totalStock = product.variants?.reduce((acc, v) => acc + (v.stock_quantity || 0), 0) || 0;
  const isLowStock = totalStock > 0 && totalStock <= 5;
  const isOutOfStock = totalStock === 0;

  // Determine image source
  const imageUrl = (primaryImage && primaryImage.url.startsWith('http'))
    ? primaryImage.url
    : getConsistentImage(product.id);

  const availableSizes = Array.from(
    new Set(product.variants?.map((v) => v.size).filter(Boolean))
  ) as string[];

  return (
    <Link
      href={`/shop/${product.slug}`}
      prefetch={true}
      className={cn(
        'group block relative flex flex-col rounded-3xl bg-white p-3 border border-border/80 hover-luxury-card cursor-pointer',
        className
      )}
      id={`product-card-${product.slug}`}
    >
      {/* Image Container with Smooth 700ms Zoom */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#FAF9F6] border border-border/40 mb-3.5">
        <Image
          src={imageUrl}
          alt={primaryImage?.alt_text || product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover hover-zoom-bangle"
        />

        {/* Elegant vignette gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Status Badges with Luxury Styling */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5 pointer-events-none">
          {isNew && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#DFB76C] to-[#C5A059] px-2.5 py-0.5 text-[10px] font-bold text-[#4A0E2E] shadow-sm">
              <Gem className="h-3 w-3" />
              New Heirloom
            </span>
          )}
          {hasComparePrice && (
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#991B1B] to-[#7A0C2E] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
              Sale Offer
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#B45309] to-[#D97706] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
              Few Left
            </span>
          )}
          {isOutOfStock && <Badge variant="default">Sold Out</Badge>}
        </div>

        {/* Quick View Button (Smooth Slide & Shine on Hover) */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 transform translate-y-3 transition-all duration-400 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none">
          <div className="flex items-center justify-center gap-2 rounded-xl bg-white/95 backdrop-blur-md py-2.5 text-xs font-bold text-[#7A0C2E] shadow-lg border border-[#C5A059]/40 btn-luxury-shine">
            <Eye className="h-3.5 w-3.5 text-[#C5A059]" />
            <span>View Details & Sizes</span>
          </div>
        </div>
      </div>

      {/* Product Information */}
      <div className="space-y-1.5 flex-1 flex flex-col justify-between px-1 pb-1">
        <div>
          {product.category && (
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">
              {product.category.name}
            </p>
          )}
          <h3 className="font-heading text-sm sm:text-base font-bold text-text-primary line-clamp-1 transition-colors duration-200 group-hover:text-[#7A0C2E] mt-0.5">
            {product.name}
          </h3>
          {availableSizes.length > 0 && (
            <div className="flex items-center gap-1 pt-0.5">
              <span className="text-[10px] text-text-secondary mr-0.5">Sizes:</span>
              {availableSizes.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center justify-center h-4 px-1.5 rounded-md bg-[#FAF9F6] border border-border text-[9px] font-semibold text-text-primary group-hover:border-[#DFB76C]/60 group-hover:bg-[#FDF2F4] transition-colors"
                >
                  {s}
                </span>
              ))}
              {availableSizes.length > 3 && (
                <span className="text-[9px] text-text-secondary">+{availableSizes.length - 3}</span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-baseline justify-between pt-1.5 border-t border-border/40">
          <div className="flex items-baseline gap-2">
            <p className="font-bold text-sm sm:text-base text-[#7A0C2E]">
              {formatPrice(price)}
            </p>
            {hasComparePrice && (
              <span className="text-[11px] text-text-secondary line-through">
                {formatPrice(
                  product.variants?.find((v) => v.compare_at_price_cents)
                    ?.compare_at_price_cents || 0
                )}
              </span>
            )}
          </div>
          {product.variants && product.variants.length > 1 && (
            <span className="text-[10px] text-text-secondary font-medium hidden sm:inline">
              {product.variants.length} sizes
            </span>
          )}
        </div>

        {/* Mobile Quick Tap Indicator */}
        <div className="sm:hidden mt-2 pt-1.5 border-t border-dashed border-[#E8E5DF] flex items-center justify-between text-[10px] font-bold text-[#7A0C2E]">
          <span>View Sizes</span>
          <span className="text-[#C5A059]">&rarr;</span>
        </div>
      </div>
    </Link>
  );
}
