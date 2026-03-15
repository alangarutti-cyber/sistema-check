
import React from 'react';
import MainLayout from '@/components/MainLayout.jsx';
import UnitPerformanceRow from '@/components/dashboard/UnitPerformanceRow.jsx';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, TrendingUp } from 'lucide-react';

const mockUnits = [
  { id: 1, name: 'Unidade São Paulo', compliance: 98, completed: 145, overdue: 0, critical: 0, openActions: 2, expiredActions: 0 },
  { id: 2, name: 'Unidade Campinas', compliance: 92, completed: 132, overdue: 2, critical: 0, openActions: 5, expiredActions: 0 },
  { id: 3, name: 'Unidade Ribeirão', compliance: 85, completed: 118, overdue: 5, critical: 1, openActions: 8, expiredActions: 1 },
  { id: 4, name: 'Unidade Americana', compliance: 72, completed: 95, overdue: 12, critical: 3, openActions: 15, expiredActions: 4 },
  { id: 5, name: 'Unidade Limeira', compliance: 45, completed: 60, overdue: 25, critical: 8, openActions: 22, expiredActions: 10 },
];

const UnitPerformancePage = () => {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Desempenho por Unidade</h1>
            <p className="text-muted-foreground">Ranking e métricas detalhadas de todas as unidades da rede.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 bg-card p-4 rounded-xl border shadow-sm">
          <Select defaultValue="30d">
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Período" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="hoje">Hoje</SelectItem>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="custom">Customizado</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Região" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Regiões</SelectItem>
              <SelectItem value="sp">São Paulo</SelectItem>
              <SelectItem value="interior">Interior</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total de Unidades</p>
              <p className="text-2xl font-bold">24</p>
            </div>
          </Card>
          <Card className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-success/10 text-success flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Média da Rede</p>
              <p className="text-2xl font-bold">84.5%</p>
            </div>
          </Card>
        </div>

        {/* Main Table */}
        <Card className="overflow-hidden border shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-16">Pos</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead className="w-48">Conformidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Concluídos</TableHead>
                  <TableHead className="text-center">Atrasados</TableHead>
                  <TableHead className="text-center">Críticos</TableHead>
                  <TableHead className="text-center">Ações Abertas</TableHead>
                  <TableHead className="text-center">Ações Vencidas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUnits.map((unit, index) => (
                  <UnitPerformanceRow 
                    key={unit.id}
                    position={index + 1}
                    {...unit}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default UnitPerformancePage;
