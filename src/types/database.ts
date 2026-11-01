export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_path: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_path?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_path?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          category_id: string | null
          name: string
          slug: string
          short_description: string | null
          description: string | null
          material: string | null
          status: 'draft' | 'active' | 'archived'
          is_featured: boolean
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          slug: string
          short_description?: string | null
          description?: string | null
          material?: string | null
          status?: 'draft' | 'active' | 'archived'
          is_featured?: boolean
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          name?: string
          slug?: string
          short_description?: string | null
          description?: string | null
          material?: string | null
          status?: 'draft' | 'active' | 'archived'
          is_featured?: boolean
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          storage_path: string
          alt_text: string | null
          sort_order: number
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          storage_path: string
          alt_text?: string | null
          sort_order?: number
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          storage_path?: string
          alt_text?: string | null
          sort_order?: number
          is_primary?: boolean
          created_at?: string
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          sku: string
          size: string | null
          color: string | null
          color_hex: string | null
          set_quantity: number
          price_minor: number
          compare_at_price_minor: number | null
          stock_quantity: number
          low_stock_threshold: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          sku: string
          size?: string | null
          color?: string | null
          color_hex?: string | null
          set_quantity?: number
          price_minor: number
          compare_at_price_minor?: number | null
          stock_quantity?: number
          low_stock_threshold?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          sku?: string
          size?: string | null
          color?: string | null
          color_hex?: string | null
          set_quantity?: number
          price_minor?: number
          compare_at_price_minor?: number | null
          stock_quantity?: number
          low_stock_threshold?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          tracking_token: string
          user_id: string | null
          customer_name: string
          customer_phone: string
          customer_email: string | null
          address_line1: string
          address_line2: string | null
          city: string
          province: string | null
          special_instructions: string | null
          subtotal_minor: number
          delivery_charge_minor: number
          total_minor: number
          payment_method: 'cod'
          payment_status: 'pending' | 'paid' | 'refunded' | 'failed'
          fulfillment_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          idempotency_key: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          tracking_token: string
          user_id?: string | null
          customer_name: string
          customer_phone: string
          customer_email?: string | null
          address_line1: string
          address_line2?: string | null
          city: string
          province?: string | null
          special_instructions?: string | null
          subtotal_minor: number
          delivery_charge_minor?: number
          total_minor: number
          payment_method?: 'cod'
          payment_status?: 'pending' | 'paid' | 'refunded' | 'failed'
          fulfillment_status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          idempotency_key?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          tracking_token?: string
          user_id?: string | null
          customer_name?: string
          customer_phone?: string
          customer_email?: string | null
          address_line1?: string
          address_line2?: string | null
          city?: string
          province?: string | null
          special_instructions?: string | null
          subtotal_minor?: number
          delivery_charge_minor?: number
          total_minor?: number
          payment_method?: 'cod'
          payment_status?: 'pending' | 'paid' | 'refunded' | 'failed'
          fulfillment_status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          idempotency_key?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          variant_id: string | null
          product_name: string
          variant_sku: string
          variant_size: string | null
          variant_color: string | null
          unit_price_minor: number
          quantity: number
          line_total_minor: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          variant_id?: string | null
          product_name: string
          variant_sku: string
          variant_size?: string | null
          variant_color?: string | null
          unit_price_minor: number
          quantity: number
          line_total_minor: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          variant_id?: string | null
          product_name?: string
          variant_sku?: string
          variant_size?: string | null
          variant_color?: string | null
          unit_price_minor?: number
          quantity?: number
          line_total_minor?: number
          created_at?: string
        }
      }
      inventory_movements: {
        Row: {
          id: string
          variant_id: string
          quantity_delta: number
          balance_after: number
          reason: 'order_placed' | 'order_cancelled' | 'manual_adjustment' | 'restock' | 'audit'
          related_order_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          variant_id: string
          quantity_delta: number
          balance_after: number
          reason: 'order_placed' | 'order_cancelled' | 'manual_adjustment' | 'restock' | 'audit'
          related_order_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          variant_id?: string
          quantity_delta?: number
          balance_after?: number
          reason?: 'order_placed' | 'order_cancelled' | 'manual_adjustment' | 'restock' | 'audit'
          related_order_id?: string | null
          created_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          role: 'admin' | 'superadmin'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          role?: 'admin' | 'superadmin'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'admin' | 'superadmin'
          created_at?: string
        }
      }
    }
    Functions: {
      create_guest_order: {
        Args: {
          p_customer_name: string
          p_customer_phone: string
          p_customer_email: string | null
          p_address_line1: string
          p_address_line2: string | null
          p_city: string
          p_province: string | null
          p_special_instructions: string | null
          p_items: Json
          p_idempotency_key?: string | null
        }
        Returns: Json
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
  }
}

