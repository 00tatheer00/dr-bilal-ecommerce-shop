import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, getProducts } from '@/lib/db/products';
import ProductDetailClient from './ProductDetailClient';
import Container from '@/components/ui/Container';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gulnaarbymk.com';

  if (!product) {
    return {
      title: 'Bangle Not Found — GULNAAR by MK',
    };
  }

  const primaryImage = product.images?.[0]?.url || `${siteUrl}/images/brand-og.jpg`;

  return {
    title: `${product.name} — Handcrafted Bangles | GULNAAR by MK`,
    description:
      product.short_description ||
      `Shop ${product.name}. Handcrafted with traditional South Asian artisanal mastery. Cash on Delivery across Pakistan.`,
    alternates: {
      canonical: `${siteUrl}/shop/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} — GULNAAR by MK`,
      description: product.short_description || 'Handcrafted Luxury Bangles Collection',
      url: `${siteUrl}/shop/${product.slug}`,
      siteName: 'GULNAAR by MK',
      images: [
        {
          url: primaryImage,
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} — GULNAAR by MK`,
      description: product.short_description || 'Handcrafted Luxury Bangles Collection',
      images: [primaryImage],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch related products in the same category or general list
  const allProducts = await getProducts();
  const related = allProducts.filter((p) => p.id !== product.id);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gulnaarbymk.com';
  const minPriceMinor = product.variants?.[0]?.price_cents || 250000;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images?.map((i) => i.url) || [],
    description: product.description || product.short_description,
    brand: {
      '@type': 'Brand',
      name: 'GULNAAR by MK',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PKR',
      price: (minPriceMinor / 100).toFixed(2),
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/shop/${product.slug}`,
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <div className="py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container size="xl">
        {/* Breadcrumb Navigation */}
        <div className="text-xs text-text-secondary mb-8 flex items-center gap-1.5 border-b border-border pb-4">
          <Link href="/" className="hover:text-brand">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-brand">
            Shop Bangles
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="hover:text-brand"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-text-primary font-medium truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </div>

        <ProductDetailClient product={product} relatedProducts={related} />
      </Container>
    </div>
  );
}
