
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const CorrectiveActionFormModal = ({ isOpen, onClose, onSave, initialData, units, sectors, users }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    unit_id: '',
    sector_id: '',
    responsible_id: '',
    deadline: '',
    priority: 'Média',
    status: 'Aberta',
    observations: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          title: initialData.title || '',
          description: initialData.description || '',
          unit_id: initialData.unit_id || '',
          sector_id: initialData.sector_id || '',
          responsible_id: initialData.responsible_id || '',
          deadline: initialData.deadline || '',
          priority: initialData.priority || 'Média',
          status: initialData.status || 'Aberta',
          observations: initialData.observations || ''
        });
      } else {
        setFormData({
          title: '',
          description: '',
          unit_id: '',
          sector_id: '',
          responsible_id: '',
          deadline: '',
          priority: 'Média',
          status: 'Aberta',
          observations: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'O título é obrigatório';
    if (!formData.unit_id) newErrors.unit_id = 'Selecione uma unidade';
    if (!formData.responsible_id) newErrors.responsible_id = 'Selecione um responsável';
    if (!formData.deadline) newErrors.deadline = 'O prazo é obrigatório';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isLoading && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Ação Corretiva' : 'Nova Ação Corretiva'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título <span className="text-error">*</span></Label>
            <Input 
              id="title" 
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={errors.title ? 'border-error' : ''}
              disabled={isLoading}
            />
            {errors.title && <p className="text-xs text-error">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea 
              id="description" 
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Unidade <span className="text-error">*</span></Label>
              <Select value={formData.unit_id} onValueChange={(val) => handleChange('unit_id', val)} disabled={isLoading}>
                <SelectTrigger className={errors.unit_id ? 'border-error' : ''}>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {units.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.unit_id && <p className="text-xs text-error">{errors.unit_id}</p>}
            </div>

            <div className="space-y-2">
              <Label>Setor</Label>
              <Select value={formData.sector_id} onValueChange={(val) => handleChange('sector_id', val)} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {sectors.filter(s => !formData.unit_id || s.unit_id === formData.unit_id).map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Responsável <span className="text-error">*</span></Label>
              <Select value={formData.responsible_id} onValueChange={(val) => handleChange('responsible_id', val)} disabled={isLoading}>
                <SelectTrigger className={errors.responsible_id ? 'border-error' : ''}>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.responsible_id && <p className="text-xs text-error">{errors.responsible_id}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Prazo <span className="text-error">*</span></Label>
              <Input 
                id="deadline" 
                type="date"
                value={formData.deadline}
                onChange={(e) => handleChange('deadline', e.target.value)}
                className={errors.deadline ? 'border-error' : ''}
                disabled={isLoading}
              />
              {errors.deadline && <p className="text-xs text-error">{errors.deadline}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select value={formData.priority} onValueChange={(val) => handleChange('priority', val)} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Crítica">Crítica</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Média">Média</SelectItem>
                  <SelectItem value="Baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(val) => handleChange('status', val)} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aberta">Aberta</SelectItem>
                  <SelectItem value="Em Progresso">Em Progresso</SelectItem>
                  <SelectItem value="Resolvida">Resolvida</SelectItem>
                  <SelectItem value="Verificada">Verificada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations">Observações</Label>
            <Textarea 
              id="observations" 
              value={formData.observations}
              onChange={(e) => handleChange('observations', e.target.value)}
              rows={2}
              disabled={isLoading}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>Cancelar</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CorrectiveActionFormModal;
