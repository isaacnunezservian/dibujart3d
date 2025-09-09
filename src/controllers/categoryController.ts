import { Request, Response } from 'express';
import { categoryService } from '../services/categoryService';
import { asyncHandler } from '../middlewares/asyncHandler';
import { logger } from '../utils/logger';
import { 
  createCategorySchema, 
  updateCategorySchema, 
  categoryIdParamsSchema 
} from '../utils/validation';

export const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();
  
  res.json({
    success: true,
    data: categories,
    count: categories.length
  });
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = categoryIdParamsSchema.parse(req.params);
  const category = await categoryService.getCategoryById(id);
  
  res.json({
    success: true,
    data: category
  });
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = createCategorySchema.parse(req.body);
  
  const category = await categoryService.createCategory(validatedData);
  
  logger.info(`Category created: ${category.title}`);
  
  res.status(201).json({
    success: true,
    data: category,
    message: 'Category created successfully'
  });
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { title, header } = req.body;
  
  const category = await categoryService.updateCategory(id, { title, header });
  
  logger.info(`Category updated: ${category.title}`);
  
  res.json({
    success: true,
    data: category,
    message: 'Category updated successfully'
  });
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  await categoryService.deleteCategory(id);
  
  logger.info(`Category deleted with ID: ${id}`);
  
  res.json({
    success: true,
    message: 'Category deleted successfully'
  });
});

// Crear categoría rápida desde el formulario de producto
export const createCategoryQuick = asyncHandler(async (req: Request, res: Response) => {
  // Validación básica
  if (!req.body.title) {
    return res.status(400).json({
      success: false,
      error: 'El título de la categoría es requerido'
    });
  }
  
  // Manejar archivo de imagen si existe
  let header: string | null = null;
  
  if (req.file) {
    try {
      const { uploadImageToSupabase } = require('../middlewares/uploadMiddleware');
      header = await uploadImageToSupabase(req.file, 'categories');
      logger.info(`Category image uploaded: ${header}`);
    } catch (error) {
      logger.error('Error uploading category image:', error as Error);
      // Continuar sin imagen
    }
  }
  
  const validatedData = createCategorySchema.parse({
    title: req.body.title,
    header
  });
  
  try {
    const category = await categoryService.createCategory(validatedData);
    
    logger.info(`Category created quickly: ${category.title}`);
    
    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully'
    });
  } catch (error: any) {
    // Manejar error de título duplicado
    if (error.code === 'P2002' && error.meta?.target?.includes('title')) {
      return res.status(409).json({
        success: false,
        error: 'Ya existe una categoría con ese título'
      });
    }
    throw error;
  }
});