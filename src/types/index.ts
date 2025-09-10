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
  id: number | string;
  name: string;
  displayName?: string;
  displayImage?: string;
  colors: string[];
  imagePath: string | null;
  categoryId: number;
  createdAt?: string;
  type?: 'mono' | 'multi';
  products?: ProductItem[];
}

export interface ProductGroup {
  name: string;
  imagePath: string | null;
  products: ProductItem[];
  isMultiProduct: boolean;
  sharedImage?: string;
  sharedNameBase?: string;
}

export interface MonoProduct extends ProductItem {
  type: 'mono';
  displayName: string;
  displayImage: string;
}

export interface MultiProduct {
  type: 'multi';
  id: string;
  name: string;
  displayName: string;
  displayImage: string;
  imagePath: string | null;
  products: ProductItem[];
}
