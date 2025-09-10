import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Agregando productos finales: Selección, Skibidi, Smiling Critters, Sonic, Spiderman y Tortugas Ninjas...\n');
  
  const categorias = [
    {
      nombre: 'Selección',
      imagen: 'https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/31.png',
      productos: [
        {
          name: '5 de copas',
          colors: ['blanco', 'negro', 'celeste claro printalot', 'amarillo', 'rojo']
        },
        {
          name: 'AFA',
          colors: ['blanco', 'dorado', 'celeste claro']
        },
        {
          name: 'AFA negro',
          colors: ['negro', 'dorado', 'blanco', 'celeste claro printalot']
        },
        {
          name: 'Camiseta "78 86 22"',
          colors: ['blanco', 'celeste +oscuro', 'negro', 'dorado']
        },
        {
          name: 'Camiseta campeones del mundo',
          colors: ['blanco', 'celeste +oscuro', 'negro', 'dorado']
        },
        {
          name: 'Camiseta Messi 10',
          colors: ['blanco', 'celeste', 'negro']
        },
        {
          name: 'Copa del mundo',
          colors: ['verde', 'dorado']
        },
        {
          name: 'Copa del mundo V2',
          colors: ['celeste', 'blanco', 'celeste', 'dorado']
        },
        {
          name: 'Dibu copa',
          colors: ['blanco', 'negro', 'celeste', 'dorado']
        },
        {
          name: 'Dibu premio',
          colors: ['blanco', 'verde fluo', 'amarillo', 'piel', 'negro']
        },
        {
          name: 'Messi con la copa',
          colors: ['blanco', 'marron havana', 'celeste+oscuro', 'amarillo', 'piel', 'negro']
        },
        {
          name: 'Messi besando copa',
          colors: ['blanco', 'amarillo', 'celeste', 'piel', 'negro']
        },
        {
          name: 'Scaloneta',
          colors: ['negro', 'celeste', 'blanco']
        },
        {
          name: 'Qué mirás bobo?',
          colors: ['negro', 'celeste +oscuro', 'blanco']
        }
      ]
    },
    {
      nombre: 'Skibidi toilet',
      imagen: 'https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/32.jpg',
      productos: [
        {
          name: 'Cameraman',
          colors: ['negro', 'blanco', 'plateado']
        },
        {
          name: 'Cameraman sopapa',
          colors: ['negro', 'plateado', 'blanco', 'plateado', 'rojo']
        },
        {
          name: 'Skibidi DJ',
          colors: ['blanco', 'piel', 'blanco', 'negro', 'violeta']
        },
        {
          name: 'Speakerman',
          colors: ['negro', 'blanco', 'plateado']
        },
        {
          name: 'Titan Cameraman',
          colors: ['negro', 'celeste claro', 'plateado']
        },
        {
          name: 'Titan Speakerman',
          colors: ['blanco', 'negro', 'rojo', 'plateado']
        },
        {
          name: 'Titan tvman',
          colors: ['negro', 'violeta', 'blanco', 'plateado']
        }
      ]
    },
    {
      nombre: 'Smiling critters',
      imagen: 'https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/33.png',
      productos: [
        {
          name: 'BOBBY',
          colors: ['negro', 'blanco', 'rosa', 'rustico']
        },
        {
          name: 'BUBBAPHANT',
          colors: ['negro', 'blanco', 'celeste', 'celeste claro', 'rosa']
        },
        {
          name: 'CATNAP',
          colors: ['negro', 'blanco', 'lavanda', 'rosa', 'violeta']
        },
        {
          name: 'HOPPY',
          colors: ['negro', 'blanco', 'verde', 'verde manzana', 'rosa']
        },
        {
          name: 'KICKINCHICKEN',
          colors: ['negro', 'blanco', 'amarillo', 'naranja', 'rosa']
        },
        {
          name: 'PICKYPIGGY',
          colors: ['negro', 'blanco', 'rosa', 'fucsia', 'piel']
        },
        {
          name: 'DOGDAY',
          colors: ['negro', 'blanco', 'naranja', 'amarillo', 'rustico', 'rosa']
        },
        {
          name: 'CRAFTY CORN',
          colors: ['negro', 'blanco', 'celeste claro', 'rosa']
        }
      ]
    },
    {
      nombre: 'Sonic',
      imagen: 'https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/34.png',
      productos: [
        {
          name: 'Sonic',
          colors: ['azul', 'blanco', 'piel', 'negro']
        },
        {
          name: 'Tails',
          colors: ['dorado 3n3', 'blanco', 'rosa', 'negro']
        },
        {
          name: 'Shadow',
          colors: ['negro', 'blanco', 'rojo', 'piel', 'negro']
        },
        {
          name: 'Knuckles',
          colors: ['rojo', 'blanco', 'piel', 'negro']
        },
        {
          name: 'Amy',
          colors: ['blanco', 'rosa', 'piel', 'negro', 'blanco']
        }
      ]
    },
    {
      nombre: 'Spiderman y sorprendentes amigos',
      imagen: 'https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/35.jpg',
      productos: [
        {
          name: 'Spidey Gwen',
          colors: ['blanco', 'celeste claro', 'violeta', 'fucsia', 'negro']
        },
        {
          name: 'Spidey Morales',
          colors: ['negro', 'rojo', 'blanco']
        },
        {
          name: 'Spidey Peter',
          colors: ['azul', 'rojo', 'negro', 'blanco']
        }
      ]
    },
    {
      nombre: 'Tortugas ninjas',
      imagen: 'https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/36.png',
      productos: [
        {
          name: 'Donnie',
          colors: ['verde', 'blanco', 'violeta', 'negro']
        },
        {
          name: 'Leo',
          colors: ['verde', 'blanco', 'celeste', 'negro']
        },
        {
          name: 'Ralph',
          colors: ['verde', 'blanco', 'rojo', 'negro']
        },
        {
          name: 'Mikey',
          colors: ['verde', 'blanco', 'rojo', 'naranja', 'negro']
        }
      ]
    }
  ];

  let totalProductos = 0;
  let totalCategorias = 0;

  for (const categoria of categorias) {
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

  console.log(`\n🎉 ¡Todos los productos finales agregados exitosamente!`);
  console.log(`📊 Resumen final:`);
  console.log(`   - Categorías creadas: ${totalCategorias}`);
  console.log(`   - Productos creados: ${totalProductos}`);
  console.log(`\n🏆 Categorías agregadas:`);
  console.log(`   - Selección Argentina (14 productos) 🇦🇷`);
  console.log(`   - Skibidi Toilet (7 productos) 🚽`);
  console.log(`   - Smiling Critters (8 productos) 😊`);
  console.log(`   - Sonic (5 productos) 💙`);
  console.log(`   - Spiderman y amigos (3 productos) 🕷️`);
  console.log(`   - Tortugas Ninjas (4 productos) 🐢`);

  await prisma.$disconnect();
}

main().catch(console.error);
