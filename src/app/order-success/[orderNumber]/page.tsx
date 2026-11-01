import React, { Suspense } from 'react';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { CheckCircle2, PackageCheck, PhoneCall, Truck, Sparkles } from 'lucide-react';

interface Props {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ token?: string }>;
}

async function OrderSuccessContent({ params, searchParams }: Props) {
  const { orderNumber } = await params;
  await searchParams;

  return (
    <div className="py-12 sm:py-20 bg-bg-secondary/40 min-h-screen">
      <Container size="md">
        <div className="rounded-2xl border border-border bg-bg-primary p-8 sm:p-12 text-center shadow-sm">
          {/* Success Check Icon */}
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-6 border-2 border-emerald-200">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand mb-3">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Order Placed Successfully
          </span>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary mb-2">
            Thank You for Your Patronage
          </h1>

          <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto mb-8 leading-relaxed">
            Your handcrafted bangles order has been safely received. Our master artisans and dispatch team are preparing your jewellery set.
          </p>

          {/* Order Details Card */}
          <div className="rounded-xl border border-border bg-bg-secondary p-6 mb-8 text-left space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-2">
              <div>
                <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider block">
                  Your Order Reference
                </span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-brand">
                  {orderNumber}
                </span>
              </div>
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-semibold self-start sm:self-center">
                Cash on Delivery (COD)
              </span>
            </div>

            {/* Next Steps List */}
            <div className="space-y-3 text-xs text-text-secondary pt-1">
              <div className="flex items-start gap-3">
                <PhoneCall className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                <div>
                  <strong className="text-text-primary font-medium">WhatsApp Confirmation:</strong>
                  <p className="mt-0.5">
                    Our team may reach out via WhatsApp/SMS to verify your wrist size and destination address.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <PackageCheck className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                <div>
                  <strong className="text-text-primary font-medium">Velvet Box Preparation:</strong>
                  <p className="mt-0.5">
                    Your bangles are inspected, polished, and packaged in our signature velvet keepsake box.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Truck className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                <div>
                  <strong className="text-text-primary font-medium">Courier Delivery:</strong>
                  <p className="mt-0.5">
                    Expected delivery in 3–5 business days. Please keep the exact cash amount ready for the rider.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={`/track-order?ref=${orderNumber}`}>
              <Button variant="secondary" size="md">
                Track Order Status
              </Button>
            </Link>
            <Link href="/shop">
              <Button variant="primary" size="md">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function OrderSuccessPage(props: Props) {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-xs text-text-secondary">
          Loading order details...
        </div>
      }
    >
      <OrderSuccessContent {...props} />
    </Suspense>
  );
}
