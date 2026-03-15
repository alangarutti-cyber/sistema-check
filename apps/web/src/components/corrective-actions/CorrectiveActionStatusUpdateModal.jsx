
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import CorrectiveActionEvidenceUpload from './CorrectiveActionEvidenceUpload.jsx';

const CorrectiveActionStatusUpdateModal = ({ isOpen, onClose, onSave, currentStatus }) => {
  const [status, setStatus] = useState('Aberta');
  const [comments, setComments] = useState('');
  const [evidence, setEvidence] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStatus(currentStatus || 'Aberta');
      setComments('');
      setEvidence(null);
    }
  }, [isOpen, currentStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(status, comments, evidence);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isLoading && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Atualizar Status</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="space-y-2">
            <Label>Novo Status</Label>
            <Select value={status} onValueChange={setStatus} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aberta">Aberta</SelectItem>
                <SelectItem value="Em Progresso">Em Progresso</SelectItem>
                <SelectItem value="Resolvida">Resolvida</SelectItem>
                <SelectItem value="Verificada">Verificada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Comentários / Observações</Label>
            <Textarea 
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Adicione detalhes sobre a atualização..."
              rows={3}
              disabled={isLoading}
            />
          </div>

          {(status === 'Resolvida' || status === 'Verificada') && (
            <div className="space-y-2">
              <Label>Evidência (Opcional)</Label>
              <CorrectiveActionEvidenceUpload onFileSelect={setEvidence} />
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>Cancelar</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Atualizar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CorrectiveActionStatusUpdateModal;
