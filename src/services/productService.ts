import { PrismaClient } from '@prisma/client';
import { CreateProductData, UpdateProductData } from '../utils/validation';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export class ProductService {
  async getAllProducts() {
    try {
      const products = await prisma.product.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      logger.info(`Retrieved ${products.length} products`);
      return products;
    } catch (error) {
      logger.error('Error fetching products', error as Error);
      throw error;
    }
  }

  async getProductById(id: number) {
    try {
      const product = await prisma.product.findUnique({
        where: { id }
      });
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      logger.info(`Retrieved product with ID: ${id}`);
      return product;
    } catch (error) {
      logger.error(`Error fetching product with ID ${id}`, error as Error);
      throw error;
    }
  }

  // ✅ SIMPLIFICADO: Solo datos, sin imágenes
  async createProduct(data: CreateProductData) {
    try {
      const product = await prisma.product.create({
        data: {
          name: data.name,
          colors: data.colors,
          imagePath: null,
          categoryId: data.categoryId // <-- NUEVO
        }
      });

      logger.info(`Created product with ID: ${product.id}`);
      return product;
    } catch (error) {
      logger.error('Error creating product', error as Error);
      throw error;
    }
  }

  // ✅ SIMPLIFICADO: Solo actualizar datos, sin imágenes
  async updateProduct(id: number, data: UpdateProductData) {
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

      logger.info(`Updated product with ID: ${id}`);
      return product;
    } catch (error) {
      logger.error(`Error updating product with ID ${id}`, error as Error);
      throw error;
    }
  }

  async getProductsByCategory(categoryId: number) {
    try {
      const products = await prisma.product.findMany({
        where: { categoryId },
        orderBy: { createdAt: 'desc' }
      });

      logger.info(`Retrieved ${products.length} products for category ${categoryId}`);
      return products;
    } catch (error) {
      logger.error(`Error fetching products for category ${categoryId}`, error as Error);
      throw error;
    }
  }

  // ✅ SIMPLIFICADO: Solo eliminar de BD, sin imágenes
  async deleteProduct(id: number) {
    try {
      // Verificar que existe
      await this.getProductById(id);

      await prisma.product.delete({
        where: { id }
      });

      logger.info(`Deleted product with ID: ${id}`);
      return { message: 'Product deleted successfully' };
    } catch (error) {
      logger.error(`Error deleting product with ID ${id}`, error as Error);
      throw error;
    }
  }
}

export const productService = new ProductService();
