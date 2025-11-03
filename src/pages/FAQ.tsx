import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function FAQ() {
  const faqs = [
    {
      question: "Como funciona a entrega dos produtos digitais?",
      answer: "Após a confirmação do pagamento pelo administrador, você receberá o produto digital em até 48 horas via chat do pedido."
    },
    {
      question: "Quais são as formas de pagamento?",
      answer: "Aceitamos pagamento via PIX. Você receberá a chave PIX na finalização da compra."
    },
    {
      question: "Como acompanho meu pedido?",
      answer: "Você pode acompanhar o status do seu pedido na área 'Meus Pedidos' após fazer login. Também pode usar o chat do pedido para se comunicar diretamente com nossa equipe."
    },
    {
      question: "Posso cancelar meu pedido?",
      answer: "Sim, você pode solicitar o cancelamento através do chat do pedido antes da confirmação do pagamento."
    },
    {
      question: "Há garantia dos produtos?",
      answer: "Todos os nossos produtos digitais têm garantia de funcionamento. Caso tenha problemas, entre em contato via chat do pedido."
    },
    {
      question: "Como posso me tornar um afiliado?",
      answer: "Acesse a página 'Seja um Afiliado' no rodapé do site e faça sua inscrição. Nossa equipe irá avaliar e aprovar seu cadastro."
    },
    {
      question: "Preciso criar uma conta para comprar?",
      answer: "Sim, é necessário criar uma conta para realizar compras, acompanhar pedidos e usar o chat de suporte."
    },
    {
      question: "Os produtos são originais?",
      answer: "Todos os produtos disponíveis em nossa loja são verificados e selecionados com cuidado para garantir qualidade."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4">Perguntas Frequentes</h1>
            <p className="text-lg text-muted-foreground">
              Encontre respostas para as dúvidas mais comuns
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border rounded-lg px-6 animate-slide-up hover-scale"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>

      <Footer />
    </div>
  );
}
