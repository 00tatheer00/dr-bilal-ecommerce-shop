'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { Check, Mail, Send, BellRing } from 'lucide-react';
import { testOrderEmailDispatch } from '@/actions/admin-email-test';

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState('GULNAAR by MK');
  const [tagline, setTagline] = useState('Handcrafted Luxury Bangles');
  const [supportPhone, setSupportPhone] = useState('0312-5880988');
  const [supportEmail, setSupportEmail] = useState('support@gulnaarbymk.com');
  const [ownerAlertEmail, setOwnerAlertEmail] = useState('admin@gulnaarbymk.com');
  const [flatDeliveryFee, setFlatDeliveryFee] = useState('250');
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState('5000');
  const [lowStockThreshold, setLowStockThreshold] = useState('3');
  const [saved, setSaved] = useState(false);

  // Email test state
  const [testingEmail, setTestingEmail] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleTestEmail = async () => {
    setTestingEmail(true);
    setTestResult(null);
    try {
      const res = await testOrderEmailDispatch(ownerAlertEmail);
      setTestResult({
        success: res.success,
        message: res.message || res.error || 'Test email completed.',
      });
    } catch {
      setTestResult({
        success: false,
        message: 'Failed to send test email. Check server logs.',
      });
    } finally {
      setTestingEmail(false);
    }
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

        {/* 3. Automatic 2-Way Order Email System */}
        <div className="rounded-xl border border-border bg-bg-primary p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="font-heading text-sm font-semibold text-text-primary flex items-center gap-2">
              <Mail className="h-4 w-4 text-brand" />
              3. Automatic 2-Way Order Email Dispatch
            </h2>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase">
              Active
            </span>
          </div>

          <p className="text-text-secondary text-xs leading-relaxed">
            Whenever a customer places an order on the website, <strong>2 automatic emails</strong> are immediately dispatched:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-3.5 rounded-lg border border-[#D4AF37]/30 bg-[#FAF9F6]">
              <span className="font-bold text-xs text-[#B81D4E] block mb-1">
                📧 Email 1: Customer Invoice
              </span>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                A designed luxury receipt sent to the customer with items ordered, sizing, totals, delivery address, and tracking link.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-[#B81D4E]/30 bg-[#FFF0F5]">
              <span className="font-bold text-xs text-[#B81D4E] flex items-center gap-1.5 mb-1">
                <BellRing className="h-3.5 w-3.5 text-[#B81D4E]" />
                🚨 Email 2: Website Owner Alert
              </span>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                An urgent notification to the store management team with customer details, WhatsApp quick-chat link, and direct button to open the order in the Admin Portal.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <label className="block font-semibold uppercase text-text-primary mb-1">
              Store Owner Alert Email Address
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="email"
                value={ownerAlertEmail}
                onChange={(e) => setOwnerAlertEmail(e.target.value)}
                placeholder="drbilalkhan@gmail.com"
                className="w-full sm:w-80 rounded border border-border bg-bg-surface px-3 py-2 text-text-primary focus:border-brand focus:outline-none"
              />
              <button
                type="button"
                onClick={handleTestEmail}
                disabled={testingEmail}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-brand bg-brand-light text-brand hover:bg-brand hover:text-white transition-colors font-semibold text-xs shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{testingEmail ? 'Dispatching Test...' : 'Send Test Order Alert'}</span>
              </button>
            </div>
            <span className="text-[10px] text-text-secondary mt-1 block">
              New order notifications will be routed to this inbox.
            </span>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-lg border text-xs font-medium ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {testResult.message}
            </div>
          )}
        </div>

        {/* Inventory Rules */}
        <div className="rounded-xl border border-border bg-bg-primary p-6 space-y-4 shadow-xs">
          <h2 className="font-heading text-sm font-semibold text-text-primary border-b border-border pb-2">
            4. Inventory & Low Stock Rules
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

