'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Search, Menu, X, Compass, HelpCircle, ChevronDown, Crown, Phone } from 'lucide-react';

export default function Header() {
  const { openCart, totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const collections = [
    { label: 'Bridal Collection', href: '/shop?category=bridal', icon: '💍', desc: 'Exquisite Kundan sets for your big day' },
    { label: 'Everyday Elegance', href: '/shop?category=everyday', icon: '✨', desc: 'Lightweight bangles for daily wear' },
    { label: 'Statement Pieces', href: '/shop?category=statement', icon: '👑', desc: 'Bold designs for special occasions' },
    { label: 'Kundan & Meenakari', href: '/shop?category=kundan-meenakari', icon: '💎', desc: 'Traditional craft with vibrant enamel' },
  ];

  const navLinks = [
    { label: 'All Bangles', href: '/shop' },
    { label: 'Our Story', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'glass shadow-lg border-b border-[#D4A017]/20'
          : 'bg-bg-primary/98 backdrop-blur-sm border-b border-border'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between">
          {/* Left: Mobile menu + Logo */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden rounded-xl p-2.5 text-text-primary hover:bg-brand-light hover:text-brand transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Brand Logo */}
            <Link href="/" className="group flex items-center gap-3">
              {/* Gold medallion icon */}
              <div className="relative hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#D4A017] to-[#B8860B] shadow-md group-hover:shadow-[0_0_20px_rgba(212,160,23,0.4)] transition-shadow">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-xl sm:text-2xl font-bold tracking-[0.15em] text-brand group-hover:text-brand-hover transition-colors">
                  GULNAAR
                </span>
                <span className="text-[9px] uppercase tracking-[0.35em] text-[#D4A017] font-semibold -mt-0.5">
                  by MK • Handcrafted
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:gap-1">
            {/* Collections Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCollectionsOpen(true)}
              onMouseLeave={() => setCollectionsOpen(false)}
            >
              <button className="text-nav flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-text-primary hover:text-brand hover:bg-brand-light/50 transition-all">
                Collections
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${collectionsOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Menu */}
              {collectionsOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 animate-dropdown">
                  <div className="w-[540px] rounded-2xl glass border border-[#D4A017]/20 shadow-xl p-5">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#D4A017]">
                        ✦ Our Collections ✦
                      </span>
                      <Link href="/shop" className="text-[11px] font-medium text-brand hover:text-brand-hover transition-colors">
                        View All →
                      </Link>
                    </div>

                    {/* Collection Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {collections.map((col) => (
                        <Link
                          key={col.label}
                          href={col.href}
                          className="group/item flex items-start gap-3 rounded-xl p-3 hover:bg-gradient-to-r hover:from-brand-light/50 hover:to-[#FFF3E6] transition-all border border-transparent hover:border-[#D4A017]/20"
                        >
                          <span className="text-2xl mt-0.5 group-hover/item:scale-110 transition-transform">
                            {col.icon}
                          </span>
                          <div>
                            <span className="text-sm font-semibold text-text-primary group-hover/item:text-brand transition-colors block">
                              {col.label}
                            </span>
                            <span className="text-[11px] text-text-secondary leading-snug block mt-0.5">
                              {col.desc}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Bottom Banner */}
                    <div className="mt-4 pt-3 border-t border-border">
                      <Link
                        href="/shop?category=bridal"
                        className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#8B1A4A] to-[#6D1038] p-3 text-white hover:shadow-lg transition-shadow"
                      >
                        <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                          <Crown className="h-5 w-5 text-[#F0D060]" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold block">Bridal Season 2026</span>
                          <span className="text-[11px] text-white/70">Premium Kundan Sets — Starting PKR 8,500</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-nav px-4 py-2.5 rounded-xl text-text-primary hover:text-brand hover:bg-brand-light/50 transition-all relative group"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <Link
              href="/search"
              className="rounded-xl p-2.5 text-text-secondary hover:bg-brand-light hover:text-brand transition-all"
              aria-label="Search Collection"
            >
              <Search className="h-5 w-5" />
            </Link>

            {/* Track Order */}
            <Link
              href="/track-order"
              className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-text-secondary hover:text-brand px-3 py-2 rounded-xl border border-border hover:border-brand/30 hover:bg-brand-light/30 transition-all"
            >
              <Compass className="h-3.5 w-3.5 text-[#D4A017]" />
              <span>Track</span>
            </Link>

            {/* Cart Button — Gold accent */}
            <button
              type="button"
              onClick={openCart}
              className="relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8B1A4A] to-[#6D1038] px-4 py-2.5 text-white hover:shadow-lg active:scale-95 transition-all group"
              aria-label={`Shopping bag with ${totalItems} items`}
            >
              <ShoppingBag className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              <span className="text-xs font-bold">{totalItems}</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#D4A017] text-[9px] font-bold text-white flex items-center justify-center animate-scale-in shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[72px] z-50 lg:hidden animate-fade-in" onClick={() => setMobileMenuOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#1A1A2E]/50 backdrop-blur-sm" />

          {/* Drawer */}
          <div
            className="relative flex h-full w-[85%] max-w-sm flex-col bg-bg-primary shadow-2xl animate-slide-in-left overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header — Bridal Image Banner */}
            <div className="relative h-40 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&auto=format&fit=crop&q=80"
                alt="Bangles Collection"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#8B1A4A]/70 to-[#8B1A4A]/90" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <Crown className="h-8 w-8 text-[#F0D060] mb-2" />
                <span className="font-heading text-xl font-bold tracking-widest">GULNAAR</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#F0D060] font-medium">
                  by MK
                </span>
              </div>
            </div>

            {/* Collections */}
            <div className="px-5 py-4">
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#D4A017] block mb-3">
                Collections
              </span>
              <div className="space-y-1">
                {collections.map((col) => (
                  <Link
                    key={col.label}
                    href={col.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-brand-light transition-colors"
                  >
                    <span className="text-xl">{col.icon}</span>
                    <div>
                      <span className="text-sm font-semibold text-text-primary block">{col.label}</span>
                      <span className="text-[11px] text-text-secondary">{col.desc}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="mx-5 border-t border-border" />

            {/* Other Links */}
            <div className="px-5 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm font-medium text-text-primary hover:bg-brand-light hover:text-brand transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-text-secondary hover:bg-brand-light hover:text-brand transition-colors"
              >
                <Compass className="h-4 w-4 text-[#D4A017]" />
                Track Your Order
              </Link>
              <Link
                href="/size-guide"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-text-secondary hover:bg-brand-light hover:text-brand transition-colors"
              >
                <HelpCircle className="h-4 w-4 text-[#D4A017]" />
                Bangle Size Guide
              </Link>
            </div>

            {/* Footer */}
            <div className="mt-auto border-t border-border p-5 bg-gradient-to-r from-brand-light/50 to-[#FFF3E6]/50">
              <div className="flex items-center gap-2 text-xs font-semibold text-brand">
                <Phone className="h-3.5 w-3.5 text-[#D4A017]" />
                WhatsApp: +92 300 0000000
              </div>
              <p className="text-[11px] text-text-secondary mt-1.5">
                Cash on Delivery • Free Shipping Over PKR 5,000
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
