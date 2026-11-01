import React from 'react';
import Container from '@/components/ui/Container';
import { Sparkles, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-20">
      <Container size="md" className="space-y-12">
        <div className="text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Our Heritage & Story
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-text-primary">
            The Craft of GULNAAR by MK
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Preserving traditional South Asian jewellery craft, one handcrafted bangle at a time.
          </p>
        </div>

        <div className="space-y-6 text-sm text-text-secondary leading-relaxed border-t border-border pt-8">
          <p>
            Founded in Lahore, <strong>GULNAAR by MK</strong> was conceived from a deep reverence for the melodic grace and sacred symbolism of the traditional subcontinent bangle. For generations, bangles have marked milestones: wedding days, festive eid mornings, ceremonies of joy, and quiet moments of everyday grace.
          </p>

          <h2 className="font-heading text-xl sm:text-2xl font-bold text-text-primary pt-4">
            Master Artisanship & Patience
          </h2>
          <p>
            Unlike mass-manufactured hollow alloy jewellery, every piece in our collection is born in artisan workshops. Our master karigars shape heavy solid brass cores, dipping them in high-micron 24K gold finishing before hand-setting delicate Kundan stones, freshwater seed pearls, and hand-painting vibrant Meenakari enamels.
          </p>

          <div className="rounded-xl bg-bg-secondary border border-border p-6 my-6 space-y-3">
            <h3 className="font-heading font-semibold text-brand text-base flex items-center gap-2">
              <Award className="h-5 w-5 text-gold" />
              Our Core Promises
            </h3>
            <ul className="space-y-2 text-xs">
              <li>• <strong>Hypoallergenic Core:</strong> Solid brass foundation designed to prevent green skin discoloration.</li>
              <li>• <strong>Fair Craft Compensation:</strong> Supporting artisan families directly with sustainable craft wages.</li>
              <li>• <strong>Heirloom Durability:</strong> Crafted to be passed down through generations in bridal trousseaus.</li>
            </ul>
          </div>

          <p>
            Whether you choose our statement Kundan bridal kangans or our featherlight rose-silk thread sets, we welcome you to the GULNAAR family.
          </p>
        </div>
      </Container>
    </div>
  );
}

