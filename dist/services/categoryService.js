"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = exports.CategoryService = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const createError_1 = require("../utils/createError");
const prisma = new client_1.PrismaClient();
class CategoryService {
    async getAllCategories() {
        try {
            const categories = await prisma.category.findMany({
                orderBy: {
                    title: 'asc'
                }
            });
            logger_1.logger.info(`Retrieved ${categories.length} categories`);
            return categories;
        }
        catch (error) {
            logger_1.logger.error('Error fetching categories', error);
            throw error;
        }
    }
    async getCategoryById(id) {
        try {
            const category = await prisma.category.findUnique({
                where: { id },
                include: {
                    products: true // Include products in this category
                }
            });
            if (!category) {
                throw (0, createError_1.createError)('Category not found', 404);
            }
            logger_1.logger.info(`Retrieved category with ID: ${id}`);
            return category;
        }
        catch (error) {
            logger_1.logger.error(`Error fetching category with ID ${id}`, error);
            throw error;
        }
    }
    async createCategory(data) {
        try {
            const category = await prisma.category.create({
                data: {
                    title: data.title,
                    header: data.header
                }
            });
            logger_1.logger.info(`Created category with ID: ${category.id}`);
            return category;
        }
        catch (error) {
            logger_1.logger.error('Error creating category', error);
            throw error;
        }
    }
    async updateCategory(id, data) {
        try {
            // Verify category exists
            await this.getCategoryById(id);
            const category = await prisma.category.update({
                where: { id },
                data
            });
            logger_1.logger.info(`Updated category with ID: ${id}`);
            return category;
        }
        catch (error) {
            logger_1.logger.error(`Error updating category with ID ${id}`, error);
            throw error;
        }
    }
    async deleteCategory(id) {
        try {
            // Verify category exists
            await this.getCategoryById(id);
            // Check if category has products
            const categoryWithProducts = await prisma.category.findUnique({
                where: { id },
                include: { products: true }
            });
            if (categoryWithProducts?.products.length > 0) {
                throw (0, createError_1.createError)('Cannot delete category with existing products', 400);
            }
            await prisma.category.delete({
                where: { id }
            });
            logger_1.logger.info(`Deleted category with ID: ${id}`);
        }
        catch (error) {
            logger_1.logger.error(`Error deleting category with ID ${id}`, error);
            throw error;
        }
    }
    // Bulk create categories - useful for seeding
    async createManyCategories(categories) {
        try {
            const result = await prisma.category.createMany({
                data: categories,
                skipDuplicates: true // Skip if title already exists
            });
            logger_1.logger.info(`Created ${result.count} categories`);
            return result;
        }
        catch (error) {
            logger_1.logger.error('Error creating multiple categories', error);
            throw error;
        }
    }
}
exports.CategoryService = CategoryService;
exports.categoryService = new CategoryService();
//# sourceMappingURL=categoryService.js.map