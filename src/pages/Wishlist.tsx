import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/lib/store';

export default function Wishlist() {
  const items = useWishlist((state) => state.items);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 p-8">
            <Heart className="h-24 w-24 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold">Sua lista de desejos está vazia</h2>
            <p className="text-muted-foreground">Salve os itens que você ama para depois!</p>
            <Button asChild className="mt-4">
              <Link to="/shop">Começar a Comprar</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Minha Lista de Desejos</h1>
            <p className="text-muted-foreground">{items.length} {items.length === 1 ? 'item' : 'itens'}</p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
