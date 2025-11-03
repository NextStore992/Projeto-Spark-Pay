import { Tag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/products-data';

export default function Deals() {
  const dealsProducts = products.filter((p) => p.discount && p.discount > 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <Tag className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Ofertas Especiais</h1>
                <p className="text-muted-foreground">Não perca nossos descontos incríveis!</p>
              </div>
            </div>
          </div>
          
          {dealsProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {dealsProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Nenhuma oferta disponível no momento. Volte em breve!</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
