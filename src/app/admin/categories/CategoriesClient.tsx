'use client';

import React, { useState } from 'react';
import { createAdminCategory, toggleCategoryActive } from '@/actions/admin-categories';
import type { Category } from '@/types';
import Button from '@/components/ui/Button';
import { Plus, X } from 'lucide-react';

interface Props {
  initialCategories: Category[];
}

export default function CategoriesClient({ initialCategories }: Props) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleActive = async (cat: Category) => {
    try {
      const res = await toggleCategoryActive(cat.id, cat.is_active);
      if (res.success) {
        setCategories((prev) =>
          prev.map((c) => (c.id === cat.id ? { ...c, is_active: !c.is_active } : c))
        );
      }
    } catch {
      // Ignore
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await createAdminCategory({
        name,
        slug: slug || undefined,
        description: description || undefined,
        sortOrder: parseInt(sortOrder, 10) || 0,
      });

      if (!res.success) {
        setError(res.error || 'Failed to create category.');
        setLoading(false);
      } else {
        setCategories([
          ...categories,
          {
            id: `cat-${Date.now()}`,
            name,
            slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
            description,
            image_url: null,
            sort_order: parseInt(sortOrder, 10) || 0,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
        setShowAddModal(false);
        setName('');
        setSlug('');
        setDescription('');
        setLoading(false);
      }
    } catch {
      setError('Error creating category.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary">
            Categories & Collections
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Organize handcrafted bangles into thematic collections for storefront navigation.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowAddModal(true)}
          className="gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-bg-primary shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-bg-secondary text-text-secondary uppercase tracking-wider font-semibold border-b border-border">
            <tr>
              <th className="p-3.5">Category Name</th>
              <th className="p-3.5">Slug</th>
              <th className="p-3.5">Description</th>
              <th className="p-3.5">Sort Order</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Toggle Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-text-primary">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-bg-surface/40 transition-colors">
                <td className="p-3.5 font-bold font-heading text-sm text-text-primary">
                  {c.name}
                </td>
                <td className="p-3.5 font-mono text-brand text-[11px]">
                  /{c.slug}
                </td>
                <td className="p-3.5 text-text-secondary max-w-xs truncate">
                  {c.description || 'No description'}
                </td>
                <td className="p-3.5 font-semibold">{c.sort_order}</td>
                <td className="p-3.5">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      c.is_active
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    {c.is_active ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(c)}
                    className="text-xs font-semibold text-brand hover:underline"
                  >
                    {c.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-border bg-bg-primary p-6 shadow-xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-heading font-bold text-base text-text-primary">
                Add New Category
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-text-secondary hover:bg-bg-surface"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {error && (
              <div className="rounded-lg bg-error-light border border-error/30 p-3 text-xs text-error">
                {error}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase text-text-primary mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Velvet & Zari Bangles"
                  className="w-full rounded border border-border bg-bg-surface px-3 py-2 text-text-primary focus:border-brand focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-text-primary mb-1">
                  Slug (URL identifier)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="velvet-zari-bangles"
                  className="w-full rounded border border-border bg-bg-surface px-3 py-2 font-mono text-text-primary focus:border-brand focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-text-primary mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Editorial description of this collection..."
                  className="w-full rounded border border-border bg-bg-surface px-3 py-2 text-text-primary focus:border-brand focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-text-primary mb-1">
                  Sort Display Order
                </label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full rounded border border-border bg-bg-surface px-3 py-2 font-semibold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" loading={loading}>
                  Save Category
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

