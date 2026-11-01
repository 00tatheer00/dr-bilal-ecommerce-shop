'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Crown, ArrowRight, Award, Check, Eye } from 'lucide-react';
import Button from '@/components/ui/Button';

interface HeroSlide {
  id: string;
  badge: string;
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  bgImage: string;
  cardImage: string;
  productName: string;
  productSubtitle: string;
  price: string;
  originalPrice?: string;
  productHref: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'bridal',
    badge: 'Bridal Season 2026 Collection',
    titlePrefix: 'Heirloom Bangles',
    titleHighlight: 'Sculpted in Gold',
    titleSuffix: 'for Sacred Vows',
    description:
      'Immerse yourself in authentic South Asian jewellery heritage. Hand-poured 24K dipped brass, uncut Kundan stones, and clustered seed pearls assembled by Lahore master karigars.',
    ctaText: 'Explore Bridal Collection',
    ctaHref: '/shop?category=bridal',
    bgImage: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1920&auto=format&fit=crop&q=85',
    cardImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=85',
    productName: 'Kundan Bridal Kangan Set',
    productSubtitle: '24K Dipped Brass Core • Seed Pearls',
    price: 'PKR 12,500',
    originalPrice: 'PKR 15,000',
    productHref: '/shop/kundan-bridal-kangan-set',
  },
  {
    id: 'meenakari',
    badge: 'Artisanal Enamel Heritage',
    titlePrefix: 'Vibrant Petals',
    titleHighlight: 'Hand-Painted Enamel',
    titleSuffix: 'Meenakari Artistry',
    description:
      'Echoing the royal courts of the Mughal era. Every stroke of crimson and emerald enamel is hand-applied over carved brass and kilned to immortal brilliance.',
    ctaText: 'Discover Meenakari Kadas',
    ctaHref: '/shop?category=kundan-meenakari',
    bgImage: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1920&auto=format&fit=crop&q=85',
    cardImage: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&auto=format&fit=crop&q=85',
    productName: 'Jaipur Enamel Royal Kada Pair',
    productSubtitle: 'Hand-Glazed Floral Motifs • Openable Screw',
    price: 'PKR 8,900',
    originalPrice: 'PKR 10,500',
    productHref: '/shop/meenakari-hand-painted-bangles',
  },
  {
    id: 'velvet-glass',
    badge: 'Timeless Everyday Splendour',
    titlePrefix: 'Silk-Wrapped',
    titleHighlight: 'Velvet & Glass',
    titleSuffix: 'Melodic Grace',
    description:
      'The sacred melody of subcontinent glass bangles, reimagined with rich plush velvet cushioning and delicate micro-bead borders for effortless day-to-night elegance.',
    ctaText: 'Shop Everyday Bangles',
    ctaHref: '/shop?category=everyday',
    bgImage: 'https://images.unsplash.com/photo-1515562141589-67f0d569b6fc?w=1920&auto=format&fit=crop&q=85',
    cardImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=85',
    productName: 'Emerald Velvet Glass Churi Set',
    productSubtitle: 'Set of 24 Silk-Edged Velvet Bangles',
    price: 'PKR 4,800',
    originalPrice: 'PKR 5,500',
    productHref: '/shop/glass-bangles-set-emerald',
  },
];

export default function LuxuryHero() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeSlide = HERO_SLIDES[currentSlideIndex];

  // Auto-slide every 6.5 seconds unless user hovers
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setTimeout(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentSlideIndex, isPaused]);

  return (
    <section
      className="relative overflow-hidden bg-[#0F0E17] text-white min-h-[680px] lg:min-h-[820px] flex flex-col justify-between"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. CINEMATIC BACKGROUND WITH HIGH-FASHION CROSS-FADE */}
      <div className="absolute inset-0 pointer-events-none">
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlideIndex ? 'opacity-40' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.bgImage}
              alt={slide.titlePrefix}
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover scale-105 transition-transform duration-10000 ease-out"
            />
          </div>
        ))}

        {/* Multi-layer luxury vignettes & ambient gold glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F0E17] via-[#0F0E17]/85 to-[#7A0C2E]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0E17] via-transparent to-[#0F0E17]/70" />
        <div className="absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-[#DFB76C]/20 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#DFB76C]/40 to-transparent" />
      </div>

      {/* 2. MAIN EDITORIAL CONTENT GRID */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center w-full">
          
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            
            {/* Atelier Crest Badge */}
            <div className="inline-flex items-center gap-3 rounded-full border border-[#DFB76C]/60 bg-white/10 backdrop-blur-md px-4.5 py-1.5 text-xs font-bold text-[#DFB76C] shadow-[0_0_24px_rgba(223,183,108,0.25)] transition-all">
              <div className="relative h-6 w-6 shrink-0 drop-shadow-sm">
                <Image
                  src="/images/logo-icon.png"
                  alt="GULNAAR Crest"
                  fill
                  sizes="24px"
                  className="object-contain"
                />
              </div>
              <span className="tracking-wider uppercase text-[11px]">
                {activeSlide.badge}
              </span>
            </div>

            {/* Majestic High-Fashion Title */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[4.25rem] font-bold tracking-tight text-white leading-[1.08]">
              {activeSlide.titlePrefix}{' '}
              <span className="bg-gradient-to-r from-[#FFF5DC] via-[#DFB76C] to-[#C5A059] bg-clip-text text-transparent block sm:inline">
                {activeSlide.titleHighlight}
              </span>{' '}
              <span className="text-white/95">{activeSlide.titleSuffix}</span>
            </h1>

            {/* Editorial Story Paragraph */}
            <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
              {activeSlide.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href={activeSlide.ctaHref} prefetch={true} className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-[#DFB76C] via-[#C5A059] to-[#DFB76C] hover:from-[#FFF5DC] hover:to-[#DFB76C] text-[#4A0E2E] font-bold shadow-[0_12px_36px_rgba(223,183,108,0.35)] border border-[#DFB76C] btn-luxury-shine group px-8"
                >
                  <Crown className="h-4 w-4 mr-2 text-[#4A0E2E]" />
                  <span>{activeSlide.ctaText}</span>
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/shop" prefetch={true} className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto border-white/30 bg-white/5 text-white hover:bg-white/15 backdrop-blur-md px-7"
                >
                  Browse Entire Vault &rarr;
                </Button>
              </Link>
            </div>

            {/* Trust Assurance Bar */}
            <div className="pt-5 flex items-center justify-center lg:justify-start gap-6 text-xs text-white/75 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-[#DFB76C]/20 flex items-center justify-center">
                  <Check className="h-3 w-3 text-[#DFB76C]" />
                </div>
                <span className="font-semibold text-white/90">Cash on Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-[#DFB76C]/20 flex items-center justify-center">
                  <Check className="h-3 w-3 text-[#DFB76C]" />
                </div>
                <span className="font-semibold text-white/90">Doorstep Inspection</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-[#DFB76C]/20 flex items-center justify-center">
                  <Check className="h-3 w-3 text-[#DFB76C]" />
                </div>
                <span className="font-semibold text-white/90">Free Delivery 5K+</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating 3D Jewelry Showcase Card */}
          <div className="hidden lg:flex lg:col-span-5 justify-center">
            <div className="relative w-full max-w-sm">
              
              {/* Floating Top Artisan Seal */}
              <div className="absolute -top-6 -right-6 z-20 flex items-center gap-2 rounded-2xl bg-[#0F0E17]/90 backdrop-blur-xl border border-[#DFB76C]/60 px-4 py-2.5 shadow-2xl animate-float">
                <div className="relative h-8 w-8 shrink-0">
                  <Image
                    src="/images/logo-icon.png"
                    alt="Artisan Seal"
                    fill
                    sizes="32px"
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#DFB76C] block">
                    Master Karigar
                  </span>
                  <span className="text-[9px] text-white/70 block">
                    Lahore Heritage Atelier
                  </span>
                </div>
              </div>

              {/* Main 3D Glass Showcase Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.7)] border-2 border-[#DFB76C]/40 bg-white/5 backdrop-blur-xl group transition-all duration-500 hover:border-[#DFB76C]">
                {/* Product Photo with Smooth Optical Zoom */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#1E1926]">
                  <Image
                    src={activeSlide.cardImage}
                    alt={activeSlide.productName}
                    fill
                    sizes="420px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F0E17] via-[#0F0E17]/30 to-transparent" />
                  
                  {/* Category Pill Tag */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#7A0C2E] to-[#4A0E2E] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#DFB76C] border border-[#DFB76C]/40 shadow-md">
                      <Crown className="h-3 w-3" />
                      Signature Edit
                    </span>
                  </div>
                </div>

                {/* Card Content Overlay */}
                <div className="p-6 text-white space-y-3">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-white group-hover:text-[#DFB76C] transition-colors">
                      {activeSlide.productName}
                    </h3>
                    <p className="text-xs text-white/70 mt-1 line-clamp-1">
                      {activeSlide.productSubtitle}
                    </p>
                  </div>

                  {/* Price & Action Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/15">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-heading font-bold text-xl text-[#DFB76C]">
                          {activeSlide.price}
                        </span>
                        {activeSlide.originalPrice && (
                          <span className="text-xs text-white/40 line-through">
                            {activeSlide.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold block">
                        Cash on Delivery Available
                      </span>
                    </div>

                    <Link
                      href={activeSlide.productHref}
                      prefetch={true}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-[#DFB76C] text-white hover:text-[#4A0E2E] px-3.5 py-2 text-xs font-bold transition-all border border-white/20 group/btn"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Details</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Floating Bottom Social Proof Badge */}
              <div className="absolute -bottom-6 -left-8 z-20 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-4 border border-[#DFB76C]/50 animate-pulse-gold max-w-[280px]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#7A0C2E] to-[#4A0E2E] flex items-center justify-center text-[#DFB76C] shadow-md shrink-0">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0F0E17] block leading-tight">
                      1,400+ Brides Adorned
                    </span>
                    <span className="text-[10px] text-text-secondary block mt-0.5">
                      4.95/5 Karigar Excellence Rating
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* 3. INTERACTIVE SLIDE NAVIGATION DOCKS */}
      <div className="relative z-10 border-t border-white/10 bg-[#0F0E17]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = idx === currentSlideIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`text-left p-3 rounded-2xl transition-all duration-300 cursor-pointer flex items-center gap-3 border ${
                    isActive
                      ? 'bg-white/15 border-[#DFB76C] shadow-md'
                      : 'bg-white/5 border-transparent hover:bg-white/10'
                  }`}
                >
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
                      isActive
                        ? 'bg-gradient-to-br from-[#DFB76C] to-[#C5A059] text-[#4A0E2E]'
                        : 'bg-white/10 text-white/70'
                    }`}
                  >
                    0{idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span
                      className={`text-xs font-bold block truncate ${
                        isActive ? 'text-[#DFB76C]' : 'text-white/90'
                      }`}
                    >
                      {slide.productName}
                    </span>
                    <span className="text-[10px] text-white/50 block truncate">
                      {slide.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
