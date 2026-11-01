import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ShieldCheck, Truck, RefreshCw, Heart, Crown, Phone, Mail, MapPin } from 'lucide-react';

const FOOTER_IMAGE = 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1400&auto=format&fit=crop&q=60';

export default function Footer() {
  return (
    <footer className="relative">
      {/* Brand Values Ribbon */}
      <div className="border-t border-[#D4A017]/20 bg-gradient-to-r from-[#FFF3E6] via-bg-primary to-[#FCE4EC] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { icon: Truck, title: 'Cash on Delivery', desc: 'Across all cities in Pakistan', gradient: 'from-brand to-brand-hover' },
              { icon: Sparkles, title: '100% Handcrafted', desc: 'Authentic artisanal jewellery', gradient: 'from-[#D4A017] to-[#B8860B]' },
              { icon: ShieldCheck, title: 'Free Shipping', desc: 'On orders over PKR 5,000', gradient: 'from-[#1B5E20] to-[#2E7D32]' },
              { icon: RefreshCw, title: 'Easy Exchanges', desc: '3-day size exchange guarantee', gradient: 'from-[#E91E63] to-[#AD1457]' },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-sm`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-text-secondary">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer — Dark luxurious theme */}
      <div className="relative bg-[#1A1A2E] text-white overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-5">
          <Image
            src={FOOTER_IMAGE}
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4A017] via-[#8B1A4A] to-[#D4A017]" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            {/* Brand Column */}
            <div className="md:col-span-1 space-y-5">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#D4A017] to-[#B8860B] flex items-center justify-center shadow-lg group-hover:shadow-[0_0_20px_rgba(212,160,23,0.4)] transition-shadow">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="font-heading text-xl font-bold tracking-widest text-white block">
                    GULNAAR
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.3em] text-[#D4A017] font-semibold -mt-0.5 block">
                    by MK
                  </span>
                </div>
              </Link>
              <p className="text-xs leading-relaxed text-white/60 max-w-xs">
                Handcrafted heirloom bangles curated for bridal celebrations and everyday elegance. Each piece reflects centuries of South Asian artisanal mastery.
              </p>
              {/* Social Icons */}
              <div className="flex items-center gap-3">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-xl bg-white/10 hover:bg-[#E91E63] flex items-center justify-center transition-colors text-white" aria-label="Instagram">
                  <svg className="h-4 w-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="h-9 w-9 rounded-xl bg-white/10 hover:bg-[#25D366] flex items-center justify-center transition-colors">
                  <Phone className="h-4 w-4" />
                </a>
                <a href="#" className="h-9 w-9 rounded-xl bg-white/10 hover:bg-[#8B1A4A] flex items-center justify-center transition-colors">
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Shop Column */}
            <div>
              <h4 className="text-xs font-bold tracking-[0.15em] text-[#D4A017] uppercase mb-5">
                Collections
              </h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li>
                  <Link href="/shop" className="hover:text-[#F0D060] transition-colors inline-flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-[#D4A017]" />
                    All Bangles
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=bridal" className="hover:text-[#F0D060] transition-colors inline-flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-[#D4A017]" />
                    Bridal Kangan Sets
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=everyday" className="hover:text-[#F0D060] transition-colors inline-flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-[#D4A017]" />
                    Everyday Silk & Glass
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=statement" className="hover:text-[#F0D060] transition-colors inline-flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-[#D4A017]" />
                    Statement Kadas
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=kundan-meenakari" className="hover:text-[#F0D060] transition-colors inline-flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-[#D4A017]" />
                    Kundan & Meenakari
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Care Column */}
            <div>
              <h4 className="text-xs font-bold tracking-[0.15em] text-[#D4A017] uppercase mb-5">
                Customer Care
              </h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li>
                  <Link href="/size-guide" className="hover:text-[#F0D060] transition-colors">
                    Bangle Sizing Guide
                  </Link>
                </li>
                <li>
                  <Link href="/care-guide" className="hover:text-[#F0D060] transition-colors">
                    Jewellery Care
                  </Link>
                </li>
                <li>
                  <Link href="/track-order" className="hover:text-[#F0D060] transition-colors">
                    Track Your Order
                  </Link>
                </li>
                <li>
                  <Link href="/shipping-policy" className="hover:text-[#F0D060] transition-colors">
                    Shipping & Delivery
                  </Link>
                </li>
                <li>
                  <Link href="/returns-policy" className="hover:text-[#F0D060] transition-colors">
                    Returns & Exchange
                  </Link>
                </li>
                <li>
                  <Link href="/faqs" className="hover:text-[#F0D060] transition-colors">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xs font-bold tracking-[0.15em] text-[#D4A017] uppercase mb-5">
                Studio & Contact
              </h4>
              <div className="space-y-4 text-sm text-white/60">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-[#D4A017] mt-0.5 shrink-0" />
                  <p>Gulberg III, Lahore, Pakistan</p>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-[#D4A017] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-white/80">WhatsApp Orders</p>
                    <p className="font-mono text-[#F0D060]">+92 300 0000000</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-[#D4A017] mt-0.5 shrink-0" />
                  <p>support@gulnaarbymk.com</p>
                </div>
                <p className="text-xs text-white/40 pl-7">
                  Mon – Sat, 10 AM – 8 PM PKT
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-14 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
            <p>© 2026 GULNAAR by MK. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              Made with <Heart className="h-3 w-3 text-[#E91E63] fill-[#E91E63]" /> for bangle lovers across Pakistan
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
