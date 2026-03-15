
import React from 'react';
import { useMockData } from '@/context/MockDataContext.jsx';
import DashboardCard from '@/components/dashboard/DashboardCard.jsx';
import ChartContainer from '@/components/dashboard/ChartContainer.jsx';
import RecentExecutionsList from '@/components/dashboard/RecentExecutionsList.jsx';
import LineChartTrend from '@/components/charts/LineChartTrend.jsx';
import { Activity, AlertTriangle, XCircle, ShieldAlert } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ManagerDashboard = () => {
  const { executions, chartData } = useMockData();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Unit Management</h1>
          <p className="text-muted-foreground">Manage operations for Factory A.</p>
        </div>
        <div className="flex gap-3">
          <Select defaultValue="factory-a">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="factory-a">Factory A</SelectItem>
              <SelectItem value="warehouse-b">Warehouse B</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              <SelectItem value="prod-1">Production Line 1</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Unit Conformity" value="92.5%" icon={Activity} trend="up" trendValue="+2.1%" colorClass="text-indigo-600 bg-indigo-100" />
        <DashboardCard title="Overdue Checklists" value="8" icon={AlertTriangle} colorClass="text-red-600 bg-red-100" />
        <DashboardCard title="Non-Conformities" value="24" icon={XCircle} colorClass="text-orange-600 bg-orange-100" />
        <DashboardCard title="Critical Items" value="3" icon={ShieldAlert} colorClass="text-red-600 bg-red-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartContainer title="Unit Conformity Trend">
            <LineChartTrend data={chartData.trend} />
          </ChartContainer>
        </div>
        <div className="bg-card rounded-xl border border-border/50 shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Pending Actions</h3>
          <div className="space-y-4">
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-sm font-medium text-red-800">Review Critical Failure</p>
              <p className="text-xs text-red-600 mt-1">Daily Safety Inspection - Sector 2</p>
            </div>
            <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg">
              <p className="text-sm font-medium text-orange-800">Assign Overdue Checklists</p>
              <p className="text-xs text-orange-600 mt-1">3 checklists need reassignment</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Unit Executions</h3>
        <RecentExecutionsList executions={executions} />
      </div>
    </div>
  );
};

export default ManagerDashboard;
