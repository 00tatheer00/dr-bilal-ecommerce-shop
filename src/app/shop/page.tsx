import React, { Suspense } from 'react';
import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/db/products';
import ProductCard from '@/components/product/ProductCard';
import Container from '@/components/ui/Container';
import EmptyState from '@/components/ui/EmptyState';
import { SlidersHorizontal, Sparkles, X } from 'lucide-react';

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    size?: string;
    search?: string;
  }>;
}

async function ShopContent({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const currentCategory = params.category || '';
  const currentSort = params.sort || 'featured';
  const currentSize = params.size || '';
  const currentSearch = (params.search || '').toLowerCase().trim();

  const categories = await getCategories();
  let products = await getProducts();

  // 1. Filter by category
  if (currentCategory) {
    products = products.filter((p) => p.category?.slug === currentCategory);
  }

  // 2. Filter by search
  if (currentSearch) {
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(currentSearch) ||
        p.description?.toLowerCase().includes(currentSearch) ||
        p.short_description?.toLowerCase().includes(currentSearch)
    );
  }

  // 3. Filter by bangle size
  if (currentSize) {
    products = products.filter((p) =>
      p.variants?.some((v) => v.size === currentSize)
    );
  }

  // 4. Sort
  if (currentSort === 'price-low') {
    products.sort((a, b) => {
      const pA = Math.min(...(a.variants?.map((v) => v.price_cents) || [0]));
      const pB = Math.min(...(b.variants?.map((v) => v.price_cents) || [0]));
      return pA - pB;
    });
  } else if (currentSort === 'price-high') {
    products.sort((a, b) => {
      const pA = Math.min(...(a.variants?.map((v) => v.price_cents) || [0]));
      const pB = Math.min(...(b.variants?.map((v) => v.price_cents) || [0]));
      return pB - pA;
    });
  } else if (currentSort === 'newest') {
    products.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  const sizes = ['2.4', '2.6', '2.8'];

  const createQueryUrl = (newParams: Record<string, string | undefined>) => {
    const combined = {
      category: currentCategory || undefined,
      sort: currentSort !== 'featured' ? currentSort : undefined,
      size: currentSize || undefined,
      search: currentSearch || undefined,
      ...newParams,
    };
    const searchString = Object.entries(combined)
      .filter(([, v]) => Boolean(v))
      .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
      .join('&');
    return `/shop${searchString ? `?${searchString}` : ''}`;
  };

  const hasActiveFilters = Boolean(currentCategory || currentSize || currentSearch);

  return (
    <div className="py-8 sm:py-12">
      <Container size="xl">
        {/* Header Breadcrumb & Title */}
        <div className="border-b border-border pb-6 mb-8">
          <div className="text-xs text-text-secondary mb-2 flex items-center gap-1.5">
            <Link href="/" className="hover:text-brand">
              Home
            </Link>
            <span>/</span>
            <span className="text-text-primary font-medium">Bangle Catalog</span>
            {currentCategory && (
              <>
                <span>/</span>
                <span className="text-brand capitalize">
                  {categories.find((c) => c.slug === currentCategory)?.name || currentCategory}
                </span>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary">
                {currentCategory
                  ? categories.find((c) => c.slug === currentCategory)?.name
                  : 'All Handcrafted Bangles'}
              </h1>
              <p className="text-xs text-text-secondary mt-1">
                Showing {products.length} {products.length === 1 ? 'piece' : 'pieces'}
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-secondary hidden sm:inline">Sort by:</span>
              <div className="flex items-center rounded-lg border border-border bg-bg-surface px-3 py-1.5 text-xs text-text-primary">
                <SlidersHorizontal className="h-3.5 w-3.5 mr-2 text-text-secondary" />
                <a
                  href={createQueryUrl({
                    sort:
                      currentSort === 'featured'
                        ? 'price-low'
                        : currentSort === 'price-low'
                        ? 'price-high'
                        : currentSort === 'price-high'
                        ? 'newest'
                        : 'featured',
                  })}
                  className="font-medium hover:text-brand"
                >
                  {currentSort === 'featured' && 'Featured'}
                  {currentSort === 'price-low' && 'Price: Low to High'}
                  {currentSort === 'price-high' && 'Price: High to Low'}
                  {currentSort === 'newest' && 'Newest Arrivals'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Link
              href={createQueryUrl({ category: undefined })}
              className={`rounded-full px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                !currentCategory
                  ? 'bg-brand text-text-inverse shadow-xs'
                  : 'bg-bg-surface text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
              }`}
            >
              All Pieces
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={createQueryUrl({ category: c.slug })}
                className={`rounded-full px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                  currentCategory === c.slug
                    ? 'bg-brand text-text-inverse shadow-xs'
                    : 'bg-bg-surface text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-text-secondary mr-1">Bangle Size:</span>
            {sizes.map((s) => (
              <Link
                key={s}
                href={createQueryUrl({ size: currentSize === s ? undefined : s })}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors border ${
                  currentSize === s
                    ? 'border-brand bg-brand text-text-inverse'
                    : 'border-border bg-bg-surface text-text-primary hover:border-gold'
                }`}
              >
                {s}
              </Link>
            ))}
            <Link
              href="/size-guide"
              className="text-[11px] text-brand underline ml-2 hover:text-brand-hover"
            >
              Size Guide
            </Link>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-2 pt-2 border-t border-border/60">
              <span className="text-xs text-text-secondary">Active filters:</span>
              {currentCategory && (
                <Link
                  href={createQueryUrl({ category: undefined })}
                  className="inline-flex items-center gap-1 rounded-full bg-brand-light px-2.5 py-1 text-xs text-brand hover:bg-brand hover:text-text-inverse transition-colors"
                >
                  Category: {currentCategory}
                  <X className="h-3 w-3" />
                </Link>
              )}
              {currentSize && (
                <Link
                  href={createQueryUrl({ size: undefined })}
                  className="inline-flex items-center gap-1 rounded-full bg-brand-light px-2.5 py-1 text-xs text-brand hover:bg-brand hover:text-text-inverse transition-colors"
                >
                  Size: {currentSize}
                  <X className="h-3 w-3" />
                </Link>
              )}
              {currentSearch && (
                <Link
                  href={createQueryUrl({ search: undefined })}
                  className="inline-flex items-center gap-1 rounded-full bg-brand-light px-2.5 py-1 text-xs text-brand hover:bg-brand hover:text-text-inverse transition-colors"
                >
                  Search: &quot;{currentSearch}&quot;
                  <X className="h-3 w-3" />
                </Link>
              )}
              <Link
                href="/shop"
                className="text-xs text-text-secondary underline hover:text-error ml-2"
              >
                Clear all
              </Link>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <EmptyState
            title="No bangles matched your filter"
            description="Try clearing your selected sizes or categories to view our complete collection."
            actionLabel="Reset All Filters"
            actionHref="/shop"
            icon={<Sparkles className="h-10 w-10 text-gold" />}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default function ShopPage(props: ShopPageProps) {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-xs text-text-secondary">
          Loading bangles catalog...
        </div>
      }
    >
      <ShopContent {...props} />
    </Suspense>
  );
}
