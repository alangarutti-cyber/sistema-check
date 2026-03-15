
import React, { useState, useMemo, useEffect } from 'react';
import MainLayout from '@/components/MainLayout.jsx';
import { useMockData } from '@/context/MockDataContext.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Copy, Edit2, Trash2, Search, FileText, Calendar, Building2, Loader2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import TemplateFormModal from '@/components/models/TemplateFormModal.jsx';
import TemplateDeleteConfirmModal from '@/components/models/TemplateDeleteConfirmModal.jsx';

const ModelsPage = () => {
  const { templates, sectors, units, createTemplate, updateTemplate, deleteTemplate, duplicateTemplate, refreshData, isLoading, error } = useMockData();
  const navigate = useNavigate();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    console.log(`Renderizando ${templates?.length || 0} templates. Loading: ${isLoading}`);
  }, [templates, isLoading]);

  const getUnitName = (template) => {
    if (template.expand?.unit_id?.name) return template.expand.unit_id.name;
    return (units || []).find(u => u.id === template.unit_id)?.name || 'Geral';
  };

  const getSectorName = (template) => {
    if (template.expand?.sector_id?.name) return template.expand.sector_id.name;
    return (sectors || []).find(s => s.id === template.sector_id)?.name || 'Geral';
  };

  const getItemsCount = (template) => {
    try {
      const parsed = JSON.parse(template.template_builder_data);
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  };

  // Filtered Templates
  const filteredTemplates = useMemo(() => {
    if (!searchQuery?.trim()) return templates || [];
    const query = searchQuery.toLowerCase();
    return (templates || []).filter(t => 
      (t?.name?.toLowerCase()?.includes(query) ?? false) || 
      (getSectorName(t)?.toLowerCase()?.includes(query) ?? false) ||
      (getUnitName(t)?.toLowerCase()?.includes(query) ?? false)
    );
  }, [templates, searchQuery, units, sectors]);

  // Handlers
  const handleCreateClick = () => {
    console.log('Abrindo modal para criar novo template');
    setSelectedTemplate(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (template) => {
    console.log('Abrindo modal para editar template:', template.id);
    setSelectedTemplate(template);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (template) => {
    console.log('Abrindo modal para deletar template:', template.id);
    setSelectedTemplate(template);
    setIsDeleteModalOpen(true);
  };

  const handleSaveTemplate = async (formData) => {
    setIsSaving(true);
    try {
      if (selectedTemplate) {
        console.log('Salvando edição do template:', selectedTemplate.id);
        await updateTemplate(selectedTemplate.id, formData);
        toast.success('Modelo atualizado com sucesso!');
      } else {
        console.log('Salvando novo template');
        await createTemplate(formData);
        toast.success('Modelo criado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar template:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedTemplate) return;
    console.log('Confirmando exclusão do template:', selectedTemplate.id);
    setIsSaving(true);
    try {
      await deleteTemplate(selectedTemplate.id);
      toast.success('Modelo excluído com sucesso!');
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Erro ao excluir template:', error);
      toast.error(error.message || 'Erro ao excluir modelo');
    } finally {
      setIsSaving(false);
      setSelectedTemplate(null);
    }
  };

  const handleDuplicate = async (id) => {
    console.log('Duplicando template:', id);
    setActionLoadingId(id);
    try {
      await duplicateTemplate(id);
      toast.success('Modelo duplicado com sucesso!');
    } catch (error) {
      console.error('Erro ao duplicar template:', error);
      toast.error(error.message || 'Erro ao duplicar modelo');
    } finally {
      setActionLoadingId(null);
    }
  };

  const getFrequencyLabel = (freq) => {
    const map = {
      'daily': 'Diária',
      'weekly': 'Semanal',
      'monthly': 'Mensal',
      'by shift': 'Por Turno',
      'on-demand': 'Sob Demanda'
    };
    return map[freq] || freq;
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Modelos de Checklists</h1>
            <p className="text-muted-foreground">Gerencie as estruturas e formulários utilizados nas inspeções.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={refreshData} disabled={isLoading} className="gap-2 shadow-sm">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Recarregar
            </Button>
            <Button onClick={handleCreateClick} disabled={isLoading} className="gap-2 shadow-sm">
              <Plus className="w-4 h-4" /> Novo Modelo
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 text-sm">
            Erro ao carregar dados: {error}
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-card p-4 rounded-2xl border shadow-sm flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Buscar por nome, setor ou unidade..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Grid */}
        <div className="relative min-h-[300px]">
          {isLoading ? (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="text-sm text-muted-foreground font-medium">Carregando modelos...</p>
            </div>
          ) : filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map(template => (
                <Card key={template.id} className="flex flex-col h-full hover:shadow-md transition-all duration-200 border-border/60 group">
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <Badge variant={template.active ? "default" : "secondary"} className={template.active ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20" : ""}>
                        {template.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 line-clamp-1" title={template.name}>{template.name}</h3>
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-2 flex-1">
                      {template.description || 'Sem descrição fornecida.'}
                    </p>
                    
                    <div className="space-y-2.5 text-sm font-medium text-muted-foreground mb-6 bg-muted/30 p-4 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 shrink-0" />
                        <span className="truncate">{getUnitName(template)} • {getSectorName(template)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 shrink-0" />
                        <span>Frequência: {getFrequencyLabel(template.frequency)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 shrink-0" />
                        <span>{getItemsCount(template)} itens configurados</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-auto pt-4 border-t">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 gap-1.5"
                        onClick={() => handleEditClick(template)}
                      >
                        <Edit2 className="w-3.5 h-3.5"/> Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 gap-1.5"
                        onClick={() => handleDuplicate(template.id)}
                        disabled={actionLoadingId === template.id}
                      >
                        {actionLoadingId === template.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Copy className="w-3.5 h-3.5"/>}
                        Duplicar
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                        onClick={() => handleDeleteClick(template)}
                      >
                        <Trash2 className="w-4 h-4"/>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-bold mb-2">Nenhum modelo encontrado</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchQuery ? 'Tente buscar com outras palavras-chave.' : 'Você ainda não possui modelos de checklist cadastrados.'}
              </p>
              {!searchQuery && (
                <Button onClick={handleCreateClick} className="gap-2">
                  <Plus className="w-4 h-4" /> Criar Primeiro Modelo
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <TemplateFormModal 
        isOpen={isFormModalOpen}
        onClose={() => {
          console.log('Fechando modal de template');
          setIsFormModalOpen(false);
        }}
        onSave={handleSaveTemplate}
        initialData={selectedTemplate}
        sectors={sectors}
        units={units}
        isLoading={isSaving}
      />

      <TemplateDeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        templateName={selectedTemplate?.name}
        isLoading={isSaving}
      />
    </MainLayout>
  );
};

export default ModelsPage;
