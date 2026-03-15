
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';

const DeleteConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, isLoading }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isLoading && !open && onCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            {title || 'Confirmar Exclusão'}
          </DialogTitle>
          <DialogDescription className="pt-2 text-base">
            {message || 'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Deletar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
