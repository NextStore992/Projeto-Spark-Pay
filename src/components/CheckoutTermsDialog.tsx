import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

interface CheckoutTermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  productName: string;
}

export function CheckoutTermsDialog({
  open,
  onOpenChange,
  onConfirm,
  productName,
}: CheckoutTermsDialogProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleConfirm = () => {
    if (acceptedTerms) {
      onConfirm();
      setAcceptedTerms(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            Informações Importantes
          </DialogTitle>
          <DialogDescription>
            Leia atentamente antes de confirmar sua compra
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-primary/10 p-4 space-y-3">
            <h3 className="font-semibold text-primary">Produto Digital</h3>
            <p className="text-sm text-muted-foreground">
              Este é um <strong>produto digital</strong> que será entregue de forma digital através de um ticket.
            </p>
          </div>

          <div className="rounded-lg border border-border p-4 space-y-3">
            <h3 className="font-semibold">Como verificar seu pedido?</h3>
            <p className="text-sm text-muted-foreground">
              O ticket ficará salvo no seu perfil. Para verificar se foi entregue, vá em:
              <br />
              <strong>Perfil → Meus Pedidos</strong>
            </p>
          </div>

          <div className="rounded-lg border border-border p-4 space-y-3">
            <h3 className="font-semibold">Prazo de Entrega</h3>
            <p className="text-sm text-muted-foreground">
              Possuímos até <strong>48 horas</strong> para realizar a entrega do produto após a confirmação do pagamento.
            </p>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm">
              <strong>Produto:</strong> {productName}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
            />
            <Label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Li e concordo com os termos acima
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!acceptedTerms}>
            Confirmar Compra
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
