
import React, { useState, useMemo, useEffect } from 'react';
import MainLayout from '@/components/MainLayout.jsx';
import { useMockData } from '@/context/MockDataContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit2, Trash2, MapPin, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import UnitFormModal from '@/components/organizational-structure/UnitFormModal.jsx';
import DeleteConfirmationModal from '@/components/shared/DeleteConfirmationModal.jsx';

const UnitsPage = () => {
  const { units, companies, sectors, createUnit, updateUnit, deleteUnit, refreshData, isLoading, error } = useMockData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    console.log(`Renderizando ${units?.length || 0} unidades. Loading: ${isLoading}`);
  }, [units, isLoading]);

  const filteredUnits = useMemo(() => {
    if (!Array.isArray(units)) return [];
    return units.filter(unit => {
      if (!unit) return false;
      
      const matchesSearch = !searchTerm || 
        unit.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.city?.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' ? unit.isActive : !unit.isActive);
        
      const matchesCompany = companyFilter === 'all' || unit.company_id === companyFilter;

      return matchesSearch && matchesStatus && matchesCompany;
    });
  }, [units, searchTerm, statusFilter, companyFilter]);

  const getCompanyName = (unit) => {
    if (unit.expand?.company_id?.name) return unit.expand.company_id.name;
    return (companies || []).find(c => c.id === unit.company_id)?.name || 'Desconhecida';
  };

  const handleCreate = () => {
    console.log('Abrindo modal para criar nova unidade');
    setSelectedUnit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (unit) => {
    console.log('Abrindo modal para editar unidade:', unit.id);
    setSelectedUnit(unit);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (unit) => {
    console.log('Abrindo modal para deletar unidade:', unit.id);
    setSelectedUnit(unit);
    setIsDeleteOpen(true);
  };

  const handleSave = async (data) => {
    try {
      if (selectedUnit) {
        console.log('Salvando edição da unidade:', selectedUnit.id);
        await updateUnit(selectedUnit.id, data);
        toast.success('Unidade atualizada com sucesso!');
      } else {
        console.log('Salvando nova unidade');
        await createUnit(data);
        toast.success('Unidade criada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar unidade:', error);
      throw error;
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUnit) return;
    
    console.log('Confirmando exclusão da unidade:', selectedUnit.id);
    
    // Check if unit has sectors
    const hasSectors = (sectors || []).some(s => s.unit_id === selectedUnit.id);
    if (hasSectors) {
      toast.error('Não é possível excluir uma unidade que possui setores vinculados.');
      setIsDeleteOpen(false);
      return;
    }

    setIsDeleting(true);
    try {
      await deleteUnit(selectedUnit.id);
      toast.success('Unidade excluída com sucesso!');
      setIsDeleteOpen(false);
    } catch (error) {
      console.error('Erro ao excluir unidade:', error);
      toast.error(error.message || 'Erro ao excluir unidade.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Unidades</h1>
            <p className="text-muted-foreground">Gerencie as filiais e locais físicos da sua operação.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={refreshData} disabled={isLoading} className="gap-2 shadow-sm">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Recarregar
            </Button>
            <Button onClick={handleCreate} disabled={isLoading} className="gap-2 shadow-sm">
              <Plus className="w-4 h-4" /> Criar Unidade
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 text-sm">
            Erro ao carregar dados: {error}
          </div>
        )}

        <div className="bg-card p-4 rounded-2xl border shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por nome ou cidade..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background"
                disabled={isLoading}
              />
            </div>
            <Select value={companyFilter} onValueChange={setCompanyFilter} disabled={isLoading}>
              <SelectTrigger className="bg-background"><SelectValue placeholder="Empresa" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Empresas</SelectItem>
                {(companies || []).map(company => (
                  <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter} disabled={isLoading}>
              <SelectTrigger className="bg-background"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="active">Ativas</SelectItem>
                <SelectItem value="inactive">Inativas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden relative min-h-[300px]">
          {isLoading ? (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="text-sm text-muted-foreground font-medium">Carregando unidades...</p>
            </div>
          ) : filteredUnits.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Nome da Unidade</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Gerente</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUnits.map((unit) => (
                    <TableRow key={unit.id} className="hover:bg-muted/20 group">
                      <TableCell className="font-bold text-sm">{unit.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{getCompanyName(unit)}</TableCell>
                      <TableCell>
                        <div className="text-sm">{unit.city || '-'}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">{unit.address || '-'}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{unit.manager || '-'}</div>
                        <div className="text-xs text-muted-foreground">{unit.phone || '-'}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={unit.isActive ? "default" : "secondary"} className={unit.isActive ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20" : ""}>
                          {unit.isActive ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(unit)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteClick(unit)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <MapPin className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium text-foreground">Nenhuma unidade encontrada</p>
              <p className="text-sm mb-6">
                {units?.length === 0 
                  ? 'Você ainda não possui unidades cadastradas.' 
                  : 'Nenhuma unidade corresponde aos filtros atuais.'}
              </p>
              {units?.length === 0 && (
                <Button onClick={handleCreate} className="gap-2">
                  <Plus className="w-4 h-4" /> Criar Primeira Unidade
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <UnitFormModal 
        isOpen={isFormOpen}
        onClose={() => {
          console.log('Fechando modal de unidade');
          setIsFormOpen(false);
        }}
        onSave={handleSave}
        initialData={selectedUnit}
        companies={companies || []}
      />

      <DeleteConfirmationModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
        isLoading={isDeleting}
        title="Excluir Unidade"
        message={`Tem certeza que deseja excluir a unidade "${selectedUnit?.name}"? Esta ação não pode ser desfeita.`}
      />
    </MainLayout>
  );
};

export default UnitsPage;
