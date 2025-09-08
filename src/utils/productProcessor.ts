import type { Product, MonoProduct, MultiProduct, ProductItem, ProductGroup } from '../types'

/**
 * Determina si varios productos forman un multiproducto basado en:
 * 1. Misma imagen (imagePath)
 * 2. Nombres similares (ej: "Vaso Azul", "Vaso Rojo" -> multiproducto "Vaso")
 */
export const extractSharedName = (names: string[]): string => {
  if (names.length <= 1) return names[0] || ''
  
  // Encontrar la parte común al inicio de todos los nombres
  let commonPrefix = names[0]
  
  for (let i = 1; i < names.length; i++) {
    let j = 0
    while (j < commonPrefix.length && j < names[i].length && 
           commonPrefix[j].toLowerCase() === names[i][j].toLowerCase()) {
      j++
    }
    commonPrefix = commonPrefix.substring(0, j).trim()
  }
  
  // Si el prefijo común termina en espacio o es muy corto, ajustar
  if (commonPrefix.length < 3) {
    // Intentar encontrar palabras comunes
    const words1 = names[0].split(' ')
    const words2 = names[1].split(' ')
    const commonWords = words1.filter(word => 
      words2.some(w2 => w2.toLowerCase() === word.toLowerCase())
    )
    return commonWords.join(' ') || names[0]
  }
  
  return commonPrefix.replace(/\s+$/, '') // Remover espacios al final
}

/**
 * Agrupa productos por imagen compartida y determina multiproductos
 */
export const groupProductsByImage = (products: Product[]): ProductGroup[] => {
  const groups = new Map<string, Product[]>()
  
  // Agrupar por imagePath (o por 'no-image' si no tienen imagen)
  products.forEach(product => {
    const imageKey = product.imagePath || 'no-image'
    if (!groups.has(imageKey)) {
      groups.set(imageKey, [])
    }
    groups.get(imageKey)!.push(product)
  })
  
  // Convertir a ProductGroups
  return Array.from(groups.entries()).map(([imageKey, products]) => ({
    sharedImage: imageKey === 'no-image' ? '' : imageKey,
    sharedNameBase: extractSharedName(products.map(p => p.name)),
    products
  }))
}

/**
 * Convierte productos del backend en ProductItems (Mono/Multi)
 */
export const processProductsToItems = (products: Product[]): ProductItem[] => {
  const groups = groupProductsByImage(products)
  
  return groups.map((group, index) => {
    if (group.products.length === 1) {
      // Monoproducto
      const product = group.products[0]
      return {
        ...product,
        type: 'mono' as const,
        displayImage: product.imagePath || '',
        displayName: product.name
      }
    } else {
      // Multiproducto
      return {
        type: 'multi' as const,
        id: `multi-${index}-${group.sharedImage.split('/').pop() || 'noimg'}`,
        displayName: group.sharedNameBase || `Producto Múltiple ${index + 1}`,
        displayImage: group.sharedImage,
        products: group.products
      }
    }
  })
}

/**
 * Filtra ProductItems por término de búsqueda
 */
export const filterProductItems = (items: ProductItem[], searchTerm: string): ProductItem[] => {
  if (!searchTerm.trim()) return items
  
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, "")
  }
  
  const normalizedSearch = normalizeText(searchTerm)
  
  return items.filter(item => {
    if (item.type === 'mono') {
      return normalizeText(item.displayName).includes(normalizedSearch)
    } else {
      // Para multiproductos, buscar en el nombre del grupo y en productos individuales
      const groupMatches = normalizeText(item.displayName).includes(normalizedSearch)
      const productMatches = item.products.some(product => 
        normalizeText(product.name).includes(normalizedSearch)
      )
      return groupMatches || productMatches
    }
  })
}

/**
 * Obtiene todos los productos individuales de una lista de ProductItems
 * Útil para estadísticas y conteos
 */
export const getAllIndividualProducts = (items: ProductItem[]): Product[] => {
  return items.flatMap(item => 
    item.type === 'mono' ? [item] : item.products
  )
}

/**
 * Filtra ProductItems por categoría
 */
export const filterProductItemsByCategory = (items: ProductItem[], categoryId: number | null): ProductItem[] => {
  if (categoryId === null) return items
  
  return items.filter(item => {
    if (item.type === 'mono') {
      return item.categoryId === categoryId
    } else {
      return item.products.some(product => product.categoryId === categoryId)
    }
  })
}
