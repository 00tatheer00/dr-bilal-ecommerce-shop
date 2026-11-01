-- =====================================================================
-- GULNAAR by MK — Seed Dataset
-- supabase/seed.sql
-- =====================================================================

-- 1. Insert Categories
insert into public.categories (id, name, slug, description, image_path, sort_order, is_active)
values
  ('11111111-1111-1111-1111-111111111111', 'Bridal Collection', 'bridal', 'Exquisite handcrafted bangles for your special day. Each piece is designed to complement bridal attire with intricate detailing and premium materials.', '/images/categories/bridal.jpg', 1, true),
  ('22222222-2222-2222-2222-222222222222', 'Everyday Elegance', 'everyday', 'Beautiful bangles for daily wear. Lightweight, comfortable and designed to add a touch of elegance to your everyday style.', '/images/categories/everyday.jpg', 2, true),
  ('33333333-3333-3333-3333-333333333333', 'Statement Pieces', 'statement', 'Bold and distinctive bangles that make a statement. Perfect for special occasions and celebrations.', '/images/categories/statement.jpg', 3, true),
  ('44444444-4444-4444-4444-444444444444', 'Kundan & Meenakari', 'kundan-meenakari', 'Traditional Kundan and Meenakari work bangles featuring precious stones and vibrant enamel artistry.', '/images/categories/kundan.jpg', 4, true)
on conflict (id) do nothing;

-- 2. Insert Products
insert into public.products (id, category_id, name, slug, short_description, description, material, status, is_featured)
values
  (
    '00000000-0000-0000-0000-000000000001',
    '11111111-1111-1111-1111-111111111111',
    'Kundan Bridal Kangan Set',
    'kundan-bridal-kangan-set',
    'Handcrafted Kundan bridal set with pearl accents — 12 bangles',
    'A stunning set of handcrafted Kundan bangles featuring intricate stone work and gold-plated finishing. This bridal set includes 12 bangles with traditional Kundan settings, complemented by delicate pearl accents. Each bangle is hand-assembled by our master artisans using age-old techniques passed down through generations.',
    '24K Gold-dipped Brass, Kundan Stones, Seed Pearls',
    'active',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    '22222222-2222-2222-2222-222222222222',
    'Silk Thread Bangles — Rose',
    'silk-thread-bangles-rose',
    'Rose-pink silk thread bangles with stone accents — set of 6',
    'Delicate silk thread bangles wrapped in layers of rose-pink thread with tiny stone embellishments. Lightweight and comfortable for everyday wear, these bangles add a pop of color to any outfit. Set of 6 bangles.',
    'Pure Silk Thread, High-grade Plastic Base, Rhinestones',
    'active',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    '44444444-4444-4444-4444-444444444444',
    'Meenakari Floral Bangles',
    'meenakari-floral-bangles',
    'Hand-painted Meenakari enamel work with floral patterns — set of 4',
    'Traditional Meenakari enamel work featuring intricate floral patterns in vibrant colors on a gold-plated base. These bangles showcase the rich heritage of Meenakari craftsmanship, with each petal and leaf painted by hand. Set of 4 bangles.',
    'Hand-painted Enamel, Gold-plated Brass',
    'active',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    '33333333-3333-3333-3333-333333333333',
    'Pearl & Gold Statement Kada',
    'pearl-gold-statement-kada',
    'Single statement kada with pearls in gold-plated brass',
    'A magnificent statement kada featuring lustrous pearls set in a gold-plated brass frame. This single piece is designed to be worn alone or paired with thin bangles for a layered look. The intricate lattice work on the edges adds depth and dimension.',
    'Freshwater Cultured Pearls, Solid Brass, 22K Micron Gold Plating',
    'active',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000005',
    '22222222-2222-2222-2222-222222222222',
    'Glass Bangles Set — Emerald',
    'glass-bangles-set-emerald',
    'Traditional emerald green glass bangles — set of 24',
    'A classic set of 24 glass bangles in rich emerald green. Handmade using traditional glass-blowing techniques from Hyderabad. These bangles produce the signature melodic clink that makes glass bangles so beloved.',
    'Artisanal Blown Glass',
    'active',
    false
  ),
  (
    '00000000-0000-0000-0000-000000000006',
    '11111111-1111-1111-1111-111111111111',
    'Zircon Studded Bridal Set',
    'zircon-studded-bridal-set',
    'AD Zircon studded bridal bangles in gold plating — set of 8',
    'A luxurious bridal bangle set studded with American diamond zircons in a gold-plated setting. The set includes 8 bangles — 4 broad bangles with full zircon coverage and 4 slim accent bangles. Perfect for nikah and walima ceremonies.',
    'American Diamond (AD) Zirconia, Rhodium & Gold Plating',
    'active',
    false
  ),
  (
    '00000000-0000-0000-0000-000000000007',
    '33333333-3333-3333-3333-333333333333',
    'Lacquer Bangles — Sunset',
    'lacquer-bangles-sunset',
    'Hand-lacquered gradient bangles in sunset tones — set of 8',
    'Vibrant lacquer bangles featuring a beautiful gradient from warm amber to deep crimson. Each bangle is hand-coated with natural lac and finished with a glass-like polish. Set of 8 bangles.',
    'Natural Organic Lac, Wooden Core',
    'active',
    false
  ),
  (
    '00000000-0000-0000-0000-000000000008',
    '33333333-3333-3333-3333-333333333333',
    'Mirror Work Bangle Pair',
    'mirror-work-bangle-pair',
    'Traditional shisha mirror work bangles — pair of 2',
    'A pair of wide bangles with traditional mirror work (shisha) embroidery. Tiny mirrors are set into fabric-wrapped bangles, creating a dazzling play of light. Each piece is a miniature work of art reflecting centuries-old craft traditions.',
    'Shisha Glass Mirrors, Velvet Wrap, Silk Embroidery',
    'active',
    false
  )
on conflict (id) do nothing;

-- 3. Insert Product Variants
insert into public.product_variants (id, product_id, sku, size, color, color_hex, set_quantity, price_minor, stock_quantity, low_stock_threshold, is_active)
values
  -- Product 1 (Kundan Bridal)
  ('a0000001-0001-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'GN-001-24', '2.4', 'Antique Gold', '#DAA520', 12, 1250000, 8, 3, true),
  ('a0000001-0002-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'GN-001-26', '2.6', 'Antique Gold', '#DAA520', 12, 1250000, 12, 3, true),
  ('a0000001-0003-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'GN-001-28', '2.8', 'Antique Gold', '#DAA520', 12, 1250000, 6, 3, true),
  
  -- Product 2 (Silk Thread)
  ('a0000002-0001-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'GN-002-RP-24', '2.4', 'Rose Pink', '#E8A0BF', 6, 350000, 20, 5, true),
  ('a0000002-0002-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'GN-002-RP-26', '2.6', 'Rose Pink', '#E8A0BF', 6, 350000, 18, 5, true),
  ('a0000002-0003-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'GN-002-MR-24', '2.4', 'Maroon', '#800020', 6, 350000, 15, 5, true),
  ('a0000002-0004-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'GN-002-MR-26', '2.6', 'Maroon', '#800020', 6, 350000, 10, 5, true),

  -- Product 3 (Meenakari)
  ('a0000003-0001-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'GN-003-24', '2.4', 'Multi-color Enamel', '#DAA520', 4, 890000, 5, 2, true),
  ('a0000003-0002-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'GN-003-26', '2.6', 'Multi-color Enamel', '#DAA520', 4, 890000, 7, 2, true),
  ('a0000003-0003-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'GN-003-28', '2.8', 'Multi-color Enamel', '#DAA520', 4, 890000, 3, 2, true),

  -- Product 4 (Pearl Kada)
  ('a0000004-0001-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'GN-004-24', '2.4', 'Gold & Pearl', '#FDFBF7', 1, 480000, 10, 3, true),
  ('a0000004-0002-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'GN-004-26', '2.6', 'Gold & Pearl', '#FDFBF7', 1, 480000, 14, 3, true),
  ('a0000004-0003-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', 'GN-004-28', '2.8', 'Gold & Pearl', '#FDFBF7', 1, 480000, 9, 3, true),

  -- Product 5 (Glass Bangles)
  ('a0000005-0001-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', 'GN-005-EM-24', '2.4', 'Emerald Green', '#006B3C', 24, 180000, 30, 5, true),
  ('a0000005-0002-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', 'GN-005-EM-26', '2.6', 'Emerald Green', '#006B3C', 24, 180000, 25, 5, true),

  -- Product 6 (Zircon Bridal)
  ('a0000006-0001-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006', 'GN-006-24', '2.4', 'Sparkling Zircon', '#E5E4E2', 8, 1650000, 4, 2, true),
  ('a0000006-0002-0000-0000-000000000002', '00000000-0000-0000-0000-000000000006', 'GN-006-26', '2.6', 'Sparkling Zircon', '#E5E4E2', 8, 1650000, 6, 2, true),

  -- Product 7 (Lacquer Bangles)
  ('a0000007-0001-0000-0000-000000000001', '00000000-0000-0000-0000-000000000007', 'GN-007-24', '2.4', 'Sunset Crimson', '#C41E3A', 8, 420000, 12, 3, true),
  ('a0000007-0002-0000-0000-000000000002', '00000000-0000-0000-0000-000000000007', 'GN-007-26', '2.6', 'Sunset Crimson', '#C41E3A', 8, 420000, 16, 3, true),

  -- Product 8 (Mirror Work)
  ('a0000008-0001-0000-0000-000000000001', '00000000-0000-0000-0000-000000000008', 'GN-008-BL-24', '2.4', 'Royal Blue', '#002366', 2, 280000, 18, 4, true),
  ('a0000008-0002-0000-0000-000000000002', '00000000-0000-0000-0000-000000000008', 'GN-008-BL-26', '2.6', 'Royal Blue', '#002366', 2, 280000, 14, 4, true)
on conflict (id) do nothing;

