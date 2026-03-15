
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout.jsx';
import TimelineEvent from '@/components/execution/TimelineEvent.jsx';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Printer, CheckCircle2, AlertTriangle, Camera, Play, Check, AlertCircle } from 'lucide-react';

const mockTimeline = [
  { id: 1, time: '09:01', desc: 'Checklist iniciado por Maria Silva', icon: Play, color: 'text-primary bg-primary/10 border-primary/20' },
  { id: 2, time: '09:05', desc: 'Item 1 marcado como Conforme', icon: Check, color: 'text-success bg-success/10 border-success/20' },
  { id: 3, time: '09:06', desc: 'Evidência fotográfica enviada para Item 3', icon: Camera, color: 'text-muted-foreground bg-muted border-border' },
  { id: 4, time: '09:08', desc: 'Não Conformidade reportada no Item 5', icon: AlertTriangle, color: 'text-error bg-error/10 border-error/20', details: 'Observação: Extintor despressurizado e com lacre rompido.' },
  { id: 5, time: '09:15', desc: 'Checklist finalizado', icon: CheckCircle2, color: 'text-success bg-success/10 border-success/20' },
  { id: 6, time: '09:16', desc: 'Ação corretiva criada automaticamente', icon: AlertCircle, color: 'text-warning bg-warning/10 border-warning/20', details: 'Ação AC-001 atribuída ao setor de Manutenção.' },
];

const ExecutionDetailPage = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto pb-20">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Voltar para Histórico
          </button>
          <Button variant="outline" size="sm" className="gap-2"><Printer className="w-4 h-4"/> Imprimir Relatório</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 pb-8 border-b">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight mb-3">Checklist de Abertura</h1>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                    <p className="text-muted-foreground">Unidade: <span className="font-bold text-foreground">Unidade Limeira</span></p>
                    <p className="text-muted-foreground">Setor: <span className="font-bold text-foreground">Cozinha</span></p>
                    <p className="text-muted-foreground">Responsável: <span className="font-bold text-foreground">Maria Silva</span></p>
                    <p className="text-muted-foreground">Data: <span className="font-bold text-foreground">14/03/2026</span></p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <span className="badge badge-success text-sm px-3 py-1">Concluído</span>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Conformidade</p>
                    <p className="text-4xl font-bold text-success">85%</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold">Respostas</h3>
                
                {/* Mock Item 1 */}
                <div className="p-5 rounded-xl border bg-muted/10">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-foreground">1. Limpeza do piso</h4>
                    <span className="badge badge-success gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Conforme
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Verificar se o piso está varrido e sem riscos.</p>
                </div>

                {/* Mock Item 2 - Critical Failure */}
                <div className="p-5 rounded-xl border border-error/30 bg-error/5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-foreground">2. Extintores de incêndio</h4>
                      <span className="badge badge-critical text-[10px] py-0">Crítico</span>
                    </div>
                    <span className="badge badge-error gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Não Conforme
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Garantir que todos os extintores estão pressurizados.</p>
                  
                  <div className="bg-background p-4 rounded-lg border border-error/20 text-sm mb-4">
                    <span className="font-bold text-error block mb-1">Observação Obrigatória:</span>
                    Extintor despressurizado e com lacre rompido no setor sul.
                  </div>

                  <div className="flex gap-3">
                    <div className="w-24 h-24 bg-muted rounded-lg border flex items-center justify-center text-xs text-muted-foreground overflow-hidden">
                      <Camera className="w-6 h-6 opacity-50" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Timeline */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-6">Linha do Tempo</h3>
              <div className="pt-2">
                {mockTimeline.map((event, idx) => (
                  <TimelineEvent 
                    key={event.id}
                    timestamp={event.time}
                    description={event.desc}
                    icon={event.icon}
                    colorClass={event.color}
                    details={event.details}
                    isLast={idx === mockTimeline.length - 1}
                  />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ExecutionDetailPage;
