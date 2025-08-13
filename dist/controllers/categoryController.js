"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getAllCategories = void 0;
const categoryService_1 = require("../services/categoryService");
const asyncHandler_1 = require("../middlewares/asyncHandler"); // ✅ Ahora existe
const logger_1 = require("../utils/logger");
exports.getAllCategories = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const categories = await categoryService_1.categoryService.getAllCategories();
    res.json({
        success: true,
        data: categories,
        count: categories.length
    });
});
exports.getCategoryById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = parseInt(req.params.id);
    const category = await categoryService_1.categoryService.getCategoryById(id);
    res.json({
        success: true,
        data: category
    });
});
exports.createCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { title, header } = req.body;
    const category = await categoryService_1.categoryService.createCategory({ title, header });
    logger_1.logger.info(`Category created: ${category.title}`);
    res.status(201).json({
        success: true,
        data: category,
        message: 'Category created successfully'
    });
});
exports.updateCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = parseInt(req.params.id);
    const { title, header } = req.body;
    const category = await categoryService_1.categoryService.updateCategory(id, { title, header });
    logger_1.logger.info(`Category updated: ${category.title}`);
    res.json({
        success: true,
        data: category,
        message: 'Category updated successfully'
    });
});
exports.deleteCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = parseInt(req.params.id);
    await categoryService_1.categoryService.deleteCategory(id);
    logger_1.logger.info(`Category deleted with ID: ${id}`);
    res.json({
        success: true,
        message: 'Category deleted successfully'
    });
});
//# sourceMappingURL=categoryController.js.map