import { Request, Response } from 'express';
import { productService } from '../services/productService';
import { 
  createProductSchema, 
  updateProductSchema, 
  productParamsSchema 
} from '../utils/validation';
import { asyncHandler, createError } from '../middlewares/errorMiddleware';
import { logger } from '../utils/logger';

export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await productService.getAllProducts();
  
  res.json({
    success: true,
    data: products,
    count: products.length
  });
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = productParamsSchema.parse(req.params);
  
  const product = await productService.getProductById(id);
  
  if (!product) {
    throw createError('Product not found', 404);
  }
  
  res.json({
    success: true,
    data: product
  });
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  // Parse colors from string if needed
  let parsedBody = { ...req.body };
  if (typeof req.body.colors === 'string') {
    try {
      parsedBody.colors = JSON.parse(req.body.colors);
    } catch (error) {
      // If JSON parsing fails, treat as comma-separated string
      parsedBody.colors = req.body.colors.split(',').map((color: string) => color.trim());
    }
  }
  
  const validatedData = createProductSchema.parse(parsedBody);
  
  const product = await productService.createProduct(
    validatedData
  );
  
  logger.info(`Product created: ${product.name}`);
  
  res.status(201).json({
    success: true,
    data: product,
    message: 'Product created successfully'
  });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = productParamsSchema.parse(req.params);
  
  // Parse colors from string if needed
  let parsedBody = { ...req.body };
  if (typeof req.body.colors === 'string') {
    try {
      parsedBody.colors = JSON.parse(req.body.colors);
    } catch (error) {
      // If JSON parsing fails, treat as comma-separated string
      parsedBody.colors = req.body.colors.split(',').map((color: string) => color.trim());
    }
  }
  
  const validatedData = updateProductSchema.parse(parsedBody);
  
  const product = await productService.updateProduct(
    id,
    validatedData
  );
  
  logger.info(`Product updated: ${product.name}`);
  
  res.json({
    success: true,
    data: product,
    message: 'Product updated successfully'
  });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = productParamsSchema.parse(req.params);
  
  const result = await productService.deleteProduct(id);
  
  logger.info(`Product deleted with ID: ${id}`);
  
  res.json({
    success: true,
    message: result.message
  });
});

export const getProductsByCategory = asyncHandler(async (req: Request, res: Response) => {
  const categoryId = Number(req.params.categoryId);
  if (isNaN(categoryId)) {
    throw createError('Invalid categoryId', 400);
  }

  const products = await productService.getProductsByCategory(categoryId);

  res.json({
    success: true,
    data: products,
    count: products.length
  });
});
