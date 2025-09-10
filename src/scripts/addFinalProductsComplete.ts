import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Agregando últimos productos: Anya, Azul, Calavera, Pepa Pig, Spiderman Solo, Unicornios e Intensamente...\n');
  
  const categorias = [
    // Productos únicos - cada uno en su propia categoría
    {
      nombre: 'Anya Dami',
      imagen: 'https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/41.jpg',
      productos: [
        {
          name: 'Anya Dami',
          colors: ['rosa', 'piel', 'negro', 'blanco', 'dorado']
        }
      ]
    },
    {
      nombre: 'Azul',
      imagen: 'https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/42.jpg',
      productos: [
        {
          name: 'Azul',
          colors: ['azul', 'amarillo', 'blanco', 'negro', 'celeste printalot claro']
        }
      ]
    },
    {
      nombre: 'Calavera One Piece',
      imagen: 'https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/43.jpg',
      productos: [
        {
          name: 'Calavera One Piece',
          colors: ['negro', 'blanco', 'amarillo', 'rojo']
        }
      ]
    },
    {
      nombre: 'Pepa Pig',
      imagen: 'https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/44.png',
      productos: [
        {
          name: 'Pepa Pig',
          colors: ['rosa', 'rojo', 'blanco', 'fucsia', 'negro']
        }
      ]
    },
    {
      nombre: 'Unicornios',
      imagen: 'https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/46.jpg',
      productos: [
        {
          name: 'Unicornios',
          colors: ['blanco', 'amarillo', 'celeste claro', 'rosa', 'negro']
        }
      ]
    },
    
    // Categoría con múltiples productos - Spiderman Solo
    {
      nombre: 'Spiderman Solo',
      imagen: 'https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/45.jpg',
      productos: [
        {
          name: 'Spiderman negro',
          colors: ['negro (rollo blanco)', 'gris plomo', 'negro', 'rojo', 'blanco']
        },
        {
          name: 'Spiderman rojo',
          colors: ['blanco', 'azul', 'rojo', 'negro']
        }
      ]
    },
    
    // Categoría con múltiples productos - Intensamente
    {
      nombre: 'Intensamente',
      imagen: 'https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/50.png',
      productos: [
        {
          name: 'Alegría',
          colors: ['negro', 'blanco', 'azul', 'piel']
        },
        {
          name: 'Envidia',
          colors: ['negro', 'nafta', 'blanco', 'verde pla+']
        },
        {
          name: 'Furia/Ira',
          colors: ['negro', 'blanco', 'rojo']
        },
        {
          name: 'Miedo',
          colors: ['negro', 'blanco', 'lavanda', 'rojo']
        },
        {
          name: 'Tristeza',
          colors: ['negro', 'celeste', 'blanco', 'azul (zafiro)']
        },
        {
          name: 'Ansiedad',
          colors: ['negro', 'blanco', 'naranja']
        },
        {
          name: 'Desagrado/Asco',
          colors: ['negro', 'blanco', 'verde oscuro', 'verde manzana']
        },
        {
          name: 'Vergüenza',
          colors: ['negro', 'blanco', 'rosa', 'gris', 'bordó']
        },
        {
          name: 'Aburrimiento',
          colors: ['negro', 'blanco', 'violeta']
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

  console.log(`\n🎉 ¡Catálogo completamente terminado! 🎊`);
  console.log(`📊 Últimos productos agregados:`);
  console.log(`   - Categorías creadas: ${totalCategorias}`);
  console.log(`   - Productos creados: ${totalProductos}`);
  console.log(`\n🌟 Categorías finales agregadas:`);
  console.log(`   - Productos únicos: Anya Dami, Azul, Calavera One Piece, Pepa Pig, Unicornios`);
  console.log(`   - Spiderman Solo (2 variantes)`);
  console.log(`   - Intensamente (9 emociones completas) 🎭`);
  console.log(`\n🏆 ¡Tu catálogo de productos está 100% completo!`);

  await prisma.$disconnect();
}

main().catch(console.error);
