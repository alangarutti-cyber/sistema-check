
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

const FilterPanel = ({ 
  filters, 
  setFilters, 
  searchQuery, 
  setSearchQuery, 
  sortBy, 
  setSortBy,
  units,
  responsibles,
  onClear 
}) => {
  
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-card p-4 rounded-2xl border shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por título ou descrição..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
        
        <Select value={filters.type} onValueChange={(v) => handleFilterChange('type', v)}>
          <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value="critical_problem">Problema Crítico</SelectItem>
            <SelectItem value="overdue_checklist">Checklist Atrasado</SelectItem>
            <SelectItem value="not_started_checklist">Checklist Não Iniciado</SelectItem>
            <SelectItem value="overdue_action">Ação Corretiva Vencida</SelectItem>
            <SelectItem value="execution_issues">Execução com Ressalvas</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.severity} onValueChange={(v) => handleFilterChange('severity', v)}>
          <SelectTrigger><SelectValue placeholder="Prioridade" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Prioridades</SelectItem>
            <SelectItem value="Crítica">Crítica</SelectItem>
            <SelectItem value="Alta">Alta</SelectItem>
            <SelectItem value="Média">Média</SelectItem>
            <SelectItem value="Baixa">Baixa</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.unit} onValueChange={(v) => handleFilterChange('unit', v)}>
          <SelectTrigger><SelectValue placeholder="Unidade" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Unidades</SelectItem>
            {units.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filters.responsible} onValueChange={(v) => handleFilterChange('responsible', v)}>
          <SelectTrigger><SelectValue placeholder="Responsável" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Responsáveis</SelectItem>
            {responsibles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2 border-t">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Ordenar por:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="date_desc">Mais recentes</SelectItem>
              <SelectItem value="date_asc">Mais antigos</SelectItem>
              <SelectItem value="severity">Maior Prioridade</SelectItem>
              <SelectItem value="type">Tipo de Alerta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground hover:text-foreground h-8 px-2">
          <X className="w-3.5 h-3.5 mr-1.5" /> Limpar Filtros
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;
