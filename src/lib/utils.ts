// ============================================
// Format utilities for GULNAAR by MK
// ============================================

/**
 * Format price in cents to PKR display string
 * e.g., 890000 → "PKR 8,900"
 */
export function formatPrice(cents: number): string {
  const amount = cents / 100;
  return `PKR ${amount.toLocaleString('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

/**
 * Format date string to readable format
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date with time
 */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Generate a non-sequential order number
 * Format: GN-XXXXXX (6 alphanumeric chars)
 */
export function generateOrderNumber(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'GN-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Create a URL-friendly slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Get stock status label
 */
export function getStockStatus(quantity: number, threshold: number): {
  label: string;
  variant: 'success' | 'warning' | 'error';
} {
  if (quantity <= 0) {
    return { label: 'Out of Stock', variant: 'error' };
  }
  if (quantity <= threshold) {
    return { label: `Only ${quantity} Left`, variant: 'warning' };
  }
  return { label: 'In Stock', variant: 'success' };
}

/**
 * Get order status display info
 */
export function getOrderStatusInfo(status: string): {
  label: string;
  variant: 'default' | 'success' | 'warning' | 'error' | 'info' | 'brand';
} {
  const statusMap: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'error' | 'info' | 'brand' }> = {
    pending: { label: 'Pending', variant: 'warning' },
    confirmed: { label: 'Confirmed', variant: 'info' },
    processing: { label: 'Processing', variant: 'brand' },
    shipped: { label: 'Shipped', variant: 'info' },
    delivered: { label: 'Delivered', variant: 'success' },
    cancelled: { label: 'Cancelled', variant: 'error' },
  };
  return statusMap[status] || { label: status, variant: 'default' };
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
}

/**
 * cn — simple class name merge utility (no dependencies)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Get cheapest variant price for a product (in cents)
 */
export function getStartingPrice(product: { variants?: { price_cents: number }[] }): number {
  if (!product.variants || product.variants.length === 0) return 0;
  return Math.min(...product.variants.map((v) => v.price_cents));
}

/**
 * Check if product has a range of variant prices
 */
export function hasPriceRange(product: { variants?: { price_cents: number }[] }): boolean {
  if (!product.variants || product.variants.length <= 1) return false;
  const prices = product.variants.map((v) => v.price_cents);
  return Math.min(...prices) !== Math.max(...prices);
}

