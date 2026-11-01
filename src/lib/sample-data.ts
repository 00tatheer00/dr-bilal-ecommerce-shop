// ============================================
// Sample data for GULNAAR by MK
// Used during development before Supabase integration
// ============================================

import type { Category, Product, ProductImage, ProductVariant } from '@/types';

export const sampleCategories: Category[] = [
  {
    id: '1',
    name: 'Bridal Collection',
    slug: 'bridal',
    description: 'Exquisite handcrafted bangles for your special day. Each piece is designed to complement bridal attire with intricate detailing and premium materials.',
    image_url: '/images/categories/bridal.jpg',
    sort_order: 1,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Everyday Elegance',
    slug: 'everyday',
    description: 'Beautiful bangles for daily wear. Lightweight, comfortable and designed to add a touch of elegance to your everyday style.',
    image_url: '/images/categories/everyday.jpg',
    sort_order: 2,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Statement Pieces',
    slug: 'statement',
    description: 'Bold and distinctive bangles that make a statement. Perfect for special occasions and celebrations.',
    image_url: '/images/categories/statement.jpg',
    sort_order: 3,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Kundan & Meenakari',
    slug: 'kundan-meenakari',
    description: 'Traditional Kundan and Meenakari work bangles featuring precious stones and vibrant enamel artistry.',
    image_url: '/images/categories/kundan.jpg',
    sort_order: 4,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

const makeImages = (productId: string, count: number): ProductImage[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `img-${productId}-${i + 1}`,
    product_id: productId,
    url: `/images/products/product-${productId}-${i + 1}.jpg`,
    alt_text: `Product image ${i + 1}`,
    sort_order: i,
    is_primary: i === 0,
    created_at: '2024-01-01T00:00:00Z',
  }));

const makeVariant = (
  productId: string,
  index: number,
  overrides: Partial<ProductVariant>
): ProductVariant => ({
  id: `var-${productId}-${index}`,
  product_id: productId,
  sku: `GN-${productId.padStart(3, '0')}-${index}`,
  size: null,
  color: null,
  color_hex: null,
  price_cents: 0,
  compare_at_price_cents: null,
  stock_quantity: 15,
  low_stock_threshold: 5,
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Kundan Bridal Kangan Set',
    slug: 'kundan-bridal-kangan-set',
    description: 'A stunning set of handcrafted Kundan bangles featuring intricate stone work and gold-plated finishing. This bridal set includes 12 bangles with traditional Kundan settings, complemented by delicate pearl accents. Each bangle is hand-assembled by our master artisans using age-old techniques passed down through generations.',
    short_description: 'Handcrafted Kundan bridal set with pearl accents — 12 bangles',
    category_id: '1',
    is_active: true,
    is_featured: true,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    category: sampleCategories[0],
    images: makeImages('1', 4),
    variants: [
      makeVariant('1', 1, { size: '2.4', price_cents: 1250000, stock_quantity: 8 }),
      makeVariant('1', 2, { size: '2.6', price_cents: 1250000, stock_quantity: 12 }),
      makeVariant('1', 3, { size: '2.8', price_cents: 1250000, stock_quantity: 6 }),
    ],
  },
  {
    id: '2',
    name: 'Silk Thread Bangles — Rose',
    slug: 'silk-thread-bangles-rose',
    description: 'Delicate silk thread bangles wrapped in layers of rose-pink thread with tiny stone embellishments. Lightweight and comfortable for everyday wear, these bangles add a pop of color to any outfit. Set of 6 bangles.',
    short_description: 'Rose-pink silk thread bangles with stone accents — set of 6',
    category_id: '2',
    is_active: true,
    is_featured: true,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
    category: sampleCategories[1],
    images: makeImages('2', 3),
    variants: [
      makeVariant('2', 1, { size: '2.4', color: 'Rose Pink', color_hex: '#E8A0BF', price_cents: 350000, stock_quantity: 20 }),
      makeVariant('2', 2, { size: '2.6', color: 'Rose Pink', color_hex: '#E8A0BF', price_cents: 350000, stock_quantity: 18 }),
      makeVariant('2', 3, { size: '2.4', color: 'Maroon', color_hex: '#800020', price_cents: 350000, stock_quantity: 15 }),
      makeVariant('2', 4, { size: '2.6', color: 'Maroon', color_hex: '#800020', price_cents: 350000, stock_quantity: 10 }),
    ],
  },
  {
    id: '3',
    name: 'Meenakari Floral Bangles',
    slug: 'meenakari-floral-bangles',
    description: 'Traditional Meenakari enamel work featuring intricate floral patterns in vibrant colors on a gold-plated base. These bangles showcase the rich heritage of Meenakari craftsmanship, with each petal and leaf painted by hand. Set of 4 bangles.',
    short_description: 'Hand-painted Meenakari enamel work with floral patterns — set of 4',
    category_id: '4',
    is_active: true,
    is_featured: true,
    created_at: '2024-02-10T00:00:00Z',
    updated_at: '2024-02-10T00:00:00Z',
    category: sampleCategories[3],
    images: makeImages('3', 4),
    variants: [
      makeVariant('3', 1, { size: '2.4', color: 'Multi', color_hex: '#DAA520', price_cents: 890000, stock_quantity: 5 }),
      makeVariant('3', 2, { size: '2.6', color: 'Multi', color_hex: '#DAA520', price_cents: 890000, stock_quantity: 7 }),
      makeVariant('3', 3, { size: '2.8', color: 'Multi', color_hex: '#DAA520', price_cents: 890000, stock_quantity: 3, low_stock_threshold: 5 }),
    ],
  },
  {
    id: '4',
    name: 'Pearl & Gold Statement Kada',
    slug: 'pearl-gold-statement-kada',
    description: 'A magnificent statement kada featuring lustrous pearls set in a gold-plated brass frame. This single piece is designed to be worn alone or paired with thin bangles for a layered look. The intricate lattice work on the edges adds depth and dimension.',
    short_description: 'Single statement kada with pearls in gold-plated brass',
    category_id: '3',
    is_active: true,
    is_featured: true,
    created_at: '2024-02-20T00:00:00Z',
    updated_at: '2024-02-20T00:00:00Z',
    category: sampleCategories[2],
    images: makeImages('4', 3),
    variants: [
      makeVariant('4', 1, { size: '2.4', price_cents: 480000, stock_quantity: 10 }),
      makeVariant('4', 2, { size: '2.6', price_cents: 480000, stock_quantity: 14 }),
      makeVariant('4', 3, { size: '2.8', price_cents: 480000, stock_quantity: 9 }),
    ],
  },
  {
    id: '5',
    name: 'Glass Bangles Set — Emerald',
    slug: 'glass-bangles-set-emerald',
    description: 'A classic set of 24 glass bangles in rich emerald green. Handmade using traditional glass-blowing techniques from Hyderabad. These bangles produce the signature melodic clink that makes glass bangles so beloved.',
    short_description: 'Traditional emerald green glass bangles — set of 24',
    category_id: '2',
    is_active: true,
    is_featured: false,
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z',
    category: sampleCategories[1],
    images: makeImages('5', 3),
    variants: [
      makeVariant('5', 1, { size: '2.4', color: 'Emerald', color_hex: '#006B3C', price_cents: 180000, stock_quantity: 30 }),
      makeVariant('5', 2, { size: '2.6', color: 'Emerald', color_hex: '#006B3C', price_cents: 180000, stock_quantity: 25 }),
      makeVariant('5', 3, { size: '2.4', color: 'Ruby Red', color_hex: '#9B111E', price_cents: 180000, stock_quantity: 28 }),
      makeVariant('5', 4, { size: '2.6', color: 'Ruby Red', color_hex: '#9B111E', price_cents: 180000, stock_quantity: 22 }),
    ],
  },
  {
    id: '6',
    name: 'Zircon Studded Bridal Set',
    slug: 'zircon-studded-bridal-set',
    description: 'A luxurious bridal bangle set studded with American diamond zircons in a gold-plated setting. The set includes 8 bangles — 4 broad bangles with full zircon coverage and 4 slim accent bangles. Perfect for nikah and walima ceremonies.',
    short_description: 'AD Zircon studded bridal bangles in gold plating — set of 8',
    category_id: '1',
    is_active: true,
    is_featured: false,
    created_at: '2024-03-10T00:00:00Z',
    updated_at: '2024-03-10T00:00:00Z',
    category: sampleCategories[0],
    images: makeImages('6', 4),
    variants: [
      makeVariant('6', 1, { size: '2.4', price_cents: 1650000, stock_quantity: 4, low_stock_threshold: 5 }),
      makeVariant('6', 2, { size: '2.6', price_cents: 1650000, stock_quantity: 6 }),
      makeVariant('6', 3, { size: '2.8', price_cents: 1650000, stock_quantity: 3, low_stock_threshold: 5 }),
    ],
  },
  {
    id: '7',
    name: 'Lacquer Bangles — Sunset',
    slug: 'lacquer-bangles-sunset',
    description: 'Vibrant lacquer bangles featuring a beautiful gradient from warm amber to deep crimson. Each bangle is hand-coated with natural lac and finished with a glass-like polish. Set of 8 bangles.',
    short_description: 'Hand-lacquered gradient bangles in sunset tones — set of 8',
    category_id: '3',
    is_active: true,
    is_featured: false,
    created_at: '2024-03-15T00:00:00Z',
    updated_at: '2024-03-15T00:00:00Z',
    category: sampleCategories[2],
    images: makeImages('7', 3),
    variants: [
      makeVariant('7', 1, { size: '2.4', price_cents: 420000, stock_quantity: 12 }),
      makeVariant('7', 2, { size: '2.6', price_cents: 420000, stock_quantity: 16 }),
    ],
  },
  {
    id: '8',
    name: 'Mirror Work Bangle Pair',
    slug: 'mirror-work-bangle-pair',
    description: 'A pair of wide bangles with traditional mirror work (shisha) embroidery. Tiny mirrors are set into fabric-wrapped bangles, creating a dazzling play of light. Each piece is a miniature work of art reflecting centuries-old craft traditions.',
    short_description: 'Traditional shisha mirror work bangles — pair of 2',
    category_id: '3',
    is_active: true,
    is_featured: false,
    created_at: '2024-03-20T00:00:00Z',
    updated_at: '2024-03-20T00:00:00Z',
    category: sampleCategories[2],
    images: makeImages('8', 3),
    variants: [
      makeVariant('8', 1, { size: '2.4', color: 'Royal Blue', color_hex: '#002366', price_cents: 280000, stock_quantity: 18 }),
      makeVariant('8', 2, { size: '2.6', color: 'Royal Blue', color_hex: '#002366', price_cents: 280000, stock_quantity: 14 }),
      makeVariant('8', 3, { size: '2.4', color: 'Red', color_hex: '#C41E3A', price_cents: 280000, stock_quantity: 20 }),
      makeVariant('8', 4, { size: '2.6', color: 'Red', color_hex: '#C41E3A', price_cents: 280000, stock_quantity: 16 }),
    ],
  },
];

// Utility to get featured products
export function getFeaturedProducts(): Product[] {
  return sampleProducts.filter((p) => p.is_featured);
}

// Utility to get products by category
export function getProductsByCategory(slug: string): Product[] {
  const category = sampleCategories.find((c) => c.slug === slug);
  if (!category) return [];
  return sampleProducts.filter((p) => p.category_id === category.id);
}

// Utility to get product by slug
export function getProductBySlug(slug: string): Product | undefined {
  return sampleProducts.find((p) => p.slug === slug);
}

// Get cheapest variant price for a product
export function getStartingPrice(product: Product): number {
  if (!product.variants || product.variants.length === 0) return 0;
  return Math.min(...product.variants.map((v) => v.price_cents));
}

// Check if product has multiple prices
export function hasPriceRange(product: Product): boolean {
  if (!product.variants || product.variants.length <= 1) return false;
  const prices = product.variants.map((v) => v.price_cents);
  return Math.min(...prices) !== Math.max(...prices);
}
