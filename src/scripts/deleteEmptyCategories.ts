import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Script para eliminar categorías sin productos asociados
 * Este script identifica y elimina todas las categorías que no tienen
 * productos asociados actualmente en la base de datos.
 */
async function deleteEmptyCategories() {
  logger.info('🔍 Iniciando búsqueda de categorías sin productos...');

  try {
    // 1. Obtener todas las categorías con conteo de productos
    const categoriesWithCount = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    // 2. Filtrar categorías sin productos
    const emptyCategories = categoriesWithCount.filter(category => 
      category._count.products === 0
    );

    logger.info(`📊 Se encontraron ${emptyCategories.length} categorías sin productos de un total de ${categoriesWithCount.length} categorías`);

    if (emptyCategories.length === 0) {
      logger.info('✅ No hay categorías vacías para eliminar');
      return { deleted: 0, message: 'No empty categories found' };
    }

    // 3. Mostrar las categorías que se eliminarán
    logger.info('🗑️ Se eliminarán las siguientes categorías:');
    emptyCategories.forEach(category => {
      logger.info(`   - ID: ${category.id}, Título: "${category.title}"`);
    });

    // 4. Eliminar las categorías vacías
    const deleteIds = emptyCategories.map(cat => cat.id);
    
    const result = await prisma.category.deleteMany({
      where: {
        id: {
          in: deleteIds
        }
      }
    });

    logger.info(`✅ Se eliminaron ${result.count} categorías vacías exitosamente`);
    return { deleted: result.count, message: `${result.count} empty categories deleted` };

  } catch (error) {
    logger.error('❌ Error al eliminar categorías vacías:', error as Error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script si se llama directamente
if (require.main === module) {
  deleteEmptyCategories()
    .then((result) => {
      logger.info(`✅ Script completado con éxito. ${result.deleted} categorías eliminadas.`);
      process.exit(0);
    })
    .catch((error) => {
      logger.error('❌ Error ejecutando script:', error);
      process.exit(1);
    });
}

export default deleteEmptyCategories;
