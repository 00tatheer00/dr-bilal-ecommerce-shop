'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, Product, ProductVariant } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  subtotalCents: number;
  deliveryFeeCents: number;
  freeDeliveryThresholdCents: number;
  totalCents: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_DELIVERY_THRESHOLD = 500000; // PKR 5,000 in cents
const STANDARD_DELIVERY_FEE = 25000;   // PKR 250 in cents
const LOCAL_STORAGE_KEY = 'gulnaar_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from local storage on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          setItems(JSON.parse(stored));
        }
      } catch {
        // Ignore local storage parse errors
      } finally {
        setIsLoaded(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Save cart to local storage whenever items change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
      } catch {
        // Ignore storage write errors
      }
    }
  }, [items, isLoaded]);

  const addItem = (product: Product, variant: ProductVariant, quantity = 1) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.variant_id === variant.id
      );

      const primaryImg = product.images?.find((img) => img.is_primary) || product.images?.[0];

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(newQty, variant.stock_quantity || 99),
        };
        return updated;
      } else {
        const newItem: CartItem = {
          variant_id: variant.id,
          product_id: product.id,
          product_name: product.name,
          product_slug: product.slug,
          variant_sku: variant.sku,
          variant_size: variant.size,
          variant_color: variant.color,
          variant_color_hex: variant.color_hex,
          price_cents: variant.price_cents,
          quantity: Math.min(quantity, variant.stock_quantity || 99),
          image_url: primaryImg?.url || null,
        };
        return [...prevItems, newItem];
      }
    });

    setIsOpen(true);
  };

  const removeItem = (variantId: string) => {
    setItems((prev) => prev.filter((item) => item.variant_id !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.variant_id === variantId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalCents = items.reduce(
    (acc, item) => acc + item.price_cents * item.quantity,
    0
  );

  const deliveryFeeCents =
    subtotalCents >= FREE_DELIVERY_THRESHOLD || subtotalCents === 0
      ? 0
      : STANDARD_DELIVERY_FEE;

  const totalCents = subtotalCents + deliveryFeeCents;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        setIsOpen,
        openCart,
        closeCart,
        totalItems,
        subtotalCents,
        deliveryFeeCents,
        freeDeliveryThresholdCents: FREE_DELIVERY_THRESHOLD,
        totalCents,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

