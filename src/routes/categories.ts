import { Router } from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  createCategoryQuick
} from '../controllers/categoryController';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();

// GET /categories - Get all categories
router.get('/', getAllCategories);

// GET /categories/:id - Get category by ID
router.get('/:id', getCategoryById);

// POST /categories - Create new category
router.post('/', createCategory);

// POST /categories/quick - Crear categoría rápidamente desde el formulario de producto
router.post('/quick', upload.single('image'), createCategoryQuick);

// PUT /categories/:id - Update category
router.put('/:id', updateCategory);

// DELETE /categories/:id - Delete category
router.delete('/:id', deleteCategory);

export default router;