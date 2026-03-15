
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

const CorrectiveActionDeleteConfirmModal = ({ isOpen, onClose, onConfirm, actionTitle }) => {
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
          <AlertDialogTitle className="flex items-center gap-2 text-error">
            <AlertTriangle className="w-5 h-5" />
            Excluir Ação Corretiva
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Tem certeza que deseja excluir a ação <strong>"{actionTitle}"</strong>? 
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} onClick={onClose}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm} 
            disabled={isLoading}
            className="bg-error hover:bg-error/90 text-white focus:ring-error"
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

export default CorrectiveActionDeleteConfirmModal;
