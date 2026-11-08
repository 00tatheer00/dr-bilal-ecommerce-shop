'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { submitGuestOrder } from '@/actions/checkout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import {
  ShieldCheck,
  Truck,
  ShoppingBag,
  ArrowLeft,
  AlertCircle,
  Copy,
  Check,
  Smartphone,
  Building2,
  Banknote,
  CheckCircle2,
} from 'lucide-react';

const FALLBACK_BANGLE_THUMBS = [
  'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=200&auto=format&fit=crop&q=80',
];

function getCheckoutItemImage(slug: string, primaryImage?: string): string {
  if (primaryImage && primaryImage.startsWith('http')) return primaryImage;
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash) + slug.charCodeAt(i);
    hash |= 0;
  }
  return FALLBACK_BANGLE_THUMBS[Math.abs(hash) % FALLBACK_BANGLE_THUMBS.length];
}

const PAKISTANI_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Larkana',
  'Sheikhupura',
  'Mardan',
  'Gujrat',
  'Other City',
];

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotalCents,
    deliveryFeeCents,
    totalCents,
    clearCart,
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('Lahore');
  const [province, setProvince] = useState('Punjab');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'easypaisa' | 'bank_transfer'>('easypaisa');
  const [paymentReference, setPaymentReference] = useState('');
  const [senderAccountName, setSenderAccountName] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldKey: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldKey);
      setTimeout(() => setCopiedField(null), 2500);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <Container size="md">
          <div className="w-16 h-16 rounded-full bg-brand-light text-brand mx-auto flex items-center justify-center mb-4">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-text-primary mb-2">
            Your Bag is Empty
          </h1>
          <p className="text-xs text-text-secondary mb-6">
            Please add bangles to your bag before proceeding to checkout.
          </p>
          <Link href="/shop">
            <Button variant="primary" size="md">
              Return to Catalog
            </Button>
          </Link>
        </Container>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setServerError(null);

    // Validate TRX ID if online payment selected
    if (paymentMethod === 'easypaisa' && !paymentReference.trim()) {
      setFormErrors({ paymentReference: 'Please enter your Easypaisa Transaction ID (TRX ID).' });
      return;
    }
    if (paymentMethod === 'bank_transfer' && !paymentReference.trim()) {
      setFormErrors({ paymentReference: 'Please enter your bank transfer reference or sender account name.' });
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customerName,
        customerPhone,
        customerEmail: customerEmail || undefined,
        addressLine1,
        addressLine2: addressLine2 || undefined,
        city,
        province,
        specialInstructions: specialInstructions || undefined,
        paymentMethod,
        paymentReference: paymentReference || undefined,
        senderAccountName: senderAccountName || undefined,
        items: items.map((i) => ({
          variantId: i.variant_id,
          quantity: i.quantity,
        })),
        idempotencyKey: `idemp_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      };

      const result = await submitGuestOrder(orderPayload);

      if (!result.success) {
        if (result.fieldErrors) {
          setFormErrors(result.fieldErrors);
        }
        setServerError(result.error || 'Unable to place order. Please check the form.');
        setLoading(false);
        return;
      }

      // Order created successfully! Clear bag and redirect to receipt screen
      clearCart();
      const queryParams = new URLSearchParams({
        token: result.trackingToken || '',
        method: paymentMethod,
        amount: totalCents.toString(),
      });
      if (paymentReference) {
        queryParams.set('ref', paymentReference);
      }
      const url = `/order-success/${result.orderNumber}?${queryParams.toString()}`;
      router.push(url);
    } catch {
      setServerError('A network error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="py-8 sm:py-14 bg-bg-secondary/40 border-b border-border min-h-screen">
      <Container size="xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Return to Bag
          </Link>

          <span className="text-xs text-text-secondary">
            Guest Checkout • No Account Required
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border bg-bg-primary p-6 sm:p-8 shadow-xs">
              <h1 className="font-heading text-2xl font-bold text-text-primary mb-1">
                Delivery Details
              </h1>
              <p className="text-xs text-text-secondary mb-6">
                Please provide your contact and address for Cash on Delivery.
              </p>

              {serverError && (
                <div className="mb-6 rounded-lg bg-error-light border border-error/30 p-4 text-xs text-error flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{serverError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* 1. Customer Name */}
                <div>
                  <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ayesha Malik"
                    className="w-full rounded-lg border border-border bg-bg-surface px-3.5 py-2.5 text-xs text-text-primary focus:border-brand focus:outline-none"
                  />
                  {formErrors.customerName && (
                    <p className="mt-1 text-[11px] text-error">{formErrors.customerName}</p>
                  )}
                </div>

                {/* 2. Phone & Email Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                      WhatsApp / Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="0300-1234567"
                      className="w-full rounded-lg border border-border bg-bg-surface px-3.5 py-2.5 text-xs text-text-primary focus:border-brand focus:outline-none"
                    />
                    <span className="text-[10px] text-text-secondary mt-1 block">
                      Required for delivery updates and dispatch call.
                    </span>
                    {formErrors.customerPhone && (
                      <p className="mt-1 text-[11px] text-error">{formErrors.customerPhone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="ayesha@example.com"
                      className="w-full rounded-lg border border-border bg-bg-surface px-3.5 py-2.5 text-xs text-text-primary focus:border-brand focus:outline-none"
                    />
                    <span className="text-[10px] text-text-secondary mt-1 block">
                      To receive a digital receipt.
                    </span>
                    {formErrors.customerEmail && (
                      <p className="mt-1 text-[11px] text-error">{formErrors.customerEmail}</p>
                    )}
                  </div>
                </div>

                {/* 3. Address Line 1 */}
                <div>
                  <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                    Street Address / House / Flat *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="House 42, Street 8, Sector Y, DHA Phase 3"
                    className="w-full rounded-lg border border-border bg-bg-surface px-3.5 py-2.5 text-xs text-text-primary focus:border-brand focus:outline-none"
                  />
                  {formErrors.addressLine1 && (
                    <p className="mt-1 text-[11px] text-error">{formErrors.addressLine1}</p>
                  )}
                </div>

                {/* 4. Address Line 2 */}
                <div>
                  <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                    Landmark / Area (Optional)
                  </label>
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="Near Commercial Market / Mosque"
                    className="w-full rounded-lg border border-border bg-bg-surface px-3.5 py-2.5 text-xs text-text-primary focus:border-brand focus:outline-none"
                  />
                </div>

                {/* 5. City & Province */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      list="pakistani-cities-list"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Select or type your city"
                      className="w-full rounded-lg border border-border bg-bg-surface px-3.5 py-2.5 text-xs text-text-primary focus:border-brand focus:outline-none"
                    />
                    <datalist id="pakistani-cities-list">
                      {PAKISTANI_CITIES.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                      Province / Region
                    </label>
                    <input
                      type="text"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      placeholder="Punjab / Sindh / KPK / Balochistan"
                      className="w-full rounded-lg border border-border bg-bg-surface px-3.5 py-2.5 text-xs text-text-primary focus:border-brand focus:outline-none"
                    />
                  </div>
                </div>

                {/* 6. Special Delivery Instructions */}
                <div>
                  <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                    Special Delivery Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Call before arrival, leave with security guard, etc."
                    className="w-full rounded-lg border border-border bg-bg-surface px-3.5 py-2.5 text-xs text-text-primary focus:border-brand focus:outline-none"
                  />
                </div>

                {/* 7. Pakistani Payment Method Selection */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
                      Select Payment Method *
                    </label>
                    <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      100% Secure Checkout
                    </span>
                  </div>

                  {/* Payment Options Grid / Tabs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* 1. Easypaisa */}
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('easypaisa');
                        setFormErrors((prev) => ({ ...prev, paymentReference: '' }));
                      }}
                      className={`relative p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        paymentMethod === 'easypaisa'
                          ? 'border-[#00c389] bg-[#00c389]/10 shadow-xs ring-2 ring-[#00c389]/30'
                          : 'border-border bg-bg-surface hover:border-[#00c389]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${paymentMethod === 'easypaisa' ? 'bg-[#00c389] text-white' : 'bg-gray-100 text-gray-600'}`}>
                            <Smartphone className="h-4 w-4" />
                          </div>
                          <span className="font-bold text-xs text-text-primary">Easypaisa</span>
                        </div>
                        {paymentMethod === 'easypaisa' && (
                          <div className="h-4 w-4 rounded-full bg-[#00c389] flex items-center justify-center text-white text-[10px]">
                            ✓
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-text-secondary leading-tight">
                        Direct wallet transfer to 03125880988
                      </span>
                    </button>

                    {/* 2. Bank Transfer (MCB) */}
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('bank_transfer');
                        setFormErrors((prev) => ({ ...prev, paymentReference: '' }));
                      }}
                      className={`relative p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        paymentMethod === 'bank_transfer'
                          ? 'border-[#1b3a6b] bg-[#1b3a6b]/10 shadow-xs ring-2 ring-[#1b3a6b]/30'
                          : 'border-border bg-bg-surface hover:border-[#1b3a6b]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${paymentMethod === 'bank_transfer' ? 'bg-[#1b3a6b] text-white' : 'bg-gray-100 text-gray-600'}`}>
                            <Building2 className="h-4 w-4" />
                          </div>
                          <span className="font-bold text-xs text-text-primary">MCB Bank</span>
                        </div>
                        {paymentMethod === 'bank_transfer' && (
                          <div className="h-4 w-4 rounded-full bg-[#1b3a6b] flex items-center justify-center text-white text-[10px]">
                            ✓
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-text-secondary leading-tight">
                        Online / Raast / 1Link transfer
                      </span>
                    </button>

                    {/* 3. Cash on Delivery (COD) */}
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('cod');
                        setFormErrors((prev) => ({ ...prev, paymentReference: '' }));
                      }}
                      className={`relative p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        paymentMethod === 'cod'
                          ? 'border-brand bg-brand-light/40 shadow-xs ring-2 ring-brand/30'
                          : 'border-border bg-bg-surface hover:border-brand/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${paymentMethod === 'cod' ? 'bg-brand text-white' : 'bg-gray-100 text-gray-600'}`}>
                            <Banknote className="h-4 w-4" />
                          </div>
                          <span className="font-bold text-xs text-text-primary">Cash on Delivery</span>
                        </div>
                        {paymentMethod === 'cod' && (
                          <div className="h-4 w-4 rounded-full bg-brand flex items-center justify-center text-white text-[10px]">
                            ✓
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-text-secondary leading-tight">
                        Pay cash at your doorstep
                      </span>
                    </button>
                  </div>

                  {/* Easypaisa Transfer Details Card */}
                  {paymentMethod === 'easypaisa' && (
                    <div className="rounded-xl border border-[#00c389]/40 bg-gradient-to-br from-[#00c389]/5 to-transparent p-4 sm:p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#00c389]/20 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-bold text-sm text-[#008a60]">
                              Easypaisa Official Account
                            </span>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#00c389]/20 text-[#008a60]">
                              Verified
                            </span>
                          </div>
                          <p className="text-[11px] text-text-secondary mt-0.5">
                            Transfer <strong>{formatPrice(totalCents)}</strong> from your Easypaisa app or USSD (*786#).
                          </p>
                        </div>
                      </div>

                      {/* Account Box with 1-Click Copy */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-lg border border-border">
                        <div>
                          <span className="text-[10px] text-text-secondary uppercase tracking-wider block font-semibold">
                            Account Number
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-base font-bold text-text-primary tracking-wide">
                              03125880988
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy('03125880988', 'easypaisa_acc')}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#008a60] bg-[#00c389]/15 hover:bg-[#00c389]/25 px-2 py-1 rounded transition-colors"
                            >
                              {copiedField === 'easypaisa_acc' ? (
                                <>
                                  <Check className="h-3 w-3" /> Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" /> Copy
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] text-text-secondary uppercase tracking-wider block font-semibold">
                            Account Title
                          </span>
                          <span className="font-bold text-sm text-text-primary block mt-1">
                            Bilal Khan
                          </span>
                        </div>
                      </div>

                      {/* TRX ID Input */}
                      <div>
                        <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                          Easypaisa Transaction ID (TRX ID) *
                        </label>
                        <input
                          type="text"
                          value={paymentReference}
                          onChange={(e) => setPaymentReference(e.target.value)}
                          placeholder="e.g. 11-digit TRX ID from 3737 SMS"
                          className="w-full rounded-lg border border-border bg-bg-surface px-3.5 py-2.5 text-xs text-text-primary focus:border-[#00c389] focus:outline-none"
                        />
                        {formErrors.paymentReference && (
                          <p className="mt-1 text-[11px] text-error font-medium">
                            {formErrors.paymentReference}
                          </p>
                        )}
                        <p className="text-[10px] text-text-secondary mt-1">
                          💬 After clicking Confirm, you will also be able to send your payment screenshot on WhatsApp with 1 click.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Bank Transfer (MCB) Details Card */}
                  {paymentMethod === 'bank_transfer' && (
                    <div className="rounded-xl border border-[#1b3a6b]/40 bg-gradient-to-br from-[#1b3a6b]/5 to-transparent p-4 sm:p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1b3a6b]/20 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-bold text-sm text-[#1b3a6b]">
                              Muslim Commercial Bank (MCB)
                            </span>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#1b3a6b]/15 text-[#1b3a6b]">
                              Official Account
                            </span>
                          </div>
                          <p className="text-[11px] text-text-secondary mt-0.5">
                            Transfer <strong>{formatPrice(totalCents)}</strong> via online banking, Raast, or ATM transfer.
                          </p>
                        </div>
                      </div>

                      {/* Bank Account Info Box with 1-Click Copy */}
                      <div className="space-y-2.5 bg-white p-3.5 rounded-lg border border-border">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2 border-b border-border/60">
                          <div>
                            <span className="text-[10px] text-text-secondary uppercase tracking-wider block font-semibold">
                              Bank Name
                            </span>
                            <span className="font-bold text-xs text-text-primary block mt-0.5">
                              Muslim Commercial Bank (MCB)
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-text-secondary uppercase tracking-wider block font-semibold">
                              Account Title
                            </span>
                            <span className="font-bold text-xs text-text-primary block mt-0.5">
                              Bilal Khan
                            </span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] text-text-secondary uppercase tracking-wider block font-semibold">
                            IBAN / Account Number
                          </span>
                          <div className="flex items-center justify-between gap-2 mt-1">
                            <span className="font-mono text-xs sm:text-sm font-bold text-text-primary break-all">
                              PK16MUCB0857263901006723
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy('PK16MUCB0857263901006723', 'mcb_iban')}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1b3a6b] bg-[#1b3a6b]/15 hover:bg-[#1b3a6b]/25 px-2 py-1 rounded transition-colors shrink-0"
                            >
                              {copiedField === 'mcb_iban' ? (
                                <>
                                  <Check className="h-3 w-3" /> Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" /> Copy IBAN
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Transaction Reference Input */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                            Bank Reference / Transaction ID *
                          </label>
                          <input
                            type="text"
                            value={paymentReference}
                            onChange={(e) => setPaymentReference(e.target.value)}
                            placeholder="e.g. MCB / Raast Ref #"
                            className="w-full rounded-lg border border-border bg-bg-surface px-3.5 py-2.5 text-xs text-text-primary focus:border-[#1b3a6b] focus:outline-none"
                          />
                          {formErrors.paymentReference && (
                            <p className="mt-1 text-[11px] text-error font-medium">
                              {formErrors.paymentReference}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                            Sender Account Name (Optional)
                          </label>
                          <input
                            type="text"
                            value={senderAccountName}
                            onChange={(e) => setSenderAccountName(e.target.value)}
                            placeholder="e.g. Account holder name"
                            className="w-full rounded-lg border border-border bg-bg-surface px-3.5 py-2.5 text-xs text-text-primary focus:border-[#1b3a6b] focus:outline-none"
                          />
                        </div>
                      </div>
                      <p className="text-[10px] text-text-secondary">
                        💬 You can attach your bank transfer receipt on WhatsApp after placing this order.
                      </p>
                    </div>
                  )}

                  {/* Cash on Delivery Notice */}
                  {paymentMethod === 'cod' && (
                    <div className="rounded-xl border border-brand/40 bg-brand-light/30 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-5 w-5 rounded-full border-4 border-brand bg-white" />
                          <div>
                            <h4 className="text-xs font-bold text-brand uppercase tracking-wider">
                              Cash on Delivery (Doorstep Payment)
                            </h4>
                            <p className="text-[11px] text-text-secondary mt-0.5">
                              Please keep exact cash ready: <strong>{formatPrice(totalCents)}</strong> upon courier delivery.
                            </p>
                          </div>
                        </div>
                        <span className="rounded bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">
                          Doorstep Inspection
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    className="shadow-lg h-13 text-sm sm:text-base font-bold btn-luxury-shine border border-[#F6D365]/40"
                  >
                    Confirm & Place Order — {formatPrice(totalCents)}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Order Items Summary */}
          <div className="lg:col-span-5 rounded-2xl border border-border bg-bg-primary p-6 space-y-4">
            <h2 className="font-heading text-lg font-bold text-text-primary border-b border-border pb-3">
              Order Review ({items.length})
            </h2>

            <div className="divide-y divide-border max-h-96 overflow-y-auto pr-1">
              {items.map((item) => {
                const itemImg = getCheckoutItemImage(item.product_slug, item.image_url || undefined);
                return (
                  <div key={item.variant_id} className="py-3 flex items-center gap-3 text-xs">
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-[#D4A017]/30 bg-bg-secondary shrink-0">
                      <Image
                        src={itemImg}
                        alt={item.product_name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-text-primary block line-clamp-1">
                        {item.product_name}
                      </span>
                      <span className="text-[11px] text-text-secondary block">
                        Size: {item.variant_size || 'Standard'} • Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="font-bold text-brand shrink-0">
                      {formatPrice(item.price_cents * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="text-text-primary font-medium">{formatPrice(subtotalCents)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Delivery Charge</span>
                <span className="text-text-primary font-medium">
                  {deliveryFeeCents === 0 ? 'FREE' : formatPrice(deliveryFeeCents)}
                </span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between items-baseline">
                <span className="font-heading font-bold text-sm text-text-primary">Estimated Total</span>
                <span className="font-heading font-bold text-xl text-brand">
                  {formatPrice(totalCents)}
                </span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-text-secondary space-y-1.5 border-t border-border">
              <p className="flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-brand" />
                <span>Express courier dispatch within 24 hours.</span>
              </p>
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-brand" />
                <span>Original velvet box packaging included.</span>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

