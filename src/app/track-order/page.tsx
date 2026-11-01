'use client';

import React, { useState, use, Suspense } from 'react';
import { lookupOrder, type OrderLookupResult } from '@/actions/order';
import { formatPrice } from '@/lib/utils';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { Compass, Search, AlertCircle, CheckCircle2, Clock, Truck, Package } from 'lucide-react';

interface Props {
  searchParams: Promise<{ ref?: string }>;
}

function TrackOrderContent({ searchParams }: Props) {
  const resolvedParams = use(searchParams);
  const [orderNumber, setOrderNumber] = useState(resolvedParams.ref || '');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OrderLookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await lookupOrder({
        orderNumber,
        phone,
      });

      if (!res.success) {
        setError(res.error || 'No matching order found.');
      } else {
        setResult(res);
      }
    } catch {
      setError('An error occurred while tracking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-20 min-h-screen bg-bg-secondary/30">
      <Container size="md">
        <div className="rounded-2xl border border-border bg-bg-primary p-6 sm:p-10 shadow-xs">
          <div className="text-center max-w-md mx-auto mb-8">
            <div className="w-12 h-12 rounded-full bg-brand-light text-brand mx-auto flex items-center justify-center mb-3">
              <Compass className="h-6 w-6 text-gold" />
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
              Track Your Order
            </h1>
            <p className="text-xs text-text-secondary mt-1">
              Enter your Order Reference and registered Phone Number to check real-time status.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleTrack} className="space-y-4 max-w-md mx-auto mb-8">
            <div>
              <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                Order Number
              </label>
              <input
                type="text"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                placeholder="e.g. GN-8K2M9P"
                className="w-full rounded-lg border border-border bg-bg-surface px-3.5 py-2.5 text-xs text-text-primary uppercase font-mono focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                Registered Phone Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0300-1234567"
                className="w-full rounded-lg border border-border bg-bg-surface px-3.5 py-2.5 text-xs text-text-primary focus:border-brand focus:outline-none"
              />
            </div>

            <Button type="submit" variant="primary" size="md" fullWidth loading={loading}>
              <Search className="h-4 w-4 mr-1.5" />
              Check Status
            </Button>
          </form>

          {error && (
            <div className="rounded-lg bg-error-light border border-error/30 p-4 text-xs text-error flex items-start gap-2 max-w-md mx-auto">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Result Card */}
          {result?.order && (
            <div className="mt-8 rounded-xl border border-border bg-bg-secondary p-6 space-y-6 animate-fade-in max-w-lg mx-auto">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <span className="text-[11px] font-semibold text-text-secondary uppercase">
                    Order Reference
                  </span>
                  <p className="font-mono text-lg font-bold text-brand">
                    {result.order.orderNumber}
                  </p>
                </div>
                <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand uppercase tracking-wider">
                  {result.order.status}
                </span>
              </div>

              {/* Status Stepper */}
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-medium text-text-secondary">
                <div className="flex flex-col items-center gap-1 text-brand font-semibold">
                  <CheckCircle2 className="h-5 w-5 text-brand" />
                  <span>Placed</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-brand font-semibold">
                  <Clock className="h-5 w-5 text-brand" />
                  <span>Confirmed</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-text-secondary">
                  <Package className="h-5 w-5 text-border-strong" />
                  <span>Dispatched</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-text-secondary">
                  <Truck className="h-5 w-5 text-border-strong" />
                  <span>Delivered</span>
                </div>
              </div>

              {/* Order Info */}
              <div className="border-t border-border pt-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Destination City:</span>
                  <span className="text-text-primary font-medium">{result.order.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Contact:</span>
                  <span className="font-mono text-text-primary">{result.order.maskedPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Payment Mode:</span>
                  <span className="text-text-primary font-medium">{result.order.paymentMethod}</span>
                </div>
                <div className="flex justify-between border-t border-border/80 pt-2 font-bold text-brand">
                  <span>Total Payable:</span>
                  <span>{formatPrice(result.order.totalMinor)}</span>
                </div>
              </div>

              {/* Items in this order */}
              <div className="border-t border-border pt-3">
                <span className="text-[11px] font-semibold text-text-secondary block mb-2">
                  Items in this Order:
                </span>
                <div className="space-y-1.5">
                  {result.order.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-text-primary">
                      <span>
                        {it.productName} ({it.size ? `Size ${it.size}` : 'Standard'} × {it.quantity})
                      </span>
                      <span className="font-medium text-brand">
                        {formatPrice(it.unitPriceMinor * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default function TrackOrderPage(props: Props) {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-xs text-text-secondary">
          Loading order tracking...
        </div>
      }
    >
      <TrackOrderContent {...props} />
    </Suspense>
  );
}
