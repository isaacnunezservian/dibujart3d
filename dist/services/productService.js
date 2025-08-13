"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = exports.ProductService = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const prisma = new client_1.PrismaClient();
class ProductService {
    async getAllProducts() {
        try {
            const products = await prisma.product.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });
            logger_1.logger.info(`Retrieved ${products.length} products`);
            return products;
        }
        catch (error) {
            logger_1.logger.error('Error fetching products', error);
            throw error;
        }
    }
    async getProductById(id) {
        try {
            const product = await prisma.product.findUnique({
                where: { id }
            });
            if (!product) {
                throw new Error('Product not found');
            }
            logger_1.logger.info(`Retrieved product with ID: ${id}`);
            return product;
        }
        catch (error) {
            logger_1.logger.error(`Error fetching product with ID ${id}`, error);
            throw error;
        }
    }
    // ✅ SIMPLIFICADO: Solo datos, sin imágenes
    async createProduct(data) {
        try {
            const product = await prisma.product.create({
                data: {
                    name: data.name,
                    colors: data.colors,
                    imagePath: null,
                    categoryId: data.categoryId // <-- NUEVO
                }
            });
            logger_1.logger.info(`Created product with ID: ${product.id}`);
            return product;
        }
        catch (error) {
            logger_1.logger.error('Error creating product', error);
            throw error;
        }
    }
    // ✅ SIMPLIFICADO: Solo actualizar datos, sin imágenes
    async updateProduct(id, data) {
        try {
            // Verificar que existe
            await this.getProductById(id);
            const product = await prisma.product.update({
                where: { id },
                data: {
                    ...(data.name && { name: data.name }),
                    ...(data.colors && { colors: data.colors }),
                    ...(data.categoryId && { categoryId: data.categoryId }) // <-- NUEVO
                }
            });
            logger_1.logger.info(`Updated product with ID: ${id}`);
            return product;
        }
        catch (error) {
            logger_1.logger.error(`Error updating product with ID ${id}`, error);
            throw error;
        }
    }
    async getProductsByCategory(categoryId) {
        try {
            const products = await prisma.product.findMany({
                where: { categoryId },
                orderBy: { createdAt: 'desc' }
            });
            logger_1.logger.info(`Retrieved ${products.length} products for category ${categoryId}`);
            return products;
        }
        catch (error) {
            logger_1.logger.error(`Error fetching products for category ${categoryId}`, error);
            throw error;
        }
    }
    // ✅ SIMPLIFICADO: Solo eliminar de BD, sin imágenes
    async deleteProduct(id) {
        try {
            // Verificar que existe
            await this.getProductById(id);
            await prisma.product.delete({
                where: { id }
            });
            logger_1.logger.info(`Deleted product with ID: ${id}`);
            return { message: 'Product deleted successfully' };
        }
        catch (error) {
            logger_1.logger.error(`Error deleting product with ID ${id}`, error);
            throw error;
        }
    }
}
exports.ProductService = ProductService;
exports.productService = new ProductService();
//# sourceMappingURL=productService.js.map