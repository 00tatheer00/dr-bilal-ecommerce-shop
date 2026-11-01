import React from 'react';
import Container from '@/components/ui/Container';
import { Truck } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="py-12 sm:py-20">
      <Container size="md" className="space-y-8">
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
            <Truck className="h-3.5 w-3.5 text-gold" />
            Nationwide Logistics
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary">
            Shipping & Delivery Policy
          </h1>
        </div>

        <div className="rounded-xl border border-border bg-bg-primary p-6 sm:p-8 space-y-6 text-xs text-text-secondary leading-relaxed shadow-xs">
          <div>
            <h3 className="font-heading font-semibold text-sm text-text-primary mb-2">
              Coverage & Couriers
            </h3>
            <p>
              GULNAAR by MK delivers to over 250 cities, towns, and postal sectors across Pakistan through reliable courier services (Trax, Call Courier, TCS, and Leopards). Every parcel is dispatched with an individual tracking code.
            </p>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="font-heading font-semibold text-sm text-text-primary mb-2">
              Delivery Rates
            </h3>
            <p>
              • <strong>Standard Flat Rate:</strong> PKR 250 per order.
              <br />
              • <strong>Free Delivery:</strong> Automatically applied at checkout on all orders with a subtotal of PKR 5,000 or greater.
            </p>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="font-heading font-semibold text-sm text-text-primary mb-2">
              Estimated Delivery Time
            </h3>
            <p>
              • <strong>Lahore, Karachi, Islamabad & Rawalpindi:</strong> 2 to 3 business days.
              <br />
              • <strong>Other Major & Regional Cities:</strong> 3 to 5 business days.
            </p>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="font-heading font-semibold text-sm text-text-primary mb-2">
              Order Dispatch Verification
            </h3>
            <p>
              Before dispatching bridal sets or orders over PKR 10,000, our team may verify the delivery address and bangle size with you via a brief WhatsApp message or phone call.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

