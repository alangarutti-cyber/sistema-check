
import React, { useState, useMemo, useRef } from 'react';
import MainLayout from '@/components/MainLayout.jsx';
import { useMockData } from '@/context/MockDataContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit2, Trash2, Users as UsersIcon, RefreshCw, Download, Upload, KeyRound, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import UserFormModal from '@/components/users/UserFormModal.jsx';
import ResetPasswordModal from '@/components/users/ResetPasswordModal.jsx';
import DeleteUserConfirmModal from '@/components/users/DeleteUserConfirmModal.jsx';
import UserPermissionBadge from '@/components/users/UserPermissionBadge.jsx';
import UserStatusBadge from '@/components/users/UserStatusBadge.jsx';

const UsersPage = () => {
  const { 
    users, companies, units, sectors, 
    createUser, updateUser, deleteUser, resetUserPassword, 
    refreshData, isLoading, error 
  } = useMockData();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [unitFilter, setUnitFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef(null);

  // Dynamic dropdowns for filters
  const availableUnits = useMemo(() => {
    if (companyFilter === 'all') return units || [];
    return (units || []).filter(u => u.company_id === companyFilter);
  }, [units, companyFilter]);

  const availableSectors = useMemo(() => {
    if (unitFilter === 'all') return sectors || [];
    return (sectors || []).filter(s => s.unit_id === unitFilter);
  }, [sectors, unitFilter]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    return users.filter(user => {
      if (!user) return false;
      
      const matchesSearch = !searchTerm || 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesCompany = companyFilter === 'all' || user.company_id === companyFilter;
      const matchesUnit = unitFilter === 'all' || user.unit_id === unitFilter;
      const matchesSector = sectorFilter === 'all' || user.sector_id === sectorFilter;
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

      return matchesSearch && matchesCompany && matchesUnit && matchesSector && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, companyFilter, unitFilter, sectorFilter, roleFilter, statusFilter]);

  // Helpers
  const getCompanyName = (id) => (companies || []).find(c => c.id === id)?.name || '-';
  const getUnitName = (id) => (units || []).find(u => u.id === id)?.name || '-';
  const getSectorName = (id) => (sectors || []).find(s => s.id === id)?.name || '-';

  // Handlers
  const handleCreate = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleResetPassword = (user) => {
    setSelectedUser(user);
    setIsResetOpen(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleSave = async (data) => {
    setIsSaving(true);
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, data);
        toast.success('Usuário atualizado com sucesso!');
      } else {
        await createUser(data);
        toast.success('Usuário criado com sucesso!');
      }
      setIsFormOpen(false);
    } catch (error) {
      toast.error(error.message || 'Erro ao salvar usuário.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmReset = async (userId, newPassword) => {
    setIsSaving(true);
    try {
      await resetUserPassword(userId, newPassword);
      toast.success('Senha redefinida com sucesso!');
      setIsResetOpen(false);
    } catch (error) {
      toast.error(error.message || 'Erro ao redefinir senha.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async (userId) => {
    setIsSaving(true);
    try {
      await deleteUser(userId);
      toast.success('Usuário excluído com sucesso!');
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error(error.message || 'Erro ao excluir usuário.');
    } finally {
      setIsSaving(false);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (filteredUsers.length === 0) {
      toast.error('Não há usuários para exportar.');
      return;
    }

    const headers = ['Nome', 'Email', 'Telefone', 'Cargo', 'Perfil', 'Status', 'Empresa', 'Unidade', 'Setor', 'Data Contratação'];
    const rows = filteredUsers.map(u => [
      `"${u.name || ''}"`,
      `"${u.email || ''}"`,
      `"${u.phone || ''}"`,
      `"${u.position || ''}"`,
      `"${u.role || ''}"`,
      `"${u.status || ''}"`,
      `"${getCompanyName(u.company_id)}"`,
      `"${getUnitName(u.unit_id)}"`,
      `"${getSectorName(u.sector_id)}"`,
      `"${u.hire_date ? u.hire_date.split(' ')[0] : ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `usuarios_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Import
  const handleImportCSV = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading('Importando usuários...');
    
    try {
      const text = await file.text();
      const rows = text.split('\n').map(row => row.split(',').map(cell => cell.replace(/^"|"$/g, '').trim()));
      
      if (rows.length < 2) throw new Error('Arquivo CSV vazio ou inválido.');
      
      // Skip header row
      let successCount = 0;
      let errorCount = 0;

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length < 2 || !row[0] || !row[1]) continue; // Skip empty rows

        try {
          // Basic mapping assuming format: Nome, Email, Telefone, Cargo, Perfil, Status
          await createUser({
            name: row[0],
            email: row[1],
            password: 'Password123!', // Default password for imported users
            phone: row[2] || '',
            position: row[3] || '',
            role: row[4] || 'operator',
            status: row[5] || 'active',
            company_id: companies[0]?.id || '', // Fallback to first company
            unit_id: units[0]?.id || '',
            sector_id: sectors[0]?.id || ''
          });
          successCount++;
        } catch (err) {
          console.error(`Erro ao importar linha ${i}:`, err);
          errorCount++;
        }
      }

      toast.success(`Importação concluída: ${successCount} sucesso, ${errorCount} erros.`, { id: toastId });
      refreshData();
    } catch (error) {
      toast.error(`Erro na importação: ${error.message}`, { id: toastId });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Usuários</h1>
            <p className="text-muted-foreground">Gerencie os acessos e permissões da sua equipe.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImportCSV} 
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="gap-2 shadow-sm">
              <Upload className="w-4 h-4" /> Importar
            </Button>
            <Button variant="outline" onClick={handleExportCSV} disabled={isLoading || filteredUsers.length === 0} className="gap-2 shadow-sm">
              <Download className="w-4 h-4" /> Exportar
            </Button>
            <Button variant="outline" onClick={refreshData} disabled={isLoading} className="gap-2 shadow-sm">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={handleCreate} disabled={isLoading} className="gap-2 shadow-sm">
              <Plus className="w-4 h-4" /> Novo Usuário
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 text-sm">
            Erro ao carregar dados: {error}
          </div>
        )}

        <div className="bg-card p-4 rounded-2xl border shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por nome ou email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background"
                disabled={isLoading}
              />
            </div>
            
            <Select value={companyFilter} onValueChange={(v) => { setCompanyFilter(v); setUnitFilter('all'); setSectorFilter('all'); }} disabled={isLoading}>
              <SelectTrigger className="bg-background"><SelectValue placeholder="Empresa" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Empresas</SelectItem>
                {(companies || []).map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={unitFilter} onValueChange={(v) => { setUnitFilter(v); setSectorFilter('all'); }} disabled={isLoading || companyFilter === 'all'}>
              <SelectTrigger className="bg-background"><SelectValue placeholder="Unidade" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Unidades</SelectItem>
                {availableUnits.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={roleFilter} onValueChange={setRoleFilter} disabled={isLoading}>
              <SelectTrigger className="bg-background"><SelectValue placeholder="Perfil" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Perfis</SelectItem>
                <SelectItem value="administrator">Administrador</SelectItem>
                <SelectItem value="manager">Gerente</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
                <SelectItem value="operator">Operador</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter} disabled={isLoading}>
              <SelectTrigger className="bg-background"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Status</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden relative min-h-[400px]">
          {isLoading ? (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="text-sm text-muted-foreground font-medium">Carregando usuários...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Alocação</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/20 group">
                      <TableCell>
                        <div className="font-bold text-sm">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                        {user.phone && <div className="text-xs text-muted-foreground">{user.phone}</div>}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{getCompanyName(user.company_id)}</div>
                        <div className="text-xs text-muted-foreground">{getUnitName(user.unit_id)} • {getSectorName(user.sector_id)}</div>
                      </TableCell>
                      <TableCell className="text-sm">{user.position || '-'}</TableCell>
                      <TableCell>
                        <UserPermissionBadge role={user.role} />
                      </TableCell>
                      <TableCell>
                        <UserStatusBadge status={user.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleResetPassword(user)} title="Redefinir Senha">
                            <KeyRound className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(user)} title="Editar">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteClick(user)} title="Excluir">
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
              <UsersIcon className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium text-foreground">Nenhum usuário encontrado</p>
              <p className="text-sm mb-6">
                {users?.length === 0 
                  ? 'Você ainda não possui usuários cadastrados.' 
                  : 'Nenhum usuário corresponde aos filtros atuais.'}
              </p>
              {users?.length === 0 && (
                <Button onClick={handleCreate} className="gap-2">
                  <Plus className="w-4 h-4" /> Criar Primeiro Usuário
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <UserFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        initialData={selectedUser}
        companies={companies || []}
        units={units || []}
        sectors={sectors || []}
        isLoading={isSaving}
      />

      <ResetPasswordModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={handleConfirmReset}
        user={selectedUser}
        isLoading={isSaving}
      />

      <DeleteUserConfirmModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        user={selectedUser}
        isLoading={isSaving}
        hasAssignedTasks={false} // Mocked for now, would check executions in real app
      />
    </MainLayout>
  );
};

export default UsersPage;
