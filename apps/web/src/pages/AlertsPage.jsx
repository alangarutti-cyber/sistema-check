
import React, { useState, useMemo } from 'react';
import MainLayout from '@/components/MainLayout.jsx';
import { useMockData } from '@/context/MockDataContext.jsx';
import { Button } from '@/components/ui/button';
import { Check, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import AlertCard from '@/components/alerts/AlertCard.jsx';
import FilterPanel from '@/components/alerts/FilterPanel.jsx';
import AlertDetailModal from '@/components/alerts/AlertDetailModal.jsx';
import AlertDeleteConfirmModal from '@/components/alerts/AlertDeleteConfirmModal.jsx';

const AlertsPage = () => {
  const { alerts, updateAlert, deleteAlert } = useMockData();

  // State
  const [activeTab, setActiveTab] = useState('unresolved'); // 'unresolved', 'resolved', 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [filters, setFilters] = useState({
    type: 'all',
    severity: 'all',
    unit: 'all',
    responsible: 'all'
  });

  // Modals State
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [alertToDelete, setAlertToDelete] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Derived Data for Filters
  const uniqueUnits = useMemo(() => [...new Set((alerts || []).map(a => a?.unit).filter(Boolean))], [alerts]);
  const uniqueResponsibles = useMemo(() => [...new Set((alerts || []).map(a => a?.responsible).filter(Boolean))], [alerts]);

  // Filtering and Sorting Logic
  const filteredAlerts = useMemo(() => {
    if (!Array.isArray(alerts)) return [];
    let result = [...alerts];

    // Tab Filter
    if (activeTab === 'unresolved') result = result.filter(a => a?.status === 'unresolved');
    if (activeTab === 'resolved') result = result.filter(a => a?.status === 'resolved');

    // Search
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      result = result.filter(a => {
        if (!a) return false;
        return (a?.title?.toLowerCase()?.includes(lower) ?? false) || 
               (a?.description?.toLowerCase()?.includes(lower) ?? false);
      });
    }

    // Dropdown Filters
    if (filters.type !== 'all') result = result.filter(a => a?.type === filters.type);
    if (filters.severity !== 'all') result = result.filter(a => a?.severity === filters.severity);
    if (filters.unit !== 'all') result = result.filter(a => a?.unit === filters.unit);
    if (filters.responsible !== 'all') result = result.filter(a => a?.responsible === filters.responsible);

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date_desc') return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
      if (sortBy === 'date_asc') return new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0);
      if (sortBy === 'severity') {
        const sMap = { 'Crítica': 4, 'Alta': 3, 'Média': 2, 'Baixa': 1 };
        return (sMap[b?.severity] || 0) - (sMap[a?.severity] || 0);
      }
      if (sortBy === 'type') return (a?.type || '').localeCompare(b?.type || '');
      return 0;
    });

    return result;
  }, [alerts, activeTab, searchQuery, filters, sortBy]);

  // Stats
  const unreadCount = (alerts || []).filter(a => a && !a.isRead).length;
  const unresolvedCount = (alerts || []).filter(a => a?.status === 'unresolved').length;

  // Handlers
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({ type: 'all', severity: 'all', unit: 'all', responsible: 'all' });
    setSortBy('date_desc');
  };

  const handleToggleRead = async (id, isRead) => {
    try {
      await updateAlert(id, { isRead });
      toast.success(isRead ? 'Marcado como lido' : 'Marcado como não lido');
      if (selectedAlert?.id === id) {
        setSelectedAlert(prev => ({ ...prev, isRead }));
      }
    } catch (error) {
      toast.error('Erro ao atualizar status de leitura');
    }
  };

  const handleToggleResolve = async (id, isResolved) => {
    try {
      await updateAlert(id, { status: isResolved ? 'resolved' : 'unresolved' });
      toast.success(isResolved ? 'Alerta resolvido' : 'Alerta reaberto');
      if (selectedAlert?.id === id) {
        setSelectedAlert(prev => ({ ...prev, status: isResolved ? 'resolved' : 'unresolved' }));
      }
    } catch (error) {
      toast.error('Erro ao atualizar status de resolução');
    }
  };

  const handleDeleteClick = (alert) => {
    setAlertToDelete(alert);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!alertToDelete) return;
    try {
      await deleteAlert(alertToDelete.id);
      toast.success('Alerta excluído com sucesso');
      setIsDeleteOpen(false);
      if (selectedAlert?.id === alertToDelete.id) {
        setIsDetailOpen(false);
      }
    } catch (error) {
      toast.error('Erro ao excluir alerta');
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadAlerts = (alerts || []).filter(a => a && !a.isRead);
    if (unreadAlerts.length === 0) return;
    
    try {
      await Promise.all(unreadAlerts.map(a => updateAlert(a.id, { isRead: true })));
      toast.success('Todos os alertas marcados como lidos');
    } catch (error) {
      toast.error('Erro ao atualizar alertas');
    }
  };

  const openDetail = (alert) => {
    setSelectedAlert(alert);
    setIsDetailOpen(true);
    if (!alert.isRead) {
      handleToggleRead(alert.id, true);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Central de Alertas</h1>
            <p className="text-muted-foreground">Gerencie notificações críticas e desvios operacionais.</p>
          </div>
          <Button variant="outline" onClick={handleMarkAllAsRead} disabled={unreadCount === 0} className="gap-2">
            <Check className="w-4 h-4" /> Marcar todos como lidos ({unreadCount})
          </Button>
        </div>

        {/* Filters */}
        <FilterPanel 
          filters={filters}
          setFilters={setFilters}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          units={uniqueUnits}
          responsibles={uniqueResponsibles}
          onClear={handleClearFilters}
        />

        {/* Tabs */}
        <div className="flex gap-2 border-b pb-px overflow-x-auto hide-scrollbar">
          <button 
            onClick={() => setActiveTab('unresolved')}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'unresolved' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            Não Resolvidos ({unresolvedCount})
          </button>
          <button 
            onClick={() => setActiveTab('resolved')}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'resolved' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            Resolvidos
          </button>
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'all' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            Todos os Alertas
          </button>
        </div>

        {/* List */}
        <div className="space-y-3">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <AlertCard 
                key={alert.id} 
                alert={alert} 
                onView={openDetail}
                onToggleRead={handleToggleRead}
                onToggleResolve={handleToggleResolve}
                onDelete={handleDeleteClick}
              />
            ))
          ) : (
            <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
              <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-bold mb-1">Nenhum alerta encontrado</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Não há alertas que correspondam aos filtros atuais ou você está com tudo em dia!
              </p>
              {(searchQuery || filters.type !== 'all' || filters.severity !== 'all' || filters.unit !== 'all' || filters.responsible !== 'all') && (
                <Button variant="link" onClick={handleClearFilters} className="mt-4">
                  Limpar filtros
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AlertDetailModal 
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        alert={selectedAlert}
        onToggleRead={handleToggleRead}
        onToggleResolve={handleToggleResolve}
        onDelete={handleDeleteClick}
      />

      <AlertDeleteConfirmModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        alertTitle={alertToDelete?.title}
      />
    </MainLayout>
  );
};

export default AlertsPage;
