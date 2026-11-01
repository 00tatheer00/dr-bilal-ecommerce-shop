'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import type { Product, ProductVariant } from '@/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
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
} from 'lucide-react';

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Visual Display */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-bg-secondary via-bg-surface to-bg-secondary border border-border shadow-xs flex items-center justify-center p-8">
            <div className="text-center relative">
              <div className="relative mx-auto mb-4 flex h-48 w-48 sm:h-64 sm:w-64 items-center justify-center rounded-full border-4 border-gold/40 bg-white/70 backdrop-blur-xs shadow-md">
                <div className="h-36 w-36 sm:h-48 sm:w-48 rounded-full border-2 border-dashed border-gold/60 flex flex-col items-center justify-center bg-brand-light/30">
                  <Sparkles className="h-12 w-12 text-gold mb-2" />
                  <span className="font-heading text-sm font-bold text-brand tracking-widest uppercase">
                    GULNAAR
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-text-secondary">
                    {selectedVariant?.size ? `Size ${selectedVariant.size}` : 'Heirloom Bangle'}
                  </span>
                </div>
              </div>
              <span className="font-heading text-lg font-semibold text-text-primary block">
                {product.name}
              </span>
              {selectedVariant?.color && (
                <span className="text-xs text-text-secondary mt-1 block">
                  Color / Finish: {selectedVariant.color}
                </span>
              )}
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {product.is_featured && <Badge variant="brand">Bespoke Bridal</Badge>}
              {comparePrice && <Badge variant="error">Sale Offer</Badge>}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex items-center gap-3">
            {[1, 2, 3, 4].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx - 1)}
                className={`relative h-20 w-20 rounded-lg border-2 bg-bg-secondary flex items-center justify-center transition-all ${
                  activeImageIndex === idx - 1
                    ? 'border-brand shadow-xs'
                    : 'border-border hover:border-gold'
                }`}
              >
                <div className="w-8 h-8 rounded-full border border-gold/50 flex items-center justify-center">
                  <span className="text-[10px] font-medium text-text-secondary">{idx}</span>
                </div>
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
                className="text-xs font-semibold uppercase tracking-wider text-brand hover:underline"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary mt-1">
              {product.name}
            </h1>
            {product.short_description && (
              <p className="text-xs sm:text-sm text-text-secondary mt-2 leading-relaxed">
                {product.short_description}
              </p>
            )}
          </div>

          {/* Price & Stock Display */}
          <div className="border-y border-border py-4 flex items-center justify-between">
            <div className="flex items-baseline gap-3">
              <span className="font-heading text-2xl font-bold text-brand">
                {formatPrice(currentPrice)}
              </span>
              {comparePrice && (
                <span className="text-sm text-text-secondary line-through">
                  {formatPrice(comparePrice)}
                </span>
              )}
            </div>

            {/* Stock Badge */}
            <div>
              {isOutOfStock ? (
                <Badge variant="error">Out of Stock</Badge>
              ) : isLowStock ? (
                <Badge variant="warning">Only {currentStock} Left in Stock</Badge>
              ) : (
                <Badge variant="success">In Stock & Ready for Dispatch</Badge>
              )}
            </div>
          </div>

          {/* Variant Selection: Size */}
          {availableSizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text-primary">Select Bangle Size:</span>
                <Link
                  href="/size-guide"
                  className="text-brand hover:underline flex items-center gap-1 font-medium"
                >
                  <Ruler className="h-3.5 w-3.5 text-gold" />
                  Bangle Size Guide
                </Link>
              </div>

              <div className="flex items-center gap-2.5">
                {availableSizes.map((size) => {
                  const isSelected = selectedVariant?.size === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeChange(size)}
                      className={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-semibold transition-all border ${
                        isSelected
                          ? 'border-brand bg-brand text-text-inverse shadow-sm scale-105'
                          : 'border-border bg-bg-surface text-text-primary hover:border-gold'
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
              <span className="text-xs font-semibold text-text-primary block">
                Finish / Shade: <span className="font-normal text-text-secondary">{selectedVariant?.color}</span>
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
                      className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium border transition-all ${
                        isSelected
                          ? 'border-brand bg-brand text-text-inverse'
                          : 'border-border bg-bg-surface text-text-primary hover:border-gold'
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
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              {/* Quantity Selector */}
              <div className="flex h-12 items-center rounded-lg border border-border bg-bg-surface px-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 text-text-secondary hover:text-text-primary"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-medium text-sm text-text-primary">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(currentStock || 50, quantity + 1))}
                  className="p-1.5 text-text-secondary hover:text-text-primary"
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
                className="h-12 shadow-sm"
              >
                {isAdded ? (
                  <span className="flex items-center gap-1.5 text-emerald-100">
                    <Check className="h-4 w-4 text-emerald-300" />
                    Added to Bag
                  </span>
                ) : isOutOfStock ? (
                  'Out of Stock'
                ) : (
                  `Add to Bag — ${formatPrice(currentPrice * quantity)}`
                )}
              </Button>
            </div>

            <p className="text-[11px] text-center text-text-secondary">
              Cash on Delivery Available • Free Delivery Over PKR 5,000
            </p>
          </div>

          {/* Trust Guarantees */}
          <div className="rounded-xl border border-border bg-bg-secondary p-4 space-y-2.5 text-xs text-text-secondary">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-brand shrink-0" />
              <span>Delivers in 3–5 business days via tracked express courier.</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand shrink-0" />
              <span>Pay cash upon delivery at your doorstep with verified parcel inspection.</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-brand shrink-0" />
              <span>3-day size exchange guarantee if your bangles don&apos;t fit perfectly.</span>
            </div>
          </div>

          {/* Collapsible Accordions */}
          <div className="divide-y divide-border border-t border-border pt-2 text-xs">
            {/* 1. Specs */}
            <div className="py-3">
              <button
                type="button"
                onClick={() => toggleAccordion('specs')}
                className="flex w-full items-center justify-between font-semibold text-text-primary text-left"
              >
                <span>Product Details & Craftsmanship</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    openAccordion === 'specs' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordion === 'specs' && (
                <div className="pt-2 text-text-secondary space-y-1.5 leading-relaxed">
                  <p>{product.description}</p>
                  <p>
                    <strong className="text-text-primary">SKU:</strong>{' '}
                    {selectedVariant?.sku || 'GN-HANDCRAFTED'}
                  </p>
                  <p>
                    <strong className="text-text-primary">Base Material:</strong> Solid Brass with 24K Micron Gold Finishing
                  </p>
                </div>
              )}
            </div>

            {/* 2. Care */}
            <div className="py-3">
              <button
                type="button"
                onClick={() => toggleAccordion('care')}
                className="flex w-full items-center justify-between font-semibold text-text-primary text-left"
              >
                <span>Care Instructions</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    openAccordion === 'care' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordion === 'care' && (
                <div className="pt-2 text-text-secondary space-y-1 leading-relaxed">
                  <p>• Avoid contact with perfumes, lotions, and chlorinated water.</p>
                  <p>• Wipe gently with a soft microfibre cloth after wearing.</p>
                  <p>• Store in the provided velvet jewellery box away from humidity.</p>
                </div>
              )}
            </div>

            {/* 3. Shipping */}
            <div className="py-3">
              <button
                type="button"
                onClick={() => toggleAccordion('shipping')}
                className="flex w-full items-center justify-between font-semibold text-text-primary text-left"
              >
                <span>Delivery & Return Policy</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    openAccordion === 'shipping' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordion === 'shipping' && (
                <div className="pt-2 text-text-secondary space-y-1 leading-relaxed">
                  <p>• Standard delivery across Pakistan: PKR 250 flat rate.</p>
                  <p>• Free shipping automatically applies on all orders above PKR 5,000.</p>
                  <p>• Exchanges accepted within 3 days of delivery for unworn items.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-border pt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-2xl font-bold text-text-primary">
              You May Also Admire
            </h2>
            <Link href="/shop" className="text-xs font-semibold text-brand hover:underline">
              View All Bangles &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((p) => (
              <div key={p.id} className="group">
                <Link href={`/shop/${p.slug}`} className="block">
                  <div className="aspect-square rounded-xl bg-bg-secondary border border-border p-4 flex flex-col items-center justify-center text-center transition-all group-hover:border-gold mb-2">
                    <Sparkles className="h-8 w-8 text-gold mb-1" />
                    <span className="text-xs font-medium text-text-primary line-clamp-1">
                      {p.name}
                    </span>
                  </div>
                  <h4 className="text-xs font-medium text-text-primary group-hover:text-brand line-clamp-1">
                    {p.name}
                  </h4>
                  <p className="text-xs font-semibold text-brand mt-0.5">
                    {formatPrice(p.variants?.[0]?.price_cents || 0)}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

