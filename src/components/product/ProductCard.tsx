'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { formatPrice, getStartingPrice } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import type { Product } from '@/types';
import { Eye } from 'lucide-react';

// Fallback bangle images from Unsplash when no product image exists
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1515562141589-67f0d569b6fc?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500&auto=format&fit=crop&q=80',
];

interface ProductCardProps {
  product: Product;
  className?: string;
}

function getConsistentImage(productId: string): string {
  // Generate a consistent index based on product ID so same product always gets same image
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

  return (
    <Link
      href={`/shop/${product.slug}`}
      className={cn('group block relative flex flex-col', className)}
      id={`product-card-${product.slug}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-bg-secondary border border-border/60 transition-all duration-500 group-hover:border-[#D4A017]/50 group-hover:shadow-xl mb-3">
        {/* Product Image */}
        <Image
          src={imageUrl}
          alt={primaryImage?.alt_text || product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Status Badges */}
        <div className="absolute left-2.5 top-2.5 z-10 flex flex-col gap-1.5">
          {isNew && <Badge variant="brand">New ✨</Badge>}
          {hasComparePrice && <Badge variant="error">Sale</Badge>}
          {isLowStock && !isOutOfStock && <Badge variant="warning">Few Left</Badge>}
          {isOutOfStock && <Badge variant="default">Sold Out</Badge>}
        </div>

        {/* Quick View on Hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 transform translate-y-3 transition-all duration-400 group-hover:opacity-100 group-hover:translate-y-0">
          <div className="flex gap-2">
            <div className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white/95 backdrop-blur-sm py-2.5 text-xs font-bold text-brand shadow-lg border border-[#D4A017]/20">
              <Eye className="h-3.5 w-3.5" />
              Quick View
            </div>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-1.5 flex-1 flex flex-col justify-between px-0.5">
        <div>
          {product.category && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#D4A017]">
              {product.category.name}
            </p>
          )}
          <h3 className="text-sm font-semibold text-text-primary line-clamp-1 transition-colors duration-200 group-hover:text-brand mt-0.5">
            {product.name}
          </h3>
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <p className="font-bold text-sm text-brand">
            {formatPrice(price)}
          </p>
          {product.variants && product.variants.length > 1 && (
            <span className="text-[10px] text-text-secondary font-medium">
              {product.variants.length} options
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
