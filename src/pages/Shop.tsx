import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, SlidersHorizontal } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';

export default function Shop() {
  const [searchParams] = useSearchParams();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    
    if (search) {
      setSearchQuery(search);
    }
    if (category) {
      setSelectedCategories([category]);
    }
  }, [searchParams]);

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold">Categorias</h3>
        {categories.map((category) => (
          <div key={category.id} className="flex items-center space-x-2">
            <Checkbox
              id={category.slug}
              checked={selectedCategories.includes(category.slug)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedCategories([...selectedCategories, category.slug]);
                } else {
                  setSelectedCategories(selectedCategories.filter((c) => c !== category.slug));
                }
              }}
            />
            <Label htmlFor={category.slug} className="text-sm cursor-pointer">
              {category.name} ({category.count})
            </Label>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Faixa de Preço</h3>
        <div className="space-y-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={500}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>R$ {priceRange[0]}</span>
            <span>R$ {priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setSelectedCategories([]);
          setPriceRange([0, 500]);
        }}
      >
        Limpar Filtros
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Compre Todos os Produtos</h1>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar produtos..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Destaque</SelectItem>
                    <SelectItem value="price-asc">Preço: Menor para Maior</SelectItem>
                    <SelectItem value="price-desc">Preço: Maior para Menor</SelectItem>
                    <SelectItem value="name">Nome</SelectItem>
                    <SelectItem value="rating">Avaliação</SelectItem>
                  </SelectContent>
                </Select>

                <Sheet>
                  <SheetTrigger asChild className="lg:hidden">
                    <Button variant="outline" size="icon">
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <h2 className="text-lg font-semibold mb-6">Filtros</h2>
                    <FilterContent />
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            {/* Filters Sidebar - Desktop */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6 rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">Filters</h2>
                </div>
                <FilterContent />
              </div>
            </aside>

            {/* Products Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Mostrando {filteredProducts.length} {filteredProducts.length === 1 ? 'produto' : 'produtos'}
                </p>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {productsLoading ? (
                  <p className="col-span-full text-center text-muted-foreground py-12">Carregando produtos...</p>
                ) : filteredProducts.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-lg text-muted-foreground">Nenhum produto encontrado.</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategories([]);
                        setPriceRange([0, 500]);
                      }}
                    >
                      Limpar Filtros
                    </Button>
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                )}
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
