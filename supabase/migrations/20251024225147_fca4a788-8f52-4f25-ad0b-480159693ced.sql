-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL CHECK (price >= 0),
  image TEXT,
  category TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  in_stock BOOLEAN DEFAULT true,
  rating NUMERIC CHECK (rating >= 0 AND rating <= 5),
  reviews INTEGER DEFAULT 0,
  discount INTEGER CHECK (discount >= 0 AND discount <= 100),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  image TEXT,
  count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Products policies - everyone can view
CREATE POLICY "Everyone can view products"
ON public.products
FOR SELECT
USING (true);

-- Only admins can manage products
CREATE POLICY "Admins can insert products"
ON public.products
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update products"
ON public.products
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete products"
ON public.products
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Categories policies - everyone can view
CREATE POLICY "Everyone can view categories"
ON public.categories
FOR SELECT
USING (true);

-- Only admins can manage categories
CREATE POLICY "Admins can insert categories"
ON public.categories
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update categories"
ON public.categories
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete categories"
ON public.categories
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for products updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Insert initial categories
INSERT INTO public.categories (name, slug, count) VALUES
  ('Eletrônicos', 'eletronicos', 0),
  ('Moda', 'moda', 0),
  ('Casa e Decoração', 'casa-decoracao', 0),
  ('Esportes', 'esportes', 0),
  ('Livros', 'livros', 0),
  ('Brinquedos', 'brinquedos', 0);

-- Update orders table to reference products
ALTER TABLE public.orders DROP COLUMN IF EXISTS product_id;
ALTER TABLE public.orders DROP COLUMN IF EXISTS product_name;
ALTER TABLE public.orders DROP COLUMN IF EXISTS product_price;

ALTER TABLE public.orders ADD COLUMN product_id UUID REFERENCES public.products(id) ON DELETE SET NULL;
ALTER TABLE public.orders ADD COLUMN quantity INTEGER NOT NULL DEFAULT 1;
ALTER TABLE public.orders ADD COLUMN total_price NUMERIC NOT NULL DEFAULT 0;