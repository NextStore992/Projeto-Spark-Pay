import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, TrendingUp } from 'lucide-react';
import AffiliateStats from '@/components/AffiliateStats';

export default function AffiliatePanel() {
  const { user, loading: authLoading } = useAuth();
  const { isAffiliate, loading: roleLoading } = useUserRole();
  const [application, setApplication] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user) {
      fetchApplication();
    }
  }, [user]);

  const fetchApplication = async () => {
    const { data, error } = await supabase
      .from('affiliate_applications')
      .select('*')
      .eq('user_id', user?.id)
      .maybeSingle();

    if (!error) {
      setApplication(data);
    }
    setLoadingData(false);
  };

  const handleApply = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('affiliate_applications')
      .insert({
        user_id: user.id,
        status: 'pending',
      });

    if (error) {
      if (error.code === '23505') {
        toast.error('Você já possui uma solicitação em andamento');
      } else {
        toast.error('Erro ao enviar solicitação');
      }
    } else {
      toast.success('Solicitação enviada! Aguarde aprovação do administrador.');
      fetchApplication();
    }
  };

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Painel de Afiliado</h1>
          </div>

          {loadingData ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : !application ? (
            <Card>
              <CardHeader>
                <CardTitle>Torne-se um Afiliado</CardTitle>
                <CardDescription>
                  Ganhe comissões promovendo nossos produtos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Envie uma solicitação para se tornar um afiliado e começar a ganhar comissões
                  promovendo nossos produtos para sua audiência.
                </p>
                <Button onClick={handleApply}>Solicitar Acesso de Afiliado</Button>
              </CardContent>
            </Card>
          ) : application.status === 'pending' ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Solicitação Pendente</CardTitle>
                    <CardDescription>
                      Aguardando aprovação do administrador
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">Pendente</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sua solicitação está sendo analisada. Você receberá uma notificação quando for aprovada.
                </p>
              </CardContent>
            </Card>
          ) : application.status === 'rejected' ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Solicitação Rejeitada</CardTitle>
                    <CardDescription>
                      Sua solicitação não foi aprovada
                    </CardDescription>
                  </div>
                  <Badge variant="destructive">Rejeitada</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Entre em contato com o suporte para mais informações.
                </p>
              </CardContent>
            </Card>
          ) : (
            <AffiliateStats userId={user.id} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
