import { Request, Response } from 'express';
import { productService } from '../services/productService';
import { 
  createProductSchema, 
  updateProductSchema, 
  productParamsSchema 
} from '../utils/validation';
import { asyncHandler, createError } from '../middlewares/errorMiddleware';
import { logger } from '../utils/logger';
import { uploadImageToSupabase } from '../middlewares/uploadMiddleware';

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
      parsedBody.colors = req.body.colors.split(',').map((color: string) => color.trim()).filter((color: string) => color.length > 0);
    }
  } else if (!req.body.colors || req.body.colors.length === 0) {
    // Si no hay colores, usar array vacío (para opción 1: nueva categoría)
    parsedBody.colors = [];
  }
  
  // ✅ NUEVO: Convert categoryId from string to number if provided
  if (typeof req.body.categoryId === 'string' && req.body.categoryId.trim() !== '') {
    parsedBody.categoryId = parseInt(req.body.categoryId, 10);
  } else {
    // Eliminar categoryId si está vacío para que se cree una categoría automáticamente
    delete parsedBody.categoryId;
  }
  
  // ✅ PROCESAR IMAGEN SI EXISTE
  let imagePath: string | null = null;
  
  if (req.file) {
    try {
      console.log('📸 Processing image upload...');
      imagePath = await uploadImageToSupabase(req.file, 'productos');
      console.log('✅ Image uploaded successfully:', imagePath);
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      // No interrumpir la creación del producto, solo continuar sin imagen
      console.log('⚠️ Continuing without image due to upload error');
      imagePath = null;
    }
  } else {
    console.log('ℹ️ No image file provided');
  }
  
  // ✅ AGREGAR IMAGEPATH AL CUERPO PARSEADO
  parsedBody.imagePath = imagePath;
  
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
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Raw request body:', req.body);
  console.log('Files:', req.file);
  console.log('============================');
  
  let parsedBody = { ...req.body };
  
  // Determinar si es FormData o JSON
  const isFormData = req.headers['content-type']?.includes('multipart/form-data');
  const isJSON = req.headers['content-type']?.includes('application/json');
  
  if (isJSON) {
    // ✅ MODO JSON (edición básica desde frontend)
    console.log('📝 Processing JSON update (basic edit)');
    
    // Para JSON, colors viene como string que necesita ser parseado
    if (typeof req.body.colors === 'string') {
      try {
        parsedBody.colors = JSON.parse(req.body.colors);
      } catch (error) {
        console.error('Error parsing colors JSON:', error);
        parsedBody.colors = [];
      }
    }
    
    // Solo permitir name y colors en modo JSON
    const updateData: any = {};
    if (parsedBody.name) updateData.name = parsedBody.name;
    if (parsedBody.colors) updateData.colors = parsedBody.colors;
    
    const validatedData = updateProductSchema.parse(updateData);
    const product = await productService.updateProduct(id, validatedData);
    
    logger.info(`Product updated (JSON mode): ${product.name}`);
    
    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
    
  } else {
    // ✅ MODO FORMDATA (actualización completa)
    console.log('📄 Processing FormData update (full edit)');
    
    // Parse colors from JSON string if needed
    if (typeof req.body.colors === 'string') {
      try {
        parsedBody.colors = JSON.parse(req.body.colors);
      } catch (error) {
        parsedBody.colors = req.body.colors.split(',').map((color: string) => color.trim());
      }
    }
    
    // Convert categoryId from string to number
    if (typeof req.body.categoryId === 'string') {
      parsedBody.categoryId = parseInt(req.body.categoryId, 10);
    }
    
    // Process image if there's a new one
    if (req.file) {
      try {
        console.log('📸 Processing image update...');
        parsedBody.imagePath = await uploadImageToSupabase(req.file, 'productos');
        console.log('✅ Image uploaded successfully:', parsedBody.imagePath);
      } catch (error) {
        console.error('❌ Error uploading image:', error);
      }
    }
    
    const validatedData = updateProductSchema.parse(parsedBody);
    const product = await productService.updateProduct(id, validatedData);
    
    logger.info(`Product updated (FormData mode): ${product.name}`);
    
    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
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
