
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Edit2, Trash2, MessageSquare, Copy, Eye } from 'lucide-react';
import { getAlertTypeName } from './AlertBadge.jsx';

const TemplateCard = ({ template, onEdit, onDuplicate, onDelete, onToggle, onTest }) => {
  return (
    <Card className={`flex flex-col h-full border-border/60 shadow-sm transition-all duration-200 ${!template.isActive ? 'opacity-70 bg-muted/30' : 'hover:shadow-lg hover:-translate-y-1'}`}>
      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight tracking-tight">{template.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-[10px] font-medium bg-background">
                  {template.category}
                </Badge>
                <span className="text-xs text-muted-foreground font-medium">{getAlertTypeName(template.alertType)}</span>
              </div>
            </div>
          </div>
          <Switch 
            checked={template.isActive} 
            onCheckedChange={(v) => onToggle(template.id, v)} 
            className="data-[state=checked]:bg-[hsl(var(--wa-success))]"
          />
        </div>

        <div className="bg-muted/40 p-4 rounded-xl border border-border/50 mb-4 flex-1 relative group">
          <p className="text-sm font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap line-clamp-4 leading-relaxed">
            {template.message}
          </p>
          <div className="absolute inset-0 bg-gradient-to-t from-muted/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-end justify-center pb-2">
            <Button variant="secondary" size="sm" className="h-7 text-xs shadow-sm" onClick={() => onTest(template)}>
              Testar Template
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {template.variables.slice(0, 4).map(v => (
            <span key={v} className="text-[10px] px-2 py-1 bg-primary/5 text-primary rounded-md border border-primary/10 font-medium">
              {v}
            </span>
          ))}
          {template.variables.length > 4 && (
            <span className="text-[10px] px-2 py-1 bg-muted text-muted-foreground rounded-md font-medium">
              +{template.variables.length - 4}
            </span>
          )}
        </div>

        <div className="flex gap-2 mt-auto pt-4 border-t">
          <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={() => onEdit(template)}>
            <Edit2 className="w-3.5 h-3.5"/> Editar
          </Button>
          <Button variant="outline" size="icon" className="shrink-0" onClick={() => onDuplicate(template)}>
            <Copy className="w-4 h-4"/>
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0" onClick={() => onDelete(template.id)}>
            <Trash2 className="w-4 h-4"/>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
