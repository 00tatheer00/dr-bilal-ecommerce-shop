'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-brand text-text-inverse text-xs font-medium py-2 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center tracking-wide">
        <Sparkles className="h-3.5 w-3.5 text-gold-light shrink-0" />
        <span>
          Free Delivery Across Pakistan on Orders Over PKR 5,000 • Handcrafted with Sacred Care
        </span>
        <Link
          href="/shop"
          className="underline decoration-gold-light/60 underline-offset-2 hover:text-gold-light transition-colors hidden sm:inline ml-1"
        >
          Explore Catalog
        </Link>
      </div>
    </div>
  );
}

