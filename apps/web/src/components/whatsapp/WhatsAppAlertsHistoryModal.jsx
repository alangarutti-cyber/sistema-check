
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Building2, FileText, User, AlertCircle, RefreshCw } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const WhatsAppAlertsHistoryModal = ({ isOpen, onClose, alert, onRetry }) => {
  if (!alert) return null;

  const getStatusColor = (status) => {
    switch(status) {
      case 'Enviado': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Pendente': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Falhou': return 'bg-red-100 text-red-800 border-red-200';
      case 'Reagendado': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Detalhes do Alerta
            <Badge variant="outline" className={getStatusColor(alert.status)}>
              {alert.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-muted-foreground flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> Data/Hora</span>
              <p className="font-medium">{format(parseISO(alert.timestamp), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground flex items-center gap-1.5"><User className="w-3.5 h-3.5"/> Destinatário</span>
              <p className="font-medium">{alert.recipient}</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5"/> Unidade</span>
              <p className="font-medium">{alert.unit}</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground flex items-center gap-1.5"><FileText className="w-3.5 h-3.5"/> Checklist</span>
              <p className="font-medium truncate" title={alert.checklist}>{alert.checklist}</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5"/> Tentativas</span>
              <p className="font-medium">{alert.attempts}</p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-semibold text-foreground">Mensagem Enviada</span>
            <div className="bg-muted/30 p-4 rounded-xl border border-border/50 text-sm whitespace-pre-wrap font-mono text-slate-700 dark:text-slate-300">
              {alert.message}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Fechar</Button>
          {alert.status === 'Falhou' && (
            <Button onClick={() => onRetry(alert.id)} className="gap-2">
              <RefreshCw className="w-4 h-4" /> Tentar Novamente
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppAlertsHistoryModal;
