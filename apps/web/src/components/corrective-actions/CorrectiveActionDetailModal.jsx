
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, User, Building2, Clock, Edit2, Trash2, CheckCircle2 } from 'lucide-react';

const CorrectiveActionDetailModal = ({ isOpen, onClose, action, onEdit, onDelete, onUpdateStatus, getUserName, getUnitName, getSectorName }) => {
  if (!action) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <div className="flex items-center justify-between gap-4 pr-6">
            <DialogTitle className="text-xl">{action.id}</DialogTitle>
            <div className="flex gap-2">
              <Badge className={getPriorityClass(action.priority)}>{action.priority}</Badge>
              <Badge className={getStatusClass(action.status)}>{action.status}</Badge>
            </div>
          </div>
          <h2 className="text-2xl font-bold mt-2">{action.title}</h2>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="comments">Observações</TabsTrigger>
            <TabsTrigger value="evidence">Evidências</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6">
            <div className="bg-muted/30 p-4 rounded-xl space-y-4">
              <p className="text-sm text-foreground">{action.description || 'Sem descrição detalhada.'}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground text-xs">Local</p>
                    <p className="font-medium">{getUnitName(action.unit_id)} {action.sector_id ? `• ${getSectorName(action.sector_id)}` : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground text-xs">Responsável</p>
                    <p className="font-medium">{getUserName(action.responsible_id)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground text-xs">Criado em</p>
                    <p className="font-medium">{new Date(action.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className={`w-4 h-4 ${isOverdue ? 'text-error' : 'text-muted-foreground'}`} />
                  <div>
                    <p className="text-muted-foreground text-xs">Prazo</p>
                    <p className={`font-medium ${isOverdue ? 'text-error' : ''}`}>
                      {new Date(action.deadline).toLocaleDateString('pt-BR')}
                      {isOverdue && ' (Vencido)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <Button onClick={() => onUpdateStatus(action)} className="gap-2">
                <CheckCircle2 className="w-4 h-4" /> Atualizar Status
              </Button>
              <Button variant="outline" onClick={() => onEdit(action)} className="gap-2">
                <Edit2 className="w-4 h-4" /> Editar
              </Button>
              <Button variant="ghost" onClick={() => onDelete(action)} className="text-error hover:text-error hover:bg-error/10 gap-2 ml-auto">
                <Trash2 className="w-4 h-4" /> Excluir
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="comments">
            <div className="bg-muted/30 p-4 rounded-xl min-h-[200px] whitespace-pre-wrap text-sm">
              {action.observations || 'Nenhuma observação registrada.'}
            </div>
          </TabsContent>

          <TabsContent value="evidence">
            <div className="bg-muted/30 p-8 rounded-xl text-center min-h-[200px] flex flex-col items-center justify-center">
              <p className="text-muted-foreground text-sm">Nenhuma evidência anexada.</p>
              <Button variant="link" onClick={() => onUpdateStatus(action)} className="mt-2">
                Anexar evidência ao atualizar status
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CorrectiveActionDetailModal;
