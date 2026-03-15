
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Loader2, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

const MOCK_RECIPIENTS = [
  { id: '1', name: 'Meu Número (Teste)', number: '(11) 99999-9999' },
  { id: '2', name: 'Gestor Teste', number: '(11) 98888-8888' },
];

const SendTestAlertModal = ({ isOpen, onClose, templates }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    if (!selectedTemplate || !selectedRecipient) {
      toast.error('Selecione um template e um destinatário.');
      return;
    }

    setIsSending(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      const success = Math.random() > 0.2; // 80% success rate for mock
      
      if (success) {
        toast.success('Alerta de teste enviado com sucesso!');
        onClose();
      } else {
        toast.error('Falha ao enviar alerta de teste. Verifique a conexão.');
      }
    }, 1500);
  };

  const template = templates?.find(t => t.id === selectedTemplate);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />
            Enviar Alerta de Teste
          </DialogTitle>
          <DialogDescription>
            Envie uma mensagem de teste para verificar a formatação e a entrega.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label>Template de Mensagem</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger><SelectValue placeholder="Selecione um template..." /></SelectTrigger>
              <SelectContent>
                {templates?.filter(t => t.isActive).map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Destinatário de Teste</Label>
            <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
              <SelectTrigger><SelectValue placeholder="Selecione um número..." /></SelectTrigger>
              <SelectContent>
                {MOCK_RECIPIENTS.map(r => (
                  <SelectItem key={r.id} value={r.id}>
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-muted-foreground" />
                      <span>{r.name} - {r.number}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {template && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Preview da Mensagem (com dados fictícios)</Label>
              <div className="bg-muted/30 p-4 rounded-xl border border-border/50 text-sm whitespace-pre-wrap font-mono text-slate-700 dark:text-slate-300">
                {template.message.replace(/{{.*?}}/g, '[Dado Fictício]')}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSending}>Cancelar</Button>
          <Button onClick={handleSend} disabled={isSending || !selectedTemplate || !selectedRecipient} className="gap-2">
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {isSending ? 'Enviando...' : 'Enviar Teste'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendTestAlertModal;
