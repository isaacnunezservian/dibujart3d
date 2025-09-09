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
  // ✅ DEBUGGING MEJORADO CON MULTER
  console.log('=== MULTER DEBUG INFO ===');
  console.log('Headers:', req.headers);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Raw request body:', req.body);
  console.log('Files:', req.file);
  console.log('Body keys:', Object.keys(req.body));
  console.log('Body values:', Object.values(req.body));
  console.log('========================');
  
  // Parse data from FormData strings
  let parsedBody = { ...req.body };
  
  // Parse colors from JSON string if needed
  if (typeof req.body.colors === 'string') {
    try {
      parsedBody.colors = JSON.parse(req.body.colors);
    } catch (error) {
      // Fallback to comma-separated string
      parsedBody.colors = req.body.colors.split(',').map((color: string) => color.trim());
    }
  }
  
  // ✅ NUEVO: Convert categoryId from string to number
  if (typeof req.body.categoryId === 'string') {
    parsedBody.categoryId = parseInt(req.body.categoryId, 10);
  }
  
  console.log('Parsed body before validation:', parsedBody);
  
  try {
    const validatedData = createProductSchema.parse(parsedBody);
    console.log('✅ Validation successful:', validatedData);
    
    const product = await productService.createProduct(validatedData);
    
    logger.info(`Product created: ${product.name}`);
    
    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (validationError) {
    console.error('❌ Validation error:', validationError);
    throw validationError;
  }
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = productParamsSchema.parse(req.params);
  
  console.log('=== UPDATE PRODUCT DEBUG ===');
  console.log('Raw request body:', req.body);
  console.log('Files:', req.file);
  console.log('============================');
  
  // Parse data from FormData strings
  let parsedBody = { ...req.body };
  
  // Parse colors from JSON string if needed
  if (typeof req.body.colors === 'string') {
    try {
      parsedBody.colors = JSON.parse(req.body.colors);
    } catch (error) {
      // Fallback to comma-separated string
      parsedBody.colors = req.body.colors.split(',').map((color: string) => color.trim());
    }
  }
  
  // ✅ NUEVO: Convert categoryId from string to number
  if (typeof req.body.categoryId === 'string') {
    parsedBody.categoryId = parseInt(req.body.categoryId, 10);
  }
  
  console.log('Parsed body before validation:', parsedBody);
  
  try {
    const validatedData = updateProductSchema.parse(parsedBody);
    console.log('✅ Update validation successful:', validatedData);
    
    const product = await productService.updateProduct(id, validatedData);
    
    logger.info(`Product updated: ${product.name}`);
    
    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (validationError) {
    console.error('❌ Update validation error:', validationError);
    throw validationError;
  }
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
