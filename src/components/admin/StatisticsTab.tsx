import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, Users, Package, DollarSign, ShoppingCart, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface Statistics {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  affiliateApplications: number;
  recentOrders: any[];
}

export default function StatisticsTab() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      // Fetch orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*');

      // Fetch products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*');

      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      // Fetch affiliate applications
      const { data: applications, error: applicationsError } = await supabase
        .from('affiliate_applications')
        .select('*')
        .eq('status', 'pending');

      // Fetch recent orders with products
      const { data: recentOrders, error: recentError } = await supabase
        .from('orders')
        .select(`
          *,
          products (
            name,
            image
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!ordersError && !productsError && !profilesError) {
        const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_price), 0) || 0;
        const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;
        const deliveredOrders = orders?.filter(o => o.status === 'delivered').length || 0;
        const cancelledOrders = orders?.filter(o => o.status === 'cancelled').length || 0;

        setStats({
          totalOrders: orders?.length || 0,
          totalRevenue,
          totalProducts: products?.length || 0,
          totalUsers: profiles?.length || 0,
          pendingOrders,
          deliveredOrders,
          cancelledOrders,
          affiliateApplications: applications?.length || 0,
          recentOrders: recentOrders || [],
        });
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return <div>Erro ao carregar estatísticas</div>;
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              De {stats.totalOrders} pedidos
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingOrders} pendentes
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Produtos cadastrados
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Usuários registrados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Entregues</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.deliveredOrders}</div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Cancelados</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.cancelledOrders}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recentes</CardTitle>
          <CardDescription>Últimos 5 pedidos realizados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                {order.products?.image && (
                  <img
                    src={order.products.image}
                    alt={order.products.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{order.products?.name || order.product_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">R$ {order.total_price.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Affiliate Applications Card */}
      {stats.affiliateApplications > 0 && (
        <Card className="border-primary/50 hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Solicitações de Afiliado Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.affiliateApplications}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Novas solicitações aguardando aprovação
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
