
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import apiServerClient from '@/lib/apiServerClient.js';
import { useMockData } from '@/context/MockDataContext.jsx';

const SectorFormModal = ({ isOpen, onClose, onSave, initialData, companies, units }) => {
  const { refreshData } = useMockData();
  const [formData, setFormData] = useState({
    name: '',
    company_id: '',
    unit_id: '',
    description: '',
    isActive: true
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeCompanies = companies.filter(c => c.isActive || c.id === formData.company_id);
  const availableUnits = units.filter(u => u.company_id === formData.company_id && (u.isActive || u.id === formData.unit_id));

  useEffect(() => {
    if (isOpen) {
      console.log('Modal opened');
      if (initialData) {
        setFormData({
          ...initialData,
          isActive: initialData.isActive ?? true
        });
      } else {
        setFormData({
          name: '',
          company_id: '',
          unit_id: '',
          description: '',
          isActive: true
        });
      }
      setErrors({});
    }
  }, [initialData, isOpen]);

  const handleChange = (field, value) => {
    console.log(`Field ${field} changed to ${value}`);
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      // Reset unit if company changes
      if (field === 'company_id' && prev.company_id !== value) {
        newData.unit_id = '';
      }
      return newData;
    });
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) {
      newErrors.name = 'Nome do setor é obrigatório';
    }
    if (!formData.company_id) {
      newErrors.company_id = 'Selecione uma empresa';
    }
    if (!formData.unit_id) {
      newErrors.unit_id = 'Selecione uma unidade';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    console.log('Sending data:', formData);

    try {
      if (initialData) {
        await onSave(formData);
        onClose();
      } else {
        const response = await apiServerClient.fetch('/sectors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await response.json();
        console.log('Server response:', data);

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao criar setor na API');
        }

        toast.success('Setor criado com sucesso!');
        await refreshData();
        onClose();
      }
    } catch (error) {
      console.log('Error:', error);
      toast.error(error?.message || 'Erro ao salvar setor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Setor' : 'Novo Setor'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Setor <span className="text-destructive">*</span></Label>
            <Input 
              id="name" 
              required
              value={formData.name} 
              onChange={(e) => handleChange('name', e.target.value)} 
              placeholder="Ex: Cozinha Quente"
              className={errors.name ? 'border-destructive' : ''}
              disabled={isSubmitting}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_id">Empresa <span className="text-destructive">*</span></Label>
              <Select required value={formData.company_id} onValueChange={(v) => handleChange('company_id', v)} disabled={isSubmitting}>
                <SelectTrigger id="company_id" className={errors.company_id ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {activeCompanies.map(company => (
                    <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.company_id && <p className="text-xs text-destructive">{errors.company_id}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit_id">Unidade <span className="text-destructive">*</span></Label>
              <Select 
                required
                value={formData.unit_id} 
                onValueChange={(v) => handleChange('unit_id', v)}
                disabled={!formData.company_id || isSubmitting}
              >
                <SelectTrigger id="unit_id" className={errors.unit_id ? 'border-destructive' : ''}>
                  <SelectValue placeholder={formData.company_id ? "Selecione..." : "Selecione a empresa"} />
                </SelectTrigger>
                <SelectContent>
                  {availableUnits.map(unit => (
                    <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.unit_id && <p className="text-xs text-destructive">{errors.unit_id}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea 
              id="description" 
              value={formData.description} 
              onChange={(e) => handleChange('description', e.target.value)} 
              placeholder="Breve descrição das atividades do setor..."
              className="resize-none h-20"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/20 mt-4">
            <div className="space-y-0.5">
              <Label className="text-base">Status do Setor</Label>
              <p className="text-sm text-muted-foreground">
                Setores inativos não aparecerão em novos checklists.
              </p>
            </div>
            <Switch 
              checked={formData.isActive} 
              onCheckedChange={(v) => handleChange('isActive', v)} 
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Salvar Setor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SectorFormModal;
