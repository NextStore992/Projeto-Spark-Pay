import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/lib/store';
import { toast } from 'sonner';

export default function Cart() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemove = (productId: string) => {
    removeItem(productId);
    toast.success('Item removido do carrinho');
  };


  const finalTotal = total;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 p-8">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold">Seu carrinho está vazio</h2>
            <p className="text-muted-foreground">Adicione alguns produtos para começar!</p>
            <Button asChild className="mt-4">
              <Link to="/shop">Continuar Comprando</Link>
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
          <h1 className="text-3xl font-bold mb-8">Carrinho de Compras</h1>
          
          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            {/* Cart Items */}
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-border bg-card">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <div>
                        <Link to={`/product/${item.id}`} className="font-semibold hover:text-primary transition-colors">
                          {item.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-lg font-bold">R$ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" onClick={clearCart} className="w-full">
                Limpar Carrinho
              </Button>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <h2 className="text-xl font-bold">Resumo do Pedido</h2>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>R$ {finalTotal.toFixed(2)}</span>
                </div>
                
                <Button className="w-full" size="lg" asChild>
                  <Link to="/checkout">Finalizar Compra</Link>
                </Button>
                
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/shop">Continuar Comprando</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
