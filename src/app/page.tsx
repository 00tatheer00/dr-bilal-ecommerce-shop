import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts, getCategories } from '@/lib/db/products';
import ProductCard from '@/components/product/ProductCard';
import LuxuryHero from '@/components/home/LuxuryHero';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { Gem, ArrowRight, Heart, Crown, Truck, RefreshCw, ShieldCheck } from 'lucide-react';

// High-resolution Unsplash bangle photography
const HERO_IMAGE = 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1600&auto=format&fit=crop&q=85';
const STORY_IMAGE = 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1200&auto=format&fit=crop&q=85';
const CTA_IMAGE = 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1400&auto=format&fit=crop&q=85';

const CATEGORY_IMAGES: Record<string, string> = {
  'bridal': 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=700&auto=format&fit=crop&q=85',
  'everyday': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=700&auto=format&fit=crop&q=85',
  'statement': 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=700&auto=format&fit=crop&q=85',
  'kundan-meenakari': 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=700&auto=format&fit=crop&q=85',
};

async function HomeContent() {
  const categories = await getCategories();
  const featuredProducts = await getProducts({ isFeatured: true, limit: 4 });
  const allProducts = await getProducts({ limit: 8 });

  return (
    <div className="pb-20">
      {/* 1. CINEMATIC $2000-GRADE INTERACTIVE LUXURY HERO */}
      <LuxuryHero />

      {/* 2. CURATED COLLECTIONS — CRISP LUXURY CARDS */}
      <section className="py-20 sm:py-28 bg-[#FFFFFF]">
        <Container size="xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold mb-2 inline-flex items-center gap-1.5">
                <Gem className="h-3.5 w-3.5 text-[#C5A059]" />
                High Jewellery Curations
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
                Shop by Style & Occasion
              </h2>
            </div>
            <Link
              href="/shop"
              prefetch={true}
              className="mt-4 sm:mt-0 text-sm font-bold text-[#7A0C2E] hover:text-[#560820] inline-flex items-center gap-1.5 group"
            >
              <span>Explore All Categories</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                prefetch={true}
                className="group relative overflow-hidden rounded-3xl h-80 border border-border/80 hover-luxury-card cursor-pointer"
              >
                {/* Category Photo */}
                <Image
                  src={CATEGORY_IMAGES[category.slug] || HERO_IMAGE}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover hover-zoom-bangle"
                />
                {/* Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0E17]/95 via-[#0F0E17]/50 to-transparent group-hover:from-[#7A0C2E]/95 transition-colors duration-500" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white flex flex-col justify-end">
                  <div className="w-11 h-11 rounded-2xl bg-[#DFB76C]/20 backdrop-blur-md flex items-center justify-center mb-3 border border-[#DFB76C]/40 group-hover:bg-[#DFB76C] group-hover:text-[#4A0E2E] transition-all duration-300">
                    <Gem className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold">{category.name}</h3>
                  <p className="text-xs text-white/75 line-clamp-2 mt-1.5 leading-relaxed">
                    {category.description}
                  </p>
                  <span className="mt-3.5 text-xs font-bold text-[#DFB76C] inline-flex items-center gap-1.5 group-hover:translate-x-2 transition-transform duration-300">
                    Discover Collection &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. FEATURED HEIRLOOM PRODUCTS */}
      <section className="py-20 sm:py-28 bg-[#FAF9F6] border-y border-border">
        <Container size="xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold block mb-2">
              ✦ Handpicked Signatures
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
              Featured Bridal & Statement Bangles
            </h2>
            <p className="text-sm text-text-secondary mt-3 leading-relaxed">
              Favored by brides and jewelry collectors across Pakistan for exquisite weight, finish, and timeless appeal.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-14">
            <Link href="/shop" prefetch={true}>
              <Button variant="primary" size="lg" className="shadow-lg group">
                <span>View Complete Bangle Vault</span>
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* 4. ARTISANAL CRAFTSMANSHIP STORY */}
      <section className="py-20 sm:py-28 bg-[#FFFFFF]">
        <Container size="xl">
          <div className="overflow-hidden rounded-3xl border border-[#C5A059]/30 shadow-[0_20px_60px_rgba(0,0,0,0.06)] bg-[#FAF9F6]">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Image Side */}
              <div className="lg:col-span-5 relative min-h-[320px] lg:min-h-full">
                <Image
                  src={STORY_IMAGE}
                  alt="Lahore Karigar Craftsmanship"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />
              </div>

              {/* Content Side */}
              <div className="lg:col-span-7 p-8 sm:p-14 lg:p-16 flex flex-col justify-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#FDF2F4] border border-[#7A0C2E]/20 px-4 py-1.5 text-xs font-bold text-[#7A0C2E] w-fit">
                  <Heart className="h-3.5 w-3.5 fill-[#7A0C2E]" />
                  The Soul of GULNAAR by MK
                </span>

                <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary leading-tight mt-5">
                  Centuries of Artisanal Soul in{' '}
                  <span className="text-[#7A0C2E]">Every Curve</span>
                </h2>

                <p className="text-sm sm:text-base text-text-secondary leading-relaxed mt-4">
                  In an era dominated by mass-manufactured hollow accessories, GULNAAR by MK stands firm in preserving authentic subcontinent craft. Every piece begins with solid brass core metal, hand-dipped in high-micron 24K gold, and encrusted with Kundan stones and seed pearls.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                  {[
                    { title: 'Solid Brass Core', desc: 'Hypoallergenic & weighty, built to resist bending' },
                    { title: 'Hand-Set Stones', desc: 'Real Kundan, seed pearls & brilliant zircons' },
                    { title: 'Velvet Gift Box', desc: 'Luxury keepsake trousseau packaging' },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl bg-white p-4.5 border border-border shadow-xs hover:border-[#C5A059] transition-colors"
                    >
                      <h4 className="font-heading font-bold text-[#7A0C2E] text-sm mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-text-secondary leading-normal">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Link href="/about" prefetch={true}>
                    <Button variant="secondary" size="md" className="group">
                      Read Our Full Story
                      <ArrowRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. LATEST PRODUCTS SPOTLIGHT */}
      <section className="py-20 sm:py-28 bg-[#FFFFFF]">
        <Container size="xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold block mb-2">
                ✦ Fresh from the Atelier
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary">
                Explore the Latest Creations
              </h2>
            </div>
            <Link
              href="/shop"
              prefetch={true}
              className="mt-4 sm:mt-0 text-sm font-bold text-[#7A0C2E] hover:text-[#560820] inline-flex items-center gap-1 group"
            >
              Open Full Catalog &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {allProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </section>

      {/* 6. FULL-WIDTH LUXURY CTA BANNER */}
      <section className="relative overflow-hidden mx-4 sm:mx-8 lg:mx-auto lg:max-w-7xl rounded-3xl min-h-[440px] flex items-center justify-center shadow-2xl">
        <Image
          src={CTA_IMAGE}
          alt="Luxury bangles wedding collection"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A0E2E]/95 via-[#7A0C2E]/85 to-[#4A0E2E]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(223,183,108,0.15),transparent_70%)]" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16 max-w-2xl mx-auto space-y-5 text-white">
          <Crown className="h-12 w-12 text-[#DFB76C] animate-pulse" />
          <h2 className="font-heading text-3xl sm:text-5xl font-bold leading-tight">
            Begin Your Bridal Journey with GULNAAR
          </h2>
          <p className="text-sm sm:text-base text-white/85 leading-relaxed">
            Discover handcrafted bangles destined to become cherished family heirlooms. Cash on Delivery across Pakistan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-3 w-full sm:w-auto">
            <Link href="/shop?category=bridal" prefetch={true} className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-[#DFB76C] to-[#C5A059] text-[#4A0E2E] font-bold shadow-[0_10px_30px_rgba(223,183,108,0.4)] border-0 btn-luxury-shine"
              >
                <Crown className="h-4 w-4 mr-1 text-[#4A0E2E]" />
                Shop Bridal Collection
              </Button>
            </Link>
            <Link href="/contact" prefetch={true} className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto border-white/40 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
              >
                Custom Bridal Inquiry
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FOUR PILLARS VALUE PROPOSITION */}
      <section className="py-20 bg-[#FFFFFF]">
        <Container size="xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Cash on Delivery', desc: 'Doorstep parcel check across Pakistan', color: 'from-[#7A0C2E] to-[#4A0E2E]' },
              { icon: Gem, title: '100% Handcrafted', desc: 'Master karigar jewelry artistry', color: 'from-[#DFB76C] to-[#C5A059]' },
              { icon: ShieldCheck, title: 'Free Express Shipping', desc: 'On all orders over PKR 5,000', color: 'from-[#114226] to-[#166534]' },
              { icon: RefreshCw, title: 'Easy Exchanges', desc: '3-day size exchange guarantee', color: 'from-[#7A0C2E] to-[#991B1B]' },
            ].map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center text-center p-6 rounded-3xl bg-[#FAF9F6] border border-border/80 hover-luxury-card group"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-sm group-hover:scale-110 transition-transform duration-300 mb-3`}
                >
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  {item.title}
                </h4>
                <p className="text-[11px] text-text-secondary mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <HomeContent />
    </Suspense>
  );
}
