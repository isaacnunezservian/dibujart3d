import { Request, Response } from 'express';
import { categoryService } from '../services/categoryService';
import { asyncHandler } from '../middlewares/asyncHandler'; // ✅ Ahora existe
import { logger } from '../utils/logger';

export const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();
  
  res.json({
    success: true,
    data: categories,
    count: categories.length
  });
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const category = await categoryService.getCategoryById(id);
  
  res.json({
    success: true,
    data: category
  });
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { title, header } = req.body;
  
  const category = await categoryService.createCategory({ title, header });
  
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