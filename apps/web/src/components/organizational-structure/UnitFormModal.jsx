
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import apiServerClient from '@/lib/apiServerClient.js';
import { useMockData } from '@/context/MockDataContext.jsx';

const formatPhone = (value) => {
  if (!value) return '';
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d)(\d{4})$/, '$1-$2')
    .slice(0, 15);
};

const UnitFormModal = ({ isOpen, onClose, onSave, initialData, companies }) => {
  const { refreshData } = useMockData();
  const [formData, setFormData] = useState({
    name: '',
    company_id: '',
    city: '',
    address: '',
    manager: '',
    phone: '',
    isActive: true
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeCompanies = companies.filter(c => c.isActive || c.id === formData.company_id);

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
          city: '',
          address: '',
          manager: '',
          phone: '',
          isActive: true
        });
      }
      setErrors({});
    }
  }, [initialData, isOpen]);

  const handleChange = (field, value) => {
    console.log(`Field ${field} changed to ${value}`);
    let formattedValue = value;
    if (field === 'phone') formattedValue = formatPhone(value);

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) {
      newErrors.name = 'Nome da unidade é obrigatório';
    }
    if (!formData.company_id) {
      newErrors.company_id = 'Selecione uma empresa';
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
        const response = await apiServerClient.fetch('/units', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await response.json();
        console.log('Server response:', data);

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao criar unidade na API');
        }

        toast.success('Unidade criada com sucesso!');
        await refreshData();
        onClose();
      }
    } catch (error) {
      console.log('Error:', error);
      toast.error(error?.message || 'Erro ao salvar unidade.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Unidade' : 'Nova Unidade'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Unidade <span className="text-destructive">*</span></Label>
            <Input 
              id="name" 
              required
              value={formData.name} 
              onChange={(e) => handleChange('name', e.target.value)} 
              placeholder="Ex: Filial Centro"
              className={errors.name ? 'border-destructive' : ''}
              disabled={isSubmitting}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_id">Empresa <span className="text-destructive">*</span></Label>
            <Select required value={formData.company_id} onValueChange={(v) => handleChange('company_id', v)} disabled={isSubmitting}>
              <SelectTrigger id="company_id" className={errors.company_id ? 'border-destructive' : ''}>
                <SelectValue placeholder="Selecione a empresa..." />
              </SelectTrigger>
              <SelectContent>
                {activeCompanies.map(company => (
                  <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.company_id && <p className="text-xs text-destructive">{errors.company_id}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input 
                id="city" 
                value={formData.city} 
                onChange={(e) => handleChange('city', e.target.value)} 
                placeholder="Ex: São Paulo"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input 
                id="phone" 
                value={formData.phone} 
                onChange={(e) => handleChange('phone', e.target.value)} 
                placeholder="(00) 00000-0000"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço Completo</Label>
            <Input 
              id="address" 
              value={formData.address} 
              onChange={(e) => handleChange('address', e.target.value)} 
              placeholder="Rua, Número, Bairro"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="manager">Gerente Responsável</Label>
            <Input 
              id="manager" 
              value={formData.manager} 
              onChange={(e) => handleChange('manager', e.target.value)} 
              placeholder="Nome do gerente"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/20 mt-4">
            <div className="space-y-0.5">
              <Label className="text-base">Status da Unidade</Label>
              <p className="text-sm text-muted-foreground">
                Unidades inativas não poderão receber novos checklists.
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
              Salvar Unidade
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UnitFormModal;
