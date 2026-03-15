
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, XCircle, RefreshCw, AlertTriangle, Info } from 'lucide-react';

export const AlertStatusBadge = ({ status }) => {
  switch(status) {
    case 'Enviado': 
    case 'Entregue':
      return <Badge className="badge-wa-success"><CheckCircle2 className="w-3 h-3 mr-1"/> {status}</Badge>;
    case 'Pendente': 
      return <Badge className="badge-wa-pending"><Clock className="w-3 h-3 mr-1"/> {status}</Badge>;
    case 'Falhou': 
      return <Badge className="badge-wa-error"><XCircle className="w-3 h-3 mr-1"/> {status}</Badge>;
    case 'Reagendado': 
      return <Badge className="badge-wa-info"><RefreshCw className="w-3 h-3 mr-1"/> {status}</Badge>;
    default: 
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const AlertPriorityBadge = ({ priority }) => {
  switch(priority) {
    case 'Crítica': 
      return <Badge className="badge-wa-error"><AlertTriangle className="w-3 h-3 mr-1"/> Crítica</Badge>;
    case 'Alta': 
      return <Badge className="badge-wa-pending">Alta</Badge>;
    case 'Média': 
      return <Badge className="badge-wa-info">Média</Badge>;
    case 'Baixa': 
      return <Badge className="badge-wa-neutral">Baixa</Badge>;
    default: 
      return <Badge variant="outline">{priority}</Badge>;
  }
};

export const AlertTypeIcon = ({ type, className = "w-4 h-4" }) => {
  switch(type) {
    case 'critical_item': return <AlertTriangle className={`${className} text-[hsl(var(--wa-error))]`} />;
    case 'overdue': return <Clock className={`${className} text-[hsl(var(--wa-pending))]`} />;
    case 'non_compliance': return <XCircle className={`${className} text-[hsl(var(--wa-error))]`} />;
    case 'overdue_action': return <Clock className={`${className} text-[hsl(var(--wa-error))]`} />;
    default: return <Info className={`${className} text-[hsl(var(--wa-neutral))]`} />;
  }
};

export const getAlertTypeName = (type) => {
  const map = {
    'critical_item': 'Item Crítico',
    'overdue': 'Atrasado',
    'non_compliance': 'Não Conformidade',
    'missing_evidence': 'Evidência Faltante',
    'overdue_action': 'Ação Vencida',
    'not_started': 'Não Iniciado',
    'reopened': 'Reaberto'
  };
  return map[type] || type;
};
