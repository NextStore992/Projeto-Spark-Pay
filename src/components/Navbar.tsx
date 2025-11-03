import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Search, Menu, User, LogOut, Settings, Package, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useCart, useWishlist } from '@/lib/store';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const { data: settings } = useSiteSettings();
  const itemCount = useCart((state) => state.itemCount);
  const wishlistItems = useWishlist((state) => state.items);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin, isAffiliate } = useUserRole();

  const handleLogout = async () => {
    await signOut();
    toast.success('Logout realizado com sucesso');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const navigation = [
    { name: 'Início', href: '/' },
    { name: 'Loja', href: '/shop' },
    { name: 'Categorias', href: '/categories' },
    { name: 'Ofertas', href: '/deals' },
    { name: 'Solicitar Afiliação', href: '/affiliate' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            {settings?.site_logo ? (
              <img src={settings.site_logo} alt="Logo" className="h-10 w-auto" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow">
                <span className="text-xl font-bold text-primary-foreground">
                  {settings?.site_name?.[0] || 'G'}
                </span>
              </div>
            )}
            <span className="text-xl font-bold">{settings?.site_name || 'Galaxy Store'}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-6 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden flex-1 max-w-md mx-8 lg:block">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar produtos..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Painel Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isAffiliate && (
                    <DropdownMenuItem asChild>
                      <Link to="/affiliate" className="cursor-pointer">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Painel Afiliado
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      Meus Pedidos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" asChild>
                <Link to="/auth">Entrar</Link>
              </Button>
            )}

            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/wishlist">
                <Heart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                    {wishlistItems.length}
                  </Badge>
                )}
              </Link>
            </Button>

            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                    {itemCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-lg font-medium transition-colors hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
