import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Package, Clock, CheckCircle, XCircle, MessageCircle, ChevronRight } from 'lucide-react';

interface Order {
  id: string;
  product_id: string;
  quantity: number;
  total_price: number;
  status: string;
  created_at: string;
  delivered_at: string | null;
  ticket_message: string | null;
  products: {
    name: string;
    image: string;
  } | null;
}

export default function Orders() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    const { data, error } = await (supabase as any)
      .from('orders')
      .select(`
        *,
        products (
          name,
          image
        )
      `)
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-green-500">Entregue</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <Package className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Meus Pedidos</h1>
          </div>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Você ainda não fez nenhum pedido</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link key={order.id} to={`/orders/${order.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(order.status)}
                          <div>
                            <CardTitle className="text-lg">
                              {order.products?.name || 'Produto'}
                            </CardTitle>
                            <CardDescription>
                              Pedido em {new Date(order.created_at).toLocaleDateString('pt-BR')}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(order.status)}
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-4">
                        {order.products?.image && (
                          <img
                            src={order.products.image}
                            alt={order.products.name}
                            className="h-20 w-20 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Quantidade</p>
                              <p className="font-medium">{order.quantity}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Total</p>
                              <p className="font-medium">R$ {order.total_price.toFixed(2)}</p>
                            </div>
                          </div>
                          
                          {order.delivered_at && (
                            <p className="text-sm text-muted-foreground mt-2">
                              Entregue em {new Date(order.delivered_at).toLocaleDateString('pt-BR')}
                            </p>
                          )}

                          <div className="mt-3 flex items-center gap-2 text-sm text-primary">
                            <MessageCircle className="h-4 w-4" />
                            <span>Clique para ver detalhes e chat</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
