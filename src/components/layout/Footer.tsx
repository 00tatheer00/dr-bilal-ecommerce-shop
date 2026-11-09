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
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/gulnaarbymk?utm_source=qr&exln=NGNocGtyMjByb2Zs"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-xl bg-[#FAF9F6] hover:bg-[#E1306C] hover:text-white border border-[#E8E5DF] flex items-center justify-center transition-all duration-300 text-text-primary shadow-2xs hover:scale-105"
                aria-label="Instagram"
                title="Follow Gulnaar by MK on Instagram"
              >
                <svg className="h-4 w-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/1DB1dprXnY/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-xl bg-[#FAF9F6] hover:bg-[#1877F2] hover:text-white border border-[#E8E5DF] flex items-center justify-center transition-all duration-300 text-text-primary shadow-2xs hover:scale-105"
                aria-label="Facebook"
                title="Follow Gulnaar by MK on Facebook"
              >
                <svg className="h-4 w-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@gulnaar.by.mk?_r=1&_t=ZS-9B9wKPYn9Ma"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-xl bg-[#FAF9F6] hover:bg-black hover:text-white border border-[#E8E5DF] flex items-center justify-center transition-all duration-300 text-text-primary shadow-2xs hover:scale-105"
                aria-label="TikTok"
                title="Watch Gulnaar by MK on TikTok"
              >
                <svg className="h-4 w-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/923125880988"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-xl bg-[#FAF9F6] hover:bg-[#25D366] hover:text-white border border-[#E8E5DF] flex items-center justify-center transition-all duration-300 text-text-primary shadow-2xs hover:scale-105"
                aria-label="WhatsApp"
                title="Chat with Gulnaar Support on WhatsApp"
              >
                <Phone className="h-4 w-4" />
              </a>

              {/* Email Support */}
              <Link
                href="/contact"
                className="h-9 w-9 rounded-xl bg-[#FAF9F6] hover:bg-[#B81D4E] hover:text-white border border-[#E8E5DF] flex items-center justify-center transition-all duration-300 text-text-primary shadow-2xs hover:scale-105"
                aria-label="Email Support"
                title="Email Support"
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
                  <p className="font-semibold text-text-primary">Orders & Payment Proof</p>
                  <a
                    href="https://wa.me/923125880988"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[#B81D4E] font-bold hover:underline block"
                  >
                    0312-5880988 (Gulnaar Support)
                  </a>
                  <a
                    href="https://wa.me/923275792600"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-text-secondary text-[11px] hover:underline block mt-0.5"
                  >
                    0327-5792600 (Support)
                  </a>
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
