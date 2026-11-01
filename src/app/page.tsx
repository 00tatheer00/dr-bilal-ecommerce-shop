import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts, getCategories } from '@/lib/db/products';
import ProductCard from '@/components/product/ProductCard';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { Sparkles, ArrowRight, Heart, Star, CheckCircle, Crown, Truck, RefreshCw, ShieldCheck } from 'lucide-react';

// High-quality Unsplash bangle images
const HERO_IMAGE = 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1200&auto=format&fit=crop&q=80';
const HERO_IMAGE_2 = 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80';
const STORY_IMAGE = 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1000&auto=format&fit=crop&q=80';
const CTA_IMAGE = 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1200&auto=format&fit=crop&q=80';

const CATEGORY_IMAGES: Record<string, string> = {
  'bridal': 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&auto=format&fit=crop&q=80',
  'everyday': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80',
  'statement': 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&auto=format&fit=crop&q=80',
  'kundan-meenakari': 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&auto=format&fit=crop&q=80',
};

async function HomeContent() {
  const categories = await getCategories();
  const featuredProducts = await getProducts({ isFeatured: true, limit: 4 });
  const allProducts = await getProducts({ limit: 8 });

  return (
    <div className="pb-16">
      {/* 1. HERO SECTION — Full Width with Image */}
      <section className="relative overflow-hidden min-h-[600px] lg:min-h-[700px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt="Luxury Handcrafted Bangles"
            fill
            priority
            className="object-cover"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A2E]/90 via-[#1A1A2E]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/50 to-transparent" />
        </div>

        <Container size="xl" className="relative z-10 flex items-center min-h-[600px] lg:min-h-[700px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16">
            {/* Left Content */}
            <div className="space-y-8 text-center lg:text-left">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D4A017]/50 bg-white/10 backdrop-blur-md px-5 py-2 text-xs font-semibold text-[#F0D060]">
                <Crown className="h-3.5 w-3.5" />
                <span>Heirloom Bangles • Handcrafted in Lahore</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                Artisanal Bangles{' '}
                <span className="text-[#F0D060]">Crafted</span> for Your Sacred{' '}
                <span className="text-[#F0D060]">Celebrations</span>
              </h1>

              <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
                From opulent bridal Kundan sets to everyday silk thread bangles — each piece hand-assembled by master artisans with centuries of heritage.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/shop?category=bridal">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto bg-gradient-to-r from-[#D4A017] to-[#B8860B] hover:from-[#F0D060] hover:to-[#D4A017] text-[#1A1A2E] font-bold shadow-gold group border-0">
                    <Crown className="h-4 w-4 mr-1" />
                    Explore Bridal Collection
                    <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:text-white">
                    View All Bangles
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex items-center justify-center lg:justify-start gap-6 text-xs text-white/70">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-[#F0D060]" />
                  <span>Cash on Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-[#F0D060]" />
                  <span>Free Shipping 5K+</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-[#F0D060]" />
                  <span>3-Day Exchange</span>
                </div>
              </div>
            </div>

            {/* Right — Floating Product Preview */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                {/* Main Product Card */}
                <div className="relative w-72 rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D4A017]/30 animate-float">
                  <div className="relative h-80">
                    <Image
                      src={HERO_IMAGE_2}
                      alt="Featured Bangles"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/80 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <span className="text-[10px] uppercase tracking-widest text-[#F0D060] font-semibold">Bestseller</span>
                    <h3 className="font-heading text-lg font-bold mt-1">Kundan Bridal Set</h3>
                    <p className="text-sm text-white/70 mt-0.5">Starting from PKR 8,500</p>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-8 bg-white rounded-xl shadow-lg px-4 py-3 border border-[#D4A017]/20 animate-pulse-glow">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-[#D4A017] fill-[#D4A017]" />
                    <div>
                      <span className="text-xs font-bold text-text-primary block">100% Handcrafted</span>
                      <span className="text-[10px] text-text-secondary">By Master Artisans</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. SHOP BY CATEGORY — with images */}
      <section className="py-16 sm:py-24">
        <Container size="xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#D4A017] font-bold block mb-2">
                ✦ Curated Collections
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary">
                Shop by Style & Occasion
              </h2>
            </div>
            <Link
              href="/shop"
              className="mt-4 sm:mt-0 text-sm font-semibold text-brand hover:text-brand-hover inline-flex items-center gap-1 group"
            >
              Browse All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="group relative overflow-hidden rounded-2xl h-72 border border-border hover:border-[#D4A017]/50 transition-all hover:shadow-xl"
              >
                {/* Category Image */}
                <Image
                  src={CATEGORY_IMAGES[category.slug] || HERO_IMAGE}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/90 via-[#1A1A2E]/40 to-transparent group-hover:from-[#8B1A4A]/90 transition-colors duration-500" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <div className="w-10 h-10 rounded-full bg-[#D4A017]/20 backdrop-blur-sm flex items-center justify-center mb-3 border border-[#D4A017]/30 group-hover:bg-[#D4A017] group-hover:text-[#1A1A2E] transition-all">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-xl font-bold">{category.name}</h3>
                  <p className="text-xs text-white/70 line-clamp-2 mt-1 leading-relaxed">
                    {category.description}
                  </p>
                  <span className="mt-3 text-xs font-semibold text-[#F0D060] inline-flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                    Explore →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF3E6] via-bg-primary to-bg-primary" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4A017]/30 to-transparent" />

        <Container size="xl" className="relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-[#D4A017] font-bold block mb-2">
              ✦ Handpicked Heirlooms
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary">
              Featured Bridal & Statement Bangles
            </h2>
            <p className="text-sm text-text-secondary mt-3 leading-relaxed">
              Our most celebrated designs, favored by brides and jewellery collectors across Pakistan.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/shop">
              <Button variant="primary" size="lg" className="shadow-md group">
                View All Handcrafted Bangles
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* 4. ARTISANAL CRAFTSMANSHIP STORY — with image */}
      <section className="py-16 sm:py-24">
        <Container size="xl">
          <div className="overflow-hidden rounded-3xl border border-[#D4A017]/20 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image Side */}
              <div className="relative h-72 lg:h-auto">
                <Image
                  src={STORY_IMAGE}
                  alt="Traditional bangle craftsmanship"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1A1A2E]/20 lg:bg-none" />
              </div>

              {/* Content Side */}
              <div className="bg-gradient-to-br from-[#FFF3E6] via-bg-primary to-[#FCE4EC] p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#D4A017]/15 px-4 py-1.5 text-xs font-bold text-[#B8860B] w-fit">
                  <Heart className="h-3.5 w-3.5 fill-[#D4A017] text-[#D4A017]" />
                  The Heritage of GULNAAR
                </span>

                <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary leading-tight mt-5">
                  Rooted in Centuries of{' '}
                  <span className="text-brand">Artisanal Mastery</span>
                </h2>

                <p className="text-sm text-text-secondary leading-relaxed mt-4">
                  Every bangle begins with hand-poured brass, shaped and embellished by third-generation karigars who pour patience, soul, and heritage into every curve.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                  {[
                    { title: 'Solid Brass Base', desc: 'Hypoallergenic & durable for decades' },
                    { title: 'Hand-Set Stones', desc: 'Real Kundan, pearls & zircons' },
                    { title: 'Velvet Presentation', desc: 'Luxury keepsake box included' },
                  ].map((item) => (
                    <div key={item.title} className="rounded-xl bg-white/80 backdrop-blur-sm p-4 border border-[#D4A017]/15 hover:border-[#D4A017]/40 hover:shadow-md transition-all">
                      <h4 className="font-heading font-semibold text-brand text-sm mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-text-secondary leading-normal">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Link href="/about">
                    <Button variant="secondary" size="md" className="group">
                      Read Our Full Story
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. LATEST PRODUCTS */}
      <section className="py-16 sm:py-24">
        <Container size="xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#D4A017] font-bold block mb-2">
                ✦ New Additions
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary">
                Explore the Latest Pieces
              </h2>
            </div>
            <Link
              href="/shop"
              className="mt-4 sm:mt-0 text-sm font-semibold text-brand hover:text-brand-hover inline-flex items-center gap-1 group"
            >
              Open Full Catalog <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {allProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </section>

      {/* 6. FULL-WIDTH CTA BANNER */}
      <section className="relative overflow-hidden mx-4 sm:mx-8 lg:mx-auto lg:max-w-7xl rounded-3xl min-h-[400px]">
        <Image
          src={CTA_IMAGE}
          alt="Beautiful bangles collection"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#8B1A4A]/95 to-[#8B1A4A]/70" />

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[400px] text-center px-6 py-16">
          <Crown className="h-12 w-12 text-[#F0D060] mb-4" />
          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-white max-w-2xl leading-tight">
            Begin Your Bridal Journey with GULNAAR
          </h2>
          <p className="text-base text-white/80 mt-4 max-w-lg">
            Discover handcrafted bangles that become cherished family heirlooms. Every piece tells a story of artisanal love.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href="/shop?category=bridal">
              <Button variant="primary" size="lg" className="bg-gradient-to-r from-[#D4A017] to-[#B8860B] text-[#1A1A2E] font-bold shadow-gold border-0 hover:from-[#F0D060] hover:to-[#D4A017]">
                <Crown className="h-4 w-4 mr-1" />
                Shop Bridal Collection
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="lg" className="border-white/40 text-white hover:bg-white/10 hover:text-white">
                Custom Order Inquiry
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. TRUST BADGES */}
      <section className="py-16">
        <Container size="xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Cash on Delivery', desc: 'Across all cities in Pakistan', color: 'from-brand to-brand-hover' },
              { icon: Sparkles, title: '100% Handcrafted', desc: 'Authentic artisanal jewellery', color: 'from-[#D4A017] to-[#B8860B]' },
              { icon: ShieldCheck, title: 'Free Shipping', desc: 'On orders over PKR 5,000', color: 'from-[#1B5E20] to-[#2E7D32]' },
              { icon: RefreshCw, title: 'Easy Exchanges', desc: '3-day size exchange guarantee', color: 'from-[#E91E63] to-[#C62828]' },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center p-5 rounded-2xl bg-bg-secondary border border-border hover:border-[#D4A017]/30 hover:shadow-md transition-all group">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-sm group-hover:scale-110 transition-transform mb-3`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  {item.title}
                </h4>
                <p className="text-[11px] text-text-secondary mt-0.5">{item.desc}</p>
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
    <Suspense fallback={<div className="min-h-screen bg-bg-primary" />}>
      <HomeContent />
    </Suspense>
  );
}
