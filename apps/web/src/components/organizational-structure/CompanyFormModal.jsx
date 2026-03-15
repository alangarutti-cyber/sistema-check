
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

const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const formatCNPJ = (value) => {
  if (!value) return '';
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .slice(0, 18);
};

const formatPhone = (value) => {
  if (!value) return '';
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d)(\d{4})$/, '$1-$2')
    .slice(0, 15);
};

const CompanyFormModal = ({ isOpen, onClose, onSave, initialData }) => {
  const { refreshData } = useMockData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tradeName: '',
    cnpj: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    isActive: true
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          email: '',
          tradeName: '',
          cnpj: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          isActive: true
        });
      }
      setErrors({});
    }
  }, [initialData, isOpen]);

  const handleChange = (field, value) => {
    console.log(`Field ${field} changed to ${value}`);
    let formattedValue = value;
    if (field === 'cnpj') formattedValue = formatCNPJ(value);
    if (field === 'phone') formattedValue = formatPhone(value);

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    if (formData.cnpj && formData.cnpj.replace(/\D/g, '').length !== 14) {
      newErrors.cnpj = 'CNPJ incompleto';
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
        // Edit mode - use existing onSave prop
        await onSave(formData);
        onClose();
      } else {
        // Create mode - use API endpoint
        const response = await apiServerClient.fetch('/companies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await response.json();
        console.log('Server response:', data);

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao criar empresa na API');
        }

        toast.success('Empresa criada com sucesso!');
        await refreshData();
        onClose();
      }
    } catch (error) {
      console.log('Error:', error);
      toast.error(error?.message || 'Erro ao salvar empresa.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Empresa' : 'Nova Empresa'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Razão Social / Nome <span className="text-destructive">*</span></Label>
              <Input 
                id="name" 
                required
                value={formData.name} 
                onChange={(e) => handleChange('name', e.target.value)} 
                placeholder="Ex: Empresa Silva LTDA"
                className={errors.name ? 'border-destructive' : ''}
                disabled={isSubmitting}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail <span className="text-destructive">*</span></Label>
              <Input 
                id="email" 
                type="email"
                required
                value={formData.email} 
                onChange={(e) => handleChange('email', e.target.value)} 
                placeholder="contato@empresa.com"
                className={errors.email ? 'border-destructive' : ''}
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tradeName">Nome Fantasia</Label>
              <Input 
                id="tradeName" 
                value={formData.tradeName} 
                onChange={(e) => handleChange('tradeName', e.target.value)} 
                placeholder="Ex: Silva Lanches"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input 
                id="cnpj" 
                value={formData.cnpj} 
                onChange={(e) => handleChange('cnpj', e.target.value)} 
                placeholder="00.000.000/0000-00"
                className={errors.cnpj ? 'border-destructive' : ''}
                disabled={isSubmitting}
              />
              {errors.cnpj && <p className="text-xs text-destructive">{errors.cnpj}</p>}
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

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Endereço</Label>
              <Input 
                id="address" 
                value={formData.address} 
                onChange={(e) => handleChange('address', e.target.value)} 
                placeholder="Rua, Número, Bairro"
                disabled={isSubmitting}
              />
            </div>

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
              <Label htmlFor="state">Estado</Label>
              <Select value={formData.state} onValueChange={(v) => handleChange('state', v)} disabled={isSubmitting}>
                <SelectTrigger id="state">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {BRAZILIAN_STATES.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/20 mt-4">
            <div className="space-y-0.5">
              <Label className="text-base">Status da Empresa</Label>
              <p className="text-sm text-muted-foreground">
                Empresas inativas não aparecerão em novos cadastros.
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
              Salvar Empresa
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyFormModal;
