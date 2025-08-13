"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsByCategory = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const productService_1 = require("../services/productService");
const validation_1 = require("../utils/validation");
const errorMiddleware_1 = require("../middlewares/errorMiddleware");
const logger_1 = require("../utils/logger");
exports.getAllProducts = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const products = await productService_1.productService.getAllProducts();
    res.json({
        success: true,
        data: products,
        count: products.length
    });
});
exports.getProductById = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { id } = validation_1.productParamsSchema.parse(req.params);
    const product = await productService_1.productService.getProductById(id);
    if (!product) {
        throw (0, errorMiddleware_1.createError)('Product not found', 404);
    }
    res.json({
        success: true,
        data: product
    });
});
exports.createProduct = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    // Parse colors from string if needed
    let parsedBody = { ...req.body };
    if (typeof req.body.colors === 'string') {
        try {
            parsedBody.colors = JSON.parse(req.body.colors);
        }
        catch (error) {
            // If JSON parsing fails, treat as comma-separated string
            parsedBody.colors = req.body.colors.split(',').map((color) => color.trim());
        }
    }
    const validatedData = validation_1.createProductSchema.parse(parsedBody);
    const product = await productService_1.productService.createProduct(validatedData);
    logger_1.logger.info(`Product created: ${product.name}`);
    res.status(201).json({
        success: true,
        data: product,
        message: 'Product created successfully'
    });
});
exports.updateProduct = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { id } = validation_1.productParamsSchema.parse(req.params);
    // Parse colors from string if needed
    let parsedBody = { ...req.body };
    if (typeof req.body.colors === 'string') {
        try {
            parsedBody.colors = JSON.parse(req.body.colors);
        }
        catch (error) {
            // If JSON parsing fails, treat as comma-separated string
            parsedBody.colors = req.body.colors.split(',').map((color) => color.trim());
        }
    }
    const validatedData = validation_1.updateProductSchema.parse(parsedBody);
    const product = await productService_1.productService.updateProduct(id, validatedData);
    logger_1.logger.info(`Product updated: ${product.name}`);
    res.json({
        success: true,
        data: product,
        message: 'Product updated successfully'
    });
});
exports.deleteProduct = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { id } = validation_1.productParamsSchema.parse(req.params);
    const result = await productService_1.productService.deleteProduct(id);
    logger_1.logger.info(`Product deleted with ID: ${id}`);
    res.json({
        success: true,
        message: result.message
    });
});
exports.getProductsByCategory = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const categoryId = Number(req.params.categoryId);
    if (isNaN(categoryId)) {
        throw (0, errorMiddleware_1.createError)('Invalid categoryId', 400);
    }
    const products = await productService_1.productService.getProductsByCategory(categoryId);
    res.json({
        success: true,
        data: products,
        count: products.length
    });
});
//# sourceMappingURL=productController.js.map