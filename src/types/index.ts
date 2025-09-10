// Types for the application

export interface Product {
  id: number;
  name: string;
  colors: string[];
  imagePath: string | null;
  categoryId: number;
  createdAt?: string;
}

export interface Category {
  id: number;
  title: string;
  header: string;
  products?: Product[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

// Types for product processing
export interface ProductItem {
  id: number;
  name: string;
  colors: string[];
  imagePath: string | null;
  categoryId: number;
  createdAt?: string;
}

export interface ProductGroup {
  name: string;
  imagePath: string | null;
  products: ProductItem[];
  isMultiProduct: boolean;
}

export interface MonoProduct extends ProductItem {
  type: 'mono';
}

export interface MultiProduct {
  type: 'multi';
  name: string;
  imagePath: string | null;
  products: ProductItem[];
}
