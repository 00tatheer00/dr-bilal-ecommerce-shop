# GULNAAR by MK — Handcrafted Luxury Bangles

> **An opulent e-commerce storefront & administration platform for handcrafted South Asian luxury bangles, bridal kangan sets, and Meenakari craftsmanship.**

Built with Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict mode), Tailwind CSS v4, and Supabase (PostgreSQL, Auth, and Storage).

---

## ✨ Key Features

### 🛍️ Customer Storefront Journey
- **Editorial Brand Aesthetic:** Tailored visual identity featuring Warm Ivory (`#FAF7F2`), Deep Burgundy (`#7A2D3C`), Muted Gold (`#B8976A`), and Charcoal typography (`#2C2C2C`).
- **Dynamic Catalogue & Search:** Instant product filtering by collection, price range slider, sort parameters, and real-time keyword search with query highlighting.
- **Variant Selection Matrix:** Dynamic size selection (diameter sizes `2.4`, `2.6`, `2.8`, `2.10`), color/finish options, stock availability badges, and interactive accordion details.
- **Cart & Slide-out Drawer:** Persistent shopping bag across sessions (`localStorage`), quantity controls, free delivery progress bar (PKR 5,000 threshold), and subtotal calculation.
- **Guest Cash on Delivery (COD) Checkout:** Streamlined guest checkout requiring zero account creation; collects Pakistani delivery destination, phone number, and delivery instructions.
- **Authoritative Price & Stock Enforcement:** All line totals, delivery fees, and inventory balances are computed strictly on the server—client price tampering is impossible.
- **Dual-Factor Order Tracking:** Privacy-respecting order lookup requiring both the Order Reference (`GN-XXXXXX`) and the customer's phone number with phone masking (`0321•••543`).

### ⚙️ Store Management Console (`/admin`)
- **Protected Administrative Console:** Charcoal console navigation with session authorization guards and fallback developer credentials.
- **Dashboard Overview:** Real-time KPI metrics for Today's Orders, Pending Dispatch, Reconciled Cash Revenue (PKR), and Low Stock Alerts.
- **Product CRUD & Edit Mode:** Create and edit bangle designs with title, slug generation, category assignment, description, craftsmanship material notes, and multi-variant SKUs.
- **Supabase Storage Image Uploader:** Direct file upload to the `product-images` bucket with instant previews, primary image toggling, and removal.
- **Inventory Matrix & Audit Logging:** Variant-level stock management with an adjustment dialog requiring mandatory reason logging (`restock`, `damage`, `correction`, `return`) written to `inventory_movements`.
- **Order Processing & COD Reconciliation:** Itemized order inspection, fulfillment status lifecycle (`pending` → `confirmed` → `processing` → `shipped` → `delivered` / `cancelled`), automatic inventory restoration on cancellation, and Cash on Delivery payment reconciliation.
- **Customer Directory:** Aggregated patron list from guest checkout orders showing lifetime spend and order frequency.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16.4.2](https://nextjs.org/) (App Router, Turbopack, Cache Components) |
| **UI Library** | [React 19.3.0](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (Strict Mode) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) & CSS Custom Properties |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Database** | [Supabase](https://supabase.com/) PostgreSQL with Row Level Security (RLS) |
| **Validation** | [Zod 4](https://zod.dev/) |
| **Payment Model**| Cash on Delivery (COD) |

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/00tatheer00/dr-bilal-ecommerce-shop.git
cd dr-bilal-ecommerce-shop
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and add your Supabase credentials:
```bash
cp .env.example .env.local
```

```ini
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Application Base URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Run Database Migrations
Open your Supabase SQL Editor and execute:
1. `supabase/migrations/20261101000001_initial_schema.sql` (Creates core relational tables, RLS policies, and `create_guest_order` transactional function)
2. `supabase/migrations/20261101000002_guest_order_tracking.sql` (Creates secure guest tracking function `lookup_guest_order`)
3. `supabase/seed.sql` (Optional: Seeds initial catalogue categories, bangles, and variants)

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the storefront, or [http://localhost:3000/admin](http://localhost:3000/admin) to access the store administration console.

---

## 🔒 Security Architecture

- **Row Level Security (RLS):** Enabled on all tables. Anonymous public users can only read active products, categories, and images.
- **Service-Role Key Protection:** `SUPABASE_SERVICE_ROLE_KEY` is strictly confined to server actions and guarded against browser execution.
- **Atomic Concurrency Locks:** Orders invoke transactional stored procedures using `FOR UPDATE` row locks on `product_variants`, preventing overselling or race conditions.
- **Production HTTP Security Headers:** Configured in `next.config.ts` (HSTS, X-Frame-Options SAMEORIGIN, X-Content-Type-Options nosniff, Referrer-Policy).
- **Search Engine Isolation:** `robots.ts` disallows crawlers from indexing `/admin/*`, `/checkout/*`, and `/order-success/*`.

---

## 📜 Documentation

- [Phase 1 Specification](docs/PHASE_1_SPECIFICATION.md): Information architecture, ER diagrams, and design tokens.
- [Supabase Setup Guide](docs/SUPABASE_SETUP.md): Database configuration, tables, and Storage policies.
- [Production Deployment Guide](docs/PRODUCTION_DEPLOYMENT_GUIDE.md): Vercel and production launch checklist.

---

## 📄 License
Private and confidential. Developed exclusively for **GULNAAR by MK**.
