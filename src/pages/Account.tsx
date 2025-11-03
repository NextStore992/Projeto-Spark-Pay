import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { User, Package, Heart, Settings, LogOut, Loader2, Mail } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart, useWishlist } from '@/lib/store';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Profile {
  full_name: string;
  avatar_url: string | null;
  email: string;
}

export default function Account() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { items: cartItems, total } = useCart();
  const wishlistItems = useWishlist((state) => state.items);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .maybeSingle();

    if (!error && data) {
      setProfile(data);
      setFullName(data.full_name || '');
    }
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user.id);

    if (error) {
      toast.error('Erro ao salvar perfil');
    } else {
      toast.success('Perfil atualizado com sucesso!');
      fetchProfile();
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('Logout realizado com sucesso');
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
            {/* Sidebar */}
            <aside className="space-y-4">
              <Card>
                <CardHeader className="text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} />
                    <AvatarFallback>{getInitials(profile?.full_name || 'Usuario')}</AvatarFallback>
                  </Avatar>
                  <CardTitle>{profile?.full_name || 'Usuário'}</CardTitle>
                  <CardDescription>{profile?.email || user.email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/orders">
                      <Package className="mr-2 h-4 w-4" />
                      Pedidos
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/wishlist">
                      <Heart className="mr-2 h-4 w-4" />
                      Lista de Desejos ({wishlistItems.length})
                    </Link>
                  </Button>
                  <Separator />
                  <Button 
                    variant="ghost" 
                    className="w-full text-destructive hover:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </Button>
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Meu Perfil</h1>
                <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
              </div>

              {/* Profile Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>Atualize seus dados pessoais</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome Completo</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Digite seu nome completo"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex gap-2">
                      <Mail className="h-5 w-5 text-muted-foreground mt-2" />
                      <Input
                        id="email"
                        value={profile?.email || user.email || ''}
                        disabled
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      O email não pode ser alterado
                    </p>
                  </div>

                  <Button onClick={handleSaveProfile} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      'Salvar Alterações'
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Stats */}
              <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardDescription>Carrinho</CardDescription>
                    <CardTitle className="text-2xl">{cartItems.length} itens</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Total: R$ {total.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardDescription>Lista de Desejos</CardDescription>
                    <CardTitle className="text-2xl">{wishlistItems.length} itens</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardDescription>Pedidos</CardDescription>
                    <CardTitle className="text-2xl">Ver Pedidos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link to="/orders">
                        <Package className="mr-2 h-4 w-4" />
                        Meus Pedidos
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
