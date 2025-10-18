-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user profiles table (synced with auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Create trigger to sync auth.users with public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Public can read categories
CREATE POLICY "Categories are publicly readable"
  ON public.categories FOR SELECT
  USING (true);

-- Only admins can modify categories
CREATE POLICY "Only admins can insert categories"
  ON public.categories FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can update categories"
  ON public.categories FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can delete categories"
  ON public.categories FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  sku TEXT UNIQUE,
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public can read products
CREATE POLICY "Products are publicly readable"
  ON public.products FOR SELECT
  USING (true);

-- Only admins can modify products
CREATE POLICY "Only admins can insert products"
  ON public.products FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can update products"
  ON public.products FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can delete products"
  ON public.products FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Product images table
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Public can read product images
CREATE POLICY "Product images are publicly readable"
  ON public.product_images FOR SELECT
  USING (true);

-- Only admins can modify product images
CREATE POLICY "Only admins can insert product images"
  ON public.product_images FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can update product images"
  ON public.product_images FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can delete product images"
  ON public.product_images FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public can read reviews
CREATE POLICY "Reviews are publicly readable"
  ON public.reviews FOR SELECT
  USING (true);

-- Authenticated users can insert reviews with their user_id
CREATE POLICY "Authenticated users can create reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

-- Guests can insert reviews without user_id but must provide name
CREATE POLICY "Guests can create reviews with name"
  ON public.reviews FOR INSERT
  WITH CHECK (user_id IS NULL AND name IS NOT NULL);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can delete any review
CREATE POLICY "Admins can delete reviews"
  ON public.reviews FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
  ON public.reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address JSONB,
  phone TEXT,
  customer_name TEXT,
  customer_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Authenticated users can create orders
CREATE POLICY "Authenticated users can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Guest users can create orders (user_id will be null)
CREATE POLICY "Guests can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (user_id IS NULL AND customer_name IS NOT NULL AND customer_email IS NOT NULL);

-- Only admins can update orders
CREATE POLICY "Only admins can update orders"
  ON public.orders FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  selected_size TEXT,
  selected_color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Users can view order items for their own orders
CREATE POLICY "Users can view own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Admins can view all order items
CREATE POLICY "Admins can view all order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Authenticated users can insert order items for their own orders
CREATE POLICY "Users can insert own order items"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Guests can insert order items for guest orders
CREATE POLICY "Guests can insert order items"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id IS NULL
    )
  );

-- Settings table
CREATE TABLE public.settings (
  id TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Public can read settings
CREATE POLICY "Settings are publicly readable"
  ON public.settings FOR SELECT
  USING (true);

-- Only admins can modify settings
CREATE POLICY "Only admins can modify settings"
  ON public.settings FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Insert default WhatsApp number setting
INSERT INTO public.settings (id, value) VALUES ('whatsapp_number', '{"number": "+1234567890"}');

-- Create view for products with average rating
CREATE VIEW product_with_avg_rating AS
SELECT
  p.*,
  COALESCE(AVG(r.rating), 0) AS avg_rating,
  COUNT(r.id) AS reviews_count
FROM public.products p
LEFT JOIN public.reviews r ON p.id = r.product_id
GROUP BY p.id;

-- Create indexes for performance
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);

-- Trigger to update updated_at on products
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample categories
INSERT INTO public.categories (name, slug, description) VALUES
  ('Scrub Tops', 'scrub-tops', 'Comfortable and stylish scrub tops for medical professionals'),
  ('Scrub Pants', 'scrub-pants', 'Durable scrub pants with multiple pockets'),
  ('Lab Coats', 'lab-coats', 'Professional lab coats for healthcare workers'),
  ('Scrub Sets', 'scrub-sets', 'Complete scrub sets for convenience');

-- Insert sample products
INSERT INTO public.products (name, slug, description, price, sku, stock, sizes, colors, category_id)
SELECT
  'Classic V-Neck Scrub Top',
  'classic-v-neck-scrub-top',
  'Breathable and comfortable V-neck scrub top with side vents for ease of movement. Perfect for long shifts.',
  29.99,
  'TOP-001',
  50,
  ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  ARRAY['Navy', 'Royal Blue', 'Ceil Blue', 'Black', 'White'],
  c.id
FROM public.categories c WHERE c.slug = 'scrub-tops'
UNION ALL
SELECT
  'Modern Fit Scrub Pants',
  'modern-fit-scrub-pants',
  'Slim fit scrub pants with cargo pockets and elastic waistband. Moisture-wicking fabric keeps you comfortable.',
  34.99,
  'PANTS-001',
  45,
  ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  ARRAY['Navy', 'Black', 'Ceil Blue', 'Charcoal'],
  c.id
FROM public.categories c WHERE c.slug = 'scrub-pants'
UNION ALL
SELECT
  'Professional Lab Coat',
  'professional-lab-coat',
  'Premium lab coat with five pockets and tablet sleeve. Wrinkle-resistant fabric for a polished look.',
  49.99,
  'LAB-001',
  30,
  ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  ARRAY['White', 'Navy'],
  c.id
FROM public.categories c WHERE c.slug = 'lab-coats'
UNION ALL
SELECT
  'Stretch Scrub Top',
  'stretch-scrub-top',
  'Four-way stretch scrub top with moisture wicking technology. Features three pockets for your essentials.',
  32.99,
  'TOP-002',
  40,
  ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  ARRAY['Teal', 'Wine', 'Black', 'Caribbean Blue'],
  c.id
FROM public.categories c WHERE c.slug = 'scrub-tops'
UNION ALL
SELECT
  'Athletic Jogger Scrub Pants',
  'athletic-jogger-scrub-pants',
  'Modern jogger-style scrub pants with cuffed ankles and drawstring waist. Perfect blend of style and comfort.',
  39.99,
  'PANTS-002',
  35,
  ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  ARRAY['Black', 'Navy', 'Pewter', 'Hunter Green'],
  c.id
FROM public.categories c WHERE c.slug = 'scrub-pants'
UNION ALL
SELECT
  'Complete Scrub Set - Unisex',
  'complete-scrub-set-unisex',
  'Matching scrub top and pants set. Save when you buy together! Comfortable, durable, and professional.',
  59.99,
  'SET-001',
  25,
  ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  ARRAY['Navy', 'Ceil Blue', 'Black', 'Wine'],
  c.id
FROM public.categories c WHERE c.slug = 'scrub-sets';