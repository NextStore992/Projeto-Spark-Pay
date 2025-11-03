import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Clock, HeadphonesIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';

export default function Home() {
  const { data: products = [], isLoading } = useProducts();
  const { data: settings } = useSiteSettings();
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );
  
  const banners = [
    settings?.site_banner_1,
    settings?.site_banner_2,
    settings?.site_banner_3,
  ].filter(Boolean);
  
  const hasCarousel = banners.length > 1;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden gradient-hero py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="space-y-6 animate-fade-in">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary glow-pulse">
                  <Sparkles className="mr-2 h-4 w-4 float" />
                  Novidades Disponíveis Agora
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
                  {settings?.hero_title || 'Descubra Seu Próximo Produto Favorito'}
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg text-balance">
                  {settings?.hero_description || 'Compre as últimas tendências e clássicos atemporais com preços imbatíveis e qualidade em que você pode confiar.'}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="group" asChild>
                    <Link to="/shop">
                      Comprar Agora
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/deals">Ver Ofertas</Link>
                  </Button>
                </div>
              </div>
              <div className="relative lg:h-[500px] animate-fade-in">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl z-10" />
                {hasCarousel ? (
                  <Carousel 
                    className="w-full h-full"
                    opts={{ loop: true }}
                    plugins={[plugin.current]}
                  >
                    <CarouselContent>
                      {banners.map((banner, index) => (
                        <CarouselItem key={index}>
                          <img
                            src={banner}
                            alt={`Banner ${index + 1}`}
                            className="rounded-3xl object-cover w-full h-full shadow-2xl"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </Carousel>
                ) : banners.length > 0 ? (
                  <img
                    src={banners[0]}
                    alt="Hero Banner"
                    className="rounded-3xl object-cover w-full h-full shadow-2xl"
                  />
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop"
                    alt="Hero Banner"
                    className="rounded-3xl object-cover w-full h-full shadow-2xl"
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 border-y border-border bg-card">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Clock,
                  title: 'Entrega Rápida',
                  description: settings?.delivery_time || 'Entrega em até 48 horas',
                },
                {
                  icon: Shield,
                  title: 'Pagamento Seguro',
                  description: '100% de transações seguras',
                },
                {
                  icon: HeadphonesIcon,
                  title: 'Suporte 24/7',
                  description: 'Equipe de suporte dedicada',
                },
                {
                  icon: ArrowRight,
                  title: 'Devoluções Fáceis',
                  description: 'Política de devolução de 30 dias',
                },
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 hover-scale group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:rotate-12">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {settings?.featured_title || 'Produtos em Destaque'}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {settings?.featured_description || 'Seleção especial dos nossos itens mais populares'}
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {isLoading ? (
                <p className="col-span-full text-center text-muted-foreground">Carregando produtos...</p>
              ) : featuredProducts.length === 0 ? (
                <p className="col-span-full text-center text-muted-foreground">Nenhum produto em destaque no momento.</p>
              ) : (
                featuredProducts.map((product, index) => (
                  <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <ProductCard product={product} />
                  </div>
                ))
              )}
            </div>
            <div className="mt-12 text-center">
              <Button size="lg" variant="outline" asChild>
                <Link to="/shop">
                  Ver Todos os Produtos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 gradient-hero">
          <div className="container mx-auto px-4">
            <div className="rounded-3xl bg-card/50 backdrop-blur-sm border border-border p-8 lg:p-16 text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Assine Nossa Newsletter
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Receba ofertas exclusivas, novidades e promoções especiais diretamente no seu e-mail.
              </p>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const email = (e.target as HTMLFormElement).email.value;
                  if (email) {
                    // Here you would typically send this to your backend
                    console.log('Newsletter subscription:', email);
                    alert('Obrigado por se inscrever!');
                    (e.target as HTMLFormElement).reset();
                  }
                }}
                className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              >
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Digite seu e-mail"
                  className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Button type="submit" size="lg" className="sm:w-auto w-full">
                  Inscrever-se
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
