
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Bug, Camera } from 'lucide-react';

const BugReportModal = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Problema reportado com sucesso! Obrigado por ajudar a melhorar o CheckFlow.');
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-error">
            <Bug className="w-5 h-5" /> Reportar um Problema
          </DialogTitle>
          <DialogDescription>
            Encontrou um erro? Descreva o que aconteceu para que possamos corrigir rapidamente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="bug-title">Título do Problema</Label>
            <Input id="bug-title" placeholder="Ex: Botão de salvar não funciona no modelo" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bug-desc">Passos para reproduzir</Label>
            <Textarea id="bug-desc" placeholder="1. Acesse a página X&#10;2. Clique no botão Y&#10;3. O erro Z acontece..." className="min-h-[120px]" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="screenshot">Captura de Tela (Recomendado)</Label>
            <div className="flex items-center gap-2">
              <Input id="screenshot" type="file" accept="image/*" className="hidden" />
              <Button type="button" variant="outline" className="w-full border-dashed" onClick={() => document.getElementById('screenshot').click()}>
                <Camera className="w-4 h-4 mr-2" /> Anexar Captura de Tela
              </Button>
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="destructive" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Reportar Problema'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BugReportModal;
