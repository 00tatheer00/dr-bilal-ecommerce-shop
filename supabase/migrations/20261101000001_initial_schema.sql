-- =====================================================================
-- GULNAAR by MK — Supabase PostgreSQL Schema & Security Policies
-- Phase 3 Migration: 20261101000001_initial_schema.sql
-- =====================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- =====================================================================
-- 1. CATEGORIES TABLE
-- =====================================================================
create table if not exists public.categories (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    description text,
    image_path text,
    sort_order integer default 0,
    is_active boolean default true,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create index if not exists cat_slug_idx on public.categories (slug);
create index if not exists cat_active_idx on public.categories (is_active, sort_order);

-- =====================================================================
-- 2. PRODUCTS TABLE
-- =====================================================================
create table if not exists public.products (
    id uuid primary key default gen_random_uuid(),
    category_id uuid references public.categories(id) on delete set null,
    name text not null,
    slug text not null unique,
    short_description text,
    description text,
    material text,
    status text default 'active' check (status in ('draft', 'active', 'archived')),
    is_featured boolean default false,
    seo_title text,
    seo_description text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create index if not exists prod_slug_idx on public.products (slug);
create index if not exists prod_cat_idx on public.products (category_id);
create index if not exists prod_status_idx on public.products (status, is_featured);

-- =====================================================================
-- 3. PRODUCT IMAGES TABLE
-- =====================================================================
create table if not exists public.product_images (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null references public.products(id) on delete cascade,
    storage_path text not null,
    alt_text text,
    sort_order integer default 0,
    is_primary boolean default false,
    created_at timestamptz default now() not null
);

create index if not exists img_prod_idx on public.product_images (product_id, sort_order);

-- =====================================================================
-- 4. PRODUCT VARIANTS TABLE
-- Money stored in integer minor units (Pakistani Paisa / PKR cents: 100 minor = 1 PKR)
-- =====================================================================
create table if not exists public.product_variants (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null references public.products(id) on delete cascade,
    sku text not null unique,
    size text,           -- e.g. '2.4', '2.6', '2.8'
    color text,          -- e.g. 'Emerald', 'Rose Pink'
    color_hex text,      -- e.g. '#006B3C'
    set_quantity integer default 1, -- e.g. 12 bangles
    price_minor integer not null check (price_minor >= 0),
    compare_at_price_minor integer check (compare_at_price_minor is null or compare_at_price_minor >= 0),
    stock_quantity integer not null default 0 check (stock_quantity >= 0),
    low_stock_threshold integer default 3 check (low_stock_threshold >= 0),
    is_active boolean default true,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create index if not exists var_prod_idx on public.product_variants (product_id, is_active);
create index if not exists var_sku_idx on public.product_variants (sku);

-- =====================================================================
-- 5. PROFILES & ADMIN USERS (Linked to Supabase Auth)
-- =====================================================================
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    phone text,
    role text default 'customer' check (role in ('customer', 'admin')),
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create table if not exists public.admin_users (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null unique,
    role text default 'admin' check (role in ('admin', 'superadmin')),
    created_at timestamptz default now() not null
);

-- =====================================================================
-- 6. ADDRESSES (Optional for future customer account support)
-- =====================================================================
create table if not exists public.addresses (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade,
    name text not null,
    phone text not null,
    address_line1 text not null,
    address_line2 text,
    city text not null,
    province text,
    is_default boolean default false,
    created_at timestamptz default now() not null
);

-- =====================================================================
-- 7. ORDERS TABLE
-- Cash on Delivery (COD) supported; Guest checkout mandatory
-- =====================================================================
create table if not exists public.orders (
    id uuid primary key default gen_random_uuid(),
    order_number text not null unique,               -- Human-readable e.g. GN-9X4K2L
    tracking_token text not null unique,             -- High-entropy unguessable token
    user_id uuid references auth.users(id) on delete set null, -- Optional (null for guests)
    customer_name text not null,
    customer_phone text not null,
    customer_email text,
    address_line1 text not null,
    address_line2 text,
    city text not null,
    province text,
    special_instructions text,
    subtotal_minor integer not null check (subtotal_minor >= 0),
    delivery_charge_minor integer not null default 0 check (delivery_charge_minor >= 0),
    total_minor integer not null check (total_minor >= 0),
    payment_method text not null default 'cod' check (payment_method in ('cod')),
    payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'refunded', 'failed')),
    fulfillment_status text not null default 'pending' check (fulfillment_status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    idempotency_key text unique,                     -- Prevents duplicate submissions on retry
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create index if not exists order_num_idx on public.orders (order_number);
create index if not exists order_phone_idx on public.orders (customer_phone);
create index if not exists order_token_idx on public.orders (tracking_token);
create index if not exists order_status_idx on public.orders (fulfillment_status, created_at desc);

-- =====================================================================
-- 8. ORDER ITEMS (Immutable historical snapshot at checkout time)
-- =====================================================================
create table if not exists public.order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references public.orders(id) on delete cascade,
    product_id uuid references public.products(id) on delete set null,
    variant_id uuid references public.product_variants(id) on delete set null,
    product_name text not null,
    variant_sku text not null,
    variant_size text,
    variant_color text,
    unit_price_minor integer not null check (unit_price_minor >= 0),
    quantity integer not null check (quantity > 0),
    line_total_minor integer not null check (line_total_minor >= 0),
    created_at timestamptz default now() not null
);

create index if not exists item_order_idx on public.order_items (order_id);

-- =====================================================================
-- 9. INVENTORY MOVEMENTS (Stock change audit log)
-- =====================================================================
create table if not exists public.inventory_movements (
    id uuid primary key default gen_random_uuid(),
    variant_id uuid not null references public.product_variants(id) on delete cascade,
    quantity_delta integer not null, -- negative for sales, positive for restock
    balance_after integer not null check (balance_after >= 0),
    reason text not null check (reason in ('order_placed', 'order_cancelled', 'manual_adjustment', 'restock', 'audit')),
    related_order_id uuid references public.orders(id) on delete set null,
    created_at timestamptz default now() not null
);

create index if not exists inv_variant_idx on public.inventory_movements (variant_id, created_at desc);

-- =====================================================================
-- 10. ATOMIC TRANSACTION: CREATE GUEST ORDER
-- Strictly validates stock & price server-side, generates order,
-- decrements stock atomically, logs inventory movement.
-- =====================================================================
create or replace function public.create_guest_order(
    p_customer_name text,
    p_customer_phone text,
    p_customer_email text,
    p_address_line1 text,
    p_address_line2 text,
    p_city text,
    p_province text,
    p_special_instructions text,
    p_items jsonb,                 -- Array of { "variant_id": uuid, "quantity": int }
    p_idempotency_key text default null
)
returns jsonb
language plpgsql
security definer -- Runs with elevated permissions to create order and deduct stock securely
as $$
declare
    v_order_id uuid;
    v_order_number text;
    v_tracking_token text;
    v_subtotal_minor integer := 0;
    v_delivery_charge_minor integer := 25000; -- PKR 250 in minor units
    v_free_delivery_threshold integer := 500000; -- PKR 5,000
    v_total_minor integer := 0;
    v_item record;
    v_variant record;
    v_product record;
    v_line_total integer;
    v_chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    v_code text := 'GN-';
    i integer;
begin
    -- 1. Check idempotency: if key provided and already exists, return existing order
    if p_idempotency_key is not null then
        select id, order_number, tracking_token, total_minor into v_order_id, v_order_number, v_tracking_token, v_total_minor
        from public.orders
        where idempotency_key = p_idempotency_key;

        if found then
            return jsonb_build_object(
                'success', true,
                'order_id', v_order_id,
                'order_number', v_order_number,
                'tracking_token', v_tracking_token,
                'is_duplicate', true
            );
        end if;
    end if;

    -- 2. Basic Input Validation
    if length(trim(p_customer_name)) = 0 then
        raise exception 'Customer name is required.';
    end if;
    if length(trim(p_customer_phone)) < 10 then
        raise exception 'Valid phone number is required.';
    end if;
    if length(trim(p_address_line1)) = 0 then
        raise exception 'Delivery address is required.';
    end if;
    if length(trim(p_city)) = 0 then
        raise exception 'City is required.';
    end if;
    if p_items is null or jsonb_array_length(p_items) = 0 then
        raise exception 'At least one item is required to place an order.';
    end if;

    -- 3. Generate random non-sequential order number
    for i in 1..6 loop
        v_code := v_code || substr(v_chars, floor(random() * length(v_chars) + 1)::integer, 1);
    end loop;
    v_order_number := v_code;
    v_tracking_token := encode(gen_random_bytes(24), 'hex');

    -- 4. Calculate Authoritative Prices and Verify Stock under ROW LOCK
    for v_item in select * from jsonb_to_recordset(p_items) as x(variant_id uuid, quantity int)
    loop
        if v_item.quantity <= 0 then
            raise exception 'Invalid item quantity: %', v_item.quantity;
        end if;

        -- Lock variant row for update to prevent concurrent race condition
        select * into v_variant
        from public.product_variants
        where id = v_item.variant_id and is_active = true
        for update;

        if not found then
            raise exception 'Product variant % is unavailable or discontinued.', v_item.variant_id;
        end if;

        if v_variant.stock_quantity < v_item.quantity then
            raise exception 'Insufficient stock for SKU %. Available: %, Requested: %',
                v_variant.sku, v_variant.stock_quantity, v_item.quantity;
        end if;

        v_line_total := v_variant.price_minor * v_item.quantity;
        v_subtotal_minor := v_subtotal_minor + v_line_total;
    end loop;

    -- 5. Calculate Delivery Fee (Free if subtotal >= 500,000 minor units / PKR 5,000)
    if v_subtotal_minor >= v_free_delivery_threshold then
        v_delivery_charge_minor := 0;
    end if;
    v_total_minor := v_subtotal_minor + v_delivery_charge_minor;

    -- 6. Insert Order Record
    insert into public.orders (
        order_number,
        tracking_token,
        customer_name,
        customer_phone,
        customer_email,
        address_line1,
        address_line2,
        city,
        province,
        special_instructions,
        subtotal_minor,
        delivery_charge_minor,
        total_minor,
        payment_method,
        payment_status,
        fulfillment_status,
        idempotency_key
    ) values (
        v_order_number,
        v_tracking_token,
        trim(p_customer_name),
        trim(p_customer_phone),
        nullif(trim(p_customer_email), ''),
        trim(p_address_line1),
        nullif(trim(p_address_line2), ''),
        trim(p_city),
        nullif(trim(p_province), ''),
        nullif(trim(p_special_instructions), ''),
        v_subtotal_minor,
        v_delivery_charge_minor,
        v_total_minor,
        'cod',
        'pending',
        'pending',
        p_idempotency_key
    ) returning id into v_order_id;

    -- 7. Deduct Stock, Insert Order Items & Record Inventory Movement
    for v_item in select * from jsonb_to_recordset(p_items) as x(variant_id uuid, quantity int)
    loop
        select v.*, p.name as product_name
        into v_variant
        from public.product_variants v
        join public.products p on p.id = v.product_id
        where v.id = v_item.variant_id;

        v_line_total := v_variant.price_minor * v_item.quantity;

        -- Deduct stock
        update public.product_variants
        set stock_quantity = stock_quantity - v_item.quantity,
            updated_at = now()
        where id = v_item.variant_id;

        -- Record order item snapshot
        insert into public.order_items (
            order_id,
            product_id,
            variant_id,
            product_name,
            variant_sku,
            variant_size,
            variant_color,
            unit_price_minor,
            quantity,
            line_total_minor
        ) values (
            v_order_id,
            v_variant.product_id,
            v_variant.id,
            v_variant.product_name,
            v_variant.sku,
            v_variant.size,
            v_variant.color,
            v_variant.price_minor,
            v_item.quantity,
            v_line_total
        );

        -- Record inventory movement
        insert into public.inventory_movements (
            variant_id,
            quantity_delta,
            balance_after,
            reason,
            related_order_id
        ) values (
            v_variant.id,
            -v_item.quantity,
            v_variant.stock_quantity - v_item.quantity,
            'order_placed',
            v_order_id
        );
    end loop;

    -- Return safe confirmation payload
    return jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_number', v_order_number,
        'tracking_token', v_tracking_token,
        'subtotal_minor', v_subtotal_minor,
        'delivery_charge_minor', v_delivery_charge_minor,
        'total_minor', v_total_minor
    );
end;
$$;

-- =====================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.profiles enable row level security;
alter table public.admin_users enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.inventory_movements enable row level security;

-- Helper function: Check if current authenticated user is an authorized admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
    select exists (
        select 1 from public.admin_users
        where id = auth.uid()
    );
$$;

-- A. CATEGORIES
create policy "Public can view active categories"
    on public.categories for select
    using (is_active = true);

create policy "Admins have full access to categories"
    on public.categories for all
    using (public.is_admin());

-- B. PRODUCTS
create policy "Public can view active products"
    on public.products for select
    using (status = 'active');

create policy "Admins have full access to products"
    on public.products for all
    using (public.is_admin());

-- C. PRODUCT IMAGES
create policy "Public can view product images"
    on public.product_images for select
    using (true);

create policy "Admins have full access to product images"
    on public.product_images for all
    using (public.is_admin());

-- D. PRODUCT VARIANTS
create policy "Public can view active product variants"
    on public.product_variants for select
    using (is_active = true);

create policy "Admins have full access to variants"
    on public.product_variants for all
    using (public.is_admin());

-- E. PROFILES & ADDRESSES
create policy "Users can view and edit their own profile"
    on public.profiles for select
    using (auth.uid() = id);

create policy "Users can manage their own addresses"
    on public.addresses for all
    using (auth.uid() = user_id);

create policy "Admins have full access to profiles"
    on public.profiles for all
    using (public.is_admin());

-- F. ORDERS (Strict privacy protection)
-- Anonymous users CANNOT select all orders.
-- Customers can only look up orders by verified tracking_token or phone + order_number
create policy "Customers can view their order with tracking token"
    on public.orders for select
    using (
        (auth.uid() is not null and auth.uid() = user_id)
        or public.is_admin()
    );

create policy "Admins have full access to orders"
    on public.orders for all
    using (public.is_admin());

-- G. ORDER ITEMS
create policy "Order items readable if order is accessible"
    on public.order_items for select
    using (
        exists (
            select 1 from public.orders o
            where o.id = order_items.order_id
            and (o.user_id = auth.uid() or public.is_admin())
        )
    );

create policy "Admins have full access to order items"
    on public.order_items for all
    using (public.is_admin());

-- H. INVENTORY MOVEMENTS (Restricted strictly to administrators)
create policy "Admins have full access to inventory movements"
    on public.inventory_movements for all
    using (public.is_admin());

-- I. ADMIN USERS
create policy "Admins can view admin users"
    on public.admin_users for select
    using (public.is_admin());

-- =====================================================================
-- 12. SUPABASE STORAGE (product-images bucket)
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public can view product images in storage"
    on storage.objects for select
    using (bucket_id = 'product-images');

create policy "Admins can upload product images"
    on storage.objects for insert
    with check (bucket_id = 'product-images' and public.is_admin());

create policy "Admins can update and delete product images"
    on storage.objects for all
    using (bucket_id = 'product-images' and public.is_admin());

