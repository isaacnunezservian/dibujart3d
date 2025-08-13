import { Router } from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController';

const router = Router();

// GET /categories - Get all categories
router.get('/', getAllCategories);

// GET /categories/:id - Get category by ID
router.get('/:id', getCategoryById);

// POST /categories - Create new category
router.post('/', createCategory);

// PUT /categories/:id - Update category
router.put('/:id', updateCategory);

// DELETE /categories/:id - Delete category
router.delete('/:id', deleteCategory);

export default router;