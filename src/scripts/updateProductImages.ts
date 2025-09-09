import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

async function updateProductImages() {
  logger.info('🔄 Iniciando actualización de imágenes de productos...');

  try {
    // 1. Obtener todas las categorías con sus imágenes
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        title: true,
        header: true
      }
    });

    logger.info(`📊 Encontradas ${categories.length} categorías`);

    // 2. Para cada categoría, actualizar los productos relacionados
    for (const category of categories) {
      if (!category.header) {
        logger.warn(`⚠️ La categoría "${category.title}" (ID: ${category.id}) no tiene imagen (header)`);
        continue;
      }

      logger.info(`🔄 Actualizando productos de la categoría "${category.title}" (ID: ${category.id}) con imagen: ${category.header}`);

      // Actualizar todos los productos de esta categoría para usar la misma imagen
      const result = await prisma.product.updateMany({
        where: {
          categoryId: category.id
        },
        data: {
          imagePath: category.header
        }
      });

      logger.info(`✅ Actualizados ${result.count} productos en la categoría "${category.title}"`);
    }

    // 3. Verificar los resultados
    const productsWithoutImages = await prisma.product.count({
      where: {
        imagePath: null
      }
    });

    logger.info(`🏁 Actualización completada. Productos sin imagen después de la actualización: ${productsWithoutImages}`);

  } catch (error) {
    logger.error('❌ Error al actualizar imágenes de productos:', error as Error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script si se llama directamente
if (require.main === module) {
  updateProductImages()
    .then(() => {
      logger.info('✅ Script completado con éxito');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('❌ Error ejecutando script:', error);
      process.exit(1);
    });
}

export default updateProductImages;
