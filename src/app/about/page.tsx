import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { Heart, Crown, ArrowRight, ShieldCheck } from 'lucide-react';

const ABOUT_HERO = 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1600&auto=format&fit=crop&q=85';
const CRAFT_IMAGE_1 = 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&auto=format&fit=crop&q=85';
const CRAFT_IMAGE_2 = 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=85';

export default function AboutPage() {
  return (
    <div className="pb-20">
      {/* 1. HERO STORY BANNER */}
      <section className="relative overflow-hidden min-h-[420px] flex items-center justify-center text-center">
        <Image
          src={ABOUT_HERO}
          alt="Artisan Jewelry Making"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/95 via-[#1A1A2E]/80 to-[#8B1A4A]/60" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4A017] via-[#8B1A4A] to-[#D4A017]" />

        <Container size="md" className="relative z-10 py-16 text-white space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-[#F0D060] border border-white/20">
            <Crown className="h-4 w-4" />
            The Heritage of GULNAAR by MK
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
            Reviving the Sacred Soul of Subcontinent Bangles
          </h1>
          <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
            Preserving centuries of South Asian jewellery craft — hand-poured brass, royal Kundan settings, and artisanal devotion in Lahore.
          </p>
        </Container>
      </section>

      {/* 2. THE STORY */}
      <section className="py-16 sm:py-24">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-[0.2em] text-[#D4A017] font-bold block">
                ✦ Born in Lahore
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary leading-tight">
                Where Heritage Meets Modern Feminine Grace
              </h2>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                Founded in Lahore, <strong>GULNAAR by MK</strong> was conceived from a deep reverence for the melodic grace and sacred symbolism of the traditional subcontinent bangle (<em>kangan</em> & <em>churi</em>).
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">
                For centuries across South Asia, bangles have marked sacred milestones: bridal wedding celebrations, joyous Eid mornings, and cherished everyday rituals. In an era dominated by hollow mass-manufactured accessories, we set out to restore authenticity and soul to heirloom jewellery.
              </p>
              <div className="pt-2">
                <Link href="/shop?category=bridal">
                  <Button variant="primary" size="md" className="shadow-md">
                    Explore Bridal Collections
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Visual Mosaic */}
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[#D4A017]/30 shadow-2xl">
                <Image
                  src={CRAFT_IMAGE_1}
                  alt="Bridal Bangles Craftsmanship"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 sm:w-56 aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-xl hidden sm:block">
                <Image
                  src={CRAFT_IMAGE_2}
                  alt="Kundan Stone Setting"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. CORE PROMISES */}
      <section className="py-16 bg-gradient-to-b from-[#FFF3E6] via-bg-primary to-[#FFF3E6] border-y border-border">
        <Container size="xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.2em] text-[#D4A017] font-bold block mb-2">
              ✦ Uncompromising Standards
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary">
              The GULNAAR Pillars of Excellence
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: 'Solid Brass Foundation',
                desc: 'Every piece begins with heavy, solid brass core cores — never hollow zinc alloys. Hypoallergenic and crafted to resist bending across decades.',
                badge: 'Hypoallergenic',
              },
              {
                icon: Crown,
                title: '24K Gold-Dipped Micron Plating',
                desc: 'Hand-finished in thick micron gold plating that mirrors the lustre of genuine fine bridal gold, sealed for anti-tarnish protection.',
                badge: '24K Micron Finish',
              },
              {
                icon: Heart,
                title: 'Master Karigar Dignity',
                desc: 'We partner directly with third-generation artisan families in the historic bazaars of Lahore, ensuring ethical wages and celebrated craft.',
                badge: '100% Ethical Craft',
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-3xl bg-white p-8 border border-[#D4A017]/30 shadow-md hover:shadow-xl transition-all space-y-4 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8B1A4A] to-[#6D1038] text-white shadow-sm">
                    <pillar.icon className="h-6 w-6 text-[#F0D060]" />
                  </div>
                  <span className="rounded-full bg-[#FFF3E6] border border-[#D4A017]/30 px-3 py-1 text-[11px] font-bold text-brand">
                    {pillar.badge}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-bold text-text-primary pt-2">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. INVITATION CTA */}
      <section className="pt-20">
        <Container size="md">
          <div className="rounded-3xl bg-gradient-to-r from-[#8B1A4A] via-[#6D1038] to-[#8B1A4A] p-10 sm:p-14 text-center text-white space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4A017]/10 to-transparent animate-shimmer pointer-events-none" />
            <Crown className="h-12 w-12 text-[#F0D060] mx-auto animate-pulse" />
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">
              Find Your Signature Heirloom Piece
            </h2>
            <p className="text-sm sm:text-base text-white/80 max-w-lg mx-auto leading-relaxed">
              Whether preparing your bridal trousseau or seeking an everyday touch of timeless grace, we invite you to experience GULNAAR by MK.
            </p>
            <div className="pt-2">
              <Link href="/shop">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-gradient-to-r from-[#D4A017] to-[#B8860B] hover:from-[#F0D060] hover:to-[#D4A017] text-[#1A1A2E] font-bold shadow-gold border-0"
                >
                  Explore All Handcrafted Bangles
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
