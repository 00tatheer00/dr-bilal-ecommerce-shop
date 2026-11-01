import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Truck, RefreshCw, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary text-text-primary">
      {/* Brand Values Ribbon */}
      <div className="border-b border-border bg-bg-surface/50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
                  Cash on Delivery
                </h4>
                <p className="text-xs text-text-secondary">Across all cities in Pakistan</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
                  100% Handcrafted
                </h4>
                <p className="text-xs text-text-secondary">Authentic artisanal jewellery</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
                  Free Shipping
                </h4>
                <p className="text-xs text-text-secondary">On all orders over PKR 5,000</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                <RefreshCw className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
                  Easy Exchanges
                </h4>
                <p className="text-xs text-text-secondary">3-day size exchange guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-heading text-2xl font-bold tracking-widest text-brand">
                GULNAAR
              </span>
              <span className="block text-[10px] uppercase tracking-[0.25em] text-text-secondary font-medium">
                by MK
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-text-secondary">
              Handcrafted heirloom bangles curated for bridal celebrations and everyday timeless elegance. Each piece reflects centuries of traditional South Asian artisanal mastery.
            </p>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="font-heading text-sm font-semibold tracking-wider text-text-primary uppercase mb-4">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li>
                <Link href="/shop" className="hover:text-brand transition-colors">
                  All Bangles
                </Link>
              </li>
              <li>
                <Link href="/shop?category=bridal" className="hover:text-brand transition-colors">
                  Bridal Kangan Sets
                </Link>
              </li>
              <li>
                <Link href="/shop?category=everyday" className="hover:text-brand transition-colors">
                  Everyday Silk & Glass
                </Link>
              </li>
              <li>
                <Link href="/shop?category=statement" className="hover:text-brand transition-colors">
                  Statement Kadas & Mirror
                </Link>
              </li>
              <li>
                <Link href="/shop?category=kundan-meenakari" className="hover:text-brand transition-colors">
                  Kundan & Meenakari
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div>
            <h4 className="font-heading text-sm font-semibold tracking-wider text-text-primary uppercase mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li>
                <Link href="/size-guide" className="hover:text-brand transition-colors">
                  Bangle Sizing Guide
                </Link>
              </li>
              <li>
                <Link href="/care-guide" className="hover:text-brand transition-colors">
                  Jewellery Care Instructions
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-brand transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-brand transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns-policy" className="hover:text-brand transition-colors">
                  Returns & Exchange Policy
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-brand transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio & Support */}
          <div>
            <h4 className="font-heading text-sm font-semibold tracking-wider text-text-primary uppercase mb-4">
              Studio & Contact
            </h4>
            <div className="space-y-3 text-xs text-text-secondary">
              <p>
                <strong className="text-text-primary font-medium">Location:</strong>
                <br />
                Gulberg III, Lahore, Pakistan
              </p>
              <p>
                <strong className="text-text-primary font-medium">WhatsApp Orders:</strong>
                <br />
                <span className="font-mono text-brand">+92 300 0000000</span>
              </p>
              <p>
                <strong className="text-text-primary font-medium">Customer Support:</strong>
                <br />
                support@gulnaarbymk.com
              </p>
              <p className="text-[11px] text-text-secondary">
                Hours: Monday – Saturday (10:00 AM – 8:00 PM PKT)
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-secondary">
          <p>© 2026 GULNAAR by MK. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-brand fill-brand" /> for bangle lovers across Pakistan.
          </p>
        </div>
      </div>
    </footer>
  );
}
