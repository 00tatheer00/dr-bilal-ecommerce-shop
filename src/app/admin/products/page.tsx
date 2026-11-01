import React from 'react';
import Link from 'next/link';
import { getAdminProducts } from '@/actions/admin-products';
import { getAdminCategories } from '@/actions/admin-categories';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import {
  Plus,
  Search,
  Edit2,
  Sparkles,
} from 'lucide-react';

interface Props {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string;
  }>;
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const categories = await getAdminCategories();
  const products = await getAdminProducts({
    search: params.search,
    categorySlug: params.category,
    status: params.status,
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
            Products & Bangles
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Manage handcrafted bangle designs, pricing, and active catalog visibility.
          </p>
        </div>

        <Link href="/admin/products/new">
          <Button variant="primary" size="sm" className="gap-1.5 shadow-sm">
            <Plus className="h-4 w-4" />
            Add New Design
          </Button>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-xl border border-border bg-bg-primary p-4 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between text-xs">
        {/* Search */}
        <form method="GET" action="/admin/products" className="relative w-full md:w-80">
          <input
            type="text"
            name="search"
            defaultValue={params.search || ''}
            placeholder="Search by name, slug or SKU..."
            className="w-full rounded-lg border border-border bg-bg-surface px-3 py-2 pl-9 text-text-primary focus:border-brand focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-secondary" />
        </form>

        {/* Category & Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Link
            href="/admin/products"
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              !params.category && !params.status
                ? 'bg-brand text-text-inverse border-brand'
                : 'bg-bg-surface text-text-secondary border-border hover:bg-bg-secondary'
            }`}
          >
            All ({products.length})
          </Link>

          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/admin/products?category=${c.slug}`}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                params.category === c.slug
                  ? 'bg-brand text-text-inverse border-brand'
                  : 'bg-bg-surface text-text-secondary border-border hover:bg-bg-secondary'
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-xl border border-border bg-bg-primary shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-bg-secondary text-text-secondary uppercase tracking-wider font-semibold border-b border-border">
              <tr>
                <th className="p-3.5">Product Design</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Variants & SKUs</th>
                <th className="p-3.5">Starting Price</th>
                <th className="p-3.5">Total Stock</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-text-primary">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-secondary">
                    No bangle designs match your criteria.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const startingPrice = Math.min(
                    ...(product.variants?.map((v) => v.price_cents) || [0])
                  );
                  const totalStock =
                    product.variants?.reduce((sum, v) => sum + v.stock_quantity, 0) || 0;

                  return (
                    <tr key={product.id} className="hover:bg-bg-surface/40 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 rounded-lg bg-bg-secondary border border-border flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-gold" />
                          </div>
                          <div>
                            <span className="font-heading font-semibold text-sm block">
                              {product.name}
                            </span>
                            <span className="text-[11px] text-text-secondary font-mono">
                              /{product.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="rounded bg-bg-surface px-2 py-0.5 text-text-secondary">
                          {product.category?.name || 'Unassigned'}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-text-secondary">
                        {product.variants?.length || 0} variant(s)
                      </td>
                      <td className="p-3.5 font-semibold text-brand">
                        {formatPrice(startingPrice)}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`font-semibold ${
                            totalStock === 0
                              ? 'text-error'
                              : totalStock <= 5
                              ? 'text-amber-600'
                              : 'text-text-primary'
                          }`}
                        >
                          {totalStock} sets
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                            product.is_active
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-zinc-100 text-zinc-700'
                          }`}
                        >
                          {product.is_active ? 'Active' : 'Archived'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/shop/${product.slug}`}
                            target="_blank"
                            className="p-1.5 rounded hover:bg-bg-surface text-text-secondary hover:text-brand"
                            title="Preview on Store"
                          >
                            Preview
                          </Link>
                          <Link
                            href={`/admin/products/new?edit=${product.id}`}
                            className="p-1.5 rounded bg-brand-light text-brand hover:bg-brand hover:text-white transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

