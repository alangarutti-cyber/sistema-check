
import React, { useState, useMemo } from 'react';
import MainLayout from '@/components/MainLayout.jsx';
import { useMockData } from '@/context/MockDataContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

import CorrectiveActionCard from '@/components/corrective-actions/CorrectiveActionCard.jsx';
import CorrectiveActionFormModal from '@/components/corrective-actions/CorrectiveActionFormModal.jsx';
import CorrectiveActionDetailModal from '@/components/corrective-actions/CorrectiveActionDetailModal.jsx';
import CorrectiveActionDeleteConfirmModal from '@/components/corrective-actions/CorrectiveActionDeleteConfirmModal.jsx';
import CorrectiveActionStatusUpdateModal from '@/components/corrective-actions/CorrectiveActionStatusUpdateModal.jsx';

const CorrectiveActionsPage = () => {
  const { 
    correctiveActions, units, sectors, users, 
    addCorrectiveAction, updateCorrectiveAction, deleteCorrectiveAction, updateCorrectiveActionStatus 
  } = useMockData();

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [unitFilter, setUnitFilter] = useState('all');
  const [sortBy, setSortBy] = useState('deadline_asc');

  // Modals State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

  // Helpers
  const getUserName = (id) => (users || []).find(u => u?.id === id)?.name || 'Desconhecido';
  const getUnitName = (id) => (units || []).find(u => u?.id === id)?.name || 'Desconhecida';
  const getSectorName = (id) => (sectors || []).find(s => s?.id === id)?.name || '';

  // Filter and Sort Logic
  const filteredActions = useMemo(() => {
    if (!Array.isArray(correctiveActions)) return [];
    let result = [...correctiveActions];

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(a => {
        if (!a) return false;
        return (a?.title?.toLowerCase()?.includes(lower) ?? false) || 
               (a?.description?.toLowerCase()?.includes(lower) ?? false) ||
               (a?.id?.toLowerCase()?.includes(lower) ?? false);
      });
    }

    if (statusFilter !== 'all') result = result.filter(a => a?.status === statusFilter);
    if (priorityFilter !== 'all') result = result.filter(a => a?.priority === priorityFilter);
    if (unitFilter !== 'all') result = result.filter(a => a?.unit_id === unitFilter);

    result.sort((a, b) => {
      if (sortBy === 'deadline_asc') return new Date(a?.deadline || 0) - new Date(b?.deadline || 0);
      if (sortBy === 'deadline_desc') return new Date(b?.deadline || 0) - new Date(a?.deadline || 0);
      if (sortBy === 'newest') return new Date(b?.created_at || 0) - new Date(a?.created_at || 0);
      if (sortBy === 'priority') {
        const pMap = { 'Crítica': 4, 'Alta': 3, 'Média': 2, 'Baixa': 1 };
        return (pMap[b?.priority] || 0) - (pMap[a?.priority] || 0);
      }
      return 0;
    });

    return result;
  }, [correctiveActions, searchTerm, statusFilter, priorityFilter, unitFilter, sortBy]);

  // Handlers
  const handleCreate = () => {
    setSelectedAction(null);
    setIsFormOpen(true);
  };

  const handleEdit = (action) => {
    setSelectedAction(action);
    setIsDetailOpen(false);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (action) => {
    setSelectedAction(action);
    setIsDetailOpen(false);
    setIsDeleteOpen(true);
  };

  const handleStatusClick = (action) => {
    setSelectedAction(action);
    setIsDetailOpen(false);
    setIsStatusOpen(true);
  };

  const handleSaveForm = async (data) => {
    try {
      if (selectedAction) {
        await updateCorrectiveAction(selectedAction.id, data);
        toast.success('Ação atualizada com sucesso!');
      } else {
        await addCorrectiveAction(data);
        toast.success('Ação criada com sucesso!');
      }
    } catch (error) {
      toast.error('Erro ao salvar ação.');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCorrectiveAction(selectedAction.id);
      toast.success('Ação excluída com sucesso!');
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error('Erro ao excluir ação.');
    }
  };

  const handleSaveStatus = async (status, comments, evidence) => {
    try {
      await updateCorrectiveActionStatus(selectedAction.id, status, comments, evidence);
      toast.success('Status atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar status.');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Ações Corretivas</h1>
            <p className="text-muted-foreground">Gerencie e acompanhe a resolução de não conformidades.</p>
          </div>
          <Button onClick={handleCreate} className="gap-2 shadow-sm">
            <Plus className="w-4 h-4"/> Nova Ação
          </Button>
        </div>

        {/* Filters Panel */}
        <div className="bg-card p-4 rounded-2xl border shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por título, ID ou descrição..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Aberta">Aberta</SelectItem>
                <SelectItem value="Em Progresso">Em Progresso</SelectItem>
                <SelectItem value="Resolvida">Resolvida</SelectItem>
                <SelectItem value="Verificada">Verificada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger><SelectValue placeholder="Prioridade" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Prioridades</SelectItem>
                <SelectItem value="Crítica">Crítica</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
                <SelectItem value="Média">Média</SelectItem>
                <SelectItem value="Baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>
            <Select value={unitFilter} onValueChange={setUnitFilter}>
              <SelectTrigger><SelectValue placeholder="Unidade" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Unidades</SelectItem>
                {(units || []).map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-sm text-muted-foreground font-medium">
              {filteredActions.length} {filteredActions.length === 1 ? 'resultado' : 'resultados'}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Ordenar por:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="deadline_asc">Prazo (Mais próximo)</SelectItem>
                  <SelectItem value="deadline_desc">Prazo (Mais distante)</SelectItem>
                  <SelectItem value="priority">Prioridade (Maior)</SelectItem>
                  <SelectItem value="newest">Mais recentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* List */}
        {filteredActions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredActions.map((action) => (
              <CorrectiveActionCard 
                key={action.id} 
                action={action} 
                onOpen={(a) => { setSelectedAction(a); setIsDetailOpen(true); }}
                getUserName={getUserName}
                getUnitName={getUnitName}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold mb-2">Nenhuma ação encontrada</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Tente ajustar os filtros ou criar uma nova ação corretiva.
            </p>
            <Button onClick={handleCreate} variant="outline" className="gap-2">
              <Plus className="w-4 h-4" /> Limpar Filtros e Criar
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <CorrectiveActionFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveForm}
        initialData={selectedAction}
        units={units || []}
        sectors={sectors || []}
        users={users || []}
      />

      <CorrectiveActionDetailModal 
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        action={selectedAction}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onUpdateStatus={handleStatusClick}
        getUserName={getUserName}
        getUnitName={getUnitName}
        getSectorName={getSectorName}
      />

      <CorrectiveActionDeleteConfirmModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        actionTitle={selectedAction?.title}
      />

      <CorrectiveActionStatusUpdateModal 
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
        onSave={handleSaveStatus}
        currentStatus={selectedAction?.status}
      />
    </MainLayout>
  );
};

export default CorrectiveActionsPage;
