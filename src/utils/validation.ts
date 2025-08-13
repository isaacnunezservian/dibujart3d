import { z } from 'zod';

// Product validation schemas
export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  colors: z.array(z.string()).min(1, 'At least one color is required'),
  categoryId: z.number().int().positive('Category ID must be a positive integer')
});

export const updateProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long').optional(),
  colors: z.array(z.string()).min(1, 'At least one color is required').optional(),
  categoryId: z.number().int().positive('Category ID must be a positive integer').optional()
});

export const productParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Invalid product ID').transform(Number),
});

// Para el endpoint getProductsByCategory
export const categoryParamsSchema = z.object({
  categoryId: z.string().regex(/^\d+$/, 'Invalid category ID').transform(Number),
});

// Type exports
export type CreateProductData = z.infer<typeof createProductSchema>;
export type UpdateProductData = z.infer<typeof updateProductSchema>;
export type ProductParams = z.infer<typeof productParamsSchema>;
export type CategoryParams = z.infer<typeof categoryParamsSchema>;
