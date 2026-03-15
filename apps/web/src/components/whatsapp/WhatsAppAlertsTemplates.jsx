
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter } from 'lucide-react';
import TemplateCard from './TemplateCard.jsx';
import TemplateFormModal from './TemplateFormModal.jsx';
import SendTestAlertModal from './SendTestAlertModal.jsx';
import { toast } from 'sonner';

const WhatsAppAlertsTemplates = ({ templates, onSave, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredTemplates = useMemo(() => {
    if (!Array.isArray(templates)) return [];
    return templates.filter(t => {
      if (!t) return false;
      const matchesSearch = t?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
      const matchesCategory = categoryFilter === 'all' || t?.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [templates, searchTerm, categoryFilter]);

  const handleCreate = () => {
    setSelectedTemplate(null);
    setIsModalOpen(true);
  };

  const handleEdit = (template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleDuplicate = async (template) => {
    const duplicated = {
      ...template,
      id: undefined,
      name: `${template.name} (Cópia)`,
      isActive: false
    };
    await onSave(duplicated);
    toast.success('Template duplicado com sucesso!');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este template? Esta ação não pode ser desfeita.')) {
      await onDelete(id);
      toast.success('Template excluído com sucesso!');
    }
  };

  const handleToggle = async (id, isActive) => {
    const template = (templates || []).find(t => t?.id === id);
    if (template) {
      await onSave({ ...template, isActive });
      toast.success(isActive ? 'Template ativado' : 'Template desativado');
    }
  };

  const handleSave = async (data) => {
    await onSave(data);
    toast.success('Template salvo com sucesso!');
    setIsModalOpen(false);
  };

  const handleTest = (template) => {
    setSelectedTemplate(template);
    setIsTestModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Biblioteca de Templates</h2>
          <p className="text-sm text-muted-foreground">Gerencie as mensagens padronizadas para envio via WhatsApp.</p>
        </div>
        <Button onClick={handleCreate} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> Criar Novo Template
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-xl border border-border/60 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar templates por nome..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[220px] bg-background"><SelectValue placeholder="Categoria" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Categorias</SelectItem>
            <SelectItem value="Checklist Execution">Execução de Checklist</SelectItem>
            <SelectItem value="Critical Items">Itens Críticos</SelectItem>
            <SelectItem value="Corrective Actions">Ações Corretivas</SelectItem>
            <SelectItem value="Escalation">Escalonamento</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => (
          <TemplateCard 
            key={template.id} 
            template={template} 
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onToggle={handleToggle}
            onTest={handleTest}
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 bg-card rounded-xl border border-dashed">
          <p className="text-muted-foreground">Nenhum template encontrado.</p>
        </div>
      )}

      <TemplateFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave}
        initialData={selectedTemplate}
      />

      <SendTestAlertModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        templates={templates || []}
        initialTemplateId={selectedTemplate?.id}
      />
    </div>
  );
};

export default WhatsAppAlertsTemplates;
