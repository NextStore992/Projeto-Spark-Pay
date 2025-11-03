import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Copy, CheckCircle, QrCode } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { CheckoutTermsDialog } from '@/components/CheckoutTermsDialog';

export default function Checkout() {
  const { user, loading: authLoading } = useAuth();
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [pixKey, setPixKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'confirmed' | 'failed'>('pending');
  const [copied, setCopied] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);

  useEffect(() => {
    fetchPixKey();
  }, []);

  const fetchPixKey = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'pix_key')
      .maybeSingle();

    if (!error && data) {
      setPixKey(data.value || '');
    }
    setLoading(false);
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    toast.success('Chave PIX copiada!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = async () => {
    if (!user) return;

    try {
      // Create orders for each cart item - status pending for manual admin confirmation
      const orders = items.map(item => ({
        user_id: user.id,
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
        total_price: item.price * item.quantity,
        status: 'pending'
      }));

      const { error } = await (supabase as any)
        .from('orders')
        .insert(orders);

      if (error) throw error;

      setPaymentStatus('confirmed');
      toast.success('Pedido criado! Envie o comprovante via chat após realizar o pagamento.');
      
      setTimeout(() => {
        clearCart();
        navigate('/orders');
      }, 2000);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Erro ao criar pedido. Tente novamente.');
      setPaymentStatus('failed');
    }
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

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const finalTotal = total;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Payment Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <QrCode className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle>Pagamento via PIX</CardTitle>
                      <CardDescription>
                        Copie a chave PIX e realize o pagamento
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-2">Valor a Pagar</p>
                    <p className="text-3xl font-bold text-primary mb-4">R$ {finalTotal.toFixed(2)}</p>
                    
                    <p className="text-sm font-medium mb-2">Chave PIX (Copia e Cola)</p>
                    <div className="flex gap-2">
                      <code className="flex-1 p-3 bg-background rounded text-xs break-all">
                        {pixKey}
                      </code>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopyPix}
                      >
                        {copied ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Instruções de Pagamento:</h4>
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>Copie a chave PIX acima</li>
                      <li>Abra seu aplicativo de banco</li>
                      <li>Selecione PIX Copia e Cola</li>
                      <li>Cole a chave e confirme o valor de <strong className="text-foreground">R$ {finalTotal.toFixed(2)}</strong></li>
                      <li>Realize o pagamento</li>
                      <li>Clique em "Criar Pedido" abaixo</li>
                      <li>Envie o comprovante pelo chat do pedido</li>
                    </ol>
                  </div>

                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Importante:</strong> Após criar o pedido, envie o comprovante de pagamento pelo chat.
                      O pedido será confirmado manualmente pelo administrador após verificar o pagamento.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {paymentStatus === 'confirmed' && (
                <Card className="border-green-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 text-green-600">
                      <CheckCircle className="h-6 w-6" />
                      <div>
                        <p className="font-medium">Pedido Criado!</p>
                        <p className="text-sm text-muted-foreground">
                          Envie o comprovante pelo chat do pedido
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity}x R$ {item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-medium">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>R$ {finalTotal.toFixed(2)}</span>
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => setShowTermsDialog(true)}
                    disabled={paymentStatus === 'confirmed'}
                  >
                    {paymentStatus === 'confirmed' ? 'Pedido Criado' : 'Criar Pedido'}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Crie o pedido e envie o comprovante via chat após o pagamento
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <CheckoutTermsDialog
        open={showTermsDialog}
        onOpenChange={setShowTermsDialog}
        onConfirm={handleConfirmPayment}
        productName={`${items.length} ${items.length === 1 ? 'produto' : 'produtos'}`}
      />

      <Footer />
    </div>
  );
}
