
import React from 'react';
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

const TemplateDeleteConfirmModal = ({ isOpen, onClose, onConfirm, templateName, isLoading }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !isLoading && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-500">
            <AlertTriangle className="w-5 h-5" />
            Excluir Modelo
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Tem certeza que deseja excluir o modelo <strong>"{templateName}"</strong>? 
            Esta ação não pode ser desfeita e removerá o modelo permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} onClick={onClose}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }} 
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 text-white focus:ring-red-500"
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

export default TemplateDeleteConfirmModal;
