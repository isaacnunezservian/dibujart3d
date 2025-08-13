"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
// import { uploadSingle } from '../middlewares/uploadMiddleware';
const router = (0, express_1.Router)();
// GET /products - Get all products
router.get('/', productController_1.getAllProducts);
// GET /products/:id - Get product by ID
router.get('/:id', productController_1.getProductById);
// GET /products/category/:categoryId - Get products by category
router.get('/category/:categoryId', productController_1.getProductsByCategory); // <-- NUEVO
// POST /products - Create new product (with categoryId)
router.post('/', productController_1.createProduct);
// PUT /products/:id - Update product (with categoryId)
router.put('/:id', productController_1.updateProduct);
// DELETE /products/:id - Delete product
router.delete('/:id', productController_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=products.js.map