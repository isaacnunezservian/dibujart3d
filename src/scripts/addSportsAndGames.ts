import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Agregando productos deportivos, Pokemon y Roblox...\n');
  
  const categorias = [
    // Categoría con múltiples productos - sin imagen (se creará automáticamente)
    {
      nombre: 'Pelotas',
      imagen: null,
      productos: [
        {
          name: 'Basquetbol',
          colors: ['negro', 'naranja']
        },
        {
          name: 'Futbol',
          colors: ['blanco', 'negro']
        },
        {
          name: 'Rugbi',
          colors: ['blanco', 'celeste', 'dorado']
        },
        {
          name: 'Tenis',
          colors: ['blanco', 'verde fluo']
        },
        {
          name: 'Vóley',
          colors: ['blanco', 'celeste']
        }
      ]
    },
    
    // Producto único - Raquetas
    {
      nombre: 'Raquetas',
      imagen: 'https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/22.jpg',
      productos: [
        {
          name: 'Raquetas',
          colors: ['blanco', 'rosa', 'celeste']
        }
      ]
    },
    
    // Producto único - Patin (con 2 variantes)
    {
      nombre: 'Patin',
      imagen: 'https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/22.jpg',
      productos: [
        {
          name: 'Patin Rosa',
          colors: ['plateado', 'blanco', 'rosa']
        },
        {
          name: 'Patin Negro',
          colors: ['plateado', 'negro', 'rosa']
        }
      ]
    },
    
    // Producto único - Hockey (con 2 variantes)
    {
      nombre: 'Hockey',
      imagen: 'https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/24.jpg',
      productos: [
        {
          name: 'Hockey Rosa',
          colors: ['blanco', 'rosa', 'rustico']
        },
        {
          name: 'Hockey Fucsia',
          colors: ['negro', 'fucsia', 'rustico']
        }
      ]
    },
    
    // Categoría con múltiples productos - Pokemon
    {
      nombre: 'Pokemon',
      imagen: 'https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/25.png',
      productos: [
        {
          name: 'Bulbasaur',
          colors: ['blanco', 'verde pla+ 3n3 (turquez)', 'rojo', 'verde', 'negro']
        },
        {
          name: 'Charmander',
          colors: ['blanco', 'naranja', 'rosa', 'verde 3n3 (fernet)', 'negro']
        },
        {
          name: 'Pikachu (nuñez)',
          colors: ['blanco', 'amarillo', 'rojo', 'negro']
        },
        {
          name: 'Squirtle',
          colors: ['blanco', 'celeste claro', 'rosa', 'rojo', 'negro']
        },
        {
          name: 'Pikachu entero',
          colors: ['amarillo', 'negro', 'blanco', 'rojo']
        },
        {
          name: 'Pokebola',
          colors: ['negro', 'blanco', 'rojo']
        }
      ]
    },
    
    // Categoría con múltiples productos - Roblox
    {
      nombre: 'Roblox',
      imagen: 'https://lazefqgizrtgsevcmqln.supabase.co/storage/v1/object/public/tigreimg/26.png',
      productos: [
        {
          name: 'Roblox logo',
          colors: ['negro', 'blanco']
        },
        {
          name: 'Roblox varon',
          colors: ['piel', 'negro', 'blanco', 'marron havana', 'verde']
        }
      ]
    }
  ];

  let totalProductos = 0;
  let totalCategorias = 0;

  for (const categoria of categorias) {
    console.log(`\n📁 Procesando categoría: ${categoria.nombre}`);
    
    try {
      let categoryId: number | undefined;
      
      if (categoria.imagen) {
        // Crear categoría con imagen específica
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

  console.log(`\n🎉 Productos deportivos, Pokemon y Roblox agregados!`);
  console.log(`📊 Resumen:`);
  console.log(`   - Nuevas categorías: ${totalCategorias}`);
  console.log(`   - Nuevos productos: ${totalProductos}`);
  console.log(`\n🏷️  Tipos de categorías creadas:`);
  console.log(`   - Pelotas (múltiples productos, sin imagen específica)`);
  console.log(`   - Raquetas, Patin, Hockey (productos únicos con imagen)`);
  console.log(`   - Pokemon, Roblox (múltiples productos con imagen específica)`);

  await prisma.$disconnect();
}

main().catch(console.error);
