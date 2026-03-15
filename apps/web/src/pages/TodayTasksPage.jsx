
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout.jsx';
import { useMockData } from '@/context/MockDataContext.jsx';
import { Clock, MapPin, User, AlertTriangle, Play, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const TodayTasksPage = () => {
  const { executions } = useMockData();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('all');

  // Filter for today's tasks
  const todayTasks = executions.filter(e => e.date === '2026-03-14');

  const filteredTasks = todayTasks.filter(task => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return task.status === 'pending';
    if (activeTab === 'in_progress') return task.status === 'in_progress';
    if (activeTab === 'completed') return task.status === 'completed';
    if (activeTab === 'overdue') return task.status === 'overdue';
    return true;
  });

  const tabs = [
    { id: 'all', label: t('tasks.all_tasks') },
    { id: 'pending', label: t('common.pending') },
    { id: 'in_progress', label: t('common.in_progress') },
    { id: 'overdue', label: t('common.overdue') },
    { id: 'completed', label: t('common.completed') },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'in_progress': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{t('tasks.title')}</h1>
          <p className="text-muted-foreground">{t('tasks.subtitle')}</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id 
                  ? 'bg-foreground text-background' 
                  : 'bg-card border hover:bg-muted text-muted-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, idx) => {
              const progress = task.totalItems ? Math.round((task.completedItems / task.totalItems) * 100) : 0;
              
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-card rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider border ${getStatusColor(task.status)}`}>
                            {t(`common.${task.status}`) || task.status.replace('_', ' ')}
                          </span>
                          {task.criticalItems > 0 && (
                            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
                              <AlertTriangle className="w-3 h-3" /> {t('common.critical')}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">{task.checklistName}</h3>
                        <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" /> {task.unit} • {task.sector}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" /> {task.scheduledTime}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <User className="w-4 h-4" /> {task.assignedTo}
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-full sm:w-32 shrink-0">
                        <div className="flex justify-between text-xs font-medium mb-1.5">
                          <span>{t('tasks.progress')}</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${progress === 100 ? 'bg-emerald-500' : 'bg-primary'}`} 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5 text-right">{task.completedItems} / {task.totalItems} {t('tasks.items')}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t flex flex-col sm:flex-row gap-3 justify-end">
                      {task.status === 'completed' ? (
                        <button 
                          onClick={() => navigate(`/history/${task.id}`)}
                          className="flex items-center justify-center gap-2 h-12 sm:h-10 px-6 rounded-xl font-medium bg-muted hover:bg-muted/80 transition-colors"
                        >
                          {t('tasks.view_details')}
                        </button>
                      ) : (
                        <button 
                          onClick={() => navigate(`/checklist-execution/${task.id}`)}
                          className="flex items-center justify-center gap-2 h-12 sm:h-10 px-6 rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                        >
                          {task.status === 'in_progress' ? (
                            <><Play className="w-4 h-4" /> {t('tasks.continue')}</>
                          ) : (
                            <><ArrowRight className="w-4 h-4" /> {t('tasks.start')}</>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">{t('tasks.all_caught_up')}</h3>
              <p className="text-muted-foreground">{t('tasks.no_tasks')}</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default TodayTasksPage;
