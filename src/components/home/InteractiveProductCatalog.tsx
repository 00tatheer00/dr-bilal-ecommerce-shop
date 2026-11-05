'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import type { Product, Category } from '@/types';
import { ArrowRight, Gem } from 'lucide-react';

interface InteractiveProductCatalogProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function InteractiveProductCatalog({
  initialProducts,
  categories,
}: InteractiveProductCatalogProps) {
  const [activeTab, setActiveTab] = useState<string>('all');

  // Filter tabs list
  const tabs = useMemo(() => {
    return [
      { id: 'all', label: 'All Bangles', count: initialProducts.length },
      ...categories.map((c) => ({
        id: c.slug,
        label: c.name,
        count: initialProducts.filter((p) => p.category?.slug === c.slug).length,
      })),
      {
        id: 'under-3000',
        label: 'Under Rs 3,000',
        count: initialProducts.filter((p) => {
          const minPrice = p.variants?.reduce(
            (min, v) => (v.price_cents < min ? v.price_cents : min),
            Infinity
          );
          return minPrice && minPrice <= 300000;
        }).length,
      },
    ];
  }, [initialProducts, categories]);

  // Filtered products based on active tab
  const filteredProducts = useMemo(() => {
    if (activeTab === 'all') {
      return initialProducts;
    }
    if (activeTab === 'under-3000') {
      return initialProducts.filter((p) => {
        const minPrice = p.variants?.reduce(
          (min, v) => (v.price_cents < min ? v.price_cents : min),
          Infinity
        );
        return minPrice && minPrice <= 300000;
      });
    }
    return initialProducts.filter((p) => p.category?.slug === activeTab);
  }, [initialProducts, activeTab]);

  return (
    <section aria-label="Interactive Product Catalog" className="w-full bg-[#FFFFFF] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & View All Link */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B81D4E] mb-1">
              <Gem className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>Trending Jewellery Catalog</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary tracking-tight">
              Featured Bangle Collections
            </h2>
          </div>

          <Link
            href="/shop"
            prefetch={true}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#B81D4E] hover:text-[#8E0E3B] group"
          >
            <span>View All ({initialProducts.length})</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Scrollable Filter Tabs (Mobile-First Touch Snap) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#B81D4E] to-[#8E0E3B] text-white shadow-md ring-1 ring-[#F6D365]/50 scale-102'
                    : 'bg-[#FFF9FB] text-text-secondary hover:text-[#B81D4E] hover:bg-[#FFF0F5] border border-[#F0DFE7]'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-black/5 text-text-secondary'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 2-Column Mobile / 4-Column Desktop Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 mt-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center rounded-2xl bg-[#FAF9F6] border border-dashed border-[#E8E5DF] mt-6">
            <Gem className="h-8 w-8 text-[#D4AF37] mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-text-primary">
              No products found in this category
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className="mt-3 text-xs font-bold text-[#B81D4E] hover:underline cursor-pointer"
            >
              Reset to All Bangles
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

