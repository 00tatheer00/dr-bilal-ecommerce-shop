'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';

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
      const url = `/order-success/${result.orderNumber}?token=${result.trackingToken || ''}`;
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

                {/* 7. Payment Method Box */}
                <div className="rounded-xl border border-brand/40 bg-brand-light/30 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full border-4 border-brand bg-white" />
                      <div>
                        <h4 className="text-xs font-bold text-brand uppercase tracking-wider">
                          Cash on Delivery (COD)
                        </h4>
                        <p className="text-[11px] text-text-secondary mt-0.5">
                          Pay cash to courier upon inspecting parcel at your doorstep.
                        </p>
                      </div>
                    </div>
                    <span className="rounded bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">
                      Standard
                    </span>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    className="shadow-md h-12"
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

            <div className="divide-y divide-border max-h-80 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.variant_id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-medium text-text-primary block line-clamp-1">
                      {item.product_name}
                    </span>
                    <span className="text-[11px] text-text-secondary block">
                      Size: {item.variant_size || 'Standard'} • Qty: {item.quantity}
                    </span>
                  </div>
                  <span className="font-semibold text-brand shrink-0">
                    {formatPrice(item.price_cents * item.quantity)}
                  </span>
                </div>
              ))}
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

