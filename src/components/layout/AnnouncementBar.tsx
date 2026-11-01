'use client';

import React from 'react';
import Link from 'next/link';
import { Gem, Crown, ArrowRight } from 'lucide-react';
import { APP_VERSION } from '@/config/version';

export default function AnnouncementBar() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#560820] via-[#7A0C2E] to-[#3B0414] text-white text-xs font-medium py-2 px-4 border-b border-[#C5A059]/30">
      {/* Metallic specular shimmer line */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#DFB76C]/15 to-transparent animate-shimmer pointer-events-none" />

      <div className="relative max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Version & Production Live Badge */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-white/80">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DFB76C] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DFB76C]" />
          </span>
          <span className="font-mono tracking-wider text-[#DFB76C] font-semibold">
            {APP_VERSION.build}
          </span>
          <span className="text-white/40">•</span>
          <span className="text-white/70">Lahore Atelier</span>
        </div>

        {/* Center: Main Broadcast Message */}
        <div className="flex-1 flex items-center justify-center gap-2 sm:gap-3 text-center tracking-wide">
          <Gem className="h-3.5 w-3.5 text-[#DFB76C] shrink-0 animate-pulse" />
          <span className="text-xs font-semibold text-white">
            Free Express Courier Across Pakistan on Orders Over PKR 5,000
          </span>
          <span className="hidden sm:inline text-[#DFB76C] font-bold">•</span>
          <span className="hidden sm:inline text-white/90 text-xs">
            Open Parcel Inspection at Doorstep
          </span>
        </div>

        {/* Right: Quick Action Link */}
        <div className="hidden sm:flex items-center gap-2">
          <Link
            href="/shop?category=bridal"
            prefetch={true}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-[#DFB76C] text-[#DFB76C] hover:text-[#560820] font-bold transition-all text-[11px] border border-[#DFB76C]/40 group"
          >
            <Crown className="h-3 w-3" />
            <span>Bridal Edit 2026</span>
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
