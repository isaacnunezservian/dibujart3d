import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory // <-- NUEVO
} from '../controllers/productController';
import { uploadSingle } from '../middlewares/uploadMiddleware';

const router = Router();

// GET /products - Get all products
router.get('/', getAllProducts);

// GET /products/:id - Get product by ID
router.get('/:id', getProductById);

// GET /products/category/:categoryId - Get products by category
router.get('/category/:categoryId', getProductsByCategory); // <-- NUEVO

// POST /products - Create new product (with categoryId and multer for form-data)
router.post('/', uploadSingle, createProduct);

// PUT /products/:id - Update product (with categoryId and multer for form-data)
router.put('/:id', uploadSingle, updateProduct);

// PATCH /products/:id - Update product basic info (JSON only, no file upload)
router.patch('/:id', updateProduct);

// DELETE /products/:id - Delete product
router.delete('/:id', deleteProduct);

export default router;

