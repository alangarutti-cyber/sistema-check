
import React from 'react';
import MainLayout from '@/components/MainLayout.jsx';
import ActivityItem from '@/components/dashboard/ActivityItem.jsx';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ClipboardList, CheckCircle, AlertTriangle, Clock, TrendingUp, TrendingDown, Info, MessageCircle, Send, XCircle, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import { useMockData } from '@/context/MockDataContext.jsx';
import AlertKPICard from '@/components/whatsapp/AlertKPICard.jsx';

const mockActivities = [
  { id: 1, type: 'completed', description: 'Checklist de Abertura da Cozinha concluído', user: 'Maria Silva', unit: 'Unidade Limeira', timestamp: 'há 5 minutos' },
  { id: 2, type: 'critical', description: 'Problema crítico reportado: Extintor vencido', user: 'João Santos', unit: 'Unidade Americana', timestamp: 'há 12 minutos' },
  { id: 3, type: 'action_created', description: 'Ação corretiva criada para Não Conformidade Crítica', user: 'Sistema', unit: 'Unidade Americana', timestamp: 'há 12 minutos' },
  { id: 4, type: 'overdue', description: 'Checklist de Limpeza atrasado', user: 'Pedro Costa', unit: 'Unidade Campinas', timestamp: 'há 1 hora' },
  { id: 5, type: 'evidence', description: 'Evidência fotográfica adicionada ao Checklist de Segurança', user: 'Ana Paula', unit: 'Unidade Limeira', timestamp: 'há 2 horas' },
];

const trendData = [
  { name: 'Seg', compliance: 85, critical: 2 },
  { name: 'Ter', compliance: 88, critical: 1 },
  { name: 'Qua', compliance: 92, critical: 0 },
  { name: 'Qui', compliance: 87, critical: 3 },
  { name: 'Sex', compliance: 94, critical: 0 },
  { name: 'Sáb', compliance: 96, critical: 0 },
  { name: 'Dom', compliance: 91, critical: 1 },
];

const waTrendData = [
  { name: 'Seg', enviados: 12, falhas: 0 },
  { name: 'Ter', enviados: 15, falhas: 1 },
  { name: 'Qua', enviados: 8, falhas: 0 },
  { name: 'Qui', enviados: 22, falhas: 2 },
  { name: 'Sex', enviados: 18, falhas: 0 },
  { name: 'Sáb', enviados: 5, falhas: 0 },
  { name: 'Dom', enviados: 7, falhas: 0 },
];

const waPieData = [
  { name: 'Sucesso', value: 87, color: 'hsl(var(--wa-success))' },
  { name: 'Falha', value: 3, color: 'hsl(var(--wa-error))' },
  { name: 'Pendente', value: 10, color: 'hsl(var(--wa-pending))' },
];

const DashboardPage = () => {
  const { whatsappAlerts } = useMockData();

  const StatCard = ({ title, value, subtitle, icon: Icon, colorClass, trend }) => (
    <Card className="p-6 flex flex-col justify-between hover:shadow-md transition-shadow border-border/60 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
            {trend > 0 ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <h3 className="text-3xl font-extrabold tracking-tight mb-1" style={{letterSpacing: '-0.02em'}}>{value}</h3>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>
    </Card>
  );

  return (
    <MainLayout>
      <div className="space-y-8 pb-8">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2" style={{letterSpacing: '-0.02em'}}>Visão Geral Operacional</h1>
            <p className="text-muted-foreground text-lg">Acompanhe o desempenho e conformidade da sua rede em tempo real.</p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary">
                <Info className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <p>Este painel consolida os dados de todas as unidades. Clique nos cards para filtrar os resultados.</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Operações de Hoje */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Checklists Agendados" value="142" subtitle="Para o dia de hoje" icon={ClipboardList} colorClass="bg-primary/10 text-primary" />
          <StatCard title="Concluídos" value="89" subtitle="62% do total" icon={CheckCircle} colorClass="bg-success/10 text-success" trend={5} />
          <StatCard title="Atrasados" value="12" subtitle="8% do total" icon={Clock} colorClass="bg-warning/10 text-warning" trend={-2} />
          <StatCard title="Problemas Críticos" value="3" subtitle="Requerem atenção imediata" icon={AlertTriangle} colorClass="bg-critical/10 text-critical" trend={-1} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tendências Chart */}
          <Card className="lg:col-span-2 p-6 border-border/60 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold tracking-tight">Tendência de Conformidade (7 dias)</h2>
              <Badge variant="outline" className="bg-background">Rede Completa</Badge>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} domain={[0, 100]} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                  />
                  <Line type="monotone" dataKey="compliance" name="Conformidade (%)" stroke="hsl(var(--primary))" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Alertas Resumo */}
          <Card className="p-6 flex flex-col border-border/60 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold tracking-tight">Central de Alertas</h2>
              <Link to="/alerts" className="text-sm text-primary font-bold hover:underline">Ver todos</Link>
            </div>
            <div className="space-y-4 flex-1">
              <div className="flex items-center justify-between p-4 rounded-xl bg-critical/10 border border-critical/20 transition-transform hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-critical" />
                  <span className="font-bold text-critical">Alertas Críticos</span>
                </div>
                <span className="text-xl font-bold text-critical">3</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-error/10 border border-error/20 transition-transform hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-error" />
                  <span className="font-bold text-error">Ações Vencidas</span>
                </div>
                <span className="text-xl font-bold text-error">5</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-warning/10 border border-warning/20 transition-transform hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-5 h-5 text-warning" />
                  <span className="font-bold text-warning">Checklists Atrasados</span>
                </div>
                <span className="text-xl font-bold text-warning">12</span>
              </div>
            </div>
            <Button className="w-full mt-4 shadow-sm" variant="outline" asChild>
              <Link to="/corrective-actions">Gerenciar Ações Corretivas</Link>
            </Button>
          </Card>
        </div>

        {/* WhatsApp Alerts Section */}
        <div className="pt-8 mt-8 border-t border-border/60">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold flex items-center gap-3 tracking-tight" style={{letterSpacing: '-0.02em'}}>
              <div className="w-10 h-10 rounded-xl bg-[hsl(var(--wa-success))]/10 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-[hsl(var(--wa-success))]" />
              </div>
              WhatsApp Alerts Analytics
            </h2>
            <Button variant="outline" className="shadow-sm" asChild>
              <Link to="/whatsapp-alerts">Acessar Módulo</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <AlertKPICard title="Enviados Hoje" value="24" icon={Send} colorClass="bg-[hsl(var(--wa-success))]/10 text-[hsl(var(--wa-success))]" trend={15} />
            <AlertKPICard title="Falhas de Envio" value="2" icon={XCircle} colorClass="bg-[hsl(var(--wa-error))]/10 text-[hsl(var(--wa-error))]" trend={-50} />
            <AlertKPICard title="Alertas Críticos" value="5" icon={AlertTriangle} colorClass="bg-[hsl(var(--wa-error))]/10 text-[hsl(var(--wa-error))]" />
            <AlertKPICard title="Taxa de Sucesso" value="92%" icon={Activity} colorClass="bg-[hsl(var(--wa-info))]/10 text-[hsl(var(--wa-info))]" trend={2} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6 border-border/60 shadow-sm">
              <h3 className="text-lg font-bold tracking-tight mb-6">Volume de Alertas (Últimos 7 Dias)</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={waTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                      cursor={{fill: 'hsl(var(--muted)/0.5)'}}
                    />
                    <Bar dataKey="enviados" name="Enviados" fill="hsl(var(--wa-success))" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="falhas" name="Falhas" fill="hsl(var(--wa-error))" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6 flex flex-col border-border/60 shadow-sm">
              <h3 className="text-lg font-bold tracking-tight mb-2">Distribuição de Status</h3>
              <div className="flex-1 flex items-center justify-center">
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={waPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {waPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                {waPieData.map(item => (
                  <div key={item.name} className="flex items-center gap-1.5 text-xs font-semibold">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                    {item.name}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Atividade Recente */}
        <Card className="overflow-hidden border-border/60 shadow-sm mt-8">
          <div className="p-6 border-b flex justify-between items-center bg-muted/10">
            <h2 className="text-lg font-bold tracking-tight">Atividade Recente</h2>
            <Button variant="ghost" size="sm" className="text-primary font-semibold">Filtrar</Button>
          </div>
          <div className="p-2">
            {mockActivities.map((activity) => (
              <ActivityItem key={activity.id} {...activity} />
            ))}
          </div>
          <div className="p-4 border-t bg-muted/10 text-center">
            <Button variant="link" className="text-muted-foreground font-semibold">Carregar mais atividades</Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
