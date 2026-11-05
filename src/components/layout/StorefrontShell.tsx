'use client';

import React, { Suspense, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import LuxuryLoader from '@/components/ui/LuxuryLoader';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

function StorefrontChrome() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return null;
  }

  return (
    <>
      <LuxuryLoader />
      <AnnouncementBar />
      <Header />
      <CartDrawer />
      <MobileBottomNav />
    </>
  );
}

function StorefrontFooter() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return null;
  }

  return <Footer />;
}

export default function StorefrontShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log(
        '%c Crafted by Tatheer %c Tech4Edges • 03275792600 ',
        'background: #B81D4E; color: #F6D365; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px;',
        'background: #0F0E17; color: #FFFFFF; padding: 4px 8px; border-radius: 0 4px 4px 0;'
      );
    }
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <StorefrontChrome />
      </Suspense>
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Suspense fallback={null}>
        <StorefrontFooter />
      </Suspense>
    </>
  );
}
