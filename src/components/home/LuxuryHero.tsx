'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Crown, ArrowRight, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface HeroSlide {
  id: string;
  badge: string;
  subtitle: string;
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  bgImage: string;
  tagline: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'bridal-couture',
    badge: 'Bridal Couture 2026',
    subtitle: 'Lahore Heritage Atelier',
    titlePrefix: 'Royal Kundan',
    titleHighlight: 'Kangans & Churis',
    titleSuffix: 'for the Modern Bride',
    description:
      'Immerse in the timeless opulence of royal wedding traditions. Hand-poured 24K gold dipped brass, hand-set uncut Kundan gems, and clustered seed pearls assembled by generational Lahore karigars.',
    ctaText: 'Shop Bridal Collection',
    ctaHref: '/shop?category=bridal',
    secondaryCtaText: 'View All Bangles',
    secondaryCtaHref: '/shop',
    bgImage: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=2000&auto=format&fit=crop&q=90',
    tagline: '24K Dipped Gold • Clustered Seed Pearls • Heirloom Quality',
  },
  {
    id: 'meenakari-royals',
    badge: 'Artisanal Enamel Heritage',
    subtitle: 'Mughal Craftsmanship',
    titlePrefix: 'Hand-Painted',
    titleHighlight: 'Meenakari Kadas',
    titleSuffix: '& Enamel Cuffs',
    description:
      'Echoing the regal magnificence of imperial courts. Every floral petal and leaf is hand-glazed in lustrous crimson, ruby, and emerald enamel over carved solid brass, kilned to eternal radiance.',
    ctaText: 'Discover Meenakari',
    ctaHref: '/shop?category=kundan-meenakari',
    secondaryCtaText: 'Statement Cuffs',
    secondaryCtaHref: '/shop?category=statement',
    bgImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=2000&auto=format&fit=crop&q=90',
    tagline: 'Hand-Glazed Jaipur Enamel • Openable Screw Fit • Pure Brass',
  },
  {
    id: 'velvet-glass',
    badge: 'Festive Everyday Luxury',
    subtitle: 'The Sound of Grace',
    titlePrefix: 'Silk-Wrapped',
    titleHighlight: 'Velvet & Glass',
    titleSuffix: 'Churi Collections',
    description:
      'The romantic, sacred chime of subcontinent glass bangles, reimagined with rich plush velvet cushioning and delicate micro-bead embroidery for day-to-night festive celebrations.',
    ctaText: 'Explore Velvet Churis',
    ctaHref: '/shop?category=everyday',
    secondaryCtaText: 'Bangle Sizing Guide',
    secondaryCtaHref: '/size-guide',
    bgImage: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=2000&auto=format&fit=crop&q=90',
    tagline: 'Featherlight Comfort • Rich Velvet Finish • Set of 24 Pieces',
  },
  {
    id: 'imperial-trousseau',
    badge: 'Signature Masterpieces',
    subtitle: 'Trousseau Vault',
    titlePrefix: 'Imperial Statement',
    titleHighlight: 'Openable Kadas',
    titleSuffix: '& Antique Brass',
    description:
      'Commanding heritage bangles featuring intricate openwork lattice, raised floral embossing, and secure vintage screw clasps designed to be treasured across generations.',
    ctaText: 'Browse Statement Pieces',
    ctaHref: '/shop?category=statement',
    secondaryCtaText: 'Our Atelier Story',
    secondaryCtaHref: '/about',
    bgImage: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=2000&auto=format&fit=crop&q=90',
    tagline: 'Solid Brass Core • Hypoallergenic • Doorstep Parcel Check',
  },
];

export default function LuxuryHero() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const totalSlides = HERO_SLIDES.length;

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto-slide every 5.5s
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <section
      className="relative overflow-hidden bg-[#0A0910] text-white w-full h-[640px] sm:h-[720px] lg:h-[780px] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Featured Collections Slider"
    >
      {/* 1. FULL-WIDTH CINEMATIC SLIDES CONTAINER */}
      <div className="absolute inset-0">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlideIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Full-bleed background image with subtle cinematic zoom */}
              <div className="relative h-full w-full">
                <Image
                  src={slide.bgImage}
                  alt={slide.titlePrefix}
                  fill
                  priority={idx === 0}
                  sizes="100vw"
                  className={`object-cover object-center transition-transform duration-[6000ms] ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                />
              </div>

              {/* Multi-layer luxury dark vignettes for pristine readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0910]/95 via-[#0A0910]/75 to-[#0A0910]/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0910] via-transparent to-[#0A0910]/60" />
              <div className="absolute inset-0 bg-[#7A0C2E]/20 mix-blend-multiply" />
            </div>
          );
        })}
      </div>

      {/* 2. CENTERED / EDITORIAL CONTENT LAYER */}
      <div className="relative z-20 h-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlideIndex;
          if (!isActive) return null;

          return (
            <div
              key={slide.id}
              className="max-w-3xl space-y-6 sm:space-y-8 animate-fade-in"
            >
              {/* Brand Crest & Category Badge */}
              <div className="inline-flex items-center gap-3 rounded-full border border-[#DFB76C]/50 bg-black/40 backdrop-blur-md px-4 py-1.5 shadow-[0_0_24px_rgba(223,183,108,0.25)]">
                <div className="relative h-6 w-6 shrink-0 drop-shadow-sm">
                  <Image
                    src="/images/logo-icon.png"
                    alt="GULNAAR Crest"
                    fill
                    sizes="24px"
                    className="object-contain"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#DFB76C] tracking-widest uppercase">
                  <span>{slide.badge}</span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/80 font-normal">{slide.subtitle}</span>
                </div>
              </div>

              {/* Majestic Editorial Title */}
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-[4.25rem] font-bold tracking-tight text-white leading-[1.08]">
                {slide.titlePrefix}{' '}
                <span className="bg-gradient-to-r from-[#FFF5DC] via-[#DFB76C] to-[#C5A059] bg-clip-text text-transparent">
                  {slide.titleHighlight}
                </span>{' '}
                <span className="text-white/95">{slide.titleSuffix}</span>
              </h1>

              {/* Editorial Description */}
              <p className="text-base sm:text-lg lg:text-xl text-white/85 leading-relaxed font-normal max-w-2xl">
                {slide.description}
              </p>

              {/* Craftsmanship Tagline */}
              <div className="text-xs text-[#DFB76C] font-semibold tracking-wider uppercase border-l-2 border-[#DFB76C] pl-3 py-0.5">
                {slide.tagline}
              </div>

              {/* Dual Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
                <Link
                  href={slide.ctaHref}
                  prefetch={true}
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#DFB76C] via-[#C5A059] to-[#DFB76C] hover:from-[#7A0C2E] hover:via-[#560820] hover:to-[#7A0C2E] text-[#3B0411] hover:text-[#FFF5DC] font-bold text-sm sm:text-base border-2 border-[#DFB76C] hover:border-[#DFB76C] shadow-[0_10px_30px_rgba(223,183,108,0.4)] hover:shadow-[0_14px_40px_rgba(122,12,46,0.6)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] btn-luxury-shine cursor-pointer"
                >
                  <Crown className="h-4.5 w-4.5 text-[#3B0411] group-hover:text-[#DFB76C] transition-colors duration-300 shrink-0" />
                  <span className="tracking-wider uppercase text-xs sm:text-sm">{slide.ctaText}</span>
                  <ArrowRight className="h-4.5 w-4.5 text-[#3B0411] group-hover:text-[#DFB76C] transition-all duration-300 group-hover:translate-x-1.5 shrink-0" />
                </Link>

                {slide.secondaryCtaText && slide.secondaryCtaHref && (
                  <Link
                    href={slide.secondaryCtaHref}
                    prefetch={true}
                    className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#0F0E17] font-bold text-sm sm:text-base border border-white/30 hover:border-white shadow-md hover:shadow-[0_10px_30px_rgba(255,255,255,0.25)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] cursor-pointer"
                  >
                    <span className="tracking-wider uppercase text-xs sm:text-sm">{slide.secondaryCtaText}</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1.5">&rarr;</span>
                  </Link>
                )}
              </div>

              {/* Trust Badges Strip */}
              <div className="pt-4 flex flex-wrap items-center gap-5 sm:gap-8 text-xs text-white/75 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-[#DFB76C]/20 flex items-center justify-center">
                    <Check className="h-3 w-3 text-[#DFB76C]" />
                  </div>
                  <span className="font-semibold text-white/90">Cash on Delivery Across Pakistan</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-[#DFB76C]/20 flex items-center justify-center">
                    <Check className="h-3 w-3 text-[#DFB76C]" />
                  </div>
                  <span className="font-semibold text-white/90">Open Doorstep Inspection</span>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-[#DFB76C]/20 flex items-center justify-center">
                    <Check className="h-3 w-3 text-[#DFB76C]" />
                  </div>
                  <span className="font-semibold text-white/90">Free Courier Above PKR 5,000</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. LUXURY ARROW NAVIGATION (LEFT & RIGHT) */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-black/60 hover:bg-[#7A0C2E] border border-white/20 hover:border-[#DFB76C] text-white hover:text-[#DFB76C] flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(122,12,46,0.6)] hover:scale-110 active:scale-95 cursor-pointer group"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="h-6 w-6 transition-transform duration-300 group-hover:-translate-x-0.5" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-black/60 hover:bg-[#7A0C2E] border border-white/20 hover:border-[#DFB76C] text-white hover:text-[#DFB76C] flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(122,12,46,0.6)] hover:scale-110 active:scale-95 cursor-pointer group"
        aria-label="Next Slide"
      >
        <ChevronRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-0.5" />
      </button>

      {/* 4. BOTTOM PAGINATION & SLIDE DOCKS */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex items-center justify-center gap-2.5 sm:gap-3.5 px-4">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlideIndex;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentSlideIndex(idx)}
              className={`group flex items-center gap-2.5 py-2 px-3.5 rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-black/80 border border-[#DFB76C] shadow-[0_0_20px_rgba(223,183,108,0.4)] scale-105'
                  : 'bg-black/40 border border-white/15 hover:bg-black/65 hover:border-white/35'
              }`}
              aria-label={`Go to slide ${idx + 1}: ${slide.badge}`}
            >
              <span
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  isActive
                    ? 'w-8 sm:w-10 bg-gradient-to-r from-[#DFB76C] via-[#F5DEB3] to-[#C5A059]'
                    : 'w-2.5 bg-white/40 group-hover:bg-white/80'
                }`}
              />
              <span
                className={`text-[10px] font-bold uppercase tracking-wider hidden sm:inline ${
                  isActive ? 'text-[#DFB76C]' : 'text-white/60 group-hover:text-white'
                }`}
              >
                0{idx + 1} • {slide.badge.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
