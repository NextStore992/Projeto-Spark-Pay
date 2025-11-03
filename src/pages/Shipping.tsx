import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Clock, Shield, MessageSquare } from 'lucide-react';

export default function Shipping() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4">Informações de Entrega</h1>
            <p className="text-lg text-muted-foreground">
              Saiba como funciona a entrega dos nossos produtos digitais
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="animate-slide-up hover-scale">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Produtos Digitais</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Trabalhamos exclusivamente com produtos digitais. Não há envio físico - 
                  tudo é entregue via plataforma online.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-slide-up hover-scale" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Prazo de Entrega</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Entrega em até 48 horas após a confirmação do pagamento. 
                  A maioria dos pedidos é processada em menos de 24 horas.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-slide-up hover-scale" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Segurança</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Todas as entregas são rastreáveis através do sistema de pedidos. 
                  Você receberá notificações sobre o status do seu pedido.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-slide-up hover-scale" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Suporte</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Chat de suporte disponível em cada pedido para acompanhamento e 
                  esclarecimento de dúvidas em tempo real.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle>Como Funciona o Processo</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="font-bold text-primary">1.</span>
                  <span>Realize seu pedido e pague via PIX</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary">2.</span>
                  <span>Envie o comprovante pelo chat do pedido</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary">3.</span>
                  <span>Nossa equipe confirma o pagamento (geralmente em minutos)</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary">4.</span>
                  <span>Você recebe o produto digital em até 48 horas via chat</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary">5.</span>
                  <span>Acompanhe tudo através da área de pedidos</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
