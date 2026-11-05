import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts, getCategories } from '@/lib/db/products';
import LuxuryHero from '@/components/home/LuxuryHero';
import CategoryStoriesBar from '@/components/home/CategoryStoriesBar';
import InteractiveProductCatalog from '@/components/home/InteractiveProductCatalog';
import ProductCard from '@/components/product/ProductCard';
import Container from '@/components/ui/Container';
import { Gem, Crown, Truck, ShieldCheck, RefreshCw, Star, ArrowRight, HeartHandshake } from 'lucide-react';

async function HomeContent() {
  const [categories, allProducts] = await Promise.all([
    getCategories(),
    getProducts({ limit: 16 }),
  ]);

  // Featured / Bestsellers
  const bestsellers = allProducts.filter((p) => p.is_featured).slice(0, 4);
  const trendingList = bestsellers.length > 0 ? bestsellers : allProducts.slice(0, 4);

  // Budget Favorites (Under Rs 4,000)
  const budgetProducts = allProducts
    .filter((p) => {
      const minPrice = p.variants?.reduce(
        (min, v) => (v.price_cents < min ? v.price_cents : min),
        Infinity
      );
      return minPrice && minPrice <= 400000;
    })
    .slice(0, 4);

  return (
    <div className="w-full bg-[#FFFFFF] text-text-primary">
      {/* 1. MOBILE-FIRST STORY CATEGORY CIRCLES */}
      <CategoryStoriesBar />

      {/* 2. LUMINOUS WHITE HERO BANNER SLIDER */}
      <LuxuryHero />

      {/* 3. DIRECT INTERACTIVE PRODUCTS CATALOG WITH LIVE TABS */}
      <InteractiveProductCatalog
        initialProducts={allProducts}
        categories={categories}
      />

      {/* 4. TRENDING BESTSELLERS ROW (2-COL MOBILE GRID) */}
      <section className="py-8 sm:py-12 bg-[#FFF9FB] border-y border-[#F0DFE7]">
        <Container size="xl">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B81D4E] mb-1">
                <Crown className="h-3.5 w-3.5 text-[#D4AF37]" />
                <span>Customer Favorites</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                Trending Bestsellers
              </h2>
            </div>
            <Link
              href="/shop?category=bridal"
              prefetch={true}
              className="text-xs sm:text-sm font-bold text-[#B81D4E] hover:text-[#8E0E3B] inline-flex items-center gap-1 group"
            >
              <span>See More</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {trendingList.map((product) => (
              <ProductCard key={`trending-${product.id}`} product={product} />
            ))}
          </div>
        </Container>
      </section>

      {/* 5. SHOP BY COLLECTION FEATURED TILES (CLEAN WHITE THEME) */}
      <section className="py-8 sm:py-12 bg-[#FFFFFF]">
        <Container size="xl">
          <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
            <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-bold block mb-1">
              Curated by Occasion
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
              Popular Bangle Vaults
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                title: 'Bridal Kangan Sets',
                desc: '24K dipped Kundan & clustered seed pearls for brides',
                href: '/shop?category=bridal',
                image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&auto=format&fit=crop&q=80',
                badge: 'Royal Bridal',
              },
              {
                title: 'Velvet & Glass Churis',
                desc: 'Comfortable plush velvet cushioning in vibrant hues',
                href: '/shop?category=everyday',
                image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=80',
                badge: 'Sets of 24',
              },
              {
                title: 'Jaipur Meenakari Kadas',
                desc: 'Solid brass with handcrafted floral enamel glazing',
                href: '/shop?category=kundan-meenakari',
                image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&auto=format&fit=crop&q=80',
                badge: 'Artisanal',
              },
            ].map((col) => (
              <Link
                key={col.title}
                href={col.href}
                prefetch={true}
                className="group relative h-48 sm:h-64 rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E8E5DF] shadow-xs hover:shadow-md transition-all duration-300"
              >
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-[#F6D365] uppercase tracking-wider mb-1.5 border border-white/20">
                    {col.badge}
                  </span>
                  <h3 className="font-heading text-lg sm:text-xl font-bold leading-tight">
                    {col.title}
                  </h3>
                  <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5">
                    {col.desc}
                  </p>
                  <span className="text-xs font-bold text-[#F6D365] inline-flex items-center gap-1 mt-2 group-hover:translate-x-1 transition-transform">
                    Shop Collection &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 6. AFFORDABLE FAVORITES (UNDER RS 4,000) — LIKE KAAJTAANKA */}
      {budgetProducts.length > 0 && (
        <section className="py-8 sm:py-12 bg-[#FFF9FB] border-y border-[#F0DFE7]">
          <Container size="xl">
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B81D4E] mb-1">
                  <Gem className="h-3.5 w-3.5 text-[#D4AF37]" />
                  <span>Pocket-Friendly Luxury</span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                  Everyday Bangles Under Rs 4,000
                </h2>
              </div>
              <Link
                href="/shop?category=everyday"
                prefetch={true}
                className="text-xs sm:text-sm font-bold text-[#B81D4E] hover:text-[#8E0E3B] inline-flex items-center gap-1 group"
              >
                <span>View All</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {budgetProducts.map((product) => (
                <ProductCard key={`budget-${product.id}`} product={product} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 7. FOUR PILLARS VALUE PROPOSITION (CLEAN WHITE AESTHETIC) */}
      <section className="py-10 sm:py-14 bg-[#FFFFFF]">
        <Container size="xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[
              {
                icon: Truck,
                title: 'Cash on Delivery',
                desc: 'Open parcel doorstep check across Pakistan',
              },
              {
                icon: Gem,
                title: '100% Handcrafted',
                desc: 'Artisanal karigars in Lahore atelier',
              },
              {
                icon: ShieldCheck,
                title: 'Free Express Courier',
                desc: 'Complimentary shipping on orders 5k+',
              },
              {
                icon: RefreshCw,
                title: 'Size Exchange',
                desc: 'Hassle-free 3-day bangle size swap',
              },
            ].map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="p-4 sm:p-5 rounded-2xl bg-[#FFF9FB] border border-[#F0DFE7] text-center flex flex-col items-center justify-center hover:border-[#D4AF37] transition-colors"
                >
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-white border border-[#F0DFE7] flex items-center justify-center text-[#B81D4E] mb-2.5 shadow-xs">
                    <Icon className="h-5 w-5 text-[#B81D4E]" />
                  </div>
                  <h4 className="font-heading text-xs sm:text-sm font-bold text-text-primary">
                    {pillar.title}
                  </h4>
                  <p className="text-[11px] text-text-secondary mt-0.5 leading-snug">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 8. VERIFIED CUSTOMER REVIEWS (AUTHENTIC PAKISTANI BUYERS) */}
      <section className="py-8 sm:py-12 bg-[#FAF9F6] border-t border-[#E8E5DF]">
        <Container size="xl">
          <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
            <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-bold block mb-1">
              Verified Shopper Love
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
              What Pakistani Brides Say
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                name: 'Ayesha Khan',
                city: 'Lahore (DHA Phase 5)',
                text: 'The bridal kangan set was breathtaking in real life! The weight feels like solid pure gold and the doorstep parcel check gave me 100% peace of mind.',
                rating: 5,
              },
              {
                name: 'Fatima Zahra',
                city: 'Karachi (Clifton)',
                text: 'Ordered 2 sets of silk velvet churis for a family wedding. The chime and comfort are unmatched. Arrived in Karachi in just 2 days via express courier.',
                rating: 5,
              },
              {
                name: 'Mariam Tariq',
                city: 'Islamabad (F-7)',
                text: 'Hands down the most professional handmade jewelry brand in Pakistan. Customer service on WhatsApp guided me through size 2.4 and it fit like a dream!',
                rating: 5,
              },
            ].map((review) => (
              <div
                key={review.name}
                className="p-5 rounded-2xl bg-white border border-[#E8E5DF] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#D4AF37] mb-2.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-[#D4AF37]" />
                    ))}
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed italic">
                    &ldquo;{review.text}&rdquo;
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8E5DF] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-text-primary block">
                      {review.name}
                    </span>
                    <span className="text-[10px] text-text-secondary">
                      {review.city}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <HeartHandshake className="h-3 w-3" />
                    Verified
                  </span>
                </div>
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
