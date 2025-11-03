import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Link2, Users, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { Separator } from './ui/separator';

interface AffiliateStatsProps {
  userId: string;
}

export default function AffiliateStats({ userId }: AffiliateStatsProps) {
  const [stats, setStats] = useState({
    totalCommissions: 0,
    totalSales: 0,
    clicks: 0,
    conversionRate: 0,
  });
  const [affiliateLink, setAffiliateLink] = useState('');

  useEffect(() => {
    generateAffiliateLink();
    fetchStats();
  }, [userId]);

  const generateAffiliateLink = () => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}?ref=${userId}`;
    setAffiliateLink(link);
  };

  const fetchStats = async () => {
    // TODO: Implement stats fetching from orders with affiliate reference
    // For now, showing placeholder data
    setStats({
      totalCommissions: 0,
      totalSales: 0,
      clicks: 0,
      conversionRate: 0,
    });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(affiliateLink);
    toast.success('Link copiado!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Comissões Totais
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats.totalCommissions.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              +0% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vendas Realizadas
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSales}</div>
            <p className="text-xs text-muted-foreground">
              Total de vendas realizadas
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cliques no Link
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clicks}</div>
            <p className="text-xs text-muted-foreground">
              Visitantes únicos
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Conversão
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.conversionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              De visitantes para vendas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Affiliate Link */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            <CardTitle>Seu Link de Afiliado</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Compartilhe este link para rastrear suas vendas e ganhar comissões. 
            Toda vez que alguém comprar através do seu link, você receberá uma comissão.
          </p>
          <div className="space-y-2">
            <Label>Link de Afiliado</Label>
            <div className="flex gap-2">
              <Input
                value={affiliateLink}
                readOnly
                className="font-mono text-sm"
              />
              <Button onClick={copyLink}>Copiar</Button>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-semibold">Como Funciona:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Compartilhe seu link nas redes sociais, blog ou site</li>
              <li>Quando alguém clicar no seu link, um cookie é salvo por 30 dias</li>
              <li>Se a pessoa comprar dentro desse período, você recebe comissão</li>
              <li>Acompanhe suas estatísticas em tempo real neste painel</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Recent Sales */}
      <Card>
        <CardHeader>
          <CardTitle>Vendas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Ainda não há vendas registradas</p>
            <p className="text-sm mt-2">
              Compartilhe seu link para começar a ganhar comissões!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
