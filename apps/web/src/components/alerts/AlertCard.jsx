
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, Clock, XCircle, AlertCircle, ClipboardList, 
  CheckCircle2, ArrowRight, Mail, MailOpen, Trash2
} from 'lucide-react';

const AlertCard = ({ alert, onView, onToggleRead, onToggleResolve, onDelete }) => {
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

  return (
    <Card className={`p-5 flex flex-col md:flex-row gap-4 md:items-center transition-all duration-200 hover:shadow-md border-border/60 group ${!alert.isRead ? 'border-l-4 border-l-primary bg-primary/[0.02]' : ''}`}>
      <div className="flex items-start gap-4 flex-1 min-w-0 cursor-pointer" onClick={() => onView(alert)}>
        <div className={`mt-1 p-2 rounded-full shrink-0 ${!alert.isRead ? 'bg-background shadow-sm' : 'bg-muted'}`}>
          {typeInfo.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <Badge variant="outline" className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
            <Badge variant={isResolved ? 'default' : 'destructive'} className={`text-[10px] h-5 ${isResolved ? 'bg-green-500 hover:bg-green-600' : ''}`}>
              {isResolved ? 'Resolvido' : 'Não Resolvido'}
            </Badge>
            {!alert.isRead && <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>}
            <span className="text-xs text-muted-foreground ml-auto md:ml-0">
              {new Date(alert.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          
          <h4 className="font-bold text-lg mb-1 truncate group-hover:text-primary transition-colors">{alert.title}</h4>
          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{alert.description}</p>
          
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>Unidade: <strong className="text-foreground font-medium">{alert.unit}</strong></span>
            <span>Resp: <strong className="text-foreground font-medium">{alert.responsible}</strong></span>
            <span className="text-muted-foreground/70">{typeInfo.label}</span>
          </div>
        </div>
      </div>
      
      <div className="flex md:flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-5 mt-2 md:mt-0 justify-end">
        <Button 
          size="sm" 
          variant={isResolved ? "outline" : "default"} 
          className="w-full md:w-auto gap-1.5"
          onClick={(e) => { e.stopPropagation(); onToggleResolve(alert.id, !isResolved); }}
        >
          {isResolved ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
          <span className="hidden md:inline">{isResolved ? 'Reabrir' : 'Resolver'}</span>
        </Button>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            size="sm" 
            variant="ghost" 
            className="flex-1 md:flex-none px-2"
            title={alert.isRead ? "Marcar como não lido" : "Marcar como lido"}
            onClick={(e) => { e.stopPropagation(); onToggleRead(alert.id, !alert.isRead); }}
          >
            {alert.isRead ? <Mail className="w-4 h-4 text-muted-foreground" /> : <MailOpen className="w-4 h-4 text-primary" />}
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="flex-1 md:flex-none px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            title="Excluir alerta"
            onClick={(e) => { e.stopPropagation(); onDelete(alert); }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="flex-1 md:flex-none px-2 md:hidden"
            onClick={() => onView(alert)}
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AlertCard;
