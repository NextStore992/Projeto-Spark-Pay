import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  order_id: string;
  user_id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}

interface OrderChatProps {
  orderId: string;
  productName: string;
}

export default function OrderChat({ orderId, productName }: OrderChatProps) {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_messages',
          filter: `order_id=eq.${orderId}`
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const fetchMessages = async () => {
    const { data, error } = await (supabase as any)
      .from('order_messages')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
    setLoading(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setSending(true);
    const { error } = await (supabase as any)
      .from('order_messages')
      .insert({
        order_id: orderId,
        user_id: user.id,
        message: newMessage.trim(),
        is_admin: isAdmin
      });

    if (error) {
      toast.error('Erro ao enviar mensagem');
      console.error(error);
    } else {
      setNewMessage('');
    }
    setSending(false);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardTitle className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Chat do Pedido
        </CardTitle>
        <CardDescription>{productName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <ScrollArea className="h-[450px] pr-4" ref={scrollRef}>
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8 space-y-3">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Send className="h-8 w-8 text-primary" />
              </div>
              <p className="font-medium">Nenhuma mensagem ainda</p>
              <p className="text-sm">Envie uma mensagem para iniciar a conversa</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 animate-slide-up ${
                    msg.user_id === user?.id ? 'flex-row-reverse' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Avatar className="h-10 w-10 border-2 border-border hover-scale">
                    <AvatarFallback className={msg.is_admin ? 'bg-gradient-to-br from-primary to-primary-glow text-primary-foreground' : 'bg-muted'}>
                      {msg.is_admin ? '👨‍💼' : '👤'}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`flex flex-col gap-1 max-w-[75%] ${
                      msg.user_id === user?.id ? 'items-end' : 'items-start'
                    }`}
                  >
                    {msg.is_admin && (
                      <Badge variant="default" className="text-xs animate-fade-in">
                        <span className="mr-1">⭐</span> Administrador
                      </Badge>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-all ${
                        msg.user_id === user?.id
                          ? 'bg-gradient-to-br from-primary to-primary-glow text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <form onSubmit={handleSend} className="flex gap-2 pt-2">
          <div className="relative flex-1">
            <Input
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={sending}
              className="pr-12 h-12 rounded-full border-2 focus:border-primary transition-all"
            />
          </div>
          <Button 
            type="submit" 
            size="icon" 
            disabled={sending || !newMessage.trim()}
            className="h-12 w-12 rounded-full hover-scale"
          >
            {sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
