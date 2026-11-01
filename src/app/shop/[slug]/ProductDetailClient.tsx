'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import type { Product, ProductVariant } from '@/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ProductCard from '@/components/product/ProductCard';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  RefreshCw,
  Plus,
  Minus,
  Check,
  ChevronDown,
  Ruler,
  Crown,
} from 'lucide-react';

// Curated high-resolution Unsplash bangle galleries per category / product
const PRODUCT_GALLERIES: Record<string, string[]> = {
  'kundan-bridal-kangan-set': [
    'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1200&auto=format&fit=crop&q=85',
  ],
  'silk-thread-bangles-rose': [
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1544441893-675973e31985?w=1200&auto=format&fit=crop&q=85',
  ],
  'meenakari-floral-bangles': [
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1515562141589-67f0d569b6fc?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=1200&auto=format&fit=crop&q=85',
  ],
  'velvet-royal-chura-set': [
    'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=1200&auto=format&fit=crop&q=85',
  ],
  'antique-gold-filigree-kada': [
    'https://images.unsplash.com/photo-1515562141589-67f0d569b6fc?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=1200&auto=format&fit=crop&q=85',
  ],
  'mirror-work-festive-bangles': [
    'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1200&auto=format&fit=crop&q=85',
  ],
  'polki-jadau-openable-kangan': [
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1515562141589-67f0d569b6fc?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1200&auto=format&fit=crop&q=85',
  ],
  'minimalist-daily-gold-kada': [
    'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1515562141589-67f0d569b6fc?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1200&auto=format&fit=crop&q=85',
  ],
};

const DEFAULT_GALLERY = [
  'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1200&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1200&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1200&auto=format&fit=crop&q=85',
];

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const { addItem } = useCart();

  // Find default active variant
  const defaultVariant = product.variants?.[0];
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    defaultVariant
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('specs');

  // Build images list: use product.images if valid http URLs, otherwise fall back to curated bangle gallery
  const hasValidDbImages =
    product.images &&
    product.images.length > 0 &&
    product.images.some((img) => img.url?.startsWith('http'));

  const galleryImages: string[] = hasValidDbImages
    ? product.images!.filter((img) => img.url?.startsWith('http')).map((img) => img.url)
    : PRODUCT_GALLERIES[product.slug] || DEFAULT_GALLERY;

  // Extract available unique sizes and colors
  const availableSizes = Array.from(
    new Set(product.variants?.map((v) => v.size).filter(Boolean) as string[])
  );
  const availableColors = Array.from(
    new Set(product.variants?.map((v) => v.color).filter(Boolean) as string[])
  );

  const currentPrice = selectedVariant?.price_cents || 0;
  const comparePrice = selectedVariant?.compare_at_price_cents;
  const currentStock = selectedVariant?.stock_quantity ?? 0;
  const isOutOfStock = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= (selectedVariant?.low_stock_threshold || 3);

  const handleSizeChange = (size: string) => {
    const match = product.variants?.find(
      (v) =>
        v.size === size &&
        (!selectedVariant?.color || v.color === selectedVariant.color)
    );
    if (match) setSelectedVariant(match);
  };

  const handleColorChange = (color: string) => {
    const match = product.variants?.find(
      (v) =>
        v.color === color &&
        (!selectedVariant?.size || v.size === selectedVariant.size)
    );
    if (match) setSelectedVariant(match);
  };

  const handleAddToCart = () => {
    if (!selectedVariant || isOutOfStock) return;
    addItem(product, selectedVariant, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="space-y-16">
      {/* Product Main Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Rich Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Visual Display */}
          <div className="relative aspect-[4/5] sm:aspect-square w-full overflow-hidden rounded-3xl bg-bg-secondary border border-[#D4A017]/30 shadow-xl group">
            <Image
              src={galleryImages[activeImageIndex] || galleryImages[0]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Subtle luxury vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              {product.is_featured && (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#D4A017] to-[#B8860B] px-3.5 py-1 text-xs font-bold text-white shadow-md">
                  <Crown className="h-3.5 w-3.5" />
                  <span>Signature Bridal</span>
                </div>
              )}
              {comparePrice && (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#C62828] to-[#8B1A4A] px-3.5 py-1 text-xs font-bold text-white shadow-md">
                  <span>Special Offer</span>
                </div>
              )}
            </div>

            {/* Bottom info overlay */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-white/90 text-xs">
              <span className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                100% Handcrafted Artisan Piece
              </span>
              <span className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                Photo {activeImageIndex + 1} of {galleryImages.length}
              </span>
            </div>
          </div>

          {/* Thumbnails Row */}
          <div className="grid grid-cols-4 gap-3">
            {galleryImages.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImageIndex === idx
                    ? 'border-[#D4A017] ring-2 ring-[#D4A017]/40 shadow-md scale-102'
                    : 'border-border/80 hover:border-[#D4A017]/60 opacity-80 hover:opacity-100'
                }`}
              >
                <Image
                  src={imgUrl}
                  alt={`${product.name} angle ${idx + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Information & Add to Bag */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            {product.category && (
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#D4A017] hover:underline mb-1"
              >
                <Sparkles className="h-3 w-3" />
                {product.category.name}
              </Link>
            )}
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary leading-tight mt-1">
              {product.name}
            </h1>
            {product.short_description && (
              <p className="text-sm text-text-secondary mt-3 leading-relaxed">
                {product.short_description}
              </p>
            )}
          </div>

          {/* Price & Stock Display */}
          <div className="border-y border-border py-4 flex items-center justify-between">
            <div className="flex items-baseline gap-3">
              <span className="font-heading text-3xl font-bold text-brand">
                {formatPrice(currentPrice)}
              </span>
              {comparePrice && (
                <span className="text-base text-text-secondary line-through">
                  {formatPrice(comparePrice)}
                </span>
              )}
            </div>

            {/* Stock Badge */}
            <div>
              {isOutOfStock ? (
                <Badge variant="error">Out of Stock</Badge>
              ) : isLowStock ? (
                <Badge variant="warning">Only {currentStock} Left</Badge>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  In Stock & Ready
                </span>
              )}
            </div>
          </div>

          {/* Variant Selection: Size */}
          {availableSizes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-text-primary">
                  Select Bangle Size:
                  {selectedVariant?.size && (
                    <span className="ml-1 text-brand font-semibold">({selectedVariant.size})</span>
                  )}
                </span>
                <Link
                  href="/size-guide"
                  className="text-brand hover:underline flex items-center gap-1 font-semibold"
                >
                  <Ruler className="h-3.5 w-3.5 text-[#D4A017]" />
                  Size Guide
                </Link>
              </div>

              <div className="flex items-center gap-3">
                {availableSizes.map((size) => {
                  const isSelected = selectedVariant?.size === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeChange(size)}
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold transition-all border ${
                        isSelected
                          ? 'border-[#D4A017] bg-gradient-to-br from-[#8B1A4A] to-[#6D1038] text-white shadow-md scale-105 ring-2 ring-[#D4A017]/40'
                          : 'border-border bg-white text-text-primary hover:border-[#D4A017] hover:shadow-xs'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Variant Selection: Color / Finish */}
          {availableColors.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-text-primary block">
                Finish / Shade:{' '}
                <span className="font-normal text-text-secondary">{selectedVariant?.color}</span>
              </span>

              <div className="flex items-center gap-2">
                {availableColors.map((color) => {
                  const isSelected = selectedVariant?.color === color;
                  const vMatch = product.variants?.find((v) => v.color === color);
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorChange(color)}
                      className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium border transition-all ${
                        isSelected
                          ? 'border-[#D4A017] bg-gradient-to-r from-[#8B1A4A] to-[#6D1038] text-white shadow-sm'
                          : 'border-border bg-white text-text-primary hover:border-[#D4A017]'
                      }`}
                    >
                      {vMatch?.color_hex && (
                        <span
                          className="h-3 w-3 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: vMatch.color_hex }}
                        />
                      )}
                      <span>{color}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart Controls */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex h-13 items-center rounded-2xl border border-border bg-white px-2 shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-text-secondary hover:text-brand transition-colors"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-text-primary">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(currentStock || 50, quantity + 1))}
                  className="p-2 text-text-secondary hover:text-brand transition-colors"
                  aria-label="Increase quantity"
                  disabled={quantity >= currentStock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Add to Bag Button */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="h-13 rounded-2xl bg-gradient-to-r from-[#8B1A4A] via-[#6D1038] to-[#8B1A4A] hover:from-[#6D1038] hover:to-[#500B29] text-white font-bold text-sm shadow-lg hover:shadow-xl border-0 active:scale-98 transition-all"
              >
                {isAdded ? (
                  <span className="flex items-center gap-2 text-emerald-200">
                    <Check className="h-5 w-5 text-emerald-300" />
                    Added to Bag Successfully!
                  </span>
                ) : isOutOfStock ? (
                  'Out of Stock'
                ) : (
                  `Add to Bag — ${formatPrice(currentPrice * quantity)}`
                )}
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-text-secondary">
              <Sparkles className="h-3.5 w-3.5 text-[#D4A017]" />
              <span>Cash on Delivery across Pakistan • Free Shipping 5K+</span>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="rounded-2xl border border-[#D4A017]/30 bg-gradient-to-br from-[#FFF3E6] via-bg-primary to-[#FCE4EC] p-5 space-y-3 text-xs text-text-secondary">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand text-white shrink-0">
                <Truck className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-text-primary block">Express Courier Delivery</span>
                <span>Delivers in 3–5 business days with live SMS tracking.</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D4A017] text-white shrink-0">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-text-primary block">Cash on Delivery (COD)</span>
                <span>Open parcel inspection upon delivery before paying.</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand text-white shrink-0">
                <RefreshCw className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-text-primary block">Easy 3-Day Size Exchange</span>
                <span>Guaranteed fit exchange if size doesn&apos;t fit your wrist.</span>
              </div>
            </div>
          </div>

          {/* Collapsible Accordions */}
          <div className="divide-y divide-border border-t border-border pt-2 text-xs">
            {/* 1. Specs */}
            <div className="py-3.5">
              <button
                type="button"
                onClick={() => toggleAccordion('specs')}
                className="flex w-full items-center justify-between font-bold text-text-primary text-left text-sm"
              >
                <span>Product Details & Craftsmanship</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform text-[#D4A017] ${
                    openAccordion === 'specs' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordion === 'specs' && (
                <div className="pt-3 text-text-secondary space-y-2 leading-relaxed">
                  <p>{product.description || 'Handcrafted luxury bangles by master artisans.'}</p>
                  {product.material && (
                    <div className="rounded-xl bg-white p-3 border border-border mt-2">
                      <span className="font-bold text-text-primary block mb-1">
                        Materials Used:
                      </span>
                      <span>{product.material}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. Sizing Guide */}
            <div className="py-3.5">
              <button
                type="button"
                onClick={() => toggleAccordion('size')}
                className="flex w-full items-center justify-between font-bold text-text-primary text-left text-sm"
              >
                <span>How to Measure Your Wrist Size</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform text-[#D4A017] ${
                    openAccordion === 'size' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordion === 'size' && (
                <div className="pt-3 text-text-secondary space-y-2 leading-relaxed">
                  <p>
                    Standard Pakistani bangle sizes correspond to inner diameter in inches:
                  </p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong>2.4:</strong> Small (Inner Diameter: 2.25 inches)</li>
                    <li><strong>2.6:</strong> Medium / Standard (Inner Diameter: 2.37 inches)</li>
                    <li><strong>2.8:</strong> Large (Inner Diameter: 2.50 inches)</li>
                  </ul>
                  <Link href="/size-guide" className="text-brand font-semibold underline block pt-1">
                    Open Comprehensive Sizing Chart & Video Guide &rarr;
                  </Link>
                </div>
              )}
            </div>

            {/* 3. Care */}
            <div className="py-3.5">
              <button
                type="button"
                onClick={() => toggleAccordion('care')}
                className="flex w-full items-center justify-between font-bold text-text-primary text-left text-sm"
              >
                <span>Jewellery Care Instructions</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform text-[#D4A017] ${
                    openAccordion === 'care' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordion === 'care' && (
                <div className="pt-3 text-text-secondary space-y-2 leading-relaxed">
                  <p>
                    • Keep away from direct perfume, water, sprays, and chemical exposure.
                  </p>
                  <p>
                    • Store in the provided GULNAAR velvet keepsake pouch or airtight ziplock.
                  </p>
                  <p>
                    • Wipe gently with a soft microfibre cloth after every wear to preserve lustre.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-border">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-[0.2em] text-[#D4A017] font-bold block mb-1">
              ✦ Complete The Look
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
              You May Also Adore
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
