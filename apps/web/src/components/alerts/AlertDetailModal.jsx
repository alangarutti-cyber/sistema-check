
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, Clock, XCircle, AlertCircle, ClipboardList, 
  Building2, User, Calendar, CheckCircle2, Trash2, Mail, MailOpen, Loader2
} from 'lucide-react';

const AlertDetailModal = ({ isOpen, onClose, alert, onToggleRead, onToggleResolve, onDelete }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!alert) return null;

  const getSeverityColor = (sev) => {
    switch(sev) {
      case 'Crítica': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Alta': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'Média': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'Baixa': return 'bg-green-500/10 text-green-600 border-green-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeInfo = (type) => {
    switch(type) {
      case 'critical_problem': return { icon: <AlertTriangle className="w-5 h-5 text-destructive" />, label: 'Problema Crítico' };
      case 'overdue_checklist': return { icon: <Clock className="w-5 h-5 text-orange-500" />, label: 'Checklist Atrasado' };
      case 'not_started_checklist': return { icon: <XCircle className="w-5 h-5 text-muted-foreground" />, label: 'Checklist Não Iniciado' };
      case 'overdue_action': return { icon: <AlertCircle className="w-5 h-5 text-yellow-500" />, label: 'Ação Corretiva Vencida' };
      case 'execution_issues': return { icon: <ClipboardList className="w-5 h-5 text-blue-500" />, label: 'Execução com Ressalvas' };
      default: return { icon: <AlertCircle className="w-5 h-5 text-primary" />, label: 'Alerta' };
    }
  };

  const typeInfo = getTypeInfo(alert.type);
  const isResolved = alert.status === 'resolved';

  const handleAction = async (actionFn) => {
    setIsProcessing(true);
    try {
      await actionFn(alert.id);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isProcessing && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="mb-2">
          <div className="flex items-center justify-between gap-4 pr-6 mb-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              {typeInfo.icon}
              {typeInfo.label}
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
              <Badge variant={isResolved ? 'default' : 'destructive'} className={isResolved ? 'bg-green-500 hover:bg-green-600' : ''}>
                {isResolved ? 'Resolvido' : 'Não Resolvido'}
              </Badge>
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold leading-tight">{alert.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="bg-muted/30 p-4 rounded-xl">
            <p className="text-base text-foreground leading-relaxed">{alert.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Unidade</p>
                <p className="font-medium">{alert.unit}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Responsável</p>
                <p className="font-medium">{alert.responsible}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Criado em</p>
                <p className="font-medium">{new Date(alert.createdAt).toLocaleString('pt-BR')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Última atualização</p>
                <p className="font-medium">{new Date(alert.updatedAt).toLocaleString('pt-BR')}</p>
              </div>
            </div>
          </div>

          {(alert.relatedChecklistId || alert.relatedActionId) && (
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">Referências Relacionadas:</p>
              <div className="flex gap-2">
                {alert.relatedChecklistId && (
                  <Badge variant="secondary" className="font-mono">{alert.relatedChecklistId}</Badge>
                )}
                {alert.relatedActionId && (
                  <Badge variant="secondary" className="font-mono">{alert.relatedActionId}</Badge>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 pt-4 border-t mt-2">
          <Button 
            variant="ghost" 
            className="text-destructive hover:text-destructive hover:bg-destructive/10 sm:mr-auto"
            onClick={() => { onClose(); onDelete(alert); }}
            disabled={isProcessing}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Excluir
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => handleAction(() => onToggleRead(alert.id, !alert.isRead))}
            disabled={isProcessing}
          >
            {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : (alert.isRead ? <Mail className="w-4 h-4 mr-2" /> : <MailOpen className="w-4 h-4 mr-2" />)}
            {alert.isRead ? 'Marcar como Não Lido' : 'Marcar como Lido'}
          </Button>
          
          <Button 
            variant={isResolved ? "outline" : "default"}
            onClick={() => handleAction(() => onToggleResolve(alert.id, !isResolved))}
            disabled={isProcessing}
          >
            {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : (isResolved ? <XCircle className="w-4 h-4 mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />)}
            {isResolved ? 'Reabrir Alerta' : 'Marcar como Resolvido'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlertDetailModal;
