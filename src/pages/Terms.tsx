import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4">Termos e Condições</h1>
            <p className="text-lg text-muted-foreground">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="space-y-6">
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle>1. Aceitação dos Termos</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Ao acessar e usar a Galaxy Store, você concorda em cumprir e estar vinculado 
                  aos seguintes termos e condições. Se você não concordar com qualquer parte 
                  destes termos, não deverá usar nossos serviços.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle>2. Produtos e Serviços</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  A Galaxy Store comercializa exclusivamente produtos digitais:
                </p>
                <ul className="space-y-2 ml-4">
                  <li>• Todos os produtos são verificados antes da venda</li>
                  <li>• Entrega em até 48 horas após confirmação do pagamento</li>
                  <li>• Não há envio físico de produtos</li>
                  <li>• Garantia de funcionamento conforme descrito</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle>3. Cadastro e Conta</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>Para utilizar nossos serviços, você deve:</p>
                <ul className="space-y-2 ml-4 mt-4">
                  <li>• Ter pelo menos 18 anos de idade</li>
                  <li>• Fornecer informações verdadeiras e completas</li>
                  <li>• Manter a segurança de sua senha</li>
                  <li>• Notificar-nos imediatamente sobre uso não autorizado</li>
                  <li>• Ser responsável por todas as atividades em sua conta</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <CardTitle>4. Pagamentos</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Aceitamos pagamentos via PIX. Todos os preços são em Reais (R$) e incluem 
                  todos os impostos aplicáveis. O pagamento deve ser confirmado através do 
                  envio do comprovante via chat do pedido.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle>5. Propriedade Intelectual</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Todo o conteúdo da plataforma, incluindo textos, gráficos, logos e imagens, 
                  é propriedade da Galaxy Store ou de seus fornecedores e está protegido por 
                  leis de direitos autorais.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <CardHeader>
                <CardTitle>6. Uso Proibido</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>Você concorda em não:</p>
                <ul className="space-y-2 ml-4 mt-4">
                  <li>• Usar a plataforma para fins ilegais</li>
                  <li>• Revender produtos sem autorização</li>
                  <li>• Compartilhar produtos adquiridos com terceiros</li>
                  <li>• Tentar acessar áreas restritas do sistema</li>
                  <li>• Realizar atividades que prejudiquem a plataforma</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <CardHeader>
                <CardTitle>7. Limitação de Responsabilidade</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  A Galaxy Store não se responsabiliza por danos indiretos, incidentais ou 
                  consequenciais decorrentes do uso ou impossibilidade de uso dos nossos serviços. 
                  Nossa responsabilidade máxima é limitada ao valor pago pelo produto.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
              <CardHeader>
                <CardTitle>8. Modificações</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Reservamos o direito de modificar estes termos a qualquer momento. 
                  Mudanças significativas serão notificadas através da plataforma ou por e-mail. 
                  O uso continuado após as modificações constitui aceitação dos novos termos.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <CardHeader>
                <CardTitle>9. Lei Aplicável</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Estes termos são regidos pelas leis brasileiras. Qualquer disputa será 
                  resolvida nos tribunais competentes do Brasil.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.9s' }}>
              <CardHeader>
                <CardTitle>10. Contato</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Para dúvidas sobre estes termos, entre em contato através de 
                  contato@galaxystore.com
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
