import React from 'react';
import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/db/products';
import ProductCard from '@/components/product/ProductCard';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { Sparkles, ArrowRight, Heart, Star, CheckCircle } from 'lucide-react';

export default async function HomePage() {
  const categories = await getCategories();
  const featuredProducts = await getProducts({ isFeatured: true, limit: 4 });
  const allProducts = await getProducts({ limit: 8 });

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-bg-secondary via-bg-primary to-bg-primary pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-border">
        {/* Subtle decorative background circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-3xl pointer-events-none" />

        <Container size="xl" className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-bg-surface/80 px-4 py-1.5 text-xs font-medium text-brand backdrop-blur-xs">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                <span>Heirloom Bangles • Handcrafted in Lahore</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-[1.15]">
                Artisanal Bangles Crafted for Your Sacred Celebrations
              </h1>

              <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Immerse yourself in timeless South Asian jewellery artistry. From opulent bridal Kundan sets to everyday silk thread bangles, each piece is hand-assembled by master artisans.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href="/shop?category=bridal">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-md group">
                    Explore Bridal Collection
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    View All Bangles
                  </Button>
                </Link>
              </div>

              {/* Delivery Assurance */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-text-secondary">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-brand" />
                  <span>Cash on Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-brand" />
                  <span>Free Shipping Over PKR 5,000</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-brand" />
                  <span>3-Day Exchange</span>
                </div>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md overflow-hidden rounded-2xl bg-gradient-to-tr from-bg-secondary via-bg-surface to-[#F5E6E9] p-8 border border-border shadow-xl">
                <div className="relative aspect-square w-full rounded-xl bg-white/70 backdrop-blur-xs border border-gold/30 flex flex-col items-center justify-center p-6 text-center shadow-inner">
                  {/* Ornate Medallion */}
                  <div className="relative w-40 h-40 rounded-full border-4 border-gold/40 flex items-center justify-center p-3 mb-4 shadow-sm">
                    <div className="w-full h-full rounded-full border-2 border-dashed border-brand/50 flex flex-col items-center justify-center bg-brand-light/30">
                      <Sparkles className="h-10 w-10 text-gold mb-1 animate-pulse" />
                      <span className="font-heading text-xs font-bold text-brand tracking-widest uppercase">
                        GULNAAR
                      </span>
                      <span className="text-[9px] uppercase tracking-widest text-text-secondary">
                        Master Craft
                      </span>
                    </div>
                  </div>

                  <h3 className="font-heading text-lg font-semibold text-text-primary">
                    Kundan Bridal Kangan Set
                  </h3>
                  <p className="text-xs text-text-secondary mt-1">
                    Hand-dipped 24K gold brass with traditional seed pearls
                  </p>
                  <p className="font-bold text-sm text-brand mt-3">
                    PKR 12,500
                  </p>

                  <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-medium text-brand bg-white px-3 py-1 rounded-full border border-border">
                    <Star className="h-3 w-3 text-gold fill-gold" />
                    <span>Signature Bridal Favorite</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. SHOP BY CATEGORY */}
      <section>
        <Container size="xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-brand font-semibold block mb-1">
                Curated Collections
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
                Shop by Style & Occasion
              </h2>
            </div>
            <Link
              href="/shop"
              className="mt-3 sm:mt-0 text-sm font-medium text-brand hover:text-brand-hover inline-flex items-center gap-1"
            >
              Browse All Categories <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-xl bg-bg-secondary border border-border p-6 transition-all duration-300 hover:border-gold/50 hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-full bg-brand-light text-brand flex items-center justify-center mb-4 group-hover:bg-brand group-hover:text-text-inverse transition-colors">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-text-primary group-hover:text-brand transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-text-secondary line-clamp-2 mt-2 leading-relaxed">
                  {category.description}
                </p>
                <span className="mt-4 text-xs font-semibold text-brand inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore Collection &rarr;
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. FEATURED PRODUCTS GRID */}
      <section className="bg-bg-secondary/60 py-16 border-y border-border">
        <Container size="xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-brand font-semibold block mb-1">
              Handpicked Heirlooms
            </span>
            <h2 className="font-heading text-3xl font-bold text-text-primary">
              Featured Bridal & Statement Bangles
            </h2>
            <p className="text-sm text-text-secondary mt-2">
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
              <Button variant="secondary" size="lg">
                View All Handcrafted Bangles
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* 4. ARTISANAL CRAFTSMANSHIP STORY */}
      <section>
        <Container size="xl">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-bg-secondary via-bg-surface to-bg-secondary p-8 sm:p-12 lg:p-16 border border-border">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold">
                <Heart className="h-3.5 w-3.5 text-gold" />
                The Heritage of GULNAAR
              </span>

              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary leading-tight">
                Rooted in Centuries of South Asian Artisanal Mastery
              </h2>

              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                In an era of mass-produced accessories, GULNAAR by MK stands steadfast in protecting authentic craft. Every bangle begins with hand-poured brass, shaped and embellished by third-generation karigars who pour patience, soul, and heritage into every curve.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-left">
                <div className="rounded-xl bg-white/70 backdrop-blur-xs p-5 border border-border">
                  <h4 className="font-heading font-semibold text-brand text-sm mb-1">
                    Solid Brass Base
                  </h4>
                  <p className="text-xs text-text-secondary leading-normal">
                    Hypoallergenic, weighty core designed to resist bending and retain shape across decades.
                  </p>
                </div>

                <div className="rounded-xl bg-white/70 backdrop-blur-xs p-5 border border-border">
                  <h4 className="font-heading font-semibold text-brand text-sm mb-1">
                    Hand-Set Stones
                  </h4>
                  <p className="text-xs text-text-secondary leading-normal">
                    Real Kundan stones, natural seed pearls, and American diamond zircons hand-mounted with care.
                  </p>
                </div>

                <div className="rounded-xl bg-white/70 backdrop-blur-xs p-5 border border-border">
                  <h4 className="font-heading font-semibold text-brand text-sm mb-1">
                    Velvet Presentation
                  </h4>
                  <p className="text-xs text-text-secondary leading-normal">
                    Arrives in our custom keepsake velvet box, ideal for bridal trousseaus and gifting.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/about">
                  <Button variant="ghost" size="md" className="text-brand hover:text-brand-hover">
                    Read Our Full Story &rarr;
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. COMPLETE CATALOG SPOTLIGHT */}
      <section>
        <Container size="xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-brand font-semibold block mb-1">
                New Additions
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
                Explore the Latest Pieces
              </h2>
            </div>
            <Link
              href="/shop"
              className="mt-3 sm:mt-0 text-sm font-medium text-brand hover:text-brand-hover inline-flex items-center gap-1"
            >
              Open Full Catalog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {allProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
