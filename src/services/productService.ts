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

  // ✅ UPDATED: Manejar imagePath de Supabase y categoría automática
  async createProduct(data: CreateProductData) {
    try {
      // Si no hay categoryId, crear una nueva categoría con el mismo nombre
      let finalCategoryId: number;
      
      if (!data.categoryId) {
        // Importar categoryService aquí para evitar dependencias circulares
        const { categoryService } = require('./categoryService');
        
        logger.info(`No category provided for product '${data.name}', creating new category`);
        
        // Crear nueva categoría con el mismo nombre y la misma imagen
        const newCategory = await categoryService.createCategory({
          title: data.name,
          header: data.imagePath // Usar la misma imagen del producto
        });
        
        finalCategoryId = newCategory.id;
        logger.info(`Created new category '${newCategory.title}' with ID: ${finalCategoryId}`);
      } else {
        finalCategoryId = data.categoryId;
      }
      
      const product = await prisma.product.create({
        data: {
          name: data.name,
          colors: data.colors,
          imagePath: data.imagePath || null,
          categoryId: finalCategoryId // Usar la categoría existente o la nueva
        },
        include: {
          category: true // Incluir detalles de la categoría
        }
      });

      logger.info(`Created product with ID: ${product.id}`);
      return product;
    } catch (error) {
      logger.error('Error creating product', error as Error);
      throw error;
    }
  }

  // ✅ UPDATED: Actualizar producto y verificar categoría huérfana
  async updateProduct(id: number, data: UpdateProductData) {
    try {
      // 1. Obtener la información actual del producto para verificar la categoría
      let oldCategoryId: number | null = null;
      
      if (data.categoryId) {
        const currentProduct = await prisma.product.findUnique({
          where: { id },
          select: { categoryId: true }
        });
        
        if (currentProduct && currentProduct.categoryId !== data.categoryId) {
          oldCategoryId = currentProduct.categoryId;
        }
      }

      // 2. Actualizar el producto
      const product = await prisma.product.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.colors && { colors: data.colors }),
          ...(data.categoryId && { categoryId: data.categoryId }),
          ...(data.imagePath !== undefined && { imagePath: data.imagePath }) 
        },
        include: { category: true }
      });

      logger.info(`Updated product with ID: ${id}`);
      
      // 3. Si cambiamos de categoría, verificar si la anterior quedó sin productos
      if (oldCategoryId) {
        const remainingProducts = await prisma.product.count({
          where: { categoryId: oldCategoryId }
        });

        if (remainingProducts === 0) {
          logger.info(`Eliminando categoría ID: ${oldCategoryId} por no tener productos asociados después de actualización`);
          await prisma.category.delete({
            where: { id: oldCategoryId }
          });
          logger.info(`Categoría ${oldCategoryId} eliminada automáticamente`);
        }
      }
      
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

  // ✅ ACTUALIZADO: Eliminar producto y verificar si la categoría queda huérfana
  async deleteProduct(id: number) {
    try {
      // 1. Obtener el producto y su categoría antes de eliminarlo
      const product = await prisma.product.findUnique({
        where: { id },
        include: { category: true }
      });
      
      if (!product) {
        throw new Error(`Product with id ${id} not found`);
      }

      const categoryId = product.categoryId;

      // 2. Eliminar el producto
      await prisma.product.delete({
        where: { id }
      });
      
      logger.info(`Deleted product with ID: ${id}`);

      // 3. Verificar si la categoría tiene otros productos
      const remainingProducts = await prisma.product.count({
        where: { categoryId }
      });

      // 4. Si no hay más productos, eliminar la categoría
      if (remainingProducts === 0) {
        logger.info(`Eliminando categoría "${product.category.title}" (ID: ${categoryId}) por no tener productos asociados`);
        await prisma.category.delete({
          where: { id: categoryId }
        });
        logger.info(`Categoría ${categoryId} eliminada automáticamente`);
      }

      return { message: 'Product deleted successfully' };
    } catch (error) {
      logger.error(`Error deleting product with ID ${id}`, error as Error);
      throw error;
    }
  }
}

export const productService = new ProductService();
