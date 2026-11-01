import { z } from 'zod';

// Pakistani phone regex: matches 03001234567, 0300-1234567, +923001234567, 923001234567
const pakistaniPhoneRegex = /^((\+92)|(92)|(0))?3[0-9]{2}[-]?[0-9]{7}$/;

export const orderItemSchema = z.object({
  variantId: z.string().min(1, 'Product variant identifier is required'),
  quantity: z
    .number()
    .int('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1')
    .max(50, 'Maximum 50 sets per variant allowed in single order'),
});

export const checkoutFormSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be under 100 characters'),
  customerPhone: z
    .string()
    .trim()
    .refine((val) => pakistaniPhoneRegex.test(val.replace(/[\s-]/g, '')), {
      message: 'Please provide a valid Pakistani mobile number (e.g., 0300-1234567)',
    }),
  customerEmail: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  addressLine1: z
    .string()
    .trim()
    .min(5, 'Delivery address is too short')
    .max(250, 'Address must be under 250 characters'),
  addressLine2: z
    .string()
    .trim()
    .max(150, 'Address line 2 must be under 150 characters')
    .optional()
    .or(z.literal('')),
  city: z
    .string()
    .trim()
    .min(2, 'Please select or enter your city')
    .max(80, 'City name is too long'),
  province: z
    .string()
    .trim()
    .max(80)
    .optional()
    .or(z.literal('')),
  specialInstructions: z
    .string()
    .trim()
    .max(500, 'Special instructions cannot exceed 500 characters')
    .optional()
    .or(z.literal('')),
  items: z
    .array(orderItemSchema)
    .min(1, 'At least one item must be present in the bag to checkout'),
  idempotencyKey: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutFormSchema>;

export const orderLookupSchema = z.object({
  orderNumber: z
    .string()
    .trim()
    .min(6, 'Order number must be at least 6 characters')
    .max(20, 'Invalid order number format'),
  phone: z
    .string()
    .trim()
    .min(10, 'Valid phone number required for lookup'),
});

export type OrderLookupInput = z.infer<typeof orderLookupSchema>;

