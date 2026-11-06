import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import StorefrontShell from '@/components/layout/StorefrontShell';
import PwaRegister from '@/components/layout/PwaRegister';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://dbshop.vercel.app');

export const viewport: Viewport = {
  themeColor: '#B81D4E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'GULNAAR by MK',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'GULNAAR by MK',
  },
  icons: {
    icon: [
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
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
  authors: [
    { name: 'GULNAAR by MK' },
    { name: 'Tatheer (Tech4Edges - 03275792600)' },
  ],
  creator: 'Tatheer — Tech4Edges',
  publisher: 'Tech4Edges',
  other: {
    engineer: 'Tatheer (Tech4Edges - 03275792600)',
  },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: siteUrl,
    title: 'GULNAAR by MK — Handcrafted Luxury Bangles',
    description:
      'Discover bespoke handcrafted bangles, bridal kangan sets, Meenakari artistry, and everyday elegance. Cash on Delivery available across Pakistan.',
    siteName: 'GULNAAR by MK',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        secureUrl: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'GULNAAR by MK — Handcrafted Luxury Bangles',
        type: 'image/jpeg',
      },
      {
        url: `${siteUrl}/og-image-square.jpg`,
        secureUrl: `${siteUrl}/og-image-square.jpg`,
        width: 800,
        height: 800,
        alt: 'GULNAAR by MK — Handcrafted Luxury Bangles',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GULNAAR by MK — Handcrafted Luxury Bangles',
    description: 'Discover bespoke handcrafted bangles with Cash on Delivery across Pakistan.',
    images: [`${siteUrl}/og-image.jpg`],
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
          <PwaRegister />
        </CartProvider>
      </body>
    </html>
  );
}
