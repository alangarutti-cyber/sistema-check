
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Play, Loader2 } from 'lucide-react';

const AVAILABLE_VARIABLES = [
  '{{checklist_name}}', '{{unit_name}}', '{{sector_name}}', '{{user_name}}', 
  '{{item_name}}', '{{scheduled_time}}', '{{status}}', '{{deadline}}', 
  '{{priority}}', '{{action_title}}', '{{responsible_name}}', '{{current_time}}'
];

const TemplateFormModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'overdue',
    content: '',
    variables: []
  });
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ name: '', type: 'overdue', content: '', variables: [] });
    }
    setTestResult('');
  }, [initialData, isOpen]);

  const handleContentChange = (e) => {
    const content = e.target.value;
    const foundVars = AVAILABLE_VARIABLES.filter(v => content.includes(v)).map(v => v.replace(/[{}]/g, ''));
    setFormData({ ...formData, content, variables: foundVars });
  };

  const insertVariable = (variable) => {
    const newContent = formData.content + (formData.content.endsWith(' ') ? '' : ' ') + variable;
    handleContentChange({ target: { value: newContent } });
  };

  const handleTest = () => {
    setIsTesting(true);
    setTimeout(() => {
      let result = formData.content;
      const mockValues = {
        '{{checklist_name}}': 'Inspeção Diária',
        '{{unit_name}}': 'Matriz',
        '{{sector_name}}': 'Produção',
        '{{user_name}}': 'João Silva',
        '{{item_name}}': 'Extintores',
        '{{scheduled_time}}': '08:00',
        '{{status}}': 'Atrasado',
        '{{deadline}}': '14/03/2026',
        '{{priority}}': 'Alta',
        '{{action_title}}': 'Trocar extintor',
        '{{responsible_name}}': 'Maria Costa',
        '{{current_time}}': '10:30'
      };
      
      Object.keys(mockValues).forEach(key => {
        result = result.replaceAll(key, mockValues[key]);
      });
      
      setTestResult(result);
      setIsTesting(false);
    }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Template' : 'Novo Template'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome do Template</Label>
              <Input 
                required 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="Ex: Alerta de Atraso"
                disabled={initialData?.isDefault}
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Evento</Label>
              <Select 
                value={formData.type} 
                onValueChange={v => setFormData({...formData, type: v})}
                disabled={initialData?.isDefault}
              >
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
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <Label>Conteúdo da Mensagem</Label>
              <Button type="button" variant="ghost" size="sm" onClick={handleTest} className="h-8 text-xs gap-1.5">
                {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                Testar Preview
              </Button>
            </div>
            <Textarea 
              required 
              value={formData.content} 
              onChange={handleContentChange}
              className="min-h-[120px] font-mono text-sm"
              placeholder="Digite a mensagem aqui..."
              disabled={initialData?.isDefault}
            />
          </div>

          {testResult && (
            <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
              <span className="text-xs font-semibold text-muted-foreground mb-1 block">Preview:</span>
              <p className="text-sm whitespace-pre-wrap">{testResult}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Variáveis Disponíveis (Clique para inserir)</Label>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_VARIABLES.map(v => (
                <Badge 
                  key={v} 
                  variant="secondary" 
                  className={`cursor-pointer hover:bg-primary/20 transition-colors ${initialData?.isDefault ? 'opacity-50 pointer-events-none' : ''}`}
                  onClick={() => !initialData?.isDefault && insertVariable(v)}
                >
                  {v}
                </Badge>
              ))}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            {!initialData?.isDefault && <Button type="submit">Salvar Template</Button>}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateFormModal;
