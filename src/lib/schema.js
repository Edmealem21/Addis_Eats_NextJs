// src/lib/schema.js
import { z } from "zod";

export const orderSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Phone must be at least 7 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  notes: z.string().max(500, "Notes must be 500 characters or fewer").optional(),
  items: z
    .array(
      z.object({
        id: z.string().min(1, "Item id required"),
        quantity: z.number().int().positive("Quantity must be positive"),
      })
    )
    .min(1, "Cart must contain at least one item"),
});