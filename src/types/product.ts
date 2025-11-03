export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  category: string;
  featured: boolean;
  in_stock: boolean;
  rating: number | null;
  reviews: number;
  discount: number | null;
  tags: string[] | null;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  count: number;
  created_at?: string;
}
