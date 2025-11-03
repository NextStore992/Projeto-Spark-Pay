import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Shield, Users, Package, Settings as SettingsIcon, ShoppingBag, Mail, Filter, BarChart3 } from 'lucide-react';
import ProductsManager from '@/components/admin/ProductsManager';
import SettingsTab from '@/components/admin/SettingsTab';
import CategoriesManager from '@/components/admin/CategoriesManager';
import StatisticsTab from '@/components/admin/StatisticsTab';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface AffiliateApplication {
  id: string;
  user_id: string;
  status: string;
  reason: string | null;
  created_at: string;
  profiles: {
    email: string;
    full_name: string | null;
  };
}

interface Order {
  id: string;
  user_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  total_price: number;
  status: string;
  ticket_message: string | null;
  created_at: string;
  profiles: {
    email: string;
    full_name: string | null;
  };
}

export default function AdminPanel() {
  const { user, loading: authLoading, resendConfirmationEmail } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [applications, setApplications] = useState<AffiliateApplication[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [email, setEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [orderFilter, setOrderFilter] = useState<string>('all');

  useEffect(() => {
    if (user && isAdmin) {
      fetchApplications();
      fetchOrders();
    }
  }, [user, isAdmin]);

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from('affiliate_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
      toast.error('Erro ao carregar solicitações');
    } else if (data) {
      // Fetch user profiles separately
      const userIds = data.map(app => app.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .in('id', userIds);
      
      const applicationsWithProfiles = data.map(app => ({
        ...app,
        profiles: profiles?.find(p => p.id === app.user_id) || { email: '', full_name: null }
      }));
      
      setApplications(applicationsWithProfiles as any);
    }
    setLoadingData(false);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      toast.error('Erro ao carregar pedidos');
    } else if (data) {
      // Fetch user profiles separately
      const userIds = data.map(order => order.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .in('id', userIds);
      
      const ordersWithProfiles = data.map(order => ({
        ...order,
        profiles: profiles?.find(p => p.id === order.user_id) || { email: '', full_name: null }
      }));
      
      setOrders(ordersWithProfiles as any);
    }
  };

  const handleApplicationAction = async (applicationId: string, userId: string, action: 'approved' | 'rejected') => {
    // Update application status
    const { error: appError } = await supabase
      .from('affiliate_applications')
      .update({ status: action })
      .eq('id', applicationId);

    if (appError) {
      toast.error('Erro ao atualizar solicitação');
      return;
    }

    // If approved, add affiliate role
    if (action === 'approved') {
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: 'affiliate' });

      if (roleError) {
        toast.error('Erro ao adicionar role de afiliado');
        return;
      }
    }

    toast.success(action === 'approved' ? 'Afiliado aprovado!' : 'Solicitação rejeitada');
    fetchApplications();
  };

  const handleUpdateOrder = async (orderId: string, status: string, ticketMessage?: string) => {
    const updateData: any = { status };
    if (ticketMessage !== undefined) {
      updateData.ticket_message = ticketMessage;
    }
    if (status === 'delivered') {
      updateData.delivered_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId);

    if (error) {
      toast.error('Erro ao atualizar pedido');
      return;
    }

    toast.success('Pedido atualizado!');
    fetchOrders();
  };

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleResendEmail = async () => {
    if (!email) {
      toast.error('Por favor, digite seu e-mail');
      return;
    }

    setSendingEmail(true);
    const { error } = await resendConfirmationEmail(email);
    setSendingEmail(false);

    if (error) {
      toast.error('Erro ao enviar e-mail de confirmação');
    } else {
      toast.success('E-mail de confirmação enviado! Verifique sua caixa de entrada.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Autenticação Necessária</CardTitle>
            <CardDescription className="text-center">
              Você precisa estar autenticado para acessar o Painel Administrativo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Para fazer compras ou solicitar afiliação, você precisa fazer login.
            </p>
            
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link to="/auth">Ir para Login</Link>
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Ou reenviar confirmação
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  onClick={handleResendEmail}
                  variant="outline"
                  className="w-full gap-2"
                  disabled={sendingEmail}
                >
                  {sendingEmail ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                  Reenviar E-mail de Confirmação
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Acesso Negado</CardTitle>
            <CardDescription className="text-center">
              Você não possui permissões de administrador.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Esta área é restrita apenas para administradores.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/">Voltar para Início</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8 animate-fade-in">
            <Shield className="h-8 w-8 text-primary glow-pulse" />
            <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          </div>

          <Tabs defaultValue="statistics" className="space-y-4 animate-slide-up">
            <TabsList className="bg-card/50 backdrop-blur-sm border border-border">
              <TabsTrigger value="statistics" className="gap-2 transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <BarChart3 className="h-4 w-4" />
                Estatísticas
              </TabsTrigger>
              <TabsTrigger value="products" className="gap-2 transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <ShoppingBag className="h-4 w-4" />
                Produtos
              </TabsTrigger>
              <TabsTrigger value="categories" className="gap-2 transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Package className="h-4 w-4" />
                Categorias
              </TabsTrigger>
              <TabsTrigger value="applications" className="gap-2 transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Users className="h-4 w-4" />
                Solicitações de Afiliado
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2 transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Package className="h-4 w-4" />
                Pedidos
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2 transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <SettingsIcon className="h-4 w-4" />
                Configurações
              </TabsTrigger>
            </TabsList>

            <TabsContent value="statistics">
              <StatisticsTab />
            </TabsContent>

            <TabsContent value="products">
              <ProductsManager />
            </TabsContent>

            <TabsContent value="categories">
              <CategoriesManager />
            </TabsContent>

            <TabsContent value="applications" className="space-y-4">
              {loadingData ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : applications.length === 0 ? (
                <Card className="animate-fade-in">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    Nenhuma solicitação pendente
                  </CardContent>
                </Card>
              ) : (
                applications.map((app, index) => (
                  <Card key={app.id} className="animate-slide-up hover-scale hover:shadow-xl transition-all duration-300 hover-glow" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{app.profiles?.full_name || 'Sem nome'}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            {app.profiles?.email}
                          </CardDescription>
                        </div>
                        <Badge 
                          variant={
                            app.status === 'approved' ? 'default' :
                            app.status === 'rejected' ? 'destructive' : 'secondary'
                          }
                          className="animate-bounce-in"
                        >
                          {app.status === 'pending' ? 'Pendente' :
                           app.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                        </Badge>
                      </div>
                    </CardHeader>
                    {app.status === 'pending' && (
                      <CardContent className="flex gap-2">
                        <Button
                          onClick={() => handleApplicationAction(app.id, app.user_id, 'approved')}
                          className="flex-1 transition-all duration-300 hover:scale-105"
                        >
                          Aprovar
                        </Button>
                        <Button
                          onClick={() => handleApplicationAction(app.id, app.user_id, 'rejected')}
                          variant="destructive"
                          className="flex-1 transition-all duration-300 hover:scale-105"
                        >
                          Rejeitar
                        </Button>
                      </CardContent>
                    )}
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              <Card className="animate-fade-in border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-primary" />
                        Filtrar Pedidos
                      </CardTitle>
                      <CardDescription>Visualize pedidos por status</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={orderFilter} onValueChange={setOrderFilter}>
                        <SelectTrigger className="w-[180px] transition-all duration-300 hover:border-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="pending">Pendentes</SelectItem>
                          <SelectItem value="processing">Em Processamento</SelectItem>
                          <SelectItem value="delivered">Entregues</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {orders.filter(order => orderFilter === 'all' || order.status === orderFilter).length === 0 ? (
                <Card className="animate-fade-in">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    Nenhum pedido encontrado
                  </CardContent>
                </Card>
              ) : (
                orders.filter(order => orderFilter === 'all' || order.status === orderFilter).map((order, index) => (
                  <Link key={order.id} to={`/orders/${order.id}`}>
                    <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer hover-scale hover-glow animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">{order.product_name}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <Users className="h-3 w-3" />
                              {order.profiles?.full_name || 'Sem nome'} 
                            </CardDescription>
                            <CardDescription className="flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              {order.profiles?.email}
                            </CardDescription>
                            <p className="text-sm text-muted-foreground mt-2 font-semibold">
                              R$ {order.product_price.toFixed(2)} x {order.quantity} = <span className="text-primary">R$ {order.total_price.toFixed(2)}</span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(order.created_at).toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <Badge 
                            variant={
                              order.status === 'delivered' ? 'default' :
                              order.status === 'processing' ? 'secondary' :
                              order.status === 'cancelled' ? 'destructive' : 'outline'
                            }
                            className="animate-bounce-in"
                          >
                            {order.status === 'pending' ? 'Pendente' :
                             order.status === 'processing' ? 'Processando' :
                             order.status === 'delivered' ? 'Entregue' : 'Cancelado'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-primary flex items-center gap-2 font-medium">
                          <Package className="h-4 w-4" />
                          <span>Clique para ver detalhes e chat</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <SettingsTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
