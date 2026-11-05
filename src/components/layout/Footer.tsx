import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Phone, Mail, MapPin, Lock } from 'lucide-react';
import { APP_VERSION } from '@/config/version';

export default function Footer() {
  return (
    <footer className="relative bg-[#FFFFFF] text-text-primary border-t border-[#E8E5DF] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F6D365] via-[#B81D4E] to-[#F6D365]" />

      {/* Main Footer Container */}
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" prefetch={true} className="inline-flex items-center gap-3 group">
              <div className="relative h-12 w-12 shrink-0 group-hover:scale-105 transition-transform duration-300 drop-shadow-xs">
                <Image
                  src="/images/logo-icon.png"
                  alt="GULNAAR by MK"
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-heading text-2xl font-bold tracking-[0.18em] text-[#B81D4E] block leading-none">
                  GULNAAR
                </span>
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#D4AF37] font-bold mt-1 block">
                  by MK • Lahore Atelier
                </span>
              </div>
            </Link>
            <p className="text-xs leading-relaxed text-text-secondary max-w-xs">
              Handcrafted heirloom bangles curated for bridal celebrations and everyday elegance. Reflecting centuries of traditional South Asian artisanal mastery.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-xl bg-[#FAF9F6] hover:bg-[#B81D4E] hover:text-white border border-[#E8E5DF] flex items-center justify-center transition-all duration-300 text-text-primary"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/923275792600"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-xl bg-[#FAF9F6] hover:bg-[#25D366] hover:text-white border border-[#E8E5DF] flex items-center justify-center transition-all duration-300 text-text-primary"
                aria-label="WhatsApp"
              >
                <Phone className="h-4 w-4" />
              </a>
              <Link
                href="/contact"
                className="h-9 w-9 rounded-xl bg-[#FAF9F6] hover:bg-[#B81D4E] hover:text-white border border-[#E8E5DF] flex items-center justify-center transition-all duration-300 text-text-primary"
                aria-label="Email Support"
              >
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-[#B81D4E] uppercase mb-4">
              Vault Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-text-secondary">
              <li>
                <Link href="/shop" prefetch={true} className="hover:text-[#B81D4E] transition-colors inline-flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#D4AF37]" />
                  All Bangles
                </Link>
              </li>
              <li>
                <Link href="/shop?category=bridal" prefetch={true} className="hover:text-[#B81D4E] transition-colors inline-flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#D4AF37]" />
                  Bridal Kangan Sets
                </Link>
              </li>
              <li>
                <Link href="/shop?category=everyday" prefetch={true} className="hover:text-[#B81D4E] transition-colors inline-flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#D4AF37]" />
                  Everyday Silk & Glass
                </Link>
              </li>
              <li>
                <Link href="/shop?category=statement" prefetch={true} className="hover:text-[#B81D4E] transition-colors inline-flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#D4AF37]" />
                  Statement Kadas
                </Link>
              </li>
              <li>
                <Link href="/shop?category=kundan-meenakari" prefetch={true} className="hover:text-[#B81D4E] transition-colors inline-flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#D4AF37]" />
                  Kundan & Meenakari
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-[#B81D4E] uppercase mb-4">
              Customer Services
            </h4>
            <ul className="space-y-2.5 text-xs text-text-secondary">
              <li>
                <Link href="/size-guide" prefetch={true} className="hover:text-[#B81D4E] transition-colors">
                  Bangle Sizing Guide
                </Link>
              </li>
              <li>
                <Link href="/care-guide" prefetch={true} className="hover:text-[#B81D4E] transition-colors">
                  Jewellery Care Instructions
                </Link>
              </li>
              <li>
                <Link href="/track-order" prefetch={true} className="hover:text-[#B81D4E] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" prefetch={true} className="hover:text-[#B81D4E] transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns-policy" prefetch={true} className="hover:text-[#B81D4E] transition-colors">
                  Returns & Exchange Policy
                </Link>
              </li>
              <li>
                <Link href="/faqs" prefetch={true} className="hover:text-[#B81D4E] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Studio */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-[#B81D4E] uppercase mb-4">
              Studio & Contact
            </h4>
            <div className="space-y-3.5 text-xs text-text-secondary">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#D4AF37] mt-0.5 shrink-0" />
                <p>Gulberg III, Lahore, Punjab, Pakistan</p>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-[#D4AF37] mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-text-primary">WhatsApp Orders</p>
                  <p className="font-mono text-[#B81D4E] font-bold">0327-5792600</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-[#D4AF37] mt-0.5 shrink-0" />
                <p>support@gulnaarbymk.com</p>
              </div>
              <p className="text-[11px] text-text-secondary/70 pl-6.5">
                Monday – Saturday (10:00 AM – 8:00 PM PKT)
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Deployment Version Indicator */}
        <div className="mt-12 border-t border-[#E8E5DF] pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-secondary">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-mono text-[11px] text-text-primary font-semibold">
              v{APP_VERSION.version} • {APP_VERSION.build}
            </span>
            <span className="text-border">|</span>
            <span className="text-[11px]">All systems operational</span>
            <span className="text-border">|</span>
            <Link
              href="/admin"
              prefetch={false}
              className="inline-flex items-center gap-1 text-[11px] text-text-secondary/70 hover:text-[#B81D4E] transition-colors"
              title="Admin Portal"
            >
              <Lock className="h-2.5 w-2.5" />
              <span>Admin Portal</span>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 text-center md:text-right text-[11px]">
            <span>
              © 2026 GULNAAR by MK. Handcrafted with{' '}
              <Heart className="h-3 w-3 text-[#B81D4E] fill-[#B81D4E] inline mx-0.5" /> in Pakistan.
            </span>
            <span className="hidden sm:inline text-border">•</span>
            <span className="text-text-secondary/60 hover:text-text-primary transition-colors" title="Engineered by Tatheer (03275792600)">
              Crafted by <span className="text-[#B81D4E] font-semibold">Tech4Edges</span> (03275792600)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
