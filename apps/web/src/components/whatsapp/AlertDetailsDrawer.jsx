
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertStatusBadge, AlertPriorityBadge, AlertTypeIcon, getAlertTypeName } from './AlertBadge.jsx';
import { Clock, Building2, FileText, User, AlertTriangle, RefreshCw, Copy, CheckCircle2, XCircle, Calendar, Hash } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

const AlertDetailsDrawer = ({ isOpen, onClose, alert, onRetry }) => {
  if (!alert) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(alert.message || 'Mensagem não disponível');
    toast.success('Mensagem copiada para a área de transferência');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl overflow-hidden flex flex-col p-0">
        <SheetHeader className="p-6 border-b bg-muted/10 shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold flex items-center gap-2">
              Detalhes do Alerta
            </SheetTitle>
            <AlertStatusBadge status={alert.status} />
          </div>
          <SheetDescription className="flex items-center gap-2 mt-2">
            <Hash className="w-3.5 h-3.5" /> {alert.id}
            <span className="text-muted-foreground">•</span>
            <Clock className="w-3.5 h-3.5" /> {format(parseISO(alert.scheduledAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-8">
            
            {/* Section: Evento */}
            <section className="space-y-3">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Evento Gerador</h3>
              <div className="bg-card border rounded-xl p-4 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <AlertTypeIcon type={alert.eventType} className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-base">{getAlertTypeName(alert.eventType)}</h4>
                    <AlertPriorityBadge priority={alert.priority} />
                  </div>
                  <p className="text-sm text-muted-foreground">Regra: {alert.ruleId}</p>
                </div>
              </div>
            </section>

            {/* Section: Contexto */}
            <section className="space-y-3">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Contexto Operacional</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1"><Building2 className="w-3.5 h-3.5"/> Unidade</span>
                  <p className="font-semibold text-sm">{alert.unitName || 'N/A'}</p>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1"><FileText className="w-3.5 h-3.5"/> Checklist</span>
                  <p className="font-semibold text-sm truncate" title={alert.checklistName}>{alert.checklistName || 'N/A'}</p>
                </div>
              </div>
            </section>

            {/* Section: Destinatários */}
            <section className="space-y-3">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Destinatários</h3>
              <div className="border rounded-xl overflow-hidden">
                {alert.destinataries?.map((dest, idx) => (
                  <div key={idx} className={`p-3 flex items-center justify-between ${idx !== 0 ? 'border-t' : ''} bg-card`}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {dest.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{dest.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{dest.number}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="secondary" className="text-[10px]">{dest.type}</Badge>
                      <AlertStatusBadge status={dest.status} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Mensagem */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Mensagem Enviada</h3>
                <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5" onClick={handleCopy}>
                  <Copy className="w-3.5 h-3.5" /> Copiar
                </Button>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-border/50 text-sm whitespace-pre-wrap font-mono text-slate-700 dark:text-slate-300 leading-relaxed shadow-inner">
                {alert.message || 'Conteúdo da mensagem não disponível no mock.'}
              </div>
              <p className="text-xs text-muted-foreground text-right">Template: {alert.templateId}</p>
            </section>

            {/* Section: Timeline */}
            <section className="space-y-3">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Timeline de Entrega</h3>
              <div className="space-y-4 pl-2">
                {alert.deliveryLogs?.map((log, idx) => (
                  <div key={idx} className="relative pl-6 pb-4 border-l-2 border-muted last:border-0 last:pb-0">
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-background flex items-center justify-center
                      ${log.status === 'Enviado' ? 'bg-[hsl(var(--wa-success))]' : 
                        log.status === 'Falhou' ? 'bg-[hsl(var(--wa-error))]' : 'bg-[hsl(var(--wa-pending))]'}`}
                    ></div>
                    <div className="-mt-1.5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{log.status}</span>
                        <span className="text-xs text-muted-foreground">{format(parseISO(log.timestamp), "HH:mm:ss", { locale: ptBR })}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{log.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-card shrink-0 flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>Fechar</Button>
          {(alert.status === 'Falhou' || alert.status === 'Pendente') && (
            <Button onClick={() => onRetry(alert.id)} className="gap-2">
              <RefreshCw className="w-4 h-4" /> Reenviar Agora
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AlertDetailsDrawer;
