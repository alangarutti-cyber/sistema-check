
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const TemplateFormModal = ({ isOpen, onClose, onSave, initialData, sectors, units, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'daily',
    sector_id: '',
    unit_id: '',
    active: true
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          description: initialData.description || '',
          frequency: initialData.frequency || 'daily',
          sector_id: initialData.sector_id || '',
          unit_id: initialData.unit_id || '',
          active: initialData.active !== undefined ? initialData.active : true
        });
      } else {
        setFormData({
          name: '',
          description: '',
          frequency: 'daily',
          sector_id: '',
          unit_id: '',
          active: true
        });
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'O nome do modelo é obrigatório';
    if (!formData.unit_id) newErrors.unit_id = 'Selecione uma unidade';
    if (!formData.sector_id) newErrors.sector_id = 'Selecione um setor';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!validate()) return;

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving template:', {
        status: error?.status,
        message: error?.message,
        originalError: error,
        payload: formData
      });

      const errorMsg = error?.message?.toLowerCase() || '';
      if (error?.status === 400 || errorMsg.includes('create rule failure') || errorMsg.includes('sql: no rows in result set')) {
        toast.error('Failed to create record. Please check that all required fields are filled correctly. If the error persists, contact support.', {
          action: {
            label: 'Retry',
            onClick: () => handleSubmit()
          },
          duration: 8000
        });
      } else {
        toast.error(error?.message || 'Erro ao salvar modelo.');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isLoading && !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Modelo' : 'Criar Novo Modelo'}</DialogTitle>
          <DialogDescription>
            Preencha os detalhes abaixo para configurar a estrutura do seu checklist.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Modelo <span className="text-destructive">*</span></Label>
            <Input 
              id="name" 
              placeholder="Ex: Inspeção Diária de Segurança" 
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}
              disabled={isLoading}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea 
              id="description" 
              placeholder="Breve descrição do propósito deste checklist..." 
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit_id">Unidade <span className="text-destructive">*</span></Label>
              <Select 
                value={formData.unit_id} 
                onValueChange={(val) => handleChange('unit_id', val)}
                disabled={isLoading}
              >
                <SelectTrigger id="unit_id" className={errors.unit_id ? 'border-destructive focus:ring-destructive' : ''}>
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
                <SelectContent>
                  {units.map(u => (
                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.unit_id && <p className="text-xs text-destructive">{errors.unit_id}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sector_id">Setor <span className="text-destructive">*</span></Label>
              <Select 
                value={formData.sector_id} 
                onValueChange={(val) => handleChange('sector_id', val)}
                disabled={isLoading}
              >
                <SelectTrigger id="sector_id" className={errors.sector_id ? 'border-destructive focus:ring-destructive' : ''}>
                  <SelectValue placeholder="Selecione o setor" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.sector_id && <p className="text-xs text-destructive">{errors.sector_id}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequência</Label>
              <Select 
                value={formData.frequency} 
                onValueChange={(val) => handleChange('frequency', val)}
                disabled={isLoading}
              >
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Selecione a frequência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diária</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                  <SelectItem value="by shift">Por Turno</SelectItem>
                  <SelectItem value="on-demand">Sob Demanda</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex flex-col justify-center pt-6">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="active" 
                  checked={formData.active} 
                  onCheckedChange={(val) => handleChange('active', val)}
                  disabled={isLoading}
                />
                <Label htmlFor="active" className="cursor-pointer">Modelo Ativo</Label>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {initialData ? 'Salvar Alterações' : 'Criar Modelo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateFormModal;
