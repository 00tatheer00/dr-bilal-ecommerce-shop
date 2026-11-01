import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts, getCategories } from '@/lib/db/products';
import ProductCard from '@/components/product/ProductCard';
import Container from '@/components/ui/Container';
import EmptyState from '@/components/ui/EmptyState';
import { SlidersHorizontal, Sparkles, X, Crown } from 'lucide-react';

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    size?: string;
    search?: string;
  }>;
}

const CATEGORY_BANNERS: Record<string, { image: string; tag: string; title: string; desc: string }> = {
  bridal: {
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1600&auto=format&fit=crop&q=85',
    tag: 'Royal Bridal Trousseau',
    title: 'Bridal Kangan Sets',
    desc: 'Exquisite 24K gold-dipped Kundan bangles, seed pearl kangans, and heritage bridal stacks designed for your sacred wedding ceremonies.',
  },
  everyday: {
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1600&auto=format&fit=crop&q=85',
    tag: 'Effortless Charm',
    title: 'Everyday Elegance',
    desc: 'Featherlight silk thread bangles, polished glass bangles, and everyday metallic accents crafted for all-day comfort.',
  },
  statement: {
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1600&auto=format&fit=crop&q=85',
    tag: 'Head-Turning Silhouettes',
    title: 'Statement Pieces & Kadas',
    desc: 'Intricate brass filigree, openable royal kadas, and architectural bangle designs crafted for celebratory evenings.',
  },
  'kundan-meenakari': {
    image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1600&auto=format&fit=crop&q=85',
    tag: 'Vibrant Heritage Art',
    title: 'Kundan & Meenakari Artistry',
    desc: 'Centuries-old enamel painting and hand-set uncut stones showcasing the true soul of South Asian jewelry craft.',
  },
};

const DEFAULT_BANNER = {
  image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1600&auto=format&fit=crop&q=85',
  tag: '✦ Complete Handcrafted Catalog',
  title: 'Artisanal Bangles Collection',
  desc: 'Discover our full ensemble of handmade bridal sets, silk thread creations, and statement kadas — lovingly shaped in Lahore.',
};

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
  const banner = CATEGORY_BANNERS[currentCategory] || DEFAULT_BANNER;

  return (
    <div className="pb-16 sm:pb-24">
      {/* 1. SHOP HERO BANNER WITH VIBRANT BANGLES PHOTOGRAPHY */}
      <section className="relative overflow-hidden mb-10 min-h-[300px] sm:min-h-[360px] flex items-center">
        <Image
          src={banner.image}
          alt={banner.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A2E]/95 via-[#1A1A2E]/80 to-[#8B1A4A]/50" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4A017] via-[#8B1A4A] to-[#D4A017]" />

        <Container size="xl" className="relative z-10 py-12">
          {/* Breadcrumb */}
          <div className="text-xs text-white/70 mb-3 flex items-center gap-2">
            <Link href="/" className="hover:text-[#F0D060] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#F0D060] transition-colors">
              Catalog
            </Link>
            {currentCategory && (
              <>
                <span>/</span>
                <span className="text-[#F0D060] font-semibold capitalize">
                  {categories.find((c) => c.slug === currentCategory)?.name || currentCategory}
                </span>
              </>
            )}
          </div>

          <div className="max-w-2xl text-white space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-[#F0D060] border border-white/20">
              <Crown className="h-3.5 w-3.5" />
              {banner.tag}
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              {banner.title}
            </h1>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
              {banner.desc}
            </p>
          </div>
        </Container>
      </section>

      <Container size="xl">
        {/* Filter and Controls Bar */}
        <div className="space-y-5 mb-10">
          {/* Categories Pill Scroller */}
          <div className="flex items-center justify-between gap-4 flex-wrap border-b border-border pb-5">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <Link
                href={createQueryUrl({ category: undefined })}
                className={`rounded-full px-5 py-2.5 text-xs font-bold whitespace-nowrap transition-all shadow-xs ${
                  !currentCategory
                    ? 'bg-gradient-to-r from-[#8B1A4A] to-[#6D1038] text-white shadow-md ring-2 ring-[#D4A017]/40'
                    : 'bg-white text-text-primary hover:bg-[#FFF3E6] border border-border hover:border-[#D4A017]'
                }`}
              >
                All Bangles
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={createQueryUrl({ category: c.slug })}
                  className={`rounded-full px-5 py-2.5 text-xs font-bold whitespace-nowrap transition-all shadow-xs ${
                    currentCategory === c.slug
                      ? 'bg-gradient-to-r from-[#8B1A4A] to-[#6D1038] text-white shadow-md ring-2 ring-[#D4A017]/40'
                      : 'bg-white text-text-primary hover:bg-[#FFF3E6] border border-border hover:border-[#D4A017]'
                  }`}
                >
                  {c.name}
                </Link>
              ))}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-secondary font-medium hidden sm:inline">Sort:</span>
              <div className="flex items-center rounded-xl border border-[#D4A017]/30 bg-white px-3.5 py-2 text-xs text-text-primary shadow-xs">
                <SlidersHorizontal className="h-3.5 w-3.5 mr-2 text-[#D4A017]" />
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
                  className="font-bold text-brand hover:text-brand-hover"
                >
                  {currentSort === 'featured' && 'Featured'}
                  {currentSort === 'price-low' && 'Price: Low to High'}
                  {currentSort === 'price-high' && 'Price: High to Low'}
                  {currentSort === 'newest' && 'Newest Arrivals'}
                </a>
              </div>
            </div>
          </div>

          {/* Sizes Row & Active Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-text-primary mr-1">Wrist Size:</span>
              {sizes.map((s) => (
                <Link
                  key={s}
                  href={createQueryUrl({ size: currentSize === s ? undefined : s })}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all border ${
                    currentSize === s
                      ? 'border-[#D4A017] bg-[#8B1A4A] text-white shadow-sm ring-2 ring-[#D4A017]/40 scale-105'
                      : 'border-border bg-white text-text-primary hover:border-[#D4A017]'
                  }`}
                >
                  {s}
                </Link>
              ))}
              <Link
                href="/size-guide"
                className="text-xs font-semibold text-brand underline ml-2 hover:text-[#D4A017] transition-colors"
              >
                Size Guide &rarr;
              </Link>
            </div>

            <p className="text-xs font-medium text-text-secondary">
              Showing <span className="font-bold text-brand">{products.length}</span> pieces
            </p>
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 pt-3 border-t border-border flex-wrap">
              <span className="text-xs text-text-secondary font-medium">Applied filters:</span>
              {currentCategory && (
                <Link
                  href={createQueryUrl({ category: undefined })}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#FCE4EC] border border-[#8B1A4A]/20 px-3 py-1 text-xs font-semibold text-brand hover:bg-brand hover:text-white transition-colors"
                >
                  Category: {currentCategory}
                  <X className="h-3 w-3" />
                </Link>
              )}
              {currentSize && (
                <Link
                  href={createQueryUrl({ size: undefined })}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#FCE4EC] border border-[#8B1A4A]/20 px-3 py-1 text-xs font-semibold text-brand hover:bg-brand hover:text-white transition-colors"
                >
                  Size: {currentSize}
                  <X className="h-3 w-3" />
                </Link>
              )}
              {currentSearch && (
                <Link
                  href={createQueryUrl({ search: undefined })}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#FCE4EC] border border-[#8B1A4A]/20 px-3 py-1 text-xs font-semibold text-brand hover:bg-brand hover:text-white transition-colors"
                >
                  Search: &quot;{currentSearch}&quot;
                  <X className="h-3 w-3" />
                </Link>
              )}
              <Link
                href="/shop"
                className="text-xs font-semibold text-text-secondary underline hover:text-brand ml-2"
              >
                Reset All
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
            icon={<Sparkles className="h-10 w-10 text-[#D4A017]" />}
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
