# GULNAAR by MK — Supabase Setup & Security Guide
## Phase 3 Database & Backend Architecture

This guide provides instructions to connect, configure, and secure the Supabase PostgreSQL backend for **GULNAAR by MK**.

---

### 1. Supabase Project Creation

1. Go to [database.new](https://database.new) and sign in or create a Supabase account.
2. Create a new project:
   - **Name:** `gulnaar-by-mk`
   - **Database Password:** Generate and securely save a strong password.
   - **Region:** Choose a low-latency region (e.g., `ap-south-1` Mumbai or `me-central-1` Bahrain).
3. Once provisioned, navigate to **Project Settings -> API** to copy:
   - **Project URL**
   - **Project API Keys:** `anon public` and `service_role secret`.

---

### 2. Environment Variables Configuration

In `gulnaar-by-mk/`, copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Populate the values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> [!CAUTION]
> Never commit `SUPABASE_SERVICE_ROLE_KEY` to git or expose it to client-side browser bundles. The application enforces this by checking execution context in `src/lib/supabase/admin.ts`.

---

### 3. Running Migrations & Seeding Data

#### Option A: Via Supabase Web Dashboard (Recommended for quick setup)
1. Open your Supabase Dashboard and click **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Open [`supabase/migrations/20261101000001_initial_schema.sql`](file:///t:/Dr%20Bilal%20Ecommerce%20Store/gulnaar-by-mk/supabase/migrations/20261101000001_initial_schema.sql) in this repository, paste the entire content into the editor, and click **Run**.
4. Create a second new query, paste the content of [`supabase/seed.sql`](file:///t:/Dr%20Bilal%20Ecommerce%20Store/gulnaar-by-mk/supabase/seed.sql), and click **Run**.

#### Option B: Via Supabase CLI
```bash
supabase link --project-ref your-project-ref
supabase db push
supabase db reset # (or run seed directly)
```

---

### 4. Database Schema Overview

| Table | Purpose | Security & RLS Policy |
| :--- | :--- | :--- |
| `categories` | Bridal, Everyday, Statement, Kundan | Public read-only for active rows; admin full CRUD. |
| `products` | Product listings, slugs, descriptions | Public read-only where `status = 'active'`; admin full CRUD. |
| `product_images` | Image URLs, sort order, primary flags | Public read; admin full CRUD. |
| `product_variants` | Bangle sizes (2.4, 2.6, 2.8), colors, prices in minor units, stock | Public read for active variants; admin full CRUD. |
| `orders` | Guest & customer orders, addresses, totals, statuses | Public insert via `create_guest_order` RPC only; select restricted to tracking token or authenticated owner; admin full CRUD. |
| `order_items` | Historical product & price snapshots at checkout time | Read restricted to verified order accessor; admin full CRUD. |
| `inventory_movements` | Stock balance audit log per variant | Strictly restricted to administrators (`is_admin()`). |
| `admin_users` | Explicit admin authorization mapping | Strictly restricted to administrators. |

---

### 5. Transactional Guest Order Creation (`create_guest_order`)

Guest checkout does **not** rely on unsecured client-side calculations or separate queries:
- Client submits only `{ variantId, quantity }` alongside delivery details.
- The PostgreSQL function `create_guest_order` executes under a transactional row lock (`SELECT ... FOR UPDATE` on `product_variants`).
- Prices are authoritatively fetched from the database `price_minor`.
- Available stock is checked and subtracted atomically:
  ```sql
  UPDATE public.product_variants
  SET stock_quantity = stock_quantity - v_item.quantity, updated_at = now()
  WHERE id = v_item.variant_id;
  ```
- If stock is insufficient, an exception is raised and the transaction rolls back cleanly.
- An inventory movement audit row (`reason = 'order_placed'`) is logged.
- A high-entropy `tracking_token` is generated and returned for anonymous order tracking.

---

### 6. Storage Bucket Configuration

The migration automatically creates a public storage bucket `product-images`.

- **Bucket Name:** `product-images`
- **Public URL pattern:** `https://<ref>.supabase.co/storage/v1/object/public/product-images/<path>`
- **Upload Restrictions:** Only users verified by `public.is_admin()` can upload or delete objects.

---

### 7. Provisioning the First Administrator

To grant admin permissions to an account:

1. In Supabase Dashboard, go to **Authentication -> Users** and click **Add user** (or sign up via email/password).
2. Copy the generated User `UUID` (e.g. `d3b07384-d113-400a-b286-63d1222416b2`).
3. Run this query in the SQL Editor:
   ```sql
   INSERT INTO public.admin_users (id, email, role)
   VALUES ('d3b07384-d113-400a-b286-63d1222416b2', 'admin@gulnaarbymk.com', 'superadmin');
   ```
4. This user is now authorized for administrative RPC calls and storage uploads.

