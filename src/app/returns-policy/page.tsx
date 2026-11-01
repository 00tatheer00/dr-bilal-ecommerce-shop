import React from 'react';
import Container from '@/components/ui/Container';
import { RefreshCw } from 'lucide-react';

export default function ReturnsPolicyPage() {
  return (
    <div className="py-12 sm:py-20">
      <Container size="md" className="space-y-8">
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
            <RefreshCw className="h-3.5 w-3.5 text-gold" />
            Customer Satisfaction
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary">
            Returns & Exchange Policy
          </h1>
        </div>

        <div className="rounded-xl border border-border bg-bg-primary p-6 sm:p-8 space-y-6 text-xs text-text-secondary leading-relaxed shadow-xs">
          <div>
            <h3 className="font-heading font-semibold text-sm text-text-primary mb-2">
              3-Day Size & Piece Exchange
            </h3>
            <p>
              We want you to adore your jewellery. If your bangles do not fit properly or you wish to exchange them for a different design, you can request an exchange within <strong>3 days</strong> of receiving your parcel.
            </p>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="font-heading font-semibold text-sm text-text-primary mb-2">
              Exchange Conditions
            </h3>
            <ul className="space-y-1.5">
              <li>• Items must be unworn, undamaged, and in their original velvet packaging.</li>
              <li>• The security tag (where attached) must be intact.</li>
              <li>• A nominal reverse-shipping courier fee of PKR 250 applies for size-related exchanges.</li>
            </ul>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="font-heading font-semibold text-sm text-text-primary mb-2">
              Damaged or Defective Items
            </h3>
            <p>
              In the unlikely event that a piece arrives damaged during courier transit, please notify our WhatsApp support (+92 300 0000000) within <strong>24 hours</strong> of delivery with a clear photograph or video unboxing. We will send an immediate replacement at zero cost to you.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

