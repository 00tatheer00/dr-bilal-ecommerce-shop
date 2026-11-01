import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { Database } from '@/types/database';

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();

    return createServerClient<Database>(supabaseUrl, supabaseKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Server Component context
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // Server Component context
          }
        },
      },
    });
  } catch {
    // If next/headers is unavailable in current execution context
    const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
    return createSupabaseClient<Database>(supabaseUrl, supabaseKey);
  }
}
