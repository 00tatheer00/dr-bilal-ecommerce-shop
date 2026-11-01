# GULNAAR by MK — Production Deployment & Launch Guide

This document provides step-by-step instructions for deploying and running **GULNAAR by MK** in a production environment (Next.js on Vercel with Supabase PostgreSQL, Auth & Storage).

---

## 1. Architecture Overview

- **Frontend & App Server:** Next.js 16 (App Router, Turbopack, React 19, Tailwind CSS v4)
- **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS) & Supabase Auth
- **Asset Storage:** Supabase Storage (Bucket: `product-images`)
- **Checkout & Fulfillment:** Cash on Delivery (COD) with guest checkout
- **Admin Console:** Protected console under `/admin` for product CRUD, inventory matrix, and COD order reconciliation

---

## 2. Production Environment Variables

Configure the following environment variables in your hosting provider (e.g. Vercel Project Settings > Environment Variables):

| Variable | Description | Exposure |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (`https://<project-ref>.supabase.co`) | Public (Browser & Server) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key for client-side queries protected by RLS | Public (Browser & Server) |
| `SUPABASE_SERVICE_ROLE_KEY` | Privileged service key for atomic order creation & admin actions | **Private (Server Only)** |
| `NEXT_PUBLIC_SITE_URL` | Canonical production domain (`https://gulnaarbymk.com`) | Public (SEO & Canonical) |

> [!CAUTION]
> Never expose `SUPABASE_SERVICE_ROLE_KEY` to browser code or prefix it with `NEXT_PUBLIC_`. It is strictly safeguarded on the server.

---

## 3. Supabase Production Setup

### Step 3.1: Execute Database Migrations
1. Open the [Supabase Dashboard](https://supabase.com/dashboard) and navigate to the **SQL Editor**.
2. Run the migration script located at:
   `supabase/migrations/20261101000001_initial_schema.sql`
   - This script creates all tables (`categories`, `products`, `product_variants`, `product_images`, `orders`, `order_items`, `inventory_movements`, `admin_users`), indexes, constraints, RLS policies, and the atomic `create_guest_order` transactional function.
3. (Optional) Run the seed script for initial catalogue data:
   `supabase/seed.sql`

### Step 3.2: Verify Storage Bucket
1. Go to **Storage** > **Buckets** in your Supabase dashboard.
2. Confirm the `product-images` bucket exists with **Public** bucket access enabled (for read access).
3. Confirm RLS policy:
   - `SELECT`: Public access (`true`)
   - `INSERT / UPDATE / DELETE`: Authenticated admin access only (`auth.role() = 'authenticated'`).

### Step 3.3: Provision the Initial Store Administrator
1. Go to **Authentication** > **Users** in Supabase and click **Add User**.
2. Enter the store owner's admin email and strong password.
3. In the **SQL Editor**, register the user in `admin_users`:
   ```sql
   INSERT INTO public.admin_users (id, role, notes)
   VALUES ('<USER_UUID_FROM_AUTH_TABLE>', 'super_admin', 'Initial store owner');
   ```

---

## 4. Vercel Deployment

1. Connect your Git repository to **Vercel**.
2. Set Framework Preset: **Next.js**.
3. Set Root Directory: `gulnaar-by-mk`.
4. Add the environment variables specified in Section 2.
5. Deploy:
   - Build Command: `next build`
   - Output Directory: `.next`
   - Install Command: `npm install`

---

## 5. Security & Protection Summary

- **Row Level Security (RLS):** All database tables have RLS enabled. Customers can only read active products, categories, and images. Order creation is handled via `SECURITY DEFINER` RPC `create_guest_order` with row-level locks on stock.
- **Order Tracking Privacy:** Order status lookups require both the non-sequential Order Number (`GN-XXXXXX`) and the customer's phone number. Phone numbers are masked (`0321•••543`) in the tracking view.
- **HTTP Security Headers:** Implemented in `next.config.ts`:
  - `Strict-Transport-Security` (HSTS)
  - `X-Frame-Options: SAMEORIGIN` (Anti-clickjacking)
  - `X-Content-Type-Options: nosniff` (Anti-MIME sniffing)
  - `Referrer-Policy: origin-when-cross-origin`
  - `Permissions-Policy`
- **Search Engine Isolation:** `robots.ts` explicitly disallows public search engine crawlers from indexing `/admin/*`, `/checkout/*`, and `/order-success/*`.

---

## 6. Cash on Delivery (COD) Operational Protocol

1. **New Order Dispatch:** Orders arrive with `fulfillment_status = 'pending'` and `payment_status = 'pending'`.
2. **Order Confirmation:** Store team calls/WhatsApp the customer to confirm delivery address, then updates status to `'confirmed'`.
3. **Dispatch & Tracking:** Package is dispatched via courier (e.g. TCS, Call Courier, Trax) with COD amount set to `total_cents / 100` PKR. Status is updated to `'shipped'`.
4. **Reconciliation:** Once the courier confirms cash collection and remits funds:
   - Status updated to `'delivered'`.
   - In `/admin/orders/[id]`, admin clicks **Mark as Paid (Cash Collected)**.
   - Revenue metric in `/admin` immediately reflects the verified income.
5. **Cancellations:** If an order is cancelled, selecting `'cancelled'` in the dashboard automatically restores variant stock levels and logs an audit record in `inventory_movements`.

