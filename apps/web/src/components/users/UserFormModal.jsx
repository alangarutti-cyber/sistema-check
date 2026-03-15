
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Eye, EyeOff, Check, X } from 'lucide-react';
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

const checkPasswordStrength = (password) => {
  if (!password) return { score: 0, checks: { length: false, upper: false, lower: false, number: false } };
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;
  return { score, checks };
};

const UserFormModal = ({ isOpen, onClose, onSave, initialData, companies, units, sectors }) => {
  const { refreshData } = useMockData();
  const isEditing = !!initialData;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    position: '',
    role: 'operator',
    status: 'active',
    hire_date: '',
    company_id: '',
    unit_id: '',
    sector_id: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [pwdStrength, setPwdStrength] = useState({ score: 0, checks: {} });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtered dropdowns
  const availableUnits = units.filter(u => u.company_id === formData.company_id);
  const availableSectors = sectors.filter(s => s.unit_id === formData.unit_id);

  useEffect(() => {
    if (isOpen) {
      console.log('Modal opened');
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          email: initialData.email || '',
          password: '', // Don't populate password on edit
          phone: initialData.phone || '',
          position: initialData.position || '',
          role: initialData.role || 'operator',
          status: initialData.status || 'active',
          hire_date: initialData.hire_date ? initialData.hire_date.split(' ')[0] : '',
          company_id: initialData.company_id || '',
          unit_id: initialData.unit_id || '',
          sector_id: initialData.sector_id || ''
        });
      } else {
        setFormData({
          name: '',
          email: '',
          password: '',
          phone: '',
          position: '',
          role: 'operator',
          status: 'active',
          hire_date: new Date().toISOString().split('T')[0],
          company_id: '',
          unit_id: '',
          sector_id: ''
        });
      }
      setErrors({});
      setPwdStrength({ score: 0, checks: {} });
      setShowPassword(false);
    }
  }, [isOpen, initialData]);

  const handleChange = (field, value) => {
    console.log(`Field ${field} changed to ${value}`);
    let formattedValue = value;
    
    if (field === 'phone') formattedValue = formatPhone(value);
    
    setFormData(prev => {
      const newData = { ...prev, [field]: formattedValue };
      
      // Cascading resets
      if (field === 'company_id' && prev.company_id !== value) {
        newData.unit_id = '';
        newData.sector_id = '';
      }
      if (field === 'unit_id' && prev.unit_id !== value) {
        newData.sector_id = '';
      }
      
      return newData;
    });

    if (field === 'password') {
      setPwdStrength(checkPasswordStrength(value));
    }

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

    if (!isEditing) {
      if (!formData.password) {
        newErrors.password = 'Senha é obrigatória para novos usuários';
      } else if (formData.password.length < 8) {
        newErrors.password = 'A senha deve ter no mínimo 8 caracteres';
      }
    }

    if (!formData.role) newErrors.role = 'Perfil de acesso é obrigatório';
    if (!formData.company_id) newErrors.company_id = 'Empresa é obrigatória';
    if (!formData.unit_id) newErrors.unit_id = 'Unidade é obrigatória';
    if (!formData.sector_id) newErrors.sector_id = 'Setor é obrigatório';

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
        const response = await apiServerClient.fetch('/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await response.json();
        console.log('Server response:', data);

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao criar usuário na API');
        }

        toast.success('Usuário criado com sucesso!');
        await refreshData();
        onClose();
      }
    } catch (error) {
      console.log('Error:', error);
      toast.error(error?.message || 'Erro ao salvar usuário.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && !open && onClose()}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Informações Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo <span className="text-destructive">*</span></Label>
                <Input 
                  id="name" 
                  required
                  value={formData.name} 
                  onChange={(e) => handleChange('name', e.target.value)} 
                  placeholder="Ex: João Silva"
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
                  placeholder="joao@empresa.com"
                  className={errors.email ? 'border-destructive' : ''}
                  disabled={isSubmitting}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
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

              <div className="space-y-2">
                <Label htmlFor="hire_date">Data de Contratação</Label>
                <Input 
                  id="hire_date" 
                  type="date"
                  value={formData.hire_date} 
                  onChange={(e) => handleChange('hire_date', e.target.value)} 
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Password (Only on create) */}
          {!isEditing && (
            <div className="space-y-4 pt-2 border-t">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Segurança</h3>
              <div className="space-y-2">
                <Label htmlFor="password">Senha de Acesso <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    required
                    type={showPassword ? "text" : "password"}
                    value={formData.password} 
                    onChange={(e) => handleChange('password', e.target.value)} 
                    placeholder="Crie uma senha segura"
                    className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                    disabled={isSubmitting}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2 space-y-2">
                    <div className="flex gap-1 h-1.5">
                      {[1, 2, 3, 4].map(level => (
                        <div 
                          key={level} 
                          className={`flex-1 rounded-full transition-colors ${
                            pwdStrength.score >= level 
                              ? (pwdStrength.score < 3 ? 'bg-warning' : 'bg-success') 
                              : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        {pwdStrength.checks.length ? <Check className="w-3 h-3 text-success" /> : <X className="w-3 h-3" />} Mín. 8 caracteres
                      </div>
                      <div className="flex items-center gap-1">
                        {pwdStrength.checks.upper ? <Check className="w-3 h-3 text-success" /> : <X className="w-3 h-3" />} Letra maiúscula
                      </div>
                      <div className="flex items-center gap-1">
                        {pwdStrength.checks.lower ? <Check className="w-3 h-3 text-success" /> : <X className="w-3 h-3" />} Letra minúscula
                      </div>
                      <div className="flex items-center gap-1">
                        {pwdStrength.checks.number ? <Check className="w-3 h-3 text-success" /> : <X className="w-3 h-3" />} Número
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Organizational Structure */}
          <div className="space-y-4 pt-2 border-t">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Alocação e Permissões</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_id">Empresa <span className="text-destructive">*</span></Label>
                <Select required value={formData.company_id} onValueChange={(v) => handleChange('company_id', v)} disabled={isSubmitting}>
                  <SelectTrigger id="company_id" className={errors.company_id ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.company_id && <p className="text-xs text-destructive">{errors.company_id}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit_id">Unidade <span className="text-destructive">*</span></Label>
                <Select required value={formData.unit_id} onValueChange={(v) => handleChange('unit_id', v)} disabled={!formData.company_id || isSubmitting}>
                  <SelectTrigger id="unit_id" className={errors.unit_id ? 'border-destructive' : ''}>
                    <SelectValue placeholder={formData.company_id ? "Selecione..." : "Selecione a empresa"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUnits.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.unit_id && <p className="text-xs text-destructive">{errors.unit_id}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector_id">Setor <span className="text-destructive">*</span></Label>
                <Select required value={formData.sector_id} onValueChange={(v) => handleChange('sector_id', v)} disabled={!formData.unit_id || isSubmitting}>
                  <SelectTrigger id="sector_id" className={errors.sector_id ? 'border-destructive' : ''}>
                    <SelectValue placeholder={formData.unit_id ? "Selecione..." : "Selecione a unidade"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSectors.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.sector_id && <p className="text-xs text-destructive">{errors.sector_id}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Cargo / Função</Label>
                <Input 
                  id="position" 
                  value={formData.position} 
                  onChange={(e) => handleChange('position', e.target.value)} 
                  placeholder="Ex: Cozinheiro Líder"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Perfil de Acesso <span className="text-destructive">*</span></Label>
                <Select value={formData.role} onValueChange={(v) => handleChange('role', v)} disabled={isSubmitting}>
                  <SelectTrigger id="role" className={errors.role ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administrator">Administrador</SelectItem>
                    <SelectItem value="manager">Gerente</SelectItem>
                    <SelectItem value="operator">Operador</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-xs text-destructive">{errors.role}</p>}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/20 mt-4">
            <div className="space-y-0.5">
              <Label className="text-base">Status do Usuário</Label>
              <p className="text-sm text-muted-foreground">
                Usuários inativos não podem acessar o sistema.
              </p>
            </div>
            <Switch 
              checked={formData.status === 'active'} 
              onCheckedChange={(v) => handleChange('status', v ? 'active' : 'inactive')} 
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEditing ? 'Salvar Alterações' : 'Criar Usuário'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormModal;
