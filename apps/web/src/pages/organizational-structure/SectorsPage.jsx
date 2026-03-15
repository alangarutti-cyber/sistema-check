
import React, { useState, useMemo, useEffect } from 'react';
import MainLayout from '@/components/MainLayout.jsx';
import { useMockData } from '@/context/MockDataContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit2, Trash2, Layers, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import SectorFormModal from '@/components/organizational-structure/SectorFormModal.jsx';
import DeleteConfirmationModal from '@/components/shared/DeleteConfirmationModal.jsx';

const SectorsPage = () => {
  const { sectors, units, companies, createSector, updateSector, deleteSector, refreshData, isLoading, error } = useMockData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [unitFilter, setUnitFilter] = useState('all');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    console.log(`Renderizando ${sectors?.length || 0} setores. Loading: ${isLoading}`);
  }, [sectors, isLoading]);

  // Dynamic units for filter based on selected company
  const availableUnitsForFilter = useMemo(() => {
    if (companyFilter === 'all') return units || [];
    return (units || []).filter(u => u.company_id === companyFilter);
  }, [units, companyFilter]);

  const filteredSectors = useMemo(() => {
    if (!Array.isArray(sectors)) return [];
    return sectors.filter(sector => {
      if (!sector) return false;
      
      const matchesSearch = !searchTerm || 
        sector.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sector.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' ? sector.isActive : !sector.isActive);
        
      // Company ID might be in description JSON or we can get it from unit
      const sectorCompanyId = sector.company_id || sector.expand?.unit_id?.company_id;
      const matchesCompany = companyFilter === 'all' || sectorCompanyId === companyFilter;
      const matchesUnit = unitFilter === 'all' || sector.unit_id === unitFilter;

      return matchesSearch && matchesStatus && matchesCompany && matchesUnit;
    });
  }, [sectors, searchTerm, statusFilter, companyFilter, unitFilter]);

  const getUnitName = (sector) => {
    if (sector.expand?.unit_id?.name) return sector.expand.unit_id.name;
    return (units || []).find(u => u.id === sector.unit_id)?.name || 'Desconhecida';
  };

  const getCompanyName = (sector) => {
    if (sector.expand?.unit_id?.expand?.company_id?.name) return sector.expand.unit_id.expand.company_id.name;
    const sectorCompanyId = sector.company_id || sector.expand?.unit_id?.company_id;
    return (companies || []).find(c => c.id === sectorCompanyId)?.name || 'Desconhecida';
  };

  const handleCreate = () => {
    console.log('Abrindo modal para criar novo setor');
    setSelectedSector(null);
    setIsFormOpen(true);
  };

  const handleEdit = (sector) => {
    console.log('Abrindo modal para editar setor:', sector.id);
    setSelectedSector(sector);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (sector) => {
    console.log('Abrindo modal para deletar setor:', sector.id);
    setSelectedSector(sector);
    setIsDeleteOpen(true);
  };

  const handleSave = async (data) => {
    try {
      if (selectedSector) {
        console.log('Salvando edição do setor:', selectedSector.id);
        await updateSector(selectedSector.id, data);
        toast.success('Setor atualizado com sucesso!');
      } else {
        console.log('Salvando novo setor');
        await createSector(data);
        toast.success('Setor criado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar setor:', error);
      throw error;
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedSector) return;
    
    console.log('Confirmando exclusão do setor:', selectedSector.id);
    setIsDeleting(true);
    try {
      await deleteSector(selectedSector.id);
      toast.success('Setor excluído com sucesso!');
      setIsDeleteOpen(false);
    } catch (error) {
      console.error('Erro ao excluir setor:', error);
      toast.error(error.message || 'Erro ao excluir setor.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Setores</h1>
            <p className="text-muted-foreground">Organize as áreas e departamentos dentro de cada unidade.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={refreshData} disabled={isLoading} className="gap-2 shadow-sm">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Recarregar
            </Button>
            <Button onClick={handleCreate} disabled={isLoading} className="gap-2 shadow-sm">
              <Plus className="w-4 h-4" /> Criar Setor
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 text-sm">
            Erro ao carregar dados: {error}
          </div>
        )}

        <div className="bg-card p-4 rounded-2xl border shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar setor..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background"
                disabled={isLoading}
              />
            </div>
            <Select 
              value={companyFilter} 
              onValueChange={(v) => {
                setCompanyFilter(v);
                setUnitFilter('all'); // Reset unit filter when company changes
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="bg-background"><SelectValue placeholder="Empresa" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Empresas</SelectItem>
                {(companies || []).map(company => (
                  <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              value={unitFilter} 
              onValueChange={setUnitFilter}
              disabled={isLoading || (companyFilter !== 'all' && availableUnitsForFilter.length === 0)}
            >
              <SelectTrigger className="bg-background"><SelectValue placeholder="Unidade" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Unidades</SelectItem>
                {availableUnitsForFilter.map(unit => (
                  <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter} disabled={isLoading}>
              <SelectTrigger className="bg-background"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden relative min-h-[300px]">
          {isLoading ? (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="text-sm text-muted-foreground font-medium">Carregando setores...</p>
            </div>
          ) : filteredSectors.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Nome do Setor</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSectors.map((sector) => (
                    <TableRow key={sector.id} className="hover:bg-muted/20 group">
                      <TableCell className="font-bold text-sm">{sector.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{getCompanyName(sector)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{getUnitName(sector)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[250px] truncate" title={sector.description}>
                        {sector.description || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={sector.isActive ? "default" : "secondary"} className={sector.isActive ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20" : ""}>
                          {sector.isActive ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(sector)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteClick(sector)}>
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
              <Layers className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium text-foreground">Nenhum setor encontrado</p>
              <p className="text-sm mb-6">
                {sectors?.length === 0 
                  ? 'Você ainda não possui setores cadastrados.' 
                  : 'Nenhum setor corresponde aos filtros atuais.'}
              </p>
              {sectors?.length === 0 && (
                <Button onClick={handleCreate} className="gap-2">
                  <Plus className="w-4 h-4" /> Criar Primeiro Setor
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <SectorFormModal 
        isOpen={isFormOpen}
        onClose={() => {
          console.log('Fechando modal de setor');
          setIsFormOpen(false);
        }}
        onSave={handleSave}
        initialData={selectedSector}
        companies={companies || []}
        units={units || []}
      />

      <DeleteConfirmationModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
        isLoading={isDeleting}
        title="Excluir Setor"
        message={`Tem certeza que deseja excluir o setor "${selectedSector?.name}"? Esta ação não pode ser desfeita.`}
      />
    </MainLayout>
  );
};

export default SectorsPage;
