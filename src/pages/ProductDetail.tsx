import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart, useWishlist } from '@/lib/store';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { toast } from 'sonner';
import ProductCard from '@/components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id);
  const { data: allProducts = [] } = useProducts();
  const addToCart = useCart((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 p-8">
            <p className="text-muted-foreground">Carregando produto...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 p-8">
            <h2 className="text-2xl font-bold">Produto não encontrado</h2>
            <Button asChild>
              <Link to="/shop">Voltar para a Loja</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const relatedProducts = allProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    if (!product.in_stock) {
      toast.error('Produto fora de estoque');
      return;
    }
    addToCart(product);
    toast.success('Adicionado ao carrinho!');
  };

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success('Removido da lista de desejos');
    } else {
      addToWishlist(product);
      toast.success('Adicionado à lista de desejos!');
    }
  };

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Início</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-foreground transition-colors">Loja</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          {/* Product Info */}
          <div className="grid gap-8 lg:grid-cols-2 mb-16">
            {/* Image */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-muted">
                <img
                  src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{product.category}</Badge>
                  {product.featured && <Badge>Destaque</Badge>}
                  {product.discount && <Badge variant="destructive">-{product.discount}%</Badge>}
                </div>
                <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                
                {product.rating && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating!)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} {product.reviews && product.reviews > 0 ? `(${product.reviews} avaliações)` : ''}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold">R$ {discountedPrice.toFixed(2)}</span>
                {product.discount && (
                  <span className="text-2xl text-muted-foreground line-through">
                    R$ {product.price.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed">{product.description}</p>

              <Separator />

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={() => {
                      if (!product.in_stock) {
                        toast.error('Produto fora de estoque');
                        return;
                      }
                      addToCart(product);
                      window.location.href = '/checkout';
                    }}
                    disabled={!product.in_stock}
                  >
                    Comprar Agora
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleWishlist}
                  >
                    <Heart className={`h-5 w-5 ${inWishlist ? 'fill-current text-destructive' : ''}`} />
                  </Button>
                </div>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleAddToCart}
                  disabled={!product.in_stock}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {product.in_stock ? 'Adicionar ao Carrinho' : 'Fora de Estoque'}
                </Button>
              </div>

              {/* Features */}
              <div className="space-y-3 pt-6 border-t border-border">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="h-5 w-5 text-primary" />
                  <span>Entrega em até 48 horas</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <RotateCcw className="h-5 w-5 text-primary" />
                  <span>Garantia e suporte via chat</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Pagamento seguro garantido</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Produtos Relacionados</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
