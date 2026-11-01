'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { Check } from 'lucide-react';

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState('GULNAAR by MK');
  const [tagline, setTagline] = useState('Handcrafted Luxury Bangles');
  const [supportPhone, setSupportPhone] = useState('+92 300 0000000');
  const [supportEmail, setSupportEmail] = useState('support@gulnaarbymk.com');
  const [flatDeliveryFee, setFlatDeliveryFee] = useState('250');
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState('5000');
  const [lowStockThreshold, setLowStockThreshold] = useState('3');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="font-heading text-2xl font-bold text-text-primary">
          Store & Delivery Settings
        </h1>
        <p className="text-xs text-text-secondary mt-0.5">
          Configure business rules, customer contact channels, and nationwide courier rates.
        </p>
      </div>

      {saved && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-800 flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-600" />
          <span>Store settings saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* General Store Identity */}
        <div className="rounded-xl border border-border bg-bg-primary p-6 space-y-4 shadow-xs">
          <h2 className="font-heading text-sm font-semibold text-text-primary border-b border-border pb-2">
            1. Brand & Contact Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase text-text-primary mb-1">
                Store Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full rounded border border-border bg-bg-surface px-3 py-2 text-text-primary font-medium focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase text-text-primary mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full rounded border border-border bg-bg-surface px-3 py-2 text-text-primary focus:border-brand focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase text-text-primary mb-1">
                Customer Care WhatsApp
              </label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full rounded border border-border bg-bg-surface px-3 py-2 font-mono text-text-primary focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase text-text-primary mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full rounded border border-border bg-bg-surface px-3 py-2 text-text-primary focus:border-brand focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Courier & Shipping Rules */}
        <div className="rounded-xl border border-border bg-bg-primary p-6 space-y-4 shadow-xs">
          <h2 className="font-heading text-sm font-semibold text-text-primary border-b border-border pb-2">
            2. Delivery & Free Shipping Rules (PKR)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase text-text-primary mb-1">
                Standard Courier Delivery Fee (PKR)
              </label>
              <input
                type="number"
                value={flatDeliveryFee}
                onChange={(e) => setFlatDeliveryFee(e.target.value)}
                className="w-full rounded border border-border bg-bg-surface px-3 py-2 font-semibold text-brand focus:border-brand focus:outline-none"
              />
              <span className="text-[10px] text-text-secondary mt-1 block">
                Standard flat rate charged across Pakistan.
              </span>
            </div>

            <div>
              <label className="block font-semibold uppercase text-text-primary mb-1">
                Free Delivery Threshold (PKR)
              </label>
              <input
                type="number"
                value={freeDeliveryThreshold}
                onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
                className="w-full rounded border border-border bg-bg-surface px-3 py-2 font-semibold text-brand focus:border-brand focus:outline-none"
              />
              <span className="text-[10px] text-text-secondary mt-1 block">
                Orders equal or exceeding this subtotal receive free delivery.
              </span>
            </div>
          </div>
        </div>

        {/* Inventory Rules */}
        <div className="rounded-xl border border-border bg-bg-primary p-6 space-y-4 shadow-xs">
          <h2 className="font-heading text-sm font-semibold text-text-primary border-b border-border pb-2">
            3. Inventory & Low Stock Rules
          </h2>

          <div className="max-w-xs">
            <label className="block font-semibold uppercase text-text-primary mb-1">
              Default Low Stock Warning Threshold (Sets)
            </label>
            <input
              type="number"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(e.target.value)}
              className="w-full rounded border border-border bg-bg-surface px-3 py-2 font-semibold text-text-primary focus:border-brand focus:outline-none"
            />
            <span className="text-[10px] text-text-secondary mt-1 block">
              Triggers warning badge when variant stock drops below this number.
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="md" className="shadow-sm">
            Save Store Settings
          </Button>
        </div>
      </form>
    </div>
  );
}

