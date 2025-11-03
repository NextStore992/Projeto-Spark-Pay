import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/useCategories';

export default function Categories() {
  const { data: categories = [], isLoading } = useCategories();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Comprar por Categoria</h1>
            <p className="text-muted-foreground">Navegue pela nossa ampla variedade de categorias de produtos</p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <p className="col-span-full text-center text-muted-foreground">Carregando categorias...</p>
            ) : categories.length === 0 ? (
              <p className="col-span-full text-center text-muted-foreground">Nenhuma categoria disponível.</p>
            ) : (
              categories.map((category) => (
              <Link key={category.id} to={`/shop?category=${category.slug}`}>
                <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-8 transition-all hover:shadow-lg hover-lift">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Package className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.count} produtos</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="mt-4 w-full">
                    Navegar {category.name}
                  </Button>
                </div>
              </Link>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
