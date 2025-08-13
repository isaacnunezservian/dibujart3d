import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { createError } from '../utils/createError';

const prisma = new PrismaClient();

interface CreateCategoryData {
  title: string;
  header: string;
}

interface UpdateCategoryData {
  title?: string;
  header?: string;
}

export class CategoryService {
  async getAllCategories() {
    try {
      const categories = await prisma.category.findMany({
        orderBy: {
          title: 'asc'
        }
      });
      
      logger.info(`Retrieved ${categories.length} categories`);
      return categories;
    } catch (error) {
      logger.error('Error fetching categories', error as Error);
      throw error;
    }
  }

  async getCategoryById(id: number) {
    try {
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          products: true // Include products in this category
        }
      });
      
      if (!category) {
        throw createError('Category not found', 404);
      }
      
      logger.info(`Retrieved category with ID: ${id}`);
      return category;
    } catch (error) {
      logger.error(`Error fetching category with ID ${id}`, error as Error);
      throw error;
    }
  }

  async createCategory(data: CreateCategoryData) {
    try {
      const category = await prisma.category.create({
        data: {
          title: data.title,
          header: data.header
        }
      });

      logger.info(`Created category with ID: ${category.id}`);
      return category;
    } catch (error) {
      logger.error('Error creating category', error as Error);
      throw error;
    }
  }

  async updateCategory(id: number, data: UpdateCategoryData) {
    try {
      // Verify category exists
      await this.getCategoryById(id);

      const category = await prisma.category.update({
        where: { id },
        data
      });

      logger.info(`Updated category with ID: ${id}`);
      return category;
    } catch (error) {
      logger.error(`Error updating category with ID ${id}`, error as Error);
      throw error;
    }
  }

  async deleteCategory(id: number) {
    try {
      // Verify category exists
      await this.getCategoryById(id);

      // Check if category has products
      const categoryWithProducts = await prisma.category.findUnique({
        where: { id },
        include: { products: true }
      });

      if (categoryWithProducts?.products.length! > 0) {
        throw createError('Cannot delete category with existing products', 400);
      }

      await prisma.category.delete({
        where: { id }
      });

      logger.info(`Deleted category with ID: ${id}`);
    } catch (error) {
      logger.error(`Error deleting category with ID ${id}`, error as Error);
      throw error;
    }
  }

  // Bulk create categories - useful for seeding
  async createManyCategories(categories: CreateCategoryData[]) {
    try {
      const result = await prisma.category.createMany({
        data: categories,
        skipDuplicates: true // Skip if title already exists
      });

      logger.info(`Created ${result.count} categories`);
      return result;
    } catch (error) {
      logger.error('Error creating multiple categories', error as Error);
      throw error;
    }
  }
}

export const categoryService = new CategoryService();