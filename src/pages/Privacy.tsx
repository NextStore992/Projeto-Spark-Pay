import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4">Política de Privacidade</h1>
            <p className="text-lg text-muted-foreground">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="space-y-6">
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle>1. Informações que Coletamos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Coletamos informações que você nos fornece diretamente ao criar uma conta, 
                  fazer um pedido ou entrar em contato conosco:
                </p>
                <ul className="space-y-2 ml-4">
                  <li>• Nome completo e e-mail</li>
                  <li>• Informações de pagamento (processadas de forma segura)</li>
                  <li>• Histórico de pedidos e comunicações</li>
                  <li>• Informações de navegação e uso da plataforma</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle>2. Como Usamos suas Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>Utilizamos suas informações para:</p>
                <ul className="space-y-2 ml-4">
                  <li>• Processar e entregar seus pedidos</li>
                  <li>• Comunicar sobre o status do pedido</li>
                  <li>• Fornecer suporte ao cliente</li>
                  <li>• Melhorar nossos produtos e serviços</li>
                  <li>• Enviar ofertas e atualizações (se você consentir)</li>
                  <li>• Prevenir fraudes e garantir segurança</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle>3. Compartilhamento de Dados</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Não vendemos suas informações pessoais. Podemos compartilhar dados apenas com:
                </p>
                <ul className="space-y-2 ml-4 mt-4">
                  <li>• Processadores de pagamento para completar transações</li>
                  <li>• Autoridades legais quando exigido por lei</li>
                  <li>• Provedores de serviços que nos ajudam a operar a plataforma</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <CardTitle>4. Segurança dos Dados</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Implementamos medidas de segurança técnicas e organizacionais para proteger 
                  seus dados contra acesso não autorizado, alteração, divulgação ou destruição. 
                  Isso inclui criptografia SSL, armazenamento seguro e controles de acesso rígidos.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle>5. Seus Direitos</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>De acordo com a LGPD, você tem direito a:</p>
                <ul className="space-y-2 ml-4 mt-4">
                  <li>• Acessar seus dados pessoais</li>
                  <li>• Corrigir dados incompletos ou desatualizados</li>
                  <li>• Solicitar a exclusão de seus dados</li>
                  <li>• Revogar consentimento para uso de dados</li>
                  <li>• Portabilidade dos dados</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <CardHeader>
                <CardTitle>6. Cookies</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Utilizamos cookies para melhorar sua experiência, analisar o uso da plataforma 
                  e personalizar conteúdo. Você pode controlar cookies através das configurações 
                  do seu navegador.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <CardHeader>
                <CardTitle>7. Contato</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Para exercer seus direitos ou esclarecer dúvidas sobre esta política, 
                  entre em contato através de contato@galaxystore.com
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
