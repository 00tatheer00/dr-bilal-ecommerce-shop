import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { Database } from '@/types/database';

const DEFAULT_SUPABASE_URL = 'https://gcicliwkftaocvfcsmhv.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjaWNsaXdrZnRhb2N2ZmNzbWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM1NDQzNzgsImV4cCI6MjEwOTEyMDM3OH0.pR0Xr5-ZGodmUanjLCab5iqzVWw9eIjB4r5Ovl6uMFM';

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

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
