
import React, { useState } from 'react';
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogCancel, 
  AlertDialogAction 
} from '@/components/ui/alert-dialog';
import { Loader2, AlertTriangle } from 'lucide-react';

const AlertDeleteConfirmModal = ({ isOpen, onClose, onConfirm, alertTitle }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !isLoading && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Excluir Alerta
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Tem certeza que deseja excluir o alerta <strong>"{alertTitle}"</strong>? 
            Esta ação não pode ser desfeita e removerá o alerta permanentemente do sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} onClick={onClose}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm} 
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground focus:ring-destructive"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Excluindo...
              </>
            ) : (
              'Sim, Excluir'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDeleteConfirmModal;
