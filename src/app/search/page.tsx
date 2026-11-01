import React, { Suspense } from 'react';
import { getProducts } from '@/lib/db/products';
import ProductCard from '@/components/product/ProductCard';
import Container from '@/components/ui/Container';
import EmptyState from '@/components/ui/EmptyState';
import { Search, Gem } from 'lucide-react';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

async function SearchContent({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = (q || '').trim().toLowerCase();

  const allProducts = await getProducts();
  const results = query
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.short_description?.toLowerCase().includes(query) ||
          p.category?.name.toLowerCase().includes(query)
      )
    : [];

  return (
    <div className="py-12 sm:py-16">
      <Container size="xl">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h1 className="font-heading text-3xl font-bold text-text-primary mb-3">
            Search Our Bangles
          </h1>
          <form method="GET" action="/search" className="relative flex items-center">
            <input
              type="text"
              name="q"
              defaultValue={q || ''}
              placeholder="Search by bangle style, color, or collection (e.g. Kundan, Bridal, Rose)..."
              className="w-full rounded-full border border-border bg-bg-surface px-6 py-3.5 pl-12 text-xs text-text-primary focus:border-brand focus:outline-none shadow-xs"
            />
            <Search className="absolute left-4 h-4 w-4 text-text-secondary" />
            <button
              type="submit"
              className="absolute right-2 rounded-full bg-brand px-5 py-2 text-xs font-semibold text-text-inverse hover:bg-brand-hover transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {query && (
          <div className="mb-8 border-b border-border pb-4 flex items-center justify-between text-xs text-text-secondary">
            <span>
              Search results for: <strong className="text-text-primary">&quot;{query}&quot;</strong>
            </span>
            <span>
              Found {results.length} {results.length === 1 ? 'piece' : 'pieces'}
            </span>
          </div>
        )}

        {query && results.length === 0 ? (
          <EmptyState
            title="No bangles matched your query"
            description={`We couldn't find any pieces matching "${query}". Try searching for Kundan, Velvet, Bridal, or Glass.`}
            actionLabel="View Full Catalog"
            actionHref="/shop"
            icon={<Gem className="h-10 w-10 text-gold" />}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {(query ? results : allProducts.slice(0, 4)).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default function SearchPage(props: SearchPageProps) {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-xs text-text-secondary">
          Searching bangles...
        </div>
      }
    >
      <SearchContent {...props} />
    </Suspense>
  );
}
