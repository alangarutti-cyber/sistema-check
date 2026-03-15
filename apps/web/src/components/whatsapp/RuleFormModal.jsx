
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

const RECIPIENTS = ['Operador', 'Gestor', 'Supervisor', 'Grupo de Escalonamento'];

const RuleFormModal = ({ isOpen, onClose, onSave, initialData, templates }) => {
  const [formData, setFormData] = useState({
    name: '',
    event: 'overdue',
    recipients: [],
    template: '',
    sendTime: 'Imediatamente',
    autoResend: false,
    resendMinutes: 60,
    enabled: true
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        event: 'overdue',
        recipients: [],
        template: templates[0]?.id || '',
        sendTime: 'Imediatamente',
        autoResend: false,
        resendMinutes: 60,
        enabled: true
      });
    }
  }, [initialData, isOpen, templates]);

  const handleRecipientToggle = (recipient) => {
    setFormData(prev => {
      const current = prev.recipients;
      if (current.includes(recipient)) {
        return { ...prev, recipients: current.filter(r => r !== recipient) };
      } else {
        return { ...prev, recipients: [...current, recipient] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Regra' : 'Nova Regra de Envio'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="space-y-2">
            <Label>Nome da Regra</Label>
            <Input 
              required 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder="Ex: Escalonamento de Atrasos Críticos"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Evento Gatilho</Label>
              <Select value={formData.event} onValueChange={v => setFormData({...formData, event: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="overdue">Checklist Atrasado</SelectItem>
                  <SelectItem value="not_started">Não Iniciado</SelectItem>
                  <SelectItem value="critical_item">Item Crítico</SelectItem>
                  <SelectItem value="non_compliance">Não Conformidade</SelectItem>
                  <SelectItem value="overdue_action">Ação Vencida</SelectItem>
                  <SelectItem value="reopened">Reaberto</SelectItem>
                  <SelectItem value="missing_evidence">Evidência Faltante</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Template de Mensagem</Label>
              <Select value={formData.template} onValueChange={v => setFormData({...formData, template: v})}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {templates.filter(t => t.type === formData.event).map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                  {templates.filter(t => t.type === formData.event).length === 0 && (
                    <SelectItem value="none" disabled>Nenhum template para este evento</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Destinatários</Label>
            <div className="grid grid-cols-2 gap-3 bg-muted/30 p-4 rounded-xl border border-border/50">
              {RECIPIENTS.map(recipient => (
                <div key={recipient} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`rec-${recipient}`} 
                    checked={formData.recipients.includes(recipient)}
                    onCheckedChange={() => handleRecipientToggle(recipient)}
                  />
                  <label htmlFor={`rec-${recipient}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {recipient}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Momento do Envio</Label>
              <Select value={formData.sendTime} onValueChange={v => setFormData({...formData, sendTime: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Imediatamente">Imediatamente</SelectItem>
                  <SelectItem value="Após 15 minutos">Após 15 minutos</SelectItem>
                  <SelectItem value="Após 30 minutos">Após 30 minutos</SelectItem>
                  <SelectItem value="Após 1 hora">Após 1 hora</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between bg-muted/30 p-4 rounded-xl border border-border/50">
            <div className="space-y-0.5">
              <Label className="text-base">Reenvio Automático</Label>
              <p className="text-xs text-muted-foreground">Reenviar se o problema não for resolvido</p>
            </div>
            <Switch 
              checked={formData.autoResend} 
              onCheckedChange={v => setFormData({...formData, autoResend: v})} 
            />
          </div>

          {formData.autoResend && (
            <div className="space-y-2 pl-4 border-l-2 border-primary/20">
              <Label>Intervalo de Reenvio (minutos)</Label>
              <Input 
                type="number" 
                min="15" 
                value={formData.resendMinutes} 
                onChange={e => setFormData({...formData, resendMinutes: parseInt(e.target.value)})} 
              />
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={formData.recipients.length === 0 || !formData.template}>Salvar Regra</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RuleFormModal;
