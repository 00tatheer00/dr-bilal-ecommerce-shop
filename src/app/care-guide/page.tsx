import React from 'react';
import Container from '@/components/ui/Container';
import { ShieldCheck, Sparkles, Droplets, Sun, Box } from 'lucide-react';

export default function CareGuidePage() {
  return (
    <div className="py-12 sm:py-20">
      <Container size="md" className="space-y-10">
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Preserve Your Heirlooms
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary">
            Jewellery Care Guide
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto">
            Proper care ensures your handcrafted bangles retain their brilliance, stone luster, and 24K gold finishing for years to come.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-text-secondary">
          <div className="rounded-xl border border-border bg-bg-primary p-6 space-y-2.5 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-brand-light text-brand flex items-center justify-center">
              <Droplets className="h-5 w-5" />
            </div>
            <h3 className="font-heading font-semibold text-sm text-text-primary">
              Avoid Moisture & Perfumes
            </h3>
            <p className="leading-relaxed">
              Always apply body lotions, hairsprays, and perfumes before putting on your bangles. Water, steam, and alcohol chemicals can dull the Kundan foil and enamel.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-bg-primary p-6 space-y-2.5 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-gold/15 text-gold flex items-center justify-center">
              <Box className="h-5 w-5" />
            </div>
            <h3 className="font-heading font-semibold text-sm text-text-primary">
              Store in Velvet Keepsake Box
            </h3>
            <p className="leading-relaxed">
              Keep each bangle set stored separately in its original GULNAAR velvet box or an airtight zip pouch to prevent friction scratches between stones.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-bg-primary p-6 space-y-2.5 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-brand-light text-brand flex items-center justify-center">
              <Sun className="h-5 w-5" />
            </div>
            <h3 className="font-heading font-semibold text-sm text-text-primary">
              Protect from Extreme Heat
            </h3>
            <p className="leading-relaxed">
              Do not leave bangles in direct sunlight or hot vehicles. High temperatures can soften natural lac bases and loosen traditional stone settings.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-bg-primary p-6 space-y-2.5 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-gold/15 text-gold flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-heading font-semibold text-sm text-text-primary">
              Gentle Dry Cleaning Only
            </h3>
            <p className="leading-relaxed">
              After each use, gently wipe bangles with a clean, dry microfibre cloth to remove natural skin oils. Never submerge in chemical jewellery cleaners.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

