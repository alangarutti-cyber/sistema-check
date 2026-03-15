
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowRight, Building2, User } from 'lucide-react';

const CorrectiveActionCard = ({ action, onOpen, getUserName, getUnitName }) => {
  const isOverdue = new Date(action.deadline) < new Date() && action.status !== 'Resolvida' && action.status !== 'Verificada';

  const getPriorityClass = (priority) => {
    const map = {
      'Crítica': 'badge-priority-critica',
      'Alta': 'badge-priority-alta',
      'Média': 'badge-priority-media',
      'Baixa': 'badge-priority-baixa'
    };
    return map[priority] || '';
  };

  const getStatusClass = (status) => {
    const map = {
      'Aberta': 'badge-status-aberta',
      'Em Progresso': 'badge-status-em-progresso',
      'Resolvida': 'badge-status-resolvida',
      'Verificada': 'badge-status-verificada'
    };
    return map[status] || '';
  };

  return (
    <Card className="p-5 flex flex-col md:flex-row gap-4 md:items-center hover:shadow-md transition-all duration-200 border-border/60 group cursor-pointer" onClick={() => onOpen(action)}>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-bold text-muted-foreground mr-1">{action.id}</span>
          <Badge className={getPriorityClass(action.priority)}>{action.priority}</Badge>
          <Badge className={getStatusClass(action.status)}>{action.status}</Badge>
          {isOverdue && (
            <span className="flex items-center gap-1 text-xs font-bold text-error bg-error/10 px-2 py-0.5 rounded-full">
              <Clock className="w-3 h-3" /> Vencida
            </span>
          )}
        </div>
        
        <h3 className="text-lg font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors">{action.title}</h3>
        
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mt-3">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <strong className="text-foreground font-medium">{getUnitName(action.unit_id)}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <strong className="text-foreground font-medium">{getUserName(action.responsible_id)}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className={`w-3.5 h-3.5 ${isOverdue ? 'text-error' : ''}`} />
            <strong className={`font-medium ${isOverdue ? 'text-error' : 'text-foreground'}`}>
              {new Date(action.deadline).toLocaleDateString('pt-BR')}
            </strong>
          </span>
        </div>
      </div>
      
      <div className="flex gap-2 shrink-0 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-5 items-center justify-end">
        <Button variant="ghost" className="w-full md:w-auto gap-2 group-hover:bg-primary/5 group-hover:text-primary">
          Detalhes <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default CorrectiveActionCard;
