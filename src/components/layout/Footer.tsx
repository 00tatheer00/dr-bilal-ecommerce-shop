import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Phone, Mail, MapPin } from 'lucide-react';
import { APP_VERSION } from '@/config/version';

const FOOTER_IMAGE = 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1400&auto=format&fit=crop&q=60';

export default function Footer() {
  return (
    <footer className="relative bg-[#0F0E17] text-white overflow-hidden">
      {/* Decorative background image */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <Image
          src={FOOTER_IMAGE}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#DFB76C] via-[#7A0C2E] to-[#DFB76C]" />

      {/* Main Footer Container */}
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-5">
            <Link href="/" prefetch={true} className="inline-flex items-center gap-3.5 group">
              <div className="relative h-14 w-14 shrink-0 group-hover:scale-105 transition-transform duration-300 drop-shadow-md">
                <Image
                  src="/images/logo-icon.png"
                  alt="GULNAAR by MK"
                  fill
                  sizes="56px"
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-heading text-2xl font-bold tracking-[0.2em] text-white block leading-none">
                  GULNAAR
                </span>
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#DFB76C] font-bold mt-1 block">
                  by MK • Lahore Atelier
                </span>
              </div>
            </Link>
            <p className="text-xs leading-relaxed text-white/70 max-w-xs">
              Handcrafted heirloom bangles curated for bridal celebrations and everyday elegance. Reflecting centuries of traditional South Asian artisanal mastery.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-2xl bg-white/10 hover:bg-[#7A0C2E] hover:border-[#DFB76C]/60 border border-white/10 flex items-center justify-center transition-all duration-300 text-white"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/923000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-2xl bg-white/10 hover:bg-[#25D366] hover:border-[#25D366] border border-white/10 flex items-center justify-center transition-all duration-300 text-white"
                aria-label="WhatsApp"
              >
                <Phone className="h-4 w-4" />
              </a>
              <Link
                href="/contact"
                className="h-10 w-10 rounded-2xl bg-white/10 hover:bg-[#DFB76C] hover:text-[#4A0E2E] border border-white/10 flex items-center justify-center transition-all duration-300 text-white"
                aria-label="Email Support"
              >
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-[#DFB76C] uppercase mb-5">
              Vault Collections
            </h4>
            <ul className="space-y-3 text-xs text-white/70">
              <li>
                <Link href="/shop" prefetch={true} className="hover:text-[#DFB76C] transition-colors inline-flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#DFB76C]" />
                  All Bangles
                </Link>
              </li>
              <li>
                <Link href="/shop?category=bridal" prefetch={true} className="hover:text-[#DFB76C] transition-colors inline-flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#DFB76C]" />
                  Bridal Kangan Sets
                </Link>
              </li>
              <li>
                <Link href="/shop?category=everyday" prefetch={true} className="hover:text-[#DFB76C] transition-colors inline-flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#DFB76C]" />
                  Everyday Silk & Glass
                </Link>
              </li>
              <li>
                <Link href="/shop?category=statement" prefetch={true} className="hover:text-[#DFB76C] transition-colors inline-flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#DFB76C]" />
                  Statement Kadas
                </Link>
              </li>
              <li>
                <Link href="/shop?category=kundan-meenakari" prefetch={true} className="hover:text-[#DFB76C] transition-colors inline-flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#DFB76C]" />
                  Kundan & Meenakari
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-[#DFB76C] uppercase mb-5">
              Customer Services
            </h4>
            <ul className="space-y-3 text-xs text-white/70">
              <li>
                <Link href="/size-guide" prefetch={true} className="hover:text-[#DFB76C] transition-colors">
                  Bangle Sizing Guide
                </Link>
              </li>
              <li>
                <Link href="/care-guide" prefetch={true} className="hover:text-[#DFB76C] transition-colors">
                  Jewellery Care Instructions
                </Link>
              </li>
              <li>
                <Link href="/track-order" prefetch={true} className="hover:text-[#DFB76C] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" prefetch={true} className="hover:text-[#DFB76C] transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns-policy" prefetch={true} className="hover:text-[#DFB76C] transition-colors">
                  Returns & Exchange Policy
                </Link>
              </li>
              <li>
                <Link href="/faqs" prefetch={true} className="hover:text-[#DFB76C] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Studio */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-[#DFB76C] uppercase mb-5">
              Studio & Contact
            </h4>
            <div className="space-y-4 text-xs text-white/70">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#DFB76C] mt-0.5 shrink-0" />
                <p>Gulberg III, Lahore, Punjab, Pakistan</p>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-[#DFB76C] mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-white/90">WhatsApp Direct Orders</p>
                  <p className="font-mono text-[#DFB76C]">+92 300 0000000</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-[#DFB76C] mt-0.5 shrink-0" />
                <p>support@gulnaarbymk.com</p>
              </div>
              <p className="text-[11px] text-white/50 pl-7">
                Monday – Saturday (10:00 AM – 8:00 PM PKT)
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Deployment Version Indicator */}
        <div className="mt-16 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-mono text-[11px] text-white/80">
              v{APP_VERSION.version} • {APP_VERSION.build}
            </span>
            <span className="text-white/20">|</span>
            <span>All systems operational</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 text-center md:text-right">
            <span>
              © 2026 GULNAAR by MK. Handcrafted with{' '}
              <Heart className="h-3 w-3 text-[#DFB76C] fill-[#DFB76C] inline mx-0.5" /> in Pakistan.
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className="text-[11px] text-white/40 hover:text-white/70 transition-colors" title="Engineered by Tatheer (03275792600)">
              Engineered by <span className="text-[#DFB76C]/80 font-medium">Tech4Edges</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
