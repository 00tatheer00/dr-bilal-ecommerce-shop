import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import StorefrontShell from '@/components/layout/StorefrontShell';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gulnaarbymk.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'GULNAAR by MK — Handcrafted Luxury Bangles',
    template: '%s | GULNAAR by MK',
  },
  description:
    'Discover bespoke handcrafted bangles, bridal kangan sets, Meenakari artistry, and everyday elegance. Cash on Delivery available across Pakistan.',
  keywords: [
    'Handmade bangles',
    'Bridal kangan Pakistan',
    'Silk thread bangles',
    'Meenakari bangles',
    'Velvet glass bangles',
    'Cash on delivery jewellery Pakistan',
    'GULNAAR by MK',
  ],
  authors: [{ name: 'GULNAAR by MK' }],
  creator: 'GULNAAR by MK',
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: siteUrl,
    title: 'GULNAAR by MK — Handcrafted Luxury Bangles',
    description:
      'Discover bespoke handcrafted bangles, bridal kangan sets, Meenakari artistry, and everyday elegance. Cash on Delivery available across Pakistan.',
    siteName: 'GULNAAR by MK',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GULNAAR by MK — Handcrafted Luxury Bangles',
    description: 'Discover bespoke handcrafted bangles with Cash on Delivery across Pakistan.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary selection:bg-brand-light selection:text-brand">
        <CartProvider>
          <StorefrontShell>{children}</StorefrontShell>
        </CartProvider>
      </body>
    </html>
  );
}
