import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function Returns() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4">Política de Devoluções e Reembolsos</h1>
            <p className="text-lg text-muted-foreground">
              Entenda nossos termos de devolução e reembolso
            </p>
          </div>

          <div className="space-y-6">
            <Card className="animate-slide-up">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-yellow-500" />
                  <CardTitle>Importante sobre Produtos Digitais</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Por se tratar de produtos digitais, as devoluções são limitadas conforme 
                  o Código de Defesa do Consumidor. No entanto, garantimos a qualidade e 
                  funcionamento de todos os nossos produtos.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <CardTitle>Quando Você Pode Solicitar Reembolso</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Produto não foi entregue dentro do prazo de 48 horas</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Produto recebido está com defeito ou não funciona</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Produto recebido não corresponde à descrição</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Pagamento foi realizado mas o pedido não foi processado</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <XCircle className="h-6 w-6 text-red-500" />
                  <CardTitle>Quando Não é Possível Reembolso</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Produto já foi acessado ou utilizado</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Solicitação feita após 7 dias da entrega</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Motivo da devolução não se enquadra nos termos</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <CardTitle>Como Solicitar Reembolso</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="font-bold text-primary">1.</span>
                    <span>Acesse a área de "Meus Pedidos"</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary">2.</span>
                    <span>Abra o chat do pedido em questão</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary">3.</span>
                    <span>Explique o motivo da solicitação de reembolso</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary">4.</span>
                    <span>Nossa equipe analisará em até 48 horas</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary">5.</span>
                    <span>Se aprovado, o reembolso é feito em até 7 dias úteis</span>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle>Garantia de Qualidade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Todos os nossos produtos passam por verificação de qualidade antes da entrega. 
                  Se você encontrar qualquer problema, entre em contato imediatamente através do 
                  chat do pedido e resolveremos a situação da melhor forma possível.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
