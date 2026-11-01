'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { formatPrice, getStartingPrice } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import type { Product } from '@/types';
import { Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  className?: string;
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

  // Aesthetic color accent based on product category
  const getOrnamentAccent = () => {
    if (product.category_id === '1') return 'from-amber-100 to-rose-100 text-brand border-gold/40';
    if (product.category_id === '4') return 'from-amber-50 to-emerald-50 text-emerald-800 border-gold/30';
    return 'from-stone-100 to-amber-50 text-gold-dark border-gold/20';
  };

  return (
    <Link
      href={`/shop/${product.slug}`}
      className={cn('group block relative flex flex-col', className)}
      id={`product-card-${product.slug}`}
    >
      {/* Image / Visual Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-[var(--radius-lg)] bg-bg-secondary border border-border/80 transition-all duration-300 group-hover:border-gold/50 group-hover:shadow-md mb-3">
        {/* Product Visual Container */}
        <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-105">
          {primaryImage && primaryImage.url.startsWith('http') ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt_text || product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className={cn('flex h-full w-full items-center justify-center bg-gradient-to-br p-6', getOrnamentAccent())}>
              <div className="text-center relative">
                {/* Decorative concentric bangle circle visual */}
                <div className="relative mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-full border-2 border-gold/40 bg-white/60 backdrop-blur-xs shadow-xs transition-transform duration-300 group-hover:rotate-45">
                  <div className="h-16 w-16 rounded-full border border-dashed border-gold/60 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-gold transition-colors group-hover:text-brand" />
                  </div>
                </div>
                <span className="font-heading text-xs font-semibold tracking-wide text-text-primary line-clamp-1 block">
                  {product.name}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-text-secondary mt-0.5 block">
                  Handcrafted
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Status Badges */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {isNew && <Badge variant="brand">New Heirloom</Badge>}
          {hasComparePrice && <Badge variant="error">Special Offer</Badge>}
          {isLowStock && !isOutOfStock && <Badge variant="warning">Only a few left</Badge>}
          {isOutOfStock && <Badge variant="default">Out of Stock</Badge>}
        </div>

        {/* Quick View Tag on Hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <div className="w-full rounded-md bg-white/95 backdrop-blur-xs py-2 text-center text-xs font-semibold text-brand shadow-xs border border-border">
            View Details & Sizes
          </div>
        </div>
      </div>

      {/* Product Information */}
      <div className="space-y-1.5 flex-1 flex flex-col justify-between">
        <div>
          {product.category && (
            <p className="text-[11px] font-medium uppercase tracking-wider text-text-secondary">
              {product.category.name}
            </p>
          )}
          <h3 className="text-sm font-medium text-text-primary line-clamp-1 transition-colors duration-200 group-hover:text-brand">
            {product.name}
          </h3>
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <p className="font-semibold text-sm text-brand">
            {formatPrice(price)}
          </p>
          {product.variants && product.variants.length > 1 && (
            <span className="text-[11px] text-text-secondary">
              {product.variants.length} sizes/options
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}


