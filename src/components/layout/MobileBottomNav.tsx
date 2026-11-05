'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gem, Search, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { openCart, totalItems } = useCart();

  // Hide on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      label: 'Bangles',
      href: '/shop',
      icon: Gem,
      isActive: pathname.startsWith('/shop'),
    },
    {
      label: 'Search',
      href: '/search',
      icon: Search,
      isActive: pathname === '/search',
    },
  ];

  const whatsappMessage = encodeURIComponent(
    'Salam! I want to order handcrafted bangles from GULNAAR by MK.'
  );
  const whatsappUrl = `https://wa.me/923275792600?text=${whatsappMessage}`;

  return (
    <aside
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E5DF] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 h-15 items-center px-2">
        {/* Home, Shop, Search */}
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              prefetch={true}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                item.isActive
                  ? 'text-[#7A0C2E] font-bold'
                  : 'text-text-secondary hover:text-[#7A0C2E]'
              }`}
            >
              <Icon
                className={`h-5 w-5 ${
                  item.isActive ? 'stroke-[2.5] text-[#7A0C2E]' : 'stroke-[1.75]'
                }`}
              />
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
            </Link>
          );
        })}

        {/* WhatsApp Direct Order */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 text-[#25D366] hover:text-[#128C7E] transition-colors"
          aria-label="Order on WhatsApp"
        >
          <div className="relative">
            <MessageCircle className="h-5 w-5 fill-[#25D366]/15 stroke-[2]" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#25D366] animate-ping" />
          </div>
          <span className="text-[10px] font-bold tracking-tight text-[#1E7E34] mt-0.5">
            WhatsApp
          </span>
        </a>

        {/* Cart Drawer Trigger */}
        <button
          type="button"
          onClick={openCart}
          className="relative flex flex-col items-center justify-center py-1 text-[#7A0C2E] cursor-pointer"
          aria-label={`Shopping Cart with ${totalItems} items`}
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5 stroke-[2] text-[#7A0C2E]" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-gradient-to-r from-[#DFB76C] to-[#C5A059] text-[9px] font-bold text-[#4A0E2E] flex items-center justify-center shadow-xs">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight text-[#7A0C2E] mt-0.5">
            Cart
          </span>
        </button>
      </div>
    </aside>
  );
}
