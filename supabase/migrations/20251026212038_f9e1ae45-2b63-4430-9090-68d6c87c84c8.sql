-- Create chat messages table for order tickets
CREATE TABLE IF NOT EXISTS public.order_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.order_messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages for their own orders
CREATE POLICY "Users can view own order messages"
ON public.order_messages
FOR SELECT
USING (
  user_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_messages.order_id 
    AND orders.user_id = auth.uid()
  ) OR
  has_role(auth.uid(), 'admin'::app_role)
);

-- Users can send messages for their own orders
CREATE POLICY "Users can send own order messages"
ON public.order_messages
FOR INSERT
WITH CHECK (
  user_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_messages.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- Admins can send messages to any order
CREATE POLICY "Admins can send messages"
ON public.order_messages
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime
ALTER TABLE public.order_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_messages;

-- Create index for better performance
CREATE INDEX idx_order_messages_order_id ON public.order_messages(order_id);
CREATE INDEX idx_order_messages_created_at ON public.order_messages(created_at);