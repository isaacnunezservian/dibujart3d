import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Agregando nuevos productos...\n');
  
  // Solo las nuevas categorías
  const nuevasCategorias = [
    {
      nombre: 'Mario Bros',
      imagen: 'https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/11.png',
      productos: [
        {
          name: 'Luigi',
          colors: ['verde', 'marron havana', 'piel', 'celeste', 'blanco', 'negro']
        },
        {
          name: 'Mario',
          colors: ['rojo', 'marron havana', 'piel', 'celeste', 'blanco', 'negro']
        },
        {
          name: 'Bowser',
          colors: ['blanco', 'piel', 'rojo', 'verde', 'negro']
        },
        {
          name: 'Peach',
          colors: ['amarillo', 'piel', 'blanco', 'negro', 'celeste', 'rosa', 'dorado', 'rojo']
        },
        {
          name: 'Toad (flores)',
          colors: ['rojo', 'piel', 'negro', 'blanco']
        },
        {
          name: 'Yoshi',
          colors: ['verde', 'blanco', 'verde', 'rojo', 'negro']
        }
      ]
    },
    {
      nombre: 'Masha',
      imagen: 'https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/12.jpg',
      productos: [
        {
          name: 'Masha',
          colors: ['rustico', 'violeta', 'bronce', 'piel', 'blanco', 'verde', 'negro']
        }
      ]
    },
    {
      nombre: 'Merlina nuevos',
      imagen: 'https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/13.jpg',
      productos: [
        {
          name: 'Baile Merlina',
          colors: ['blanco', 'negro']
        },
        {
          name: 'Dedos x1 chato',
          colors: ['blanco', 'gris', 'piel', 'negro']
        },
        {
          name: 'Merlina',
          colors: ['blanco', 'plateado', 'negro']
        }
      ]
    },
    {
      nombre: 'Paw Patrol',
      imagen: 'https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/14.jpg',
      productos: [
        {
          name: 'Chase',
          colors: ['blanco', 'dorado 3n3', 'rustico', 'celeste', 'amarillo', 'gris', 'negro']
        },
        {
          name: 'Everest',
          colors: ['blanco', 'rosa', 'violeta', 'amarillo', 'verde caribe', 'negro']
        },
        {
          name: 'Marshall',
          colors: ['blanco', 'celeste', 'rojo', 'amarillo plateado', 'negro']
        },
        {
          name: 'Rocky',
          colors: ['blanco', 'naranja', 'rosa', 'plateado', 'gris acero', 'verde', 'negro']
        }
      ]
    }
  ];

  let totalProductos = 0;
  let totalCategorias = 0;

  for (const categoria of nuevasCategorias) {
    console.log(`\n📁 Procesando categoría: ${categoria.nombre}`);
    
    try {
      // Crear categoría con imagen específica
      console.log(`   🏷️  Creando categoría con imagen: ${categoria.imagen}`);
      const newCategory = await categoryService.createCategory({
        title: categoria.nombre,
        header: categoria.imagen
      });
      const categoryId = newCategory.id;
      totalCategorias++;
      console.log(`   ✅ Categoría creada: ${newCategory.title} (ID: ${categoryId})`);

      // Crear productos
      for (const producto of categoria.productos) {
        try {
          const productData = {
            name: producto.name,
            colors: producto.colors,
            imagePath: categoria.imagen,
            categoryId: categoryId
          };

          const created = await productService.createProduct(productData);
          totalProductos++;
          
          console.log(`   ✅ Producto: ${created.name} (${producto.colors.join(', ')})`);
          
        } catch (error) {
          console.error(`   ❌ Error creando producto ${producto.name}:`, error);
          logger.error(`Error creando producto ${producto.name}`, error as Error);
        }
      }
      
    } catch (error) {
      console.error(`❌ Error procesando categoría ${categoria.nombre}:`, error);
      logger.error(`Error procesando categoría ${categoria.nombre}`, error as Error);
    }
  }

  console.log(`\n🎉 Nuevos productos agregados!`);
  console.log(`📊 Resumen:`);
  console.log(`   - Nuevas categorías: ${totalCategorias}`);
  console.log(`   - Nuevos productos: ${totalProductos}`);

  await prisma.$disconnect();
}

main().catch(console.error);
