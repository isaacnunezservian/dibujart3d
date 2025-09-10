import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando carga masiva de productos...\n');
  
  // Datos organizados por categoría con sus productos
  const categorias = [
    {
      nombre: 'Gumball y Darwin',
      imagen: null, // Sin imagen específica, se creará automáticamente
      productos: [
        {
          name: 'Darwin',
          colors: ['naranja', 'blanco', 'negro']
        },
        {
          name: 'Gumball',
          colors: ['celeste', 'blanco', 'celeste claro', 'negro', 'rojo']
        }
      ]
    },
    {
      nombre: 'Harry Potter',
      imagen: 'https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/1.jpg',
      productos: [
        {
          name: 'Harry',
          colors: ['blanco', 'piel', 'amarillo', 'rojo', 'marron havana', 'negro']
        },
        {
          name: 'Hermione',
          colors: ['blanco', 'piel', 'amarillo', 'rojo', 'rustico', 'negro']
        },
        {
          name: 'Ron',
          colors: ['blanco', 'piel', 'amarillo', 'rojo', 'naranja', 'negro']
        }
      ]
    },
    {
      nombre: 'Héroes en Pijama',
      imagen: 'https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/2.jpg',
      productos: [
        {
          name: 'Buhita',
          colors: ['rojo', 'piel', 'blanco', 'negro']
        },
        {
          name: 'Gatuno',
          colors: ['azul', 'piel', 'blanco', 'negro']
        },
        {
          name: 'Gekko',
          colors: ['verde', 'piel', 'blanco', 'negro']
        }
      ]
    },
    {
      nombre: 'Inter Messi',
      imagen: 'https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/3.jpg',
      productos: [
        {
          name: 'Camisetas',
          colors: ['rosa', 'negro', 'negro', 'rosa']
        },
        {
          name: 'Escudo',
          colors: ['negro', 'blanco', 'rosa']
        },
        {
          name: 'Inter',
          colors: ['blanco', 'rosa', 'marron havana', 'piel', 'negro']
        }
      ]
    },
    {
      nombre: 'Joystick',
      imagen: 'https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/4.jpg',
      productos: [
        {
          name: 'Joystick Azul',
          colors: ['azul', 'negro']
        },
        {
          name: 'Joystick Blanco',
          colors: ['blanco', 'negro']
        },
        {
          name: 'Joystick Negro',
          colors: ['negro', 'blanco']
        },
        {
          name: 'Joystick Rojo',
          colors: ['rojo', 'negro']
        }
      ]
    },
    {
      nombre: 'Ladybug',
      imagen: 'https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/5.jpg',
      productos: [
        {
          name: 'Ladybug',
          colors: ['azul', 'piel', 'celeste claro', 'blanco', 'negro', 'rojo']
        }
      ]
    },
    {
      nombre: 'Los pequeños Looney Tunes',
      imagen: null, // Sin imagen específica, se creará automáticamente
      productos: [
        {
          name: 'Lucas',
          colors: ['rustico', 'rojo', 'blanco', 'naranja', 'negro']
        },
        {
          name: 'Silvestre',
          colors: ['blanco', 'rojo', 'negro']
        },
        {
          name: 'Taz',
          colors: ['blanco', 'piel', 'havana', 'negro']
        }
      ]
    },
    // ✅ NUEVAS CATEGORÍAS
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

  for (const categoria of categorias) {
    console.log(`\n📁 Procesando categoría: ${categoria.nombre}`);
    
    try {
      // Crear categoría si tiene imagen específica
      let categoryId: number | undefined;
      
      if (categoria.imagen) {
        console.log(`   🏷️  Creando categoría con imagen: ${categoria.imagen}`);
        const newCategory = await categoryService.createCategory({
          title: categoria.nombre,
          header: categoria.imagen
        });
        categoryId = newCategory.id;
        totalCategorias++;
        console.log(`   ✅ Categoría creada: ${newCategory.title} (ID: ${categoryId})`);
      }

      // Crear productos
      for (const producto of categoria.productos) {
        try {
          const productData: any = {
            name: producto.name,
            colors: producto.colors,
            imagePath: categoria.imagen || null
          };
          
          // Si ya creamos la categoría, usarla. Si no, se creará automáticamente
          if (categoryId) {
            productData.categoryId = categoryId;
          }

          const created = await productService.createProduct(productData);
          totalProductos++;
          
          console.log(`   ✅ Producto: ${created.name} (${producto.colors.join(', ')})`);
          
          // Si no teníamos categoría previa y se creó automáticamente, obtener el ID para los siguientes productos
          if (!categoryId && created.categoryId) {
            categoryId = created.categoryId;
          }
          
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

  console.log(`\n🎉 Proceso completado!`);
  console.log(`📊 Resumen:`);
  console.log(`   - Categorías procesadas: ${totalCategorias}`);
  console.log(`   - Productos creados: ${totalProductos}`);

  await prisma.$disconnect();
}

main().catch(console.error);
