'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit2, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { deleteAdminProduct } from '@/actions/admin-products';

interface Props {
  productId: string;
  productSlug: string;
  productName: string;
}

export default function ProductActions({ productId, productSlug, productName }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete "${productName}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await deleteAdminProduct(productId);
      if (!res.success) {
        alert(res.error || 'Failed to delete product.');
      } else {
        router.refresh();
      }
    } catch {
      alert('Error occurred while deleting product.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Link
        href={`/shop/${productSlug}`}
        target="_blank"
        className="inline-flex items-center gap-1 px-2 py-1 rounded border border-border bg-bg-surface hover:bg-bg-secondary text-[11px] text-text-secondary hover:text-text-primary transition-colors"
        title="View live in store"
      >
        <span>Store</span>
        <ExternalLink className="h-3 w-3" />
      </Link>

      <Link
        href={`/admin/products/new?edit=${productId}`}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#7A0C2E]/10 text-[#7A0C2E] hover:bg-[#7A0C2E] hover:text-white text-[11px] font-medium transition-colors"
        title="Edit product, prices, stock & photos"
      >
        <Edit2 className="h-3 w-3" />
        <span>Edit</span>
      </Link>

      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="inline-flex items-center justify-center p-1.5 rounded text-text-secondary/60 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
        title="Delete product"
      >
        {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

