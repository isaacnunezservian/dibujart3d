// Tipos para la aplicación

export interface Product {
  id: number
  name: string
  colors: string[]
  imagePath?: string
  categoryId: number
  createdAt: string
  category?: Category
}

export interface Category {
  id: number
  title: string
  header: string
  products?: Product[]
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  count?: number
  message?: string
}

export interface AuthContextType {
  isAuthenticated: boolean
  login: (password: string) => Promise<boolean>
  logout: () => void
}

// Nuevos tipos para el paradigma Mono/Multi producto
export interface MonoProduct extends Product {
  type: 'mono'
  displayImage: string
  displayName: string
}

export interface MultiProduct {
  type: 'multi'
  id: string // Generado basado en imagen compartida
  displayName: string
  displayImage: string
  products: Product[] // Productos individuales que comparten imagen/nombre
}

export type ProductItem = MonoProduct | MultiProduct

// Utilidad para determinar si productos forman un multiproducto
export interface ProductGroup {
  sharedImage: string
  sharedNameBase: string
  products: Product[]
}
