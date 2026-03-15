
import React, { useState, useMemo } from 'react';
import MainLayout from '@/components/MainLayout.jsx';
import { useMockData } from '@/context/MockDataContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { 
  CalendarPlus, Search, Calendar as CalendarIcon, Clock, 
  Building2, User, FileText, MoreVertical, Edit2, Trash2, 
  CheckCircle2, AlertCircle, Loader2, FilterX
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { format, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const SchedulePage = () => {
  const { executions, templates, units, users, saveExecution, deleteExecution } = useMockData();

  // State
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ unit: 'all', responsible: 'all', status: 'all' });
  
  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedExecution, setSelectedExecution] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    template_id: '',
    unit_id: '',
    assigned_to: '',
    scheduled_date: format(new Date(), 'yyyy-MM-dd'),
    scheduled_time: '08:00',
    shift: 'Manhã'
  });

  // Derived Data
  const filteredExecutions = useMemo(() => {
    if (!Array.isArray(executions)) return [];
    let result = [...executions];

    // Date Filter
    if (selectedDate) {
      result = result.filter(e => e?.scheduled_date && isSameDay(parseISO(e.scheduled_date), selectedDate));
    }

    // Search
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      result = result.filter(e => {
        if (!e) return false;
        const template = (templates || []).find(t => t?.id === e.template_id);
        return template?.name?.toLowerCase()?.includes(lower) ?? false;
      });
    }

    // Dropdown Filters
    if (filters.unit !== 'all') result = result.filter(e => e?.unit_id === filters.unit);
    if (filters.responsible !== 'all') result = result.filter(e => e?.assigned_to === filters.responsible);
    if (filters.status !== 'all') result = result.filter(e => e?.status === filters.status);

    // Sort by time
    result.sort((a, b) => (a?.scheduled_time || '').localeCompare(b?.scheduled_time || ''));

    return result;
  }, [executions, selectedDate, searchQuery, filters, templates]);

  // Helpers
  const getTemplateName = (id) => (templates || []).find(t => t?.id === id)?.name || 'Desconhecido';
  const getUnitName = (id) => (units || []).find(u => u?.id === id)?.name || 'Desconhecida';
  const getUserName = (id) => (users || []).find(u => u?.id === id)?.name || 'Desconhecido';

  const getStatusBadge = (status) => {
    const map = {
      'pending': { label: 'Pendente', class: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
      'in_progress': { label: 'Em Andamento', class: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
      'completed': { label: 'Concluído', class: 'bg-green-500/10 text-green-600 border-green-500/20' },
      'overdue': { label: 'Atrasado', class: 'bg-destructive/10 text-destructive border-destructive/20' }
    };
    const s = map[status] || map['pending'];
    return <Badge variant="outline" className={s.class}>{s.label}</Badge>;
  };

  // Handlers
  const handleOpenForm = (execution = null) => {
    if (execution) {
      setFormData({
        id: execution.id,
        template_id: execution.template_id,
        unit_id: execution.unit_id,
        assigned_to: execution.assigned_to,
        scheduled_date: execution.scheduled_date,
        scheduled_time: execution.scheduled_time,
        shift: execution.shift || 'Manhã'
      });
    } else {
      setFormData({
        template_id: '',
        unit_id: '',
        assigned_to: '',
        scheduled_date: format(selectedDate || new Date(), 'yyyy-MM-dd'),
        scheduled_time: '08:00',
        shift: 'Manhã'
      });
    }
    setIsFormOpen(true);
  };

  const handleSaveForm = async (e) => {
    e.preventDefault();
    if (!formData.template_id || !formData.unit_id || !formData.assigned_to || !formData.scheduled_date) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }

    setIsProcessing(true);
    try {
      await saveExecution(formData);
      toast.success('Agendamento salvo com sucesso!');
      setIsFormOpen(false);
    } catch (error) {
      toast.error('Erro ao salvar agendamento.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteClick = (execution) => {
    setSelectedExecution(execution);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedExecution) return;
    setIsProcessing(true);
    try {
      await deleteExecution(selectedExecution.id);
      toast.success('Agendamento excluído com sucesso!');
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error('Erro ao excluir agendamento.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({ unit: 'all', responsible: 'all', status: 'all' });
    setSelectedDate(new Date());
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Agenda de Checklists</h1>
            <p className="text-muted-foreground">Programe e acompanhe as execuções de checklists.</p>
          </div>
          <Button onClick={() => handleOpenForm()} className="gap-2 shadow-sm">
            <CalendarPlus className="w-4 h-4" /> Novo Agendamento
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar: Calendar & Filters */}
          <div className="w-full lg:w-80 shrink-0 space-y-6">
            <Card className="p-4 border-border/60 shadow-sm">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                locale={ptBR}
                className="rounded-md mx-auto"
              />
            </Card>

            <Card className="p-5 border-border/60 shadow-sm space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Filtros</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-xs text-muted-foreground">
                  <FilterX className="w-3.5 h-3.5 mr-1" /> Limpar
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Nome do checklist..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 h-9 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <Select value={filters.status} onValueChange={(v) => setFilters(prev => ({ ...prev, status: v }))}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Todos" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="in_progress">Em Andamento</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                      <SelectItem value="overdue">Atrasado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Unidade</Label>
                  <Select value={filters.unit} onValueChange={(v) => setFilters(prev => ({ ...prev, unit: v }))}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Todas" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Unidades</SelectItem>
                      {(units || []).map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Responsável</Label>
                  <Select value={filters.responsible} onValueChange={(v) => setFilters(prev => ({ ...prev, responsible: v }))}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Todos" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Responsáveis</SelectItem>
                      {(users || []).map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Content: List */}
          <div className="flex-1 min-w-0">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                {selectedDate ? format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR }) : 'Todos os Agendamentos'}
              </h2>
              <Badge variant="secondary" className="font-medium">
                {filteredExecutions.length} {filteredExecutions.length === 1 ? 'agendamento' : 'agendamentos'}
              </Badge>
            </div>

            <div className="space-y-3">
              {filteredExecutions.length > 0 ? (
                filteredExecutions.map((execution) => (
                  <Card key={execution.id} className="p-4 flex flex-col sm:flex-row gap-4 sm:items-center hover:shadow-md transition-all border-border/60 group">
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary font-bold text-lg shrink-0">
                      {execution.scheduled_time}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-base truncate group-hover:text-primary transition-colors">
                          {getTemplateName(execution.template_id)}
                        </h3>
                        {getStatusBadge(execution.status)}
                      </div>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground mt-2">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5" />
                          <span className="font-medium text-foreground">{getUnitName(execution.unit_id)}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          <span className="font-medium text-foreground">{getUserName(execution.assigned_to)}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Turno: {execution.shift || 'N/A'}</span>
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center justify-end border-t sm:border-t-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => handleOpenForm(execution)}>
                            <Edit2 className="w-4 h-4 mr-2" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteClick(execution)} className="text-destructive focus:text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
                  <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-bold mb-2">Nenhum agendamento</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Não há checklists programados para esta data com os filtros atuais.
                  </p>
                  <Button onClick={() => handleOpenForm()} variant="outline" className="gap-2">
                    <CalendarPlus className="w-4 h-4" /> Agendar Agora
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <Dialog open={isFormOpen} onOpenChange={(open) => !isProcessing && setIsFormOpen(open)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{formData.id ? 'Editar Agendamento' : 'Novo Agendamento'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSaveForm} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Modelo de Checklist <span className="text-destructive">*</span></Label>
              <Select value={formData.template_id} onValueChange={(v) => setFormData(prev => ({ ...prev, template_id: v }))} disabled={isProcessing}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {(templates || []).map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Unidade <span className="text-destructive">*</span></Label>
              <Select value={formData.unit_id} onValueChange={(v) => setFormData(prev => ({ ...prev, unit_id: v }))} disabled={isProcessing}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {(units || []).map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Responsável <span className="text-destructive">*</span></Label>
              <Select value={formData.assigned_to} onValueChange={(v) => setFormData(prev => ({ ...prev, assigned_to: v }))} disabled={isProcessing}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {(users || []).map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data <span className="text-destructive">*</span></Label>
                <Input 
                  type="date" 
                  value={formData.scheduled_date} 
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduled_date: e.target.value }))}
                  disabled={isProcessing}
                />
              </div>
              <div className="space-y-2">
                <Label>Horário</Label>
                <Input 
                  type="time" 
                  value={formData.scheduled_time} 
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduled_time: e.target.value }))}
                  disabled={isProcessing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Turno</Label>
              <Select value={formData.shift} onValueChange={(v) => setFormData(prev => ({ ...prev, shift: v }))} disabled={isProcessing}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manhã">Manhã</SelectItem>
                  <SelectItem value="Tarde">Tarde</SelectItem>
                  <SelectItem value="Noite">Noite</SelectItem>
                  <SelectItem value="Madrugada">Madrugada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} disabled={isProcessing}>Cancelar</Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={(open) => !isProcessing && setIsDeleteOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Excluir Agendamento
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDeleteOpen(false)} disabled={isProcessing}>Cancelar</Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isProcessing}>
              {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default SchedulePage;
