export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  rating: number;
  reviews: number;
  stock: number;
  description: string;
  featured?: boolean;
  badge?: string;
  specs: string[];
  colorGradient: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  description: string;
  bgGradient: string;
}