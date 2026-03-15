
import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Eye, RefreshCw, Calendar as CalendarIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AlertDetailsDrawer from './AlertDetailsDrawer.jsx';
import { AlertStatusBadge, AlertPriorityBadge, AlertTypeIcon, getAlertTypeName } from './AlertBadge.jsx';
import { toast } from 'sonner';

const WhatsAppAlertsHistory = ({ alerts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const filteredAlerts = useMemo(() => {
    if (!Array.isArray(alerts)) return [];
    
    return alerts.filter(alert => {
      if (!alert) return false;
      
      const matchesSearch = !searchTerm || 
        (alert.destinataries || []).some(d => d?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || d?.number?.includes(searchTerm)) ||
        (alert.checklistName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (alert.unitName?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
      const matchesType = typeFilter === 'all' || alert.eventType === typeFilter;
      const matchesPriority = priorityFilter === 'all' || alert.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesType && matchesPriority;
    }).sort((a, b) => new Date(b?.scheduledAt || 0) - new Date(a?.scheduledAt || 0));
  }, [alerts, searchTerm, statusFilter, typeFilter, priorityFilter]);

  const handleView = (alert) => {
    setSelectedAlert(alert);
    setIsDrawerOpen(true);
  };

  const handleRetry = (id) => {
    toast.success('Reenvio agendado com sucesso!');
    setIsDrawerOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Advanced Filters */}
      <Card className="p-4 border-border/60 shadow-sm bg-card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por destinatário, checklist ou unidade..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
          <div className="flex flex-wrap sm:flex-nowrap gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px] bg-background"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Status</SelectItem>
                <SelectItem value="Enviado">Enviado</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Falhou">Falhou</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[140px] bg-background"><SelectValue placeholder="Prioridade" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Prioridades</SelectItem>
                <SelectItem value="Crítica">Crítica</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
                <SelectItem value="Média">Média</SelectItem>
                <SelectItem value="Baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[160px] bg-background"><SelectValue placeholder="Tipo de Evento" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Eventos</SelectItem>
                <SelectItem value="critical_item">Item Crítico</SelectItem>
                <SelectItem value="overdue">Atrasado</SelectItem>
                <SelectItem value="non_compliance">Não Conformidade</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full sm:w-auto gap-2" onClick={() => {
              setSearchTerm(''); setStatusFilter('all'); setTypeFilter('all'); setPriorityFilter('all');
            }}>
              <Filter className="w-4 h-4" /> Limpar
            </Button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="border-border/60 shadow-sm overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[160px]">Data/Hora</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Unidade / Checklist</TableHead>
                <TableHead>Destinatário Principal</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <TableRow key={alert.id} className="hover:bg-muted/20 transition-colors group">
                    <TableCell className="whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {alert.scheduledAt ? format(parseISO(alert.scheduledAt), "dd/MM/yyyy HH:mm", { locale: ptBR }) : 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AlertTypeIcon type={alert.eventType} />
                        <span className="text-sm font-semibold">{getAlertTypeName(alert.eventType)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{alert.unitName || 'N/A'}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">{alert.checklistName || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{alert.destinataries?.[0]?.name || 'N/A'}</span>
                        <span className="text-xs text-muted-foreground font-mono">{alert.destinataries?.[0]?.number || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell><AlertPriorityBadge priority={alert.priority} /></TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 items-start">
                        <AlertStatusBadge status={alert.status} />
                        {alert.retryCount > 0 && (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <RefreshCw className="w-3 h-3" /> {alert.retryCount} tentativas
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleView(alert)} className="h-8 px-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="w-4 h-4 mr-1.5" /> Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Filter className="w-8 h-8 mb-2 opacity-20" />
                      <p>Nenhum alerta encontrado com os filtros atuais.</p>
                      <Button variant="link" onClick={() => {
                        setSearchTerm(''); setStatusFilter('all'); setTypeFilter('all'); setPriorityFilter('all');
                      }}>Limpar filtros</Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <AlertDetailsDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        alert={selectedAlert}
        onRetry={handleRetry}
      />
    </div>
  );
};

export default WhatsAppAlertsHistory;
