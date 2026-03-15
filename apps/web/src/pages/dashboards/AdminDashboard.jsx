
import React from 'react';
import { useMockData } from '@/context/MockDataContext.jsx';
import DashboardCard from '@/components/dashboard/DashboardCard.jsx';
import ChartContainer from '@/components/dashboard/ChartContainer.jsx';
import AlertCard from '@/components/dashboard/AlertCard.jsx';
import RecentExecutionsList from '@/components/dashboard/RecentExecutionsList.jsx';
import BarChartByUnit from '@/components/charts/BarChartByUnit.jsx';
import PieChartStatus from '@/components/charts/PieChartStatus.jsx';
import LineChartTrend from '@/components/charts/LineChartTrend.jsx';
import { ClipboardList, CheckCircle, Clock, AlertTriangle, ShieldAlert, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { executions, alerts, chartData } = useMockData();

  const stats = [
    { title: 'Total Checklists', value: '1,248', icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Completed', value: '892', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', trend: 'up', trendValue: '+12%' },
    { title: 'Pending', value: '156', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { title: 'Overdue', value: '42', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100', trend: 'down', trendValue: '-5%' },
    { title: 'Critical Items', value: '18', icon: ShieldAlert, color: 'text-orange-600', bg: 'bg-orange-100' },
    { title: 'Conformity Rate', value: '94.2%', icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-100', trend: 'up', trendValue: '+1.2%' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Executive Overview</h1>
        <p className="text-muted-foreground">Monitor compliance and execution metrics across all units.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <DashboardCard 
            key={i}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            trendValue={stat.trendValue}
            colorClass={`${stat.color} ${stat.bg}`}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartContainer title="Executions by Unit">
          <BarChartByUnit data={chartData.byUnit} />
        </ChartContainer>
        <ChartContainer title="Status Distribution">
          <PieChartStatus data={chartData.status} />
        </ChartContainer>
        <ChartContainer title="Conformity Trend (30 Days)">
          <LineChartTrend data={chartData.trend} />
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold">Recent Executions</h3>
          <RecentExecutionsList executions={executions} />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Active Alerts</h3>
            <span className="text-sm text-primary hover:underline cursor-pointer">View All</span>
          </div>
          <div className="space-y-3">
            {alerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
