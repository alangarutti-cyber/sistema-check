
import React, { useState, useMemo, useEffect } from 'react';
import MainLayout from '@/components/MainLayout.jsx';
import { useMockData } from '@/context/MockDataContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit2, Trash2, Building2, RefreshCw, BugPlay, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import CompanyFormModal from '@/components/organizational-structure/CompanyFormModal.jsx';
import DeleteConfirmationModal from '@/components/shared/DeleteConfirmationModal.jsx';

const CompaniesPage = () => {
  const { companies, createCompany, updateCompany, deleteCompany, units, refreshData, isLoading, error } = useMockData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    console.log(`Renderizando ${companies?.length || 0} empresas. Loading: ${isLoading}`);
  }, [companies, isLoading]);

  const uniqueStates = useMemo(() => {
    const states = new Set((companies || []).map(c => c.state).filter(Boolean));
    return Array.from(states).sort();
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    if (!Array.isArray(companies)) return [];
    return companies.filter(company => {
      if (!company) return false;
      
      const matchesSearch = !searchTerm || 
        company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.tradeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.cnpj?.includes(searchTerm);
        
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' ? company.isActive : !company.isActive);
        
      const matchesState = stateFilter === 'all' || company.state === stateFilter;

      return matchesSearch && matchesStatus && matchesState;
    });
  }, [companies, searchTerm, statusFilter, stateFilter]);

  const handleCreate = () => {
    console.log('Abrindo modal para criar nova empresa');
    setSelectedCompany(null);
    setIsFormOpen(true);
  };

  const handleEdit = (company) => {
    console.log('Abrindo modal para editar empresa:', company.id);
    setSelectedCompany(company);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (company) => {
    console.log('Abrindo modal para deletar empresa:', company.id);
    setSelectedCompany(company);
    setIsDeleteOpen(true);
  };

  const handleSave = async (data) => {
    try {
      if (selectedCompany) {
        console.log('Salvando edição da empresa:', selectedCompany.id);
        await updateCompany(selectedCompany.id, data);
        toast.success('Empresa atualizada com sucesso!');
      } else {
        console.log('Salvando nova empresa');
        await createCompany(data);
        toast.success('Empresa criada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar empresa:', error);
      throw error;
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCompany) return;
    
    console.log('Confirmando exclusão da empresa:', selectedCompany.id);
    
    // Check if company has units
    const hasUnits = (units || []).some(u => u.company_id === selectedCompany.id);
    if (hasUnits) {
      toast.error('Não é possível excluir uma empresa que possui unidades vinculadas.');
      setIsDeleteOpen(false);
      return;
    }

    setIsDeleting(true);
    try {
      await deleteCompany(selectedCompany.id);
      toast.success('Empresa excluída com sucesso!');
      setIsDeleteOpen(false);
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
      toast.error(error.message || 'Erro ao excluir empresa.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTestCreate = async () => {
    setIsTesting(true);
    const testName = `Empresa Teste ${new Date().toLocaleTimeString()}`;
    const toastId = toast.loading('Criando empresa teste (apenas nome)...');
    
    try {
      await createCompany({ name: testName });
      toast.success(`Empresa "${testName}" criada com sucesso!`, { id: toastId });
    } catch (error) {
      toast.error(`Erro ao criar: ${error.message}`, { id: toastId });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Empresas</h1>
            <p className="text-muted-foreground">Gerencie as empresas e redes da sua organização.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" onClick={handleTestCreate} disabled={isTesting || isLoading} className="gap-2 shadow-sm border-dashed border-primary/50 text-primary hover:bg-primary/5">
              <BugPlay className={`w-4 h-4 ${isTesting ? 'animate-pulse' : ''}`} />
              Test Create
            </Button>
            <Button variant="outline" onClick={refreshData} disabled={isLoading} className="gap-2 shadow-sm">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Recarregar
            </Button>
            <Button onClick={handleCreate} disabled={isLoading} className="gap-2 shadow-sm">
              <Plus className="w-4 h-4" /> Criar Empresa
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
                placeholder="Buscar por nome ou CNPJ..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background"
                disabled={isLoading}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter} disabled={isLoading}>
              <SelectTrigger className="bg-background"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="active">Ativas</SelectItem>
                <SelectItem value="inactive">Inativas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stateFilter} onValueChange={setStateFilter} disabled={isLoading}>
              <SelectTrigger className="bg-background"><SelectValue placeholder="Estado" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Estados</SelectItem>
                {uniqueStates.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden relative min-h-[300px]">
          {isLoading ? (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="text-sm text-muted-foreground font-medium">Carregando empresas...</p>
            </div>
          ) : filteredCompanies.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Nome / Razão Social</TableHead>
                    <TableHead>CNPJ</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.map((company) => (
                    <TableRow key={company.id} className="hover:bg-muted/20 group">
                      <TableCell>
                        <div className="font-bold text-sm">{company.name}</div>
                        {company.tradeName && <div className="text-xs text-muted-foreground">{company.tradeName}</div>}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{company.cnpj || '-'}</TableCell>
                      <TableCell>
                        <div className="text-sm">{company.email || '-'}</div>
                        <div className="text-xs text-muted-foreground">{company.phone || '-'}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{company.city || '-'}</div>
                        <div className="text-xs text-muted-foreground">{company.state || '-'}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={company.isActive ? "default" : "secondary"} className={company.isActive ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20" : ""}>
                          {company.isActive ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(company)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteClick(company)}>
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
              <Building2 className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium text-foreground">Nenhuma empresa encontrada</p>
              <p className="text-sm mb-6">
                {companies?.length === 0 
                  ? 'Você ainda não possui empresas cadastradas.' 
                  : 'Nenhuma empresa corresponde aos filtros atuais.'}
              </p>
              {companies?.length === 0 && (
                <Button onClick={handleCreate} className="gap-2">
                  <Plus className="w-4 h-4" /> Criar Primeira Empresa
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <CompanyFormModal 
        isOpen={isFormOpen}
        onClose={() => {
          console.log('Fechando modal de empresa');
          setIsFormOpen(false);
        }}
        onSave={handleSave}
        initialData={selectedCompany}
      />

      <DeleteConfirmationModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
        isLoading={isDeleting}
        title="Excluir Empresa"
        message={`Tem certeza que deseja excluir a empresa "${selectedCompany?.name}"? Esta ação não pode ser desfeita.`}
      />
    </MainLayout>
  );
};

export default CompaniesPage;
