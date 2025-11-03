-- Add missing columns to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS product_name TEXT,
ADD COLUMN IF NOT EXISTS product_price NUMERIC;

-- Update existing orders with product info from products table
UPDATE public.orders o
SET 
  product_name = p.name,
  product_price = p.price
FROM public.products p
WHERE o.product_id = p.id
AND o.product_name IS NULL;