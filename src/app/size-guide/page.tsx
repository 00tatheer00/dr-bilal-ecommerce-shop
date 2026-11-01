import React from 'react';
import Container from '@/components/ui/Container';
import { Ruler, HelpCircle } from 'lucide-react';

export default function SizeGuidePage() {
  return (
    <div className="py-12 sm:py-20">
      <Container size="md" className="space-y-10">
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
            <Ruler className="h-3.5 w-3.5 text-gold" />
            Fitting & Measurements
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary">
            Bangle Sizing Guide
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto">
            Traditional subcontinent bangles are sized by their inner diameter in inches. Find your perfect fit below.
          </p>
        </div>

        {/* Size Chart Table */}
        <div className="overflow-x-auto rounded-xl border border-border bg-bg-primary shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-bg-secondary border-b border-border text-text-primary uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3 sm:p-4">Standard Size</th>
                <th className="p-3 sm:p-4">Inner Diameter (Inches)</th>
                <th className="p-3 sm:p-4">Inner Diameter (mm)</th>
                <th className="p-3 sm:p-4">Hand Circumference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-text-secondary">
              <tr>
                <td className="p-3 sm:p-4 font-bold text-brand">2.4 (Small)</td>
                <td className="p-3 sm:p-4">2.25 inches</td>
                <td className="p-3 sm:p-4">57.2 mm</td>
                <td className="p-3 sm:p-4">7.06 inches</td>
              </tr>
              <tr className="bg-bg-surface/30">
                <td className="p-3 sm:p-4 font-bold text-brand">2.6 (Medium)</td>
                <td className="p-3 sm:p-4">2.375 inches</td>
                <td className="p-3 sm:p-4">60.3 mm</td>
                <td className="p-3 sm:p-4">7.46 inches</td>
              </tr>
              <tr>
                <td className="p-3 sm:p-4 font-bold text-brand">2.8 (Large)</td>
                <td className="p-3 sm:p-4">2.50 inches</td>
                <td className="p-3 sm:p-4">63.5 mm</td>
                <td className="p-3 sm:p-4">7.85 inches</td>
              </tr>
              <tr className="bg-bg-surface/30">
                <td className="p-3 sm:p-4 font-bold text-brand">2.10 (Extra Large)</td>
                <td className="p-3 sm:p-4">2.625 inches</td>
                <td className="p-3 sm:p-4">66.7 mm</td>
                <td className="p-3 sm:p-4">8.25 inches</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Measurement Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-text-secondary">
          <div className="rounded-xl border border-border bg-bg-secondary p-5 space-y-2">
            <h3 className="font-heading font-semibold text-sm text-text-primary">
              Method 1: Measure an Existing Bangle
            </h3>
            <p>
              Take a bangle that fits comfortably. Place it on a flat ruler and measure the <strong>inside diameter</strong> straight across from one inside edge to the other (do not include the outer rim).
            </p>
          </div>

          <div className="rounded-xl border border-border bg-bg-secondary p-5 space-y-2">
            <h3 className="font-heading font-semibold text-sm text-text-primary">
              Method 2: Hand Measurement
            </h3>
            <p>
              Bring your thumb and little finger together as if sliding on a bangle. Wrap a strip of paper or string around the widest part of your hand/knuckles. Mark the point and measure the length on a ruler.
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-brand-light/40 border border-brand/20 p-5 text-xs text-text-secondary flex items-start gap-3">
          <HelpCircle className="h-5 w-5 text-brand shrink-0 mt-0.5" />
          <p>
            <strong>Still unsure about your size?</strong> Our customer support team is happy to assist you over WhatsApp (+92 300 0000000) before your order is dispatched. We also offer a <strong>3-day size exchange guarantee</strong>.
          </p>
        </div>
      </Container>
    </div>
  );
}

