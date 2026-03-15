
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout.jsx';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { 
  CheckSquare, List, Type, Hash, Camera, PenTool, MinusCircle, 
  GripVertical, Plus, Save, Copy, Trash2, Settings, Info, Loader2, FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { useMockData } from '@/context/MockDataContext.jsx';

const ITEM_TYPES = [
  { id: 'yes_no', label: 'Resposta Binária (Sim/Não)', icon: CheckSquare },
  { id: 'multiple_choice', label: 'Múltipla Escolha', icon: List },
  { id: 'short_text', label: 'Texto Curto', icon: Type },
  { id: 'long_text', label: 'Texto Longo', icon: Type },
  { id: 'number', label: 'Número', icon: Hash },
  { id: 'photo', label: 'Evidência Fotográfica', icon: Camera },
  { id: 'signature', label: 'Assinatura', icon: PenTool },
  { id: 'not_applicable', label: 'Não se Aplica', icon: MinusCircle },
];

const TemplateBuilder = () => {
  const { templates, saveTemplate, deleteTemplate, duplicateTemplate } = useMockData();
  
  const [currentTemplateId, setCurrentTemplateId] = useState('new');
  const [title, setTitle] = useState('Novo Modelo de Checklist');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load template data when selection changes
  useEffect(() => {
    if (currentTemplateId === 'new') {
      setTitle('Novo Modelo de Checklist');
      setDescription('');
      setItems([]);
      setSelectedItem(null);
    } else {
      const template = templates.find(t => t.id === currentTemplateId);
      if (template) {
        setTitle(template.name);
        setDescription(template.description || '');
        setItems(template.items || []);
        setSelectedItem(null);
      }
    }
  }, [currentTemplateId, templates]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const { source, destination } = result;

    // Dropping from library to canvas
    if (source.droppableId === 'library' && destination.droppableId === 'canvas') {
      const type = ITEM_TYPES[source.index];
      const newItem = {
        id: `item-${Date.now()}`,
        type: type.id,
        title: `Novo Item (${type.label})`,
        description: '',
        mandatory: true,
        critical: false,
        evidence_required: false,
        observation_allowed: true,
      };
      const newItems = Array.from(items);
      newItems.splice(destination.index, 0, newItem);
      setItems(newItems);
      setSelectedItem(newItem);
      return;
    }

    // Reordering within canvas
    if (source.droppableId === 'canvas' && destination.droppableId === 'canvas') {
      const newItems = Array.from(items);
      const [reorderedItem] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, reorderedItem);
      setItems(newItems);
    }
  };

  const updateSelectedItem = (updates) => {
    if (!selectedItem) return;
    const updated = { ...selectedItem, ...updates };
    setSelectedItem(updated);
    setItems(items.map(i => i.id === updated.id ? updated : i));
  };

  const deleteItem = (id) => {
    setItems(items.filter(i => i.id !== id));
    if (selectedItem?.id === id) setSelectedItem(null);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('O título do modelo é obrigatório.');
      return;
    }
    if (items.length === 0) {
      toast.error('Adicione pelo menos um item ao checklist.');
      return;
    }

    setIsSaving(true);
    try {
      const templateData = {
        ...(currentTemplateId !== 'new' ? { id: currentTemplateId } : {}),
        name: title,
        description,
        items,
        active: true
      };
      
      const saved = await saveTemplate(templateData);
      setCurrentTemplateId(saved.id);
      toast.success('Modelo salvo com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar modelo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDuplicate = async () => {
    if (currentTemplateId === 'new') return;
    setIsSaving(true);
    try {
      const duplicated = await duplicateTemplate(currentTemplateId);
      setCurrentTemplateId(duplicated.id);
      toast.success('Modelo duplicado com sucesso!');
    } catch (error) {
      toast.error('Erro ao duplicar modelo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (currentTemplateId === 'new') return;
    setIsDeleting(true);
    try {
      await deleteTemplate(currentTemplateId);
      setCurrentTemplateId('new');
      setShowDeleteConfirm(false);
      toast.success('Modelo excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir modelo.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <MainLayout>
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b mb-4 shrink-0 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Construtor de Modelos</h1>
              <p className="text-sm text-muted-foreground">Crie e edite estruturas de checklists.</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Select value={currentTemplateId} onValueChange={setCurrentTemplateId}>
              <SelectTrigger className="w-[250px] bg-background">
                <SelectValue placeholder="Selecione um modelo..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new" className="font-bold text-primary">+ Criar Novo Modelo</SelectItem>
                {templates.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {currentTemplateId !== 'new' && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleDuplicate} disabled={isSaving}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Duplicar Modelo</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => setShowDeleteConfirm(true)} disabled={isSaving}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Excluir Modelo</p></TooltipContent>
                </Tooltip>
              </>
            )}
            
            <Button onClick={handleSave} disabled={isSaving} className="min-w-[120px]">
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2"/>}
              Salvar
            </Button>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
            
            {/* Left Panel: Library */}
            <div className="w-full lg:w-64 flex flex-col bg-card rounded-xl border shadow-sm overflow-hidden shrink-0 h-[300px] lg:h-auto">
              <div className="p-4 border-b bg-muted/30 font-semibold text-sm flex items-center justify-between">
                Biblioteca de Itens
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Arraste os itens desta lista para a área central para construir seu checklist.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Droppable droppableId="library" isDropDisabled={true}>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="p-3 space-y-2 overflow-y-auto flex-1">
                    {ITEM_TYPES.map((type, index) => (
                      <Draggable key={type.id} draggableId={`lib-${type.id}`} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`flex items-center gap-3 p-3 rounded-lg border bg-background hover:border-primary hover:shadow-sm transition-all cursor-grab ${snapshot.isDragging ? 'shadow-lg ring-2 ring-primary/20 z-50' : ''}`}
                          >
                            <type.icon className="w-5 h-5 text-muted-foreground" />
                            <span className="text-sm font-medium">{type.label}</span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            {/* Center Panel: Canvas */}
            <div className="flex-1 flex flex-col bg-muted/10 rounded-xl border overflow-hidden min-h-[400px]">
              <div className="p-6 border-b bg-card">
                <Input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="text-2xl font-bold h-auto py-2 px-3 border-transparent hover:border-input focus:border-primary bg-transparent mb-2"
                  placeholder="Título do Checklist"
                />
                <Textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="resize-none border-transparent hover:border-input focus:border-primary bg-transparent"
                  placeholder="Descrição ou instruções gerais..."
                  rows={2}
                />
              </div>
              
              <Droppable droppableId="canvas">
                {(provided, snapshot) => (
                  <div 
                    {...provided.droppableProps} 
                    ref={provided.innerRef} 
                    className={`flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 ${snapshot.isDraggingOver ? 'bg-primary/5' : ''}`}
                  >
                    {items.length === 0 && !snapshot.isDraggingOver && (
                      <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl p-8 text-center">
                        <Plus className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-medium">Arraste itens da biblioteca para cá</p>
                        <p className="text-sm opacity-70">Comece a construir seu checklist</p>
                      </div>
                    )}
                    
                    {items.map((item, index) => {
                      const TypeIcon = ITEM_TYPES.find(t => t.id === item.type)?.icon || CheckSquare;
                      const isSelected = selectedItem?.id === item.id;
                      
                      return (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              onClick={() => setSelectedItem(item)}
                              className={`p-4 flex items-start gap-3 sm:gap-4 cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'} ${snapshot.isDragging ? 'shadow-xl z-40' : ''}`}
                            >
                              <div {...provided.dragHandleProps} className="mt-1 cursor-grab text-muted-foreground hover:text-foreground">
                                <GripVertical className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Item {index + 1}</span>
                                  {item.critical && <span className="bg-destructive/10 text-destructive px-1.5 py-0.5 rounded text-[10px] font-bold">Crítico</span>}
                                  {item.mandatory && <span className="text-destructive font-bold" title="Obrigatório">*</span>}
                                </div>
                                <h4 className="font-semibold text-base break-words">{item.title || 'Item sem título'}</h4>
                                {item.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>}
                              </div>
                              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3 shrink-0">
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-xs font-medium text-muted-foreground whitespace-nowrap">
                                  <TypeIcon className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">{ITEM_TYPES.find(t => t.id === item.type)?.label}</span>
                                </div>
                                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }} className="text-muted-foreground hover:text-destructive h-8 w-8">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </Card>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            {/* Right Panel: Properties */}
            <div className="w-full lg:w-80 flex flex-col bg-card rounded-xl border shadow-sm overflow-hidden shrink-0 h-[400px] lg:h-auto">
              <div className="p-4 border-b bg-muted/30 flex items-center gap-2 font-semibold text-sm">
                <Settings className="w-4 h-4" /> Propriedades do Item
              </div>
              <div className="p-4 overflow-y-auto flex-1">
                {selectedItem ? (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Título do Item</label>
                      <Input 
                        value={selectedItem.title} 
                        onChange={(e) => updateSelectedItem({ title: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Instruções / Descrição</label>
                      <Textarea 
                        value={selectedItem.description} 
                        onChange={(e) => updateSelectedItem({ description: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tipo de Resposta</label>
                      <Select value={selectedItem.type} onValueChange={(val) => updateSelectedItem({ type: val })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ITEM_TYPES.map(t => (
                            <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="pt-4 border-t space-y-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox 
                          id="mandatory" 
                          checked={selectedItem.mandatory} 
                          onCheckedChange={(c) => updateSelectedItem({ mandatory: c })}
                          className="mt-0.5"
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label htmlFor="mandatory" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Resposta Obrigatória
                          </label>
                          <p className="text-xs text-muted-foreground">O usuário não pode pular este item.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Checkbox 
                          id="critical" 
                          checked={selectedItem.critical} 
                          onCheckedChange={(c) => updateSelectedItem({ critical: c })}
                          className="mt-0.5 data-[state=checked]:bg-destructive data-[state=checked]:border-destructive"
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label htmlFor="critical" className="text-sm font-medium leading-none text-destructive">
                            Item Crítico
                          </label>
                          <p className="text-xs text-muted-foreground">Gera alerta imediato se não conforme.</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox 
                          id="evidence" 
                          checked={selectedItem.evidence_required} 
                          onCheckedChange={(c) => updateSelectedItem({ evidence_required: c })}
                          className="mt-0.5"
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label htmlFor="evidence" className="text-sm font-medium leading-none">
                            Exige Evidência
                          </label>
                          <p className="text-xs text-muted-foreground">Obriga o anexo de foto ou documento.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-4">
                    <Settings className="w-10 h-10 mb-3 opacity-20" />
                    <p className="text-sm">Selecione um item no canvas para editar suas propriedades.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </DragDropContext>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Excluir Modelo</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o modelo "{title}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default TemplateBuilder;
