// ============================================
// GULNAAR by MK — Type Definitions
// ============================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  material?: string | null;
  category_id: string | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  // Joined relations
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  size: string | null;
  color: string | null;
  color_hex: string | null;
  price_cents: number;
  compare_at_price_cents: number | null;
  stock_quantity: number;
  low_stock_threshold: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  variant_id: string;
  product_id: string;
  product_name: string;
  product_slug: string;
  variant_sku: string;
  variant_size: string | null;
  variant_color: string | null;
  variant_color_hex: string | null;
  price_cents: number;
  quantity: number;
  image_url: string | null;
}

export interface Order {
  id: string;
  order_number: string;
  status: OrderStatus;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  province: string | null;
  special_instructions: string | null;
  subtotal_cents: number;
  delivery_fee_cents: number;
  total_cents: number;
  payment_method: string;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  status_history?: OrderStatusHistory[];
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'collected'
  | 'refunded'
  | 'failed'
  | 'completed'
  | 'unpaid';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  variant_id?: string;
  product_name: string;
  variant_sku: string;
  variant_size: string | null;
  variant_color: string | null;
  quantity: number;
  unit_price_cents?: number;
  total_price_cents?: number;
  price_cents?: number;
  total_cents?: number;
  product_image_url?: string | null;
  created_at: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  notes: string | null;
  changed_by: string;
  created_at: string;
}

export interface DeliveryZone {
  id: string;
  city: string;
  province: string;
  delivery_fee_cents: number;
  estimated_days_min: number;
  estimated_days_max: number;
  is_active: boolean;
}

export interface StoreSetting {
  key: string;
  value: string;
  updated_at: string;
}

// UI-specific types
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'brand';
