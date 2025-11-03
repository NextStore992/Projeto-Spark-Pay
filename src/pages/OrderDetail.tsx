import { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OrderChat from '@/components/OrderChat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Package, ArrowLeft, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Order {
  id: string;
  product_id: string;
  product_name: string;
  product_price: number;
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

export default function OrderDetail() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user && id && !roleLoading) {
      fetchOrder();
    }
  }, [user, id, isAdmin, roleLoading]);

  const fetchOrder = async () => {
    const { data, error } = await (supabase as any)
      .from('orders')
      .select(`
        *,
        products (
          name,
          image
        )
      `)
      .eq('id', id)
      .single();

    if (!error && data) {
      // Check if user owns this order or is admin
      if (data.user_id === user?.id || isAdmin) {
        setOrder(data);
      }
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!order) return;
    
    setUpdating(true);
    const updateData: any = { status: newStatus };
    if (newStatus === 'delivered') {
      updateData.delivered_at = new Date().toISOString();
    }

    const { error } = await (supabase as any)
      .from('orders')
      .update(updateData)
      .eq('id', order.id);

    if (error) {
      toast.error('Erro ao atualizar status');
    } else {
      toast.success('Status atualizado!');
      fetchOrder();
    }
    setUpdating(false);
  };

  if (authLoading || loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 p-8">
            <p className="text-muted-foreground">Pedido não encontrado ou acesso negado</p>
            <Button asChild>
              <Link to="/orders">Voltar para Pedidos</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
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
      case 'processing':
        return <Badge variant="secondary">Processando</Badge>;
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
        <div className="container mx-auto px-4 max-w-6xl">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Pedidos
            </Link>
          </Button>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Order Details */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <CardTitle>Detalhes do Pedido</CardTitle>
                        <CardDescription>
                          Pedido #{order.id.slice(0, 8)}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.products?.image && (
                    <img
                      src={order.products.image}
                      alt={order.product_name || order.products.name}
                      className="w-full h-48 rounded-lg object-cover"
                    />
                  )}
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Produto</p>
                      <p className="font-medium">{order.product_name || order.products?.name}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Quantidade</p>
                        <p className="font-medium">{order.quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Preço Unitário</p>
                        <p className="font-medium">R$ {order.product_price.toFixed(2)}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-lg font-bold">R$ {order.total_price.toFixed(2)}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Data do Pedido</p>
                      <p className="font-medium">
                        {new Date(order.created_at).toLocaleString('pt-BR')}
                      </p>
                    </div>

                    {order.delivered_at && (
                      <div>
                        <p className="text-sm text-muted-foreground">Data de Entrega</p>
                        <p className="font-medium">
                          {new Date(order.delivered_at).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    )}
                  </div>

                  {isAdmin && order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium mb-2">Atualizar Status</p>
                      <div className="flex gap-2">
                        <Select
                          defaultValue={order.status}
                          onValueChange={handleStatusUpdate}
                          disabled={updating}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pendente</SelectItem>
                            <SelectItem value="processing">Processando</SelectItem>
                            <SelectItem value="delivered">Entregue</SelectItem>
                            <SelectItem value="cancelled">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Chat */}
            <div>
              <OrderChat 
                orderId={order.id} 
                productName={order.product_name || order.products?.name || 'Pedido'}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
