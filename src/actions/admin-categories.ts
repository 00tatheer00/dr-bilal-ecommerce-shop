'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAdminSession } from '@/actions/admin-auth';
import { sampleCategories } from '@/lib/sample-data';
import { slugify } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import type { Category } from '@/types';

export interface CategoryResult {
  success: boolean;
  error?: string;
}

/**
 * Fetch all categories for admin management
 */
export async function getAdminCategories(): Promise<Category[]> {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    throw new Error('Unauthorized');
  }

  const client = createAdminClient() || (await createClient());
  if (client) {
    try {
      const { data, error } = await (client as any)
        .from('categories')
        .select('*')
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
      // Fallback
    }
  }

  return sampleCategories;
}

/**
 * Create a new category
 */
export async function createAdminCategory(data: {
  name: string;
  slug?: string;
  description?: string;
  sortOrder?: number;
}): Promise<CategoryResult> {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    return { success: false, error: 'Unauthorized.' };
  }

  const cleanSlug = data.slug?.trim() ? slugify(data.slug) : slugify(data.name);

  const adminClient = createAdminClient();
  if (adminClient) {
    try {
      const { error } = await (adminClient as any).from('categories').insert({
        name: data.name.trim(),
        slug: cleanSlug,
        description: data.description || null,
        sort_order: data.sortOrder || 0,
        is_active: true,
      });

      if (error) return { success: false, error: error.message };
      revalidatePath('/admin/categories');
      revalidatePath('/shop');
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Error creating category.' };
    }
  }

  revalidatePath('/admin/categories');
  return { success: true };
}

/**
 * Toggle active state of category
 */
export async function toggleCategoryActive(id: string, currentStatus: boolean): Promise<CategoryResult> {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    return { success: false, error: 'Unauthorized.' };
  }

  const adminClient = createAdminClient();
  if (adminClient) {
    try {
      const { error } = await (adminClient as any)
        .from('categories')
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) return { success: false, error: error.message };
      revalidatePath('/admin/categories');
      revalidatePath('/shop');
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Error updating category.' };
    }
  }

  return { success: true };
}
