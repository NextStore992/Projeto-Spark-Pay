-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
  ('site_name', 'Galaxy Store'),
  ('site_logo', ''),
  ('site_banner_1', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop'),
  ('site_banner_2', ''),
  ('site_banner_3', ''),
  ('hero_title', 'Descubra Seu Próximo Produto Favorito'),
  ('hero_description', 'Compre as últimas tendências e clássicos atemporais com preços imbatíveis e qualidade em que você pode confiar.'),
  ('featured_title', 'Produtos em Destaque'),
  ('featured_description', 'Seleção especial dos nossos itens mais populares'),
  ('delivery_time', 'Entrega em até 48 horas')
ON CONFLICT (key) DO NOTHING;

-- Add images column to products table for multiple images
ALTER TABLE products ADD COLUMN IF NOT EXISTS images text[] DEFAULT ARRAY[]::text[];