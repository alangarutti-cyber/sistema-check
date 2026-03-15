
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, MessageCircle, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

const EVENT_TYPES = [
  { id: 'overdue', label: 'Checklist Atrasado' },
  { id: 'not_started', label: 'Não Iniciado' },
  { id: 'critical_item', label: 'Item Crítico Reprovado' },
  { id: 'non_compliance', label: 'Não Conformidade Geral' },
  { id: 'overdue_action', label: 'Ação Corretiva Vencida' },
  { id: 'reopened', label: 'Ação Reaberta' },
  { id: 'missing_evidence', label: 'Evidência Faltante' }
];

const formatPhone = (value) => {
  if (!value) return '';
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
  }
  return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
};

const WhatsAppAlertsSettings = ({ config, onSave }) => {
  const [formData, setFormData] = useState(config);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(config);
  }, [config]);

  const handlePhoneChange = (field, value) => {
    setFormData({ ...formData, [field]: formatPhone(value) });
  };

  const handleEventToggle = (eventId) => {
    setFormData(prev => {
      const current = prev.selectedEvents;
      if (current.includes(eventId)) {
        return { ...prev, selectedEvents: current.filter(id => id !== eventId) };
      } else {
        return { ...prev, selectedEvents: [...current, eventId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-4 border-b bg-muted/10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Status do Módulo
              </CardTitle>
              <CardDescription>Ative ou desative o envio de alertas via WhatsApp para toda a rede.</CardDescription>
            </div>
            <Switch 
              checked={formData.enabled} 
              onCheckedChange={(v) => setFormData({...formData, enabled: v})} 
              className="data-[state=checked]:bg-success"
            />
          </div>
        </CardHeader>
      </Card>

      <div className={`space-y-6 transition-opacity duration-300 ${!formData.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Contatos Padrão</CardTitle>
            <CardDescription>Defina os números de telefone para escalonamento e fallback.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Telefone do Responsável Geral</Label>
                <Input 
                  placeholder="(00) 00000-0000" 
                  value={formData.responsiblePhone}
                  onChange={(e) => handlePhoneChange('responsiblePhone', e.target.value)}
                  maxLength={15}
                />
                <p className="text-xs text-muted-foreground">Recebe alertas quando não há responsável definido.</p>
              </div>
              <div className="space-y-2">
                <Label>Telefone do Gestor (Escalonamento)</Label>
                <Input 
                  placeholder="(00) 00000-0000" 
                  value={formData.managerPhone}
                  onChange={(e) => handlePhoneChange('managerPhone', e.target.value)}
                  maxLength={15}
                />
                <p className="text-xs text-muted-foreground">Recebe alertas críticos não resolvidos.</p>
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <Label>Grupo de Escalonamento</Label>
              <Select value={formData.escalationGroup} onValueChange={(v) => setFormData({...formData, escalationGroup: v})}>
                <SelectTrigger className="max-w-md"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gestores Regionais">Gestores Regionais</SelectItem>
                  <SelectItem value="Diretoria">Diretoria</SelectItem>
                  <SelectItem value="Equipe de Qualidade">Equipe de Qualidade</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-warning" />
              Eventos Monitorados
            </CardTitle>
            <CardDescription>Selecione quais eventos devem gerar alertas automáticos.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {EVENT_TYPES.map(event => (
                <div key={event.id} className="flex items-start space-x-3 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                  <Checkbox 
                    id={`event-${event.id}`} 
                    checked={formData.selectedEvents.includes(event.id)}
                    onCheckedChange={() => handleEventToggle(event.id)}
                    className="mt-0.5"
                  />
                  <label htmlFor={`event-${event.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                    {event.label}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSaving} className="gap-2">
            <Save className="w-4 h-4" />
            {isSaving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default WhatsAppAlertsSettings;
