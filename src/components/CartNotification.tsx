import { ShoppingCart } from 'lucide-react';
import { Badge } from './ui/badge';
import { useCart } from '@/lib/store';
import { Link } from 'react-router-dom';

export default function CartNotification() {
  const itemCount = useCart((state) => state.itemCount);

  if (itemCount === 0) return null;

  return (
    <Link
      to="/cart"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-fade-in"
    >
      <ShoppingCart className="h-5 w-5" />
      <span className="font-medium">
        {itemCount} {itemCount === 1 ? 'item' : 'itens'}
      </span>
      <Badge className="bg-primary-foreground text-primary">
        Ver Carrinho
      </Badge>
    </Link>
  );
}
