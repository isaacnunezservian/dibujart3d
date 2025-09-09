import { z } from 'zod';

// Category validation schemas
export const createCategorySchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  header: z.string().optional() // Campo opcional para imagen
});

export const updateCategorySchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long').optional(),
  header: z.string().optional() // Campo opcional para imagen
});

export const categoryIdParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Invalid category ID').transform(Number),
});

// Product validation schemas
export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  colors: z.array(z.string()).min(1, 'At least one color is required'),
  categoryId: z.number().int().positive('Category ID must be a positive integer').optional(), // Ahora opcional
  imagePath: z.string().url().nullable().optional() // ✅ Permitir URLs de imagen o null
});

export const updateProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long').optional(),
  colors: z.array(z.string()).min(1, 'At least one color is required').optional(),
  categoryId: z.number().int().positive('Category ID must be a positive integer').optional(),
  imagePath: z.string().url().nullable().optional() // ✅ Opcional para updates
});

export const productParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Invalid product ID').transform(Number),
});

// Para el endpoint getProductsByCategory
export const categoryParamsSchema = z.object({
  categoryId: z.string().regex(/^\d+$/, 'Invalid category ID').transform(Number),
});

// Type exports for categories
export type CreateCategoryData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryData = z.infer<typeof updateCategorySchema>;
export type CategoryIdParams = z.infer<typeof categoryIdParamsSchema>;

// Type exports for products
export type CreateProductData = z.infer<typeof createProductSchema>;
export type UpdateProductData = z.infer<typeof updateProductSchema>;
export type ProductParams = z.infer<typeof productParamsSchema>;
export type CategoryParams = z.infer<typeof categoryParamsSchema>;
