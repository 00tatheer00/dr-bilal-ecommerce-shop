'use client';

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';

function StorefrontChrome() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return null;
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <CartDrawer />
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
  return (
    <>
      <Suspense fallback={null}>
        <StorefrontChrome />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Suspense fallback={null}>
        <StorefrontFooter />
      </Suspense>
    </>
  );
}
