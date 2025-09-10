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
      let finalImagePath = data.imagePath;
      
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
        // Si se proporciona categoryId, obtener la categoría existente y usar su imagen
        const existingCategory = await prisma.category.findUnique({
          where: { id: data.categoryId }
        });
        
        if (!existingCategory) {
          throw new Error(`Category with ID ${data.categoryId} not found`);
        }
        
        finalCategoryId = data.categoryId;
        // Usar la imagen de la categoría existente en lugar de la del producto
        finalImagePath = existingCategory.header;
        logger.info(`Using existing category '${existingCategory.title}' image: ${finalImagePath}`);
      }
      
      const product = await prisma.product.create({
        data: {
          name: data.name,
          colors: data.colors,
          imagePath: finalImagePath || null,
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

  // ✅ UPDATED: Actualizar producto (edición básica: solo nombre y colores)
  async updateProduct(id: number, data: UpdateProductData) {
    try {
      // Verificar que el producto existe
      const existingProduct = await prisma.product.findUnique({
        where: { id },
        include: { category: true }
      });

      if (!existingProduct) {
        throw new Error(`Product with id ${id} not found`);
      }

      // Si se está cambiando el nombre, verificar que no exista otro producto con ese nombre
      if (data.name && data.name !== existingProduct.name) {
        const duplicateProduct = await prisma.product.findFirst({
          where: { 
            name: data.name,
            id: { not: id }
          }
        });

        if (duplicateProduct) {
          throw new Error(`Product with name "${data.name}" already exists`);
        }
      }

      // Actualizar solo nombre y colores (edición básica)
      const updateData: any = {};
      if (data.name) updateData.name = data.name;
      if (data.colors) updateData.colors = data.colors;

      const product = await prisma.product.update({
        where: { id },
        data: updateData,
        include: { category: true }
      });

      logger.info(`Updated product: ${product.name} (ID: ${id})`);
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
