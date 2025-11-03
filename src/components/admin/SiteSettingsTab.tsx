import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Save, Image as ImageIcon } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useQueryClient } from '@tanstack/react-query';

export default function SiteSettingsTab() {
  const { data: settings, isLoading } = useSiteSettings();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    site_name: '',
    site_logo: '',
    site_banner_1: '',
    site_banner_2: '',
    site_banner_3: '',
    hero_title: '',
    hero_description: '',
    featured_title: '',
    featured_description: '',
    delivery_time: '',
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(formData).map(([key, value]) => ({
        key,
        value,
      }));

      for (const update of updates) {
        const { error } = await (supabase as any)
          .from('site_settings')
          .update({ value: update.value })
          .eq('key', update.key);

        if (error) throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Save className="h-5 w-5 text-primary glow-pulse" />
          Configurações do Site
        </h3>
        <p className="text-sm text-muted-foreground">
          Gerencie as informações básicas e conteúdo da página inicial. As alterações são atualizadas em tempo real para todos os usuários!
        </p>
      </div>

      <Separator className="animate-fade-in" />

      <Card className="animate-slide-up hover-scale border-primary/20 bg-gradient-to-br from-primary/5 to-transparent" style={{ animationDelay: '0.1s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="h-5 w-5 text-primary" />
            Informações Básicas
          </CardTitle>
          <CardDescription>Nome e logo do site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site_name">Nome do Site</Label>
            <Input
              id="site_name"
              value={formData.site_name}
              onChange={(e) => handleChange('site_name', e.target.value)}
              placeholder="Galaxy Store"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site_logo">URL do Logo</Label>
            <Input
              id="site_logo"
              value={formData.site_logo}
              onChange={(e) => handleChange('site_logo', e.target.value)}
              placeholder="https://..."
            />
            <p className="text-xs text-muted-foreground">
              Deixe vazio para usar o logo padrão
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="animate-slide-up hover-scale border-primary/20" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            Banners da Home (Carrossel)
          </CardTitle>
          <CardDescription>
            Configure até 3 imagens para o carrossel automático. As mudanças aparecem em tempo real! 🎬
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site_banner_1">Banner 1 (Principal)</Label>
            <Input
              id="site_banner_1"
              value={formData.site_banner_1}
              onChange={(e) => handleChange('site_banner_1', e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site_banner_2">Banner 2 (Opcional)</Label>
            <Input
              id="site_banner_2"
              value={formData.site_banner_2}
              onChange={(e) => handleChange('site_banner_2', e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site_banner_3">Banner 3 (Opcional)</Label>
            <Input
              id="site_banner_3"
              value={formData.site_banner_3}
              onChange={(e) => handleChange('site_banner_3', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </CardContent>
      </Card>

      <Card className="animate-slide-up hover-scale border-primary/20" style={{ animationDelay: '0.3s' }}>
        <CardHeader>
          <CardTitle>Seção Hero</CardTitle>
          <CardDescription>Conteúdo principal da página inicial</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hero_title">Título Principal</Label>
            <Input
              id="hero_title"
              value={formData.hero_title}
              onChange={(e) => handleChange('hero_title', e.target.value)}
              placeholder="Descubra Seu Próximo Produto Favorito"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero_description">Descrição</Label>
            <Textarea
              id="hero_description"
              value={formData.hero_description}
              onChange={(e) => handleChange('hero_description', e.target.value)}
              placeholder="Compre as últimas tendências..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="animate-slide-up hover-scale border-primary/20" style={{ animationDelay: '0.4s' }}>
        <CardHeader>
          <CardTitle>Produtos em Destaque</CardTitle>
          <CardDescription>Textos da seção de produtos em destaque</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="featured_title">Título</Label>
            <Input
              id="featured_title"
              value={formData.featured_title}
              onChange={(e) => handleChange('featured_title', e.target.value)}
              placeholder="Produtos em Destaque"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="featured_description">Descrição</Label>
            <Textarea
              id="featured_description"
              value={formData.featured_description}
              onChange={(e) => handleChange('featured_description', e.target.value)}
              placeholder="Seleção especial dos nossos itens mais populares"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="animate-slide-up hover-scale border-primary/20" style={{ animationDelay: '0.5s' }}>
        <CardHeader>
          <CardTitle>Entrega</CardTitle>
          <CardDescription>Tempo de entrega dos produtos digitais</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="delivery_time">Tempo de Entrega</Label>
            <Input
              id="delivery_time"
              value={formData.delivery_time}
              onChange={(e) => handleChange('delivery_time', e.target.value)}
              placeholder="Entrega em até 48 horas"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <Button 
          onClick={handleSave} 
          disabled={saving} 
          size="lg"
          className="transition-all duration-300 hover:scale-105 hover-glow"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando e Atualizando em Tempo Real...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Configurações
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
