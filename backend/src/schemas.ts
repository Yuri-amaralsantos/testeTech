import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive().max(100).default(1),
});

export const updateCartSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(0).max(100),
});

export const checkoutSchema = z.object({
  email: z.string().email(),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartInput = z.infer<typeof updateCartSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
