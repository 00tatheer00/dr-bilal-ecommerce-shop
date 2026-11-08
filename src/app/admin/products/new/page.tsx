'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  createAdminProduct,
  updateAdminProduct,
  getAdminProductById,
  uploadAdminProductImage,
} from '@/actions/admin-products';
import Button from '@/components/ui/Button';
import {
  ArrowLeft,
  Plus,
  Trash2,
  AlertCircle,
  Upload,
  CheckCircle2,
} from 'lucide-react';

interface ImageItem {
  id: string;
  url: string;
  alt_text?: string;
  is_primary?: boolean;
}

function ProductFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(Boolean(editId));
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('11111111-1111-1111-1111-111111111111');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [material, setMaterial] = useState('24K Gold-dipped Brass, Kundan Stones');
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<'active' | 'draft' | 'archived'>('active');

  // Images State
  const [images, setImages] = useState<ImageItem[]>([
    {
      id: 'img-1',
      url: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&q=80&w=1000',
      alt_text: 'Handmade Bangle Set',
      is_primary: true,
    },
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Variants State
  const [variants, setVariants] = useState([
    { sku: 'GN-NEW-24', size: '2.4', color: 'Antique Gold', price: '8900', stock: '10' },
    { sku: 'GN-NEW-26', size: '2.6', color: 'Antique Gold', price: '8900', stock: '15' },
    { sku: 'GN-NEW-28', size: '2.8', color: 'Antique Gold', price: '8900', stock: '8' },
  ]);

  // Load existing product if in Edit mode
  useEffect(() => {
    if (!editId) return;

    let isMounted = true;
    async function loadProduct() {
      try {
        const prod = await getAdminProductById(editId!);
        if (prod && isMounted) {
          setName(prod.name);
          setSlug(prod.slug);
          if (prod.category_id) setCategoryId(prod.category_id);
          setShortDescription(prod.short_description || '');
          setDescription(prod.description || '');
          setMaterial(prod.material || '24K Gold-dipped Brass, Kundan Stones');
          setIsFeatured(Boolean(prod.is_featured));
          setStatus(prod.is_active ? 'active' : 'draft');

          if (prod.images && prod.images.length > 0) {
            setImages(
              prod.images.map((im) => ({
                id: im.id,
                url: im.url,
                alt_text: im.alt_text || prod.name,
                is_primary: im.is_primary,
              }))
            );
          }

          if (prod.variants && prod.variants.length > 0) {
            setVariants(
              prod.variants.map((v) => ({
                sku: v.sku,
                size: v.size || '2.6',
                color: v.color || 'Antique Gold',
                price: (v.price_cents / 100).toString(),
                stock: v.stock_quantity.toString(),
              }))
            );
          }
        }
      } catch {
        setError('Failed to load product details for editing.');
      } finally {
        if (isMounted) setFetchingProduct(false);
      }
    }

    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [editId]);

  const addVariantRow = () => {
    setVariants([
      ...variants,
      {
        sku: `GN-NEW-${variants.length + 1}`,
        size: '2.6',
        color: 'Antique Gold',
        price: '8900',
        stock: '10',
      },
    ]);
  };

  const removeVariantRow = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: string, value: string) => {
    const updated = [...variants];
    (updated[index] as any)[field] = value;
    setVariants(updated);
  };

  // Image Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      let uploadedUrl: string | null = null;
      let uploadError: string | null = null;

      // 1. Try fast streaming API route first
      try {
        const response = await fetch('/api/admin/upload-image', {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();
        if (result.success && result.url) {
          uploadedUrl = result.url;
        } else {
          uploadError = result.error || null;
        }
      } catch {
        // Fall through to server action
      }

      // 2. If API route didn't succeed, fallback to Server Action
      if (!uploadedUrl) {
        const res = await uploadAdminProductImage(formData);
        if (res.success && res.url) {
          uploadedUrl = res.url;
        } else {
          uploadError = uploadError || res.error || 'Upload failed.';
        }
      }

      if (uploadedUrl) {
        setImages((prev) => [
          ...prev,
          {
            id: `img-${Date.now()}`,
            url: uploadedUrl!,
            alt_text: name || 'Bangle Product Photo',
            is_primary: prev.length === 0,
          },
        ]);
        setSuccessMsg('Photo uploaded successfully to Supabase Storage!');
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setError(uploadError || 'Failed to upload photo. Please verify image is under 10MB.');
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred during image upload.');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setImages((prev) => [
      ...prev,
      {
        id: `img-${Date.now()}`,
        url: newImageUrl.trim(),
        alt_text: name || 'Bangle Photo',
        is_primary: prev.length === 0,
      },
    ]);
    setNewImageUrl('');
  };

  const removeImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const setPrimaryImage = (id: string) => {
    setImages(
      images.map((img) => ({
        ...img,
        is_primary: img.id === id,
      }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formattedVariants = variants.map((v) => ({
        sku: v.sku.trim().toUpperCase(),
        size: v.size || undefined,
        color: v.color || undefined,
        priceMinor: Math.round(parseFloat(v.price) * 100),
        stockQuantity: parseInt(v.stock, 10) || 0,
      }));

      const formattedImages = images.map((img) => ({
        url: img.url,
        altText: img.alt_text || name,
        isPrimary: img.is_primary,
      }));

      if (editId) {
        // Edit Mode: Update existing product + variants + images
        const res = await updateAdminProduct(editId, {
          name,
          slug: slug || undefined,
          categoryId,
          shortDescription,
          description,
          material,
          isFeatured,
          status,
          variants: formattedVariants,
          images: formattedImages,
        });

        if (!res.success) {
          setError(res.error || 'Failed to update product.');
          setLoading(false);
        } else {
          setSuccessMsg('Product, prices, stock & photos updated successfully!');
          setTimeout(() => {
            router.push('/admin/products');
            router.refresh();
          }, 1000);
        }
      } else {
        // Create Mode: Insert new product, variants & images
        const res = await createAdminProduct({
          name,
          slug: slug || undefined,
          categoryId,
          shortDescription,
          description,
          material,
          isFeatured,
          status,
          variants: formattedVariants,
          images: formattedImages,
        });

        if (!res.success) {
          setError(res.error || 'Failed to save product.');
          setLoading(false);
        } else {
          setSuccessMsg('New product published successfully!');
          setTimeout(() => {
            router.push('/admin/products');
            router.refresh();
          }, 1000);
        }
      }
    } catch {
      setError('An error occurred during submission.');
      setLoading(false);
    }
  };

  if (fetchingProduct) {
    return (
      <div className="py-20 text-center text-xs text-text-secondary">
        Loading product details for editing...
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-1.5 rounded-lg border border-border bg-bg-primary hover:bg-bg-surface text-text-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-heading text-xl font-bold text-text-primary">
              {editId ? `Edit Bangle: ${name || 'Design'}` : 'Add New Bangle Design'}
            </h1>
            <p className="text-xs text-text-secondary">
              {editId
                ? 'Update specifications, pricing, imagery, and variant inventory.'
                : 'Create a new handcrafted piece with size and finish variants.'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-error-light border border-error/30 p-3.5 text-xs text-error flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-300 p-3.5 text-xs text-emerald-800 flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* 1. Basic Product Info */}
        <div className="rounded-xl border border-border bg-bg-primary p-6 space-y-4 shadow-xs">
          <h2 className="font-heading text-sm font-semibold text-text-primary border-b border-border pb-2">
            1. Basic Design Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-text-primary mb-1">
                Bangle Title *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kundan Bridal Kangan Set"
                className="w-full rounded-lg border border-border bg-bg-surface px-3 py-2 text-text-primary focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-text-primary mb-1">
                URL Slug (Optional)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="auto-generated-if-blank"
                className="w-full rounded-lg border border-border bg-bg-surface px-3 py-2 text-text-primary font-mono focus:border-brand focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-text-primary mb-1">
                Collection Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-lg border border-border bg-bg-surface px-3 py-2 text-text-primary focus:border-brand focus:outline-none"
              >
                <option value="11111111-1111-1111-1111-111111111111">Bridal & Formal Kangan</option>
                <option value="22222222-2222-2222-2222-222222222222">Silk Thread Bangles</option>
                <option value="33333333-3333-3333-3333-333333333333">Velvet & Glass Chooriyan</option>
                <option value="44444444-4444-4444-4444-444444444444">Meenakari & Polki Classics</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-text-primary mb-1">
                Craftsmanship Material
              </label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g. 24K Gold-dipped Brass, Kundan Stones"
                className="w-full rounded-lg border border-border bg-bg-surface px-3 py-2 text-text-primary focus:border-brand focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-text-primary mb-1">
              Short Description (Card Teaser)
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Exquisite 4-piece kangan set handcrafted with intricate floral meenakari..."
              className="w-full rounded-lg border border-border bg-bg-surface px-3 py-2 text-text-primary focus:border-brand focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-text-primary mb-1">
              Full Description & Artisan Story
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the heritage craftsmanship, detailing, styling recommendations, and bridal pairing notes..."
              className="w-full rounded-lg border border-border bg-bg-surface px-3 py-2 text-text-primary focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        {/* 2. Product Imagery & Supabase Storage */}
        <div className="rounded-xl border border-border bg-bg-primary p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div>
              <h2 className="font-heading text-sm font-semibold text-text-primary">
                2. Product Photography
              </h2>
              <p className="text-[11px] text-text-secondary">
                Upload bangle photography directly to Supabase Storage or link CDN URLs.
              </p>
            </div>
          </div>

          {/* Current Images Gallery */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img) => (
              <div
                key={img.id}
                className="relative group rounded-lg border border-border bg-bg-surface overflow-hidden aspect-square flex items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.alt_text} className="h-full w-full object-cover" />
                {img.is_primary && (
                  <span className="absolute top-1.5 left-1.5 bg-brand text-white text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                    Primary
                  </span>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                  {!img.is_primary && (
                    <button
                      type="button"
                      onClick={() => setPrimaryImage(img.id)}
                      className="p-1 rounded bg-white text-text-primary text-[10px] font-semibold hover:bg-gold hover:text-white transition-colors"
                      title="Set as Primary Image"
                    >
                      Make Primary
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    className="p-1 rounded bg-error text-white hover:bg-red-700 transition-colors"
                    title="Remove Photo"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Direct Upload Tile */}
            <label className="border-2 border-dashed border-border hover:border-brand rounded-lg flex flex-col items-center justify-center p-4 cursor-pointer text-text-secondary hover:text-brand transition-colors aspect-square text-center">
              <Upload className="h-6 w-6 mb-1 text-gold" />
              <span className="text-[11px] font-semibold">
                {uploadingImage ? 'Uploading...' : 'Upload Photo'}
              </span>
              <span className="text-[9px] text-text-secondary mt-0.5">JPG, PNG, WebP</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
          </div>

          {/* External URL Entry */}
          <div className="flex gap-2 pt-2">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Or paste an image URL (e.g. https://...)"
              className="flex-1 rounded-lg border border-border bg-bg-surface px-3 py-1.5 text-xs text-text-primary focus:border-brand focus:outline-none"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddImageUrl}
              disabled={!newImageUrl.trim()}
            >
              Add URL
            </Button>
          </div>
        </div>

        {/* 3. Variant Matrix */}
        <div className="rounded-xl border border-border bg-bg-primary p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div>
              <h2 className="font-heading text-sm font-semibold text-text-primary">
                3. Bangle Size & Color Variants
              </h2>
              <p className="text-[11px] text-text-secondary">
                Configure unique SKUs, bangle diameter sizes, finishes, prices in PKR, and initial inventory.
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addVariantRow}
              className="gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Variant
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
                  <th className="pb-2">SKU Code *</th>
                  <th className="pb-2">Bangle Size</th>
                  <th className="pb-2">Finish / Color</th>
                  <th className="pb-2">Price (PKR) *</th>
                  <th className="pb-2">Initial Stock</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {variants.map((v, idx) => (
                  <tr key={idx} className="hover:bg-bg-surface/30">
                    <td className="py-2.5 pr-2">
                      <input
                        type="text"
                        required
                        value={v.sku}
                        onChange={(e) => updateVariant(idx, 'sku', e.target.value)}
                        className="w-28 rounded border border-border bg-bg-surface px-2 py-1 font-mono uppercase focus:border-brand focus:outline-none"
                      />
                    </td>
                    <td className="py-2.5 pr-2">
                      <select
                        value={v.size}
                        onChange={(e) => updateVariant(idx, 'size', e.target.value)}
                        className="w-20 rounded border border-border bg-bg-surface px-2 py-1 focus:border-brand focus:outline-none"
                      >
                        <option value="2.4">2.4 (Small)</option>
                        <option value="2.6">2.6 (Medium)</option>
                        <option value="2.8">2.8 (Large)</option>
                        <option value="2.10">2.10 (XL)</option>
                      </select>
                    </td>
                    <td className="py-2.5 pr-2">
                      <input
                        type="text"
                        value={v.color}
                        onChange={(e) => updateVariant(idx, 'color', e.target.value)}
                        placeholder="e.g. Gold"
                        className="w-28 rounded border border-border bg-bg-surface px-2 py-1 focus:border-brand focus:outline-none"
                      />
                    </td>
                    <td className="py-2.5 pr-2">
                      <input
                        type="number"
                        required
                        min="1"
                        value={v.price}
                        onChange={(e) => updateVariant(idx, 'price', e.target.value)}
                        className="w-24 rounded border border-border bg-bg-surface px-2 py-1 font-semibold focus:border-brand focus:outline-none"
                      />
                    </td>
                    <td className="py-2.5 pr-2">
                      <input
                        type="number"
                        required
                        min="0"
                        value={v.stock}
                        onChange={(e) => updateVariant(idx, 'stock', e.target.value)}
                        className="w-20 rounded border border-border bg-bg-surface px-2 py-1 focus:border-brand focus:outline-none"
                      />
                    </td>
                    <td className="py-2.5 text-right">
                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariantRow(idx)}
                          className="p-1 rounded text-text-secondary hover:text-error transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Visibility & Submit */}
        <div className="rounded-xl border border-border bg-bg-primary p-6 space-y-4 shadow-xs">
          <h2 className="font-heading text-sm font-semibold text-text-primary border-b border-border pb-2">
            4. Catalog Visibility
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-border text-brand focus:ring-brand"
                />
                <span className="font-semibold text-text-primary">Featured on Homepage</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-text-secondary font-semibold uppercase tracking-wider">
                  Status:
                </span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="rounded border border-border bg-bg-surface px-2.5 py-1 text-text-primary font-medium focus:border-brand focus:outline-none"
                >
                  <option value="active">Active (Published)</option>
                  <option value="draft">Draft (Hidden)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/admin/products">
                <Button type="button" variant="ghost" size="sm">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="primary" size="sm" disabled={loading}>
                {loading ? 'Saving...' : editId ? 'Update Bangle Design' : 'Publish Bangle Design'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function NewProductPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-xs text-text-secondary">
          Loading product editor...
        </div>
      }
    >
      <ProductFormContent />
    </Suspense>
  );
}
