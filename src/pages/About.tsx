import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Award, Users, Zap, Code, Mail, Globe, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4">Sobre Nós</h1>
            <p className="text-lg text-muted-foreground">
              Conheça mais sobre a Galaxy Store e nossa missão
            </p>
          </div>

          <div className="space-y-8">
            <Card className="animate-slide-up">
              <CardContent className="pt-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  A Galaxy Store é uma plataforma moderna dedicada à venda de produtos digitais de alta qualidade. 
                  Nossa missão é fornecer aos nossos clientes acesso fácil e rápido aos melhores produtos 
                  digitais do mercado, com entrega em até 48 horas e suporte completo via chat.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Desenvolvida com as mais recentes tecnologias web, nossa plataforma oferece uma experiência
                  de compra segura, rápida e intuitiva para todos os usuários.
                </p>
              </CardContent>
            </Card>

            {/* Developer Info */}
            <Card className="animate-slide-up border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Code className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Desenvolvedor</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    <strong>Contato:</strong> @079byfael
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Tecnologias:</strong> React, TypeScript, Tailwind CSS, Supabase
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Objetivo:</strong> Criar uma plataforma de e-commerce moderna e eficiente 
                    para produtos digitais, com foco em experiência do usuário e segurança.
                  </p>
                </div>
                <Button variant="outline" className="w-full sm:w-auto" asChild>
                  <a href="https://instagram.com/079byfael" target="_blank" rel="noopener noreferrer">
                    <Mail className="mr-2 h-4 w-4" />
                    Entrar em Contato
                  </a>
                </Button>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="animate-slide-up hover-scale" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Nossa Missão</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Democratizar o acesso a produtos digitais de qualidade, oferecendo uma 
                    plataforma segura, rápida e acessível para todos.
                  </p>
                </CardContent>
              </Card>

              <Card className="animate-slide-up hover-scale" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Nossa Paixão</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Somos apaixonados por tecnologia e produtos digitais. Acreditamos que 
                    todos merecem acesso a conteúdo de qualidade.
                  </p>
                </CardContent>
              </Card>

              <Card className="animate-slide-up hover-scale" style={{ animationDelay: '0.3s' }}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Qualidade</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Todos os produtos são cuidadosamente selecionados e verificados para 
                    garantir a melhor experiência aos nossos clientes.
                  </p>
                </CardContent>
              </Card>

              <Card className="animate-slide-up hover-scale" style={{ animationDelay: '0.4s' }}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Comunidade</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Construímos uma comunidade crescente de clientes satisfeitos que 
                    confiam em nossos produtos e serviços.
                  </p>
                </CardContent>
              </Card>

              <Card className="animate-slide-up hover-scale" style={{ animationDelay: '0.5s' }}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Agilidade</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Entrega rápida em até 48 horas e suporte dedicado para resolver qualquer 
                    questão de forma ágil e eficiente.
                  </p>
                </CardContent>
              </Card>

              <Card className="animate-slide-up hover-scale" style={{ animationDelay: '0.6s' }}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Inovação</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Utilizamos as tecnologias mais modernas para proporcionar a melhor 
                    experiência de compra online.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
