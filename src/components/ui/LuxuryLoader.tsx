'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';

/**
 * Luxury Bangle & Jet-Fast Top Navigation Loader
 * Renders an ultra-fast gold metallic progress bar at top on page change
 * and an opulent initial entrance animation.
 */
export default function LuxuryLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [navigating, setNavigating] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Initial load transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  // Route change progress bar trigger
  useEffect(() => {
    const startTimer = setTimeout(() => {
      setNavigating(true);
    }, 0);
    const endTimer = setTimeout(() => {
      setNavigating(false);
    }, 350);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
    };
  }, [pathname, searchParams]);

  return (
    <>
      {/* 1. JET-FAST TOP PROGRESS BAR */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 h-[3px] pointer-events-none transition-opacity duration-300 ${
          navigating ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="h-full w-full bg-gradient-to-r from-[#F6D365] via-[#9F1239] to-[#F6D365] animate-shimmer shadow-[0_0_12px_rgba(223,183,108,0.8)]" />
      </div>

      {/* 2. INITIAL LUXURY ENTRANCE SPLASH (Subtle & Ultra-Fast) */}
      {initialLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-md transition-opacity duration-300">
          <div className="relative flex flex-col items-center">
            {/* Spinning Concentric Bangle Rings */}
            <div className="relative flex h-24 w-24 items-center justify-center">
              {/* Outer Bangle Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#F6D365] animate-spin [animation-duration:8s]" />
              {/* Middle Polished Gold Ring */}
              <div className="absolute inset-2 rounded-full border-2 border-[#9F1239]/40 border-t-[#F6D365] animate-spin [animation-duration:2.5s]" />
              {/* Inner Medallion */}
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#B81D4E] to-[#700B2E] shadow-lg overflow-hidden p-1.5 animate-pulse">
                <Image
                  src="/images/logo-icon.png"
                  alt="GULNAAR"
                  fill
                  sizes="64px"
                  className="object-contain p-1"
                />
              </div>
            </div>

            {/* Brand Typography */}
            <div className="mt-4 text-center">
              <span className="font-heading text-lg font-bold tracking-[0.25em] text-[#B81D4E] block">
                GULNAAR
              </span>
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#F6D365] font-semibold block mt-0.5">
                by MK • Crafting Heirlooms
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Inline Spinner for Buttons & Cards
 */
export function BangleSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeMap = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-10 w-10 border-3',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <div
        className={`${sizeMap[size]} rounded-full border-[#F6D365]/30 border-t-[#F6D365] border-r-[#B81D4E] animate-spin`}
      />
    </div>
  );
}
