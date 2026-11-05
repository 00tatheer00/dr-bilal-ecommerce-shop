'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/actions/admin-auth';
import Button from '@/components/ui/Button';
import { Crown, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginAdmin(formData);

    if (!result.success) {
      setError(result.error || 'Authentication failed.');
      setLoading(false);
    } else {
      router.push('/admin');
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-secondary px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-bg-primary p-8 shadow-md">
        <div className="text-center">
          <div className="relative mx-auto mb-3 h-20 w-20">
            <Image
              src="/images/logo-icon.png"
              alt="GULNAAR by MK"
              fill
              sizes="80px"
              className="object-contain drop-shadow-sm"
            />
          </div>
          <span className="font-heading text-2xl font-bold tracking-widest text-[#B81D4E] block">
            GULNAAR
          </span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-text-secondary font-medium">
            by MK • Admin Portal
          </span>
          <h2 className="mt-4 font-heading text-lg font-semibold text-text-primary">
            Store Management Sign In
          </h2>
          <p className="mt-1 text-xs text-text-secondary">
            Restricted to authorized store owners and administrators.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-error-light border border-error/30 p-3.5 text-xs text-error flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold uppercase tracking-wider text-text-primary mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              defaultValue="admin@gulnaarbymk.com"
              placeholder="admin@gulnaarbymk.com"
              className="w-full rounded-lg border border-border bg-bg-surface px-3.5 py-2.5 text-text-primary focus:border-brand focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-text-primary mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              defaultValue="gulnaar2026"
              placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-bg-surface px-3.5 py-2.5 text-text-primary focus:border-brand focus:outline-none"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} className="mt-2 h-11">
            Access Dashboard
          </Button>
        </form>

        <div className="border-t border-border pt-4 text-center text-[11px] text-text-secondary">
          <p className="flex items-center justify-center gap-1">
            <Crown className="h-3 w-3 text-gold" />
            Protected by Supabase Auth & Role-Level Access
          </p>
        </div>
      </div>
    </div>
  );
}

