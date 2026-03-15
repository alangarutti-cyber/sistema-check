
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Send, Paperclip } from 'lucide-react';

const ContactFormModal = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Mensagem enviada com sucesso! Nossa equipe entrará em contato em breve.');
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Contatar Suporte</DialogTitle>
          <DialogDescription>
            Preencha o formulário abaixo para falar com nossa equipe de especialistas.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Assunto</Label>
            <Input id="subject" placeholder="Ex: Dúvida sobre relatórios" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea id="message" placeholder="Descreva sua dúvida ou solicitação detalhadamente..." className="min-h-[120px]" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="attachment">Anexo (Opcional)</Label>
            <div className="flex items-center gap-2">
              <Input id="attachment" type="file" className="hidden" />
              <Button type="button" variant="outline" className="w-full border-dashed" onClick={() => document.getElementById('attachment').click()}>
                <Paperclip className="w-4 h-4 mr-2" /> Adicionar Arquivo
              </Button>
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : <><Send className="w-4 h-4 mr-2" /> Enviar Mensagem</>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactFormModal;
