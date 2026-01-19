export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  sku?: string;
  stock: number;
  sizes: string[];
  colors: string[];
  category_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductWithRating extends Product {
  avg_rating: number;
  reviews_count: number;
  image?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt?: string;
  position: number;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id?: string;
  name: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selected_size?: string;
  selected_color?: string;
}

export interface Order {
  id: string;
  user_id?: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  phone?: string;
  customer_name?: string;
  customer_email?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_name: string;
  quantity: number;
  price: number;
  selected_size?: string;
  selected_color?: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'customer';
  created_at: string;
}

export interface Settings {
  id: string;
  value: {
    number?: string;
  };
}
