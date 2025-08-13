"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = require("../controllers/categoryController");
const router = (0, express_1.Router)();
// GET /categories - Get all categories
router.get('/', categoryController_1.getAllCategories);
// GET /categories/:id - Get category by ID
router.get('/:id', categoryController_1.getCategoryById);
// POST /categories - Create new category
router.post('/', categoryController_1.createCategory);
// PUT /categories/:id - Update category
router.put('/:id', categoryController_1.updateCategory);
// DELETE /categories/:id - Delete category
router.delete('/:id', categoryController_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=categories.js.map