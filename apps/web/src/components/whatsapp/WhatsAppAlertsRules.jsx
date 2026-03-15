
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit2, Trash2, Copy, Clock, Users, AlertTriangle } from 'lucide-react';
import RuleFormModal from './RuleFormModal.jsx';
import { AlertPriorityBadge, AlertTypeIcon, getAlertTypeName } from './AlertBadge.jsx';
import { toast } from 'sonner';

const WhatsAppAlertsRules = ({ rules, templates, onSave, onDelete, onToggle }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);

  const safeRules = Array.isArray(rules) ? rules : [];

  const handleCreate = () => {
    setSelectedRule(null);
    setIsModalOpen(true);
  };

  const handleEdit = (rule) => {
    setSelectedRule(rule);
    setIsModalOpen(true);
  };

  const handleDuplicate = async (rule) => {
    const duplicated = {
      ...rule,
      id: undefined,
      name: `${rule.name} (Cópia)`,
      isActive: false
    };
    await onSave(duplicated);
    toast.success('Regra duplicada com sucesso!');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta regra?')) {
      await onDelete(id);
      toast.success('Regra excluída com sucesso!');
    }
  };

  const handleToggle = async (id, isActive) => {
    const rule = safeRules.find(r => r?.id === id);
    if (rule) {
      await onSave({ ...rule, isActive });
      toast.success(isActive ? 'Regra ativada' : 'Regra desativada');
    }
  };

  const handleSave = async (data) => {
    await onSave(data);
    toast.success('Regra salva com sucesso!');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Regras de Automação</h2>
          <p className="text-sm text-muted-foreground">Configure gatilhos, atrasos e destinatários para envios automáticos.</p>
        </div>
        <Button onClick={handleCreate} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> Criar Nova Regra
        </Button>
      </div>

      <Card className="border-border/60 shadow-sm overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Nome da Regra</TableHead>
                <TableHead>Gatilho</TableHead>
                <TableHead>Destinatários</TableHead>
                <TableHead>Atraso</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeRules.map((rule) => (
                <TableRow key={rule.id} className={`hover:bg-muted/20 transition-colors group ${!rule.isActive ? 'opacity-60' : ''}`}>
                  <TableCell className="font-bold text-sm">{rule.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AlertTypeIcon type={rule.eventType} />
                      <span className="text-sm font-medium">{getAlertTypeName(rule.eventType)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Users className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[150px]" title={(rule.recipients || []).join(', ')}>
                        {(rule.recipients || []).join(', ')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      {rule.delayMinutes === 0 ? 'Imediato' : `${rule.delayMinutes} min`}
                    </div>
                  </TableCell>
                  <TableCell><AlertPriorityBadge priority={rule.priority} /></TableCell>
                  <TableCell>
                    <Switch 
                      checked={rule.isActive} 
                      onCheckedChange={(v) => handleToggle(rule.id, v)} 
                      className="data-[state=checked]:bg-[hsl(var(--wa-success))]"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(rule)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDuplicate(rule)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(rule.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {safeRules.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    Nenhuma regra configurada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <RuleFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave}
        initialData={selectedRule}
        templates={templates || []}
      />
    </div>
  );
};

export default WhatsAppAlertsRules;
