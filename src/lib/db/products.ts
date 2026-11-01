import { createClient } from '@/lib/supabase/server';
import { sampleProducts, sampleCategories } from '@/lib/sample-data';
import type { Product, Category } from '@/types';

/**
 * Fetch all active categories
 */
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();

  if (supabase) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return data.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description,
          image_url: c.image_path,
          sort_order: c.sort_order,
          is_active: c.is_active,
          created_at: c.created_at,
          updated_at: c.updated_at,
        }));
      }
    } catch {
      // Fallback on connection failure
    }
  }

  return sampleCategories;
}

/**
 * Fetch active products with joined categories and variants
 */
export async function getProducts(options?: {
  categoryId?: string;
  categorySlug?: string;
  isFeatured?: boolean;
  limit?: number;
}): Promise<Product[]> {
  const supabase = await createClient();

  if (supabase) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = (supabase as any)
        .from('products')
        .select(
          `
          *,
          category:categories(*),
          images:product_images(*),
          variants:product_variants(*)
        `
        )
        .eq('status', 'active');

      if (options?.isFeatured) {
        query = query.eq('is_featured', true);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let results = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          short_description: p.short_description,
          category_id: p.category_id,
          is_active: p.status === 'active',
          is_featured: p.is_featured,
          created_at: p.created_at,
          updated_at: p.updated_at,
          category: p.category
            ? {
                id: p.category.id,
                name: p.category.name,
                slug: p.category.slug,
                description: p.category.description,
                image_url: p.category.image_path,
                sort_order: p.category.sort_order,
                is_active: p.category.is_active,
                created_at: p.category.created_at,
                updated_at: p.category.updated_at,
              }
            : undefined,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          images: p.images?.map((img: any) => ({
            id: img.id,
            product_id: img.product_id,
            url: img.storage_path,
            alt_text: img.alt_text,
            sort_order: img.sort_order,
            is_primary: img.is_primary,
            created_at: img.created_at,
          })),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          variants: p.variants?.map((v: any) => ({
            id: v.id,
            product_id: v.product_id,
            sku: v.sku,
            size: v.size,
            color: v.color,
            color_hex: v.color_hex,
            price_cents: v.price_minor,
            compare_at_price_cents: v.compare_at_price_minor,
            stock_quantity: v.stock_quantity,
            low_stock_threshold: v.low_stock_threshold,
            is_active: v.is_active,
            created_at: v.created_at,
            updated_at: v.updated_at,
          })),
        }));

        if (options?.categorySlug) {
          results = results.filter((p: Product) => p.category?.slug === options.categorySlug);
        }

        return results;
      }
    } catch {
      // Fallback on connection failure
    }
  }

  // Fallback to sample data
  let filtered = [...sampleProducts];
  if (options?.isFeatured) {
    filtered = filtered.filter((p) => p.is_featured);
  }
  if (options?.categorySlug) {
    const category = sampleCategories.find((c) => c.slug === options.categorySlug);
    if (category) {
      filtered = filtered.filter((p) => p.category_id === category.id);
    }
  }
  if (options?.limit) {
    filtered = filtered.slice(0, options.limit);
  }
  return filtered;
}

/**
 * Fetch a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();

  if (supabase) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('products')
        .select(
          `
          *,
          category:categories(*),
          images:product_images(*),
          variants:product_variants(*)
        `
        )
        .eq('slug', slug)
        .eq('status', 'active')
        .single();

      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          slug: data.slug,
          description: data.description,
          short_description: data.short_description,
          category_id: data.category_id,
          is_active: data.status === 'active',
          is_featured: data.is_featured,
          created_at: data.created_at,
          updated_at: data.updated_at,
          category: data.category
            ? {
                id: data.category.id,
                name: data.category.name,
                slug: data.category.slug,
                description: data.category.description,
                image_url: data.category.image_path,
                sort_order: data.category.sort_order,
                is_active: data.category.is_active,
                created_at: data.category.created_at,
                updated_at: data.category.updated_at,
              }
            : undefined,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          images: data.images?.map((img: any) => ({
            id: img.id,
            product_id: img.product_id,
            url: img.storage_path,
            alt_text: img.alt_text,
            sort_order: img.sort_order,
            is_primary: img.is_primary,
            created_at: img.created_at,
          })),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          variants: data.variants?.map((v: any) => ({
            id: v.id,
            product_id: v.product_id,
            sku: v.sku,
            size: v.size,
            color: v.color,
            color_hex: v.color_hex,
            price_cents: v.price_minor,
            compare_at_price_cents: v.compare_at_price_minor,
            stock_quantity: v.stock_quantity,
            low_stock_threshold: v.low_stock_threshold,
            is_active: v.is_active,
            created_at: v.created_at,
            updated_at: v.updated_at,
          })),
        };
      }
    } catch {
      // Fallback
    }
  }

  const found = sampleProducts.find((p) => p.slug === slug);
  return found || null;
}
