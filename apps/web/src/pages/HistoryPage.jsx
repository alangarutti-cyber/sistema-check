
import React, { useState, useMemo } from 'react';
import MainLayout from '@/components/MainLayout.jsx';
import { useMockData } from '@/context/MockDataContext.jsx';
import FilterPanel from '@/components/shared/FilterPanel.jsx';
import RecentExecutionsList from '@/components/dashboard/RecentExecutionsList.jsx';

const HistoryPage = () => {
  const { executions } = useMockData();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Memoize filtered results to prevent unnecessary recalculations
  const completedExecutions = useMemo(() => {
    return executions.filter(e => e.status === 'completed' || e.status === 'completed_with_issues');
  }, [executions]);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Execution History</h1>
          <p className="text-muted-foreground">Review past checklist executions and audit logs.</p>
        </div>

        <FilterPanel 
          onSearch={setSearchTerm} 
          onFilterChange={() => {}} 
        />

        <RecentExecutionsList executions={completedExecutions} />
      </div>
    </MainLayout>
  );
};

export default HistoryPage;
