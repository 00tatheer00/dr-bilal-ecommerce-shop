'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Search, Menu, X, Compass, HelpCircle } from 'lucide-react';

export default function Header() {
  const { openCart, totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'All Bangles', href: '/shop' },
    { label: 'Bridal', href: '/shop?category=bridal' },
    { label: 'Everyday', href: '/shop?category=everyday' },
    { label: 'Statement', href: '/shop?category=statement' },
    { label: 'Kundan & Meenakari', href: '/shop?category=kundan-meenakari' },
    { label: 'Our Story', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-bg-primary/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <div className="flex items-center lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-md p-2 text-text-primary hover:bg-bg-surface focus-visible:outline-brand"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Brand Logo / Wordmark */}
        <div className="flex items-center">
          <Link href="/" className="group flex flex-col items-center">
            <span className="font-heading text-2xl font-bold tracking-widest text-brand group-hover:text-brand-hover transition-colors sm:text-3xl">
              GULNAAR
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-text-secondary group-hover:text-gold transition-colors font-medium">
              by MK • Handcrafted Bangles
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex lg:items-center lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-nav text-text-primary hover:text-brand transition-colors py-2 relative group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search */}
          <Link
            href="/search"
            className="rounded-full p-2 text-text-secondary hover:bg-bg-surface hover:text-text-primary transition-colors focus-visible:outline-brand"
            aria-label="Search Collection"
          >
            <Search className="h-5 w-5" />
          </Link>

          {/* Track Order */}
          <Link
            href="/track-order"
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-brand px-2.5 py-1 rounded-full border border-border hover:border-brand/40 transition-colors"
          >
            <Compass className="h-3.5 w-3.5 text-gold" />
            <span>Track Order</span>
          </Link>

          {/* Cart Pill */}
          <button
            type="button"
            onClick={openCart}
            className="relative flex items-center gap-2 rounded-full bg-brand px-3.5 py-2 text-text-inverse hover:bg-brand-hover active:scale-95 transition-all shadow-sm focus-visible:outline-brand"
            aria-label={`Shopping bag with ${totalItems} items`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="text-xs font-semibold">{totalItems}</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-20 z-50 bg-[#2C2C2C]/40 backdrop-blur-xs lg:hidden animate-fade-in">
          <div className="flex h-full w-4/5 max-w-sm flex-col bg-bg-primary p-6 shadow-xl border-r border-border animate-slide-in-left">
            <div className="flex flex-col gap-4 divide-y divide-border">
              <div className="flex flex-col gap-3 pb-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-heading text-lg font-medium text-text-primary hover:text-brand transition-colors py-1"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="flex flex-col gap-3 pt-4 text-sm text-text-secondary">
                <Link
                  href="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-1.5 hover:text-brand"
                >
                  <Compass className="h-4 w-4 text-gold" />
                  Track Your Order
                </Link>
                <Link
                  href="/size-guide"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-1.5 hover:text-brand"
                >
                  <HelpCircle className="h-4 w-4 text-gold" />
                  Bangle Size Guide
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1.5 hover:text-brand"
                >
                  Customer Support
                </Link>
              </div>
            </div>

            <div className="mt-auto border-t border-border pt-6 text-xs text-text-secondary">
              <p className="font-medium text-brand">Cash on Delivery across Pakistan</p>
              <p className="mt-1">Free Delivery on orders over PKR 5,000</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

