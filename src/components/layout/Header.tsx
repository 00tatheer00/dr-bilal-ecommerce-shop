'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Search, Menu, X, Compass, ChevronDown, Crown, Phone, Gem } from 'lucide-react';
import { APP_VERSION } from '@/config/version';

export default function Header() {
  const { openCart, totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const collections = [
    { label: 'Bridal Collection', href: '/shop?category=bridal', icon: '💍', desc: 'Opulent 24K dipped Kundan sets' },
    { label: 'Everyday Elegance', href: '/shop?category=everyday', icon: '🌸', desc: 'Featherlight silk thread bangles' },
    { label: 'Statement Pieces', href: '/shop?category=statement', icon: '👑', desc: 'Openable royal kadas & brass cuffs' },
    { label: 'Kundan & Meenakari', href: '/shop?category=kundan-meenakari', icon: '💎', desc: 'Vibrant hand-painted enamel artistry' },
  ];

  const navLinks = [
    { label: 'All Bangles', href: '/shop' },
    { label: 'Our Story', href: '/about' },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'glass-luxury shadow-[0_8px_30px_rgba(0,0,0,0.06)] border-b border-[#C5A059]/30'
          : 'bg-white/95 backdrop-blur-md border-b border-border'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[76px] items-center justify-between">
          {/* Left: Mobile menu button + Brand Logo */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden rounded-xl p-2.5 text-text-primary hover:bg-[#FDF2F4] hover:text-[#7A0C2E] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Brand Logo / Wordmark */}
            <Link href="/" prefetch={true} className="group flex items-center gap-3.5">
              {/* Opulent Gold Medallion with Crown */}
              <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#DFB76C] via-[#C5A059] to-[#9E7938] p-0.5 shadow-md group-hover:shadow-[0_0_24px_rgba(197,160,89,0.5)] group-hover:scale-105 transition-all duration-300">
                <div className="h-full w-full rounded-full bg-gradient-to-br from-[#7A0C2E] to-[#4A0E2E] flex items-center justify-center">
                  <Crown className="h-5 w-5 text-[#DFB76C] group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>

              <div className="flex flex-col">
                <span className="font-heading text-2xl font-bold tracking-[0.2em] text-[#7A0C2E] group-hover:text-[#560820] transition-colors leading-none">
                  GULNAAR
                </span>
                <span className="text-[10px] uppercase tracking-[0.38em] text-[#C5A059] font-bold mt-1 block">
                  by MK • Lahore Atelier
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Navigation with Hover Micro-Interactions */}
          <nav className="hidden lg:flex lg:items-center lg:gap-2">
            {/* Collections Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCollectionsOpen(true)}
              onMouseLeave={() => setCollectionsOpen(false)}
            >
              <button
                type="button"
                className="text-nav flex items-center gap-1.5 px-4 py-2.5 rounded-full text-text-primary hover:text-[#7A0C2E] hover:bg-[#FDF2F4] transition-all cursor-pointer group"
              >
                <span>Collections</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-[#C5A059] transition-transform duration-300 ${
                    collectionsOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Mega Menu Dropdown */}
              {collectionsOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 animate-dropdown">
                  <div className="w-[580px] rounded-3xl bg-white border border-[#C5A059]/40 shadow-[0_24px_60px_rgba(122,12,46,0.14)] p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                      <div className="flex items-center gap-2">
                        <Gem className="h-3.5 w-3.5 text-[#C5A059]" />
                        <span className="text-[11px] uppercase tracking-[0.25em] font-bold text-[#C5A059]">
                          Bangle Collections
                        </span>
                      </div>
                      <Link
                        href="/shop"
                        prefetch={true}
                        className="text-xs font-bold text-[#7A0C2E] hover:text-[#560820] transition-colors"
                      >
                        Explore Entire Vault &rarr;
                      </Link>
                    </div>

                    {/* Collection Grid */}
                    <div className="grid grid-cols-2 gap-3.5">
                      {collections.map((col) => (
                        <Link
                          key={col.label}
                          href={col.href}
                          prefetch={true}
                          className="group/item flex items-start gap-3.5 rounded-2xl p-3.5 hover:bg-[#FDF2F4] border border-transparent hover:border-[#C5A059]/40 transition-all duration-300 hover:translate-x-1"
                        >
                          <span className="text-2xl mt-0.5 group-hover/item:scale-125 transition-transform duration-300">
                            {col.icon}
                          </span>
                          <div>
                            <span className="text-sm font-bold text-text-primary group-hover/item:text-[#7A0C2E] transition-colors block">
                              {col.label}
                            </span>
                            <span className="text-xs text-text-secondary leading-snug block mt-0.5">
                              {col.desc}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Bottom Spotlight Card */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <Link
                        href="/shop?category=bridal"
                        prefetch={true}
                        className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#7A0C2E] to-[#4A0E2E] p-4 text-white hover:shadow-lg hover:scale-[1.01] transition-all duration-300 border border-[#DFB76C]/40 group/spot"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center">
                            <Crown className="h-5 w-5 text-[#DFB76C]" />
                          </div>
                          <div>
                            <span className="text-xs uppercase tracking-wider font-bold text-[#DFB76C] block">
                              Bridal Season Edit 2026
                            </span>
                            <span className="text-xs text-white/80">
                              Kundan Sets & Wedding Trousseaus
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#DFB76C] group-hover/spot:translate-x-1 transition-transform">
                          Shop Bridal &rarr;
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Nav Links with Underline Hover Micro-Interaction */}
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                prefetch={true}
                className="relative text-nav px-4 py-2.5 text-text-primary hover:text-[#7A0C2E] transition-colors group"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#DFB76C] to-[#7A0C2E] transition-all duration-300 group-hover:w-3/4 rounded-full" />
              </Link>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Search */}
            <Link
              href="/search"
              prefetch={true}
              className="rounded-full p-2.5 text-text-secondary hover:bg-[#FDF2F4] hover:text-[#7A0C2E] transition-all hover:scale-105 active:scale-95"
              aria-label="Search Collection"
            >
              <Search className="h-5 w-5" />
            </Link>

            {/* Track Order */}
            <Link
              href="/track-order"
              prefetch={true}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-[#7A0C2E] px-3.5 py-2 rounded-full border border-border hover:border-[#C5A059] hover:bg-[#FDF2F4] transition-all hover:scale-102"
            >
              <Compass className="h-3.5 w-3.5 text-[#C5A059]" />
              <span>Track Order</span>
            </Link>

            {/* Shopping Bag Button with Shiny Glow */}
            <button
              type="button"
              onClick={openCart}
              className="relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#7A0C2E] to-[#4A0E2E] px-4.5 py-2.5 text-white border border-[#DFB76C]/40 shadow-md hover:shadow-[0_8px_24px_rgba(122,12,46,0.25)] hover:scale-105 active:scale-95 transition-all duration-300 btn-luxury-shine cursor-pointer group"
              aria-label={`Shopping bag with ${totalItems} items`}
            >
              <ShoppingBag className="h-4 w-4 text-[#DFB76C] group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-xs font-bold tracking-wider">{totalItems}</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-[#DFB76C] to-[#C5A059] text-[10px] font-bold text-[#4A0E2E] flex items-center justify-center shadow-md animate-scale-in">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-[76px] z-50 lg:hidden animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-[#0F0E17]/60 backdrop-blur-sm" />

          <div
            className="relative flex h-full w-[85%] max-w-sm flex-col bg-white shadow-2xl animate-slide-in-left overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Header Banner */}
            <div className="relative h-44 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&auto=format&fit=crop&q=80"
                alt="Bridal Bangles"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4A0E2E]/95 via-[#7A0C2E]/70 to-transparent" />
              <div className="absolute bottom-4 left-5 text-white">
                <Crown className="h-6 w-6 text-[#DFB76C] mb-1" />
                <span className="font-heading text-xl font-bold tracking-wider block">GULNAAR</span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#DFB76C] font-semibold block">
                  by MK • Handcrafted Bangles
                </span>
              </div>
            </div>

            {/* Mobile Collections */}
            <div className="px-5 py-4">
              <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C5A059] block mb-3">
                Collections
              </span>
              <div className="space-y-1.5">
                {collections.map((col) => (
                  <Link
                    key={col.label}
                    href={col.href}
                    prefetch={true}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-2xl p-3 hover:bg-[#FDF2F4] transition-colors"
                  >
                    <span className="text-xl">{col.icon}</span>
                    <div>
                      <span className="text-sm font-bold text-text-primary block">{col.label}</span>
                      <span className="text-xs text-text-secondary">{col.desc}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mx-5 border-t border-border" />

            {/* Other Mobile Links */}
            <div className="px-5 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  prefetch={true}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm font-bold text-text-primary hover:bg-[#FDF2F4] hover:text-[#7A0C2E] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/track-order"
                prefetch={true}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-[#FDF2F4] hover:text-[#7A0C2E] transition-colors"
              >
                <Compass className="h-4 w-4 text-[#C5A059]" />
                Track Order
              </Link>
            </div>

            {/* Drawer Footer with Version Info */}
            <div className="mt-auto border-t border-border p-5 bg-[#FAF9F6]">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[#7A0C2E] font-bold">
                  <Phone className="h-3.5 w-3.5 text-[#C5A059]" />
                  <span>+92 300 0000000</span>
                </div>
                <span className="font-mono text-[10px] text-text-secondary">
                  v{APP_VERSION.version}
                </span>
              </div>
              <p className="text-[11px] text-text-secondary mt-1">
                Cash on Delivery Available Across Pakistan
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
