
import React, { useMemo } from 'react';
import { useMockData } from '@/context/MockDataContext.jsx';
import DashboardCard from '@/components/dashboard/DashboardCard.jsx';
import ChecklistCard from '@/components/checklist/ChecklistCard.jsx';
import { ClipboardList, PlayCircle, CheckCircle } from 'lucide-react';

const OperatorDashboard = () => {
  const { executions } = useMockData();
  
  // Memoize filtered mock data for operator view to prevent unnecessary recalculations
  const myChecklists = useMemo(() => executions.filter(e => e.assignedTo === 'Operator User'), [executions]);
  const pending = useMemo(() => myChecklists.filter(e => e.status === 'pending' || e.status === 'overdue'), [myChecklists]);
  const inProgress = useMemo(() => myChecklists.filter(e => e.status === 'in_progress'), [myChecklists]);
  const completed = useMemo(() => myChecklists.filter(e => e.status === 'completed'), [myChecklists]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Workspace</h1>
        <p className="text-muted-foreground">Welcome back. Here are your tasks for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard title="To Do" value={pending.length} icon={ClipboardList} colorClass="text-blue-600 bg-blue-100" />
        <DashboardCard title="In Progress" value={inProgress.length} icon={PlayCircle} colorClass="text-yellow-600 bg-yellow-100" />
        <DashboardCard title="Completed Today" value={completed.length} icon={CheckCircle} colorClass="text-green-600 bg-green-100" />
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold border-b pb-2">Action Required</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...pending, ...inProgress].map(checklist => (
            <ChecklistCard key={checklist.id} checklist={checklist} />
          ))}
          {[...pending, ...inProgress].length === 0 && (
            <div className="col-span-full p-8 text-center bg-muted/30 rounded-xl border border-dashed">
              <p className="text-muted-foreground">You're all caught up! No pending checklists.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OperatorDashboard;
