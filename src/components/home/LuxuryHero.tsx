'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Crown, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSlide {
  id: string;
  badge: string;
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  image: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'bridal-2026',
    badge: 'Bridal Couture 2026',
    titlePrefix: 'Royal Kundan',
    titleHighlight: 'Kangans & Churis',
    titleSuffix: 'for Brides',
    subtitle: 'Hand-poured 24K dipped gold, real uncut Kundan & clustered seed pearls.',
    ctaText: 'Shop Bridal Edit',
    ctaHref: '/shop?category=bridal',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1600&auto=format&fit=crop&q=85',
  },
  {
    id: 'velvet-glass',
    badge: 'Everyday Luxury',
    titlePrefix: 'Plush Silk &',
    titleHighlight: 'Velvet Churis',
    titleSuffix: 'Sets of 24',
    subtitle: 'The romantic chime of subcontinent glass, reimagined in soft velvet finish.',
    ctaText: 'Explore Velvet Churis',
    ctaHref: '/shop?category=everyday',
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1600&auto=format&fit=crop&q=85',
  },
  {
    id: 'meenakari-art',
    badge: 'Jaipur Heritage',
    titlePrefix: 'Hand-Painted',
    titleHighlight: 'Meenakari Kadas',
    titleSuffix: '& Enamel Cuffs',
    subtitle: 'Vibrant hand-glazed Mughal floral enamel artistry over solid brass.',
    ctaText: 'Discover Meenakari',
    ctaHref: '/shop?category=kundan-meenakari',
    image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1600&auto=format&fit=crop&q=85',
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

  // Auto-slide every 5s
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 45) {
      nextSlide();
    } else if (diff < -45) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-[#FFF9FB] to-white border-b border-[#F0DFE7] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="High Jewellery Banner Slider"
    >
      <div className="relative w-full h-[280px] min-[420px]:h-[320px] sm:h-[400px] lg:h-[480px]">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlideIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Image with Bright Luminous White Overlay */}
              <div className="relative h-full w-full">
                <Image
                  src={slide.image}
                  alt={slide.titlePrefix}
                  fill
                  priority={idx === 0}
                  sizes="100vw"
                  className="object-cover object-center"
                />

                {/* Pure White / Light Vignette — Keeps Background Vibrant while Text is 100% Razor Sharp */}
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent sm:via-white/70" />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent sm:hidden" />
              </div>

              {/* Slide Content Layer */}
              <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                <div className="max-w-xl space-y-2.5 sm:space-y-4">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 border border-[#D4AF37]/40 shadow-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#B81D4E]" />
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#B81D4E]">
                      {slide.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="font-heading text-2xl min-[420px]:text-3xl sm:text-4xl lg:text-5xl font-bold text-[#18181B] leading-[1.12] tracking-tight">
                    {slide.titlePrefix}{' '}
                    <span className="text-[#B81D4E] underline decoration-[#F6D365]/50 decoration-2 underline-offset-4">
                      {slide.titleHighlight}
                    </span>{' '}
                    <span className="block text-[#27272A]">{slide.titleSuffix}</span>
                  </h1>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-md line-clamp-2 sm:line-clamp-none">
                    {slide.subtitle}
                  </p>

                  {/* Dual Action Buttons */}
                  <div className="flex items-center gap-3 pt-1 sm:pt-2">
                    <Link
                      href={slide.ctaHref}
                      prefetch={true}
                      className="inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full bg-gradient-to-r from-[#B81D4E] to-[#8E0E3B] hover:from-[#8E0E3B] hover:to-[#3B0411] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] btn-luxury-shine cursor-pointer"
                    >
                      <Crown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#F6D365]" />
                      <span>{slide.ctaText}</span>
                      <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Link>

                    <Link
                      href="/shop"
                      prefetch={true}
                      className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-full bg-white hover:bg-[#FFF0F5] text-[#B81D4E] font-bold text-xs sm:text-sm border border-[#B81D4E]/30 hover:border-[#B81D4E] transition-all shadow-xs cursor-pointer"
                    >
                      <span>All Bangles</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Navigation Arrows */}
      <button
        type="button"
        onClick={prevSlide}
        className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/90 hover:bg-[#B81D4E] hover:text-white text-text-primary border border-border shadow-md items-center justify-center transition-all cursor-pointer"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/90 hover:bg-[#B81D4E] hover:text-white text-text-primary border border-border shadow-md items-center justify-center transition-all cursor-pointer"
        aria-label="Next Slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-3 left-0 right-0 z-20 flex items-center justify-center gap-2">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlideIndex;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentSlideIndex(idx)}
              className="p-1 cursor-pointer focus:outline-none"
              aria-label={`Go to slide ${idx + 1}`}
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  isActive ? 'w-6 bg-[#B81D4E]' : 'w-2 bg-[#D4D4D8] hover:bg-[#A1A1AA]'
                }`}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
