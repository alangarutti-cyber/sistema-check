
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';

const DeleteUserConfirmModal = ({ isOpen, onClose, onConfirm, user, isLoading, hasAssignedTasks }) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isLoading && !open && onClose()}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Excluir Usuário
          </DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <p className="text-sm">
            Tem certeza que deseja excluir o usuário <strong>{user.name}</strong> ({user.email})?
          </p>
          
          {hasAssignedTasks && (
            <div className="bg-warning/10 border border-warning/20 text-warning-foreground p-3 rounded-lg text-sm flex gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 text-warning" />
              <p>
                <strong>Atenção:</strong> Este usuário possui checklists ou ações corretivas atribuídas a ele. 
                Recomendamos inativar o usuário em vez de excluí-lo para manter o histórico.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="button" variant="destructive" onClick={() => onConfirm(user.id)} disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Sim, Excluir Usuário
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserConfirmModal;
