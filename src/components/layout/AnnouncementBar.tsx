'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Gift } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#8B1A4A] via-[#6D1038] to-[#8B1A4A] text-white text-xs font-medium py-2.5 px-4 animate-gradient">
      {/* Gold shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4A017]/10 to-transparent animate-shimmer pointer-events-none" />

      <div className="relative max-w-7xl mx-auto flex items-center justify-center gap-3 text-center tracking-wide">
        <Sparkles className="h-3.5 w-3.5 text-[#F0D060] shrink-0" />
        <span>
          ✨ Free Delivery Across Pakistan on Orders Over PKR 5,000
        </span>
        <span className="hidden sm:inline text-[#F0D060]">•</span>
        <span className="hidden sm:inline flex items-center gap-1">
          <Gift className="h-3 w-3 text-[#F0D060] inline" />
          Handcrafted with Love
        </span>
        <Link
          href="/shop"
          className="hidden md:inline-flex items-center gap-1 ml-2 px-3 py-0.5 rounded-full bg-white/15 hover:bg-white/25 text-[#F0D060] font-semibold transition-colors text-[11px] border border-white/20"
        >
          Shop Now →
        </Link>
      </div>
    </div>
  );
}
