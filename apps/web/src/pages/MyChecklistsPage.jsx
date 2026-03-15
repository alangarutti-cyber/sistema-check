
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout.jsx';
import { useMockData } from '@/context/MockDataContext.jsx';
import { Search, Filter, Clock, MapPin, Play, CheckCircle2, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const MyChecklistsPage = () => {
  const { executions } = useMockData();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredChecklists = useMemo(() => {
    if (!Array.isArray(executions)) return [];
    
    return executions.filter(exec => {
      if (!exec) return false;
      const matchesSearch = !searchTerm ? true : (exec?.checklistName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ?? false);
      const matchesTab = activeTab === 'all' || exec?.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [executions, searchTerm, activeTab]);

  const tabs = [
    { id: 'all', label: t('common.all') },
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
      <div className="max-w-7xl mx-auto space-y-6 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">{t('checklists.title')}</h1>
            <p className="text-muted-foreground">{t('checklists.subtitle')}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder={t('checklists.search_placeholder')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 h-12 rounded-xl border bg-card focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 h-12 px-6 rounded-xl border bg-card hover:bg-muted transition-colors font-medium shrink-0">
            <Filter className="w-4 h-4" /> {t('common.filters')}
          </button>
        </div>

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

        {filteredChecklists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChecklists.map((checklist, index) => {
              const progress = checklist.totalItems ? Math.round((checklist.completedItems / checklist.totalItems) * 100) : 0;
              
              return (
                <motion.div
                  key={checklist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(checklist.status === 'completed' ? `/history/${checklist.id}` : `/checklist-execution/${checklist.id}`)}
                  className="bg-card rounded-2xl border shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col h-full"
                >
                  <div className="p-5 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider border ${getStatusColor(checklist.status)}`}>
                        {t(`common.${checklist.status}`) || (checklist.status || '').replace('_', ' ')}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">{checklist.date}</span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {checklist.checklistName}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 shrink-0" /> 
                        <span className="truncate">{checklist.unit} • {checklist.sector}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 shrink-0" /> 
                        <span>{t('checklists.scheduled')}: {checklist.scheduledTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5 border-t bg-muted/10 mt-auto">
                    <div className="flex justify-between text-xs font-medium mb-2">
                      <span>{t('tasks.progress')}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-2">
                      <div 
                        className={`h-full rounded-full ${progress === 100 ? 'bg-emerald-500' : 'bg-primary'}`} 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs text-muted-foreground">{checklist.completedItems || 0} of {checklist.totalItems || 0} {t('tasks.items')}</span>
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {checklist.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">{t('checklists.no_checklists')}</h3>
            <p className="text-muted-foreground">{t('checklists.try_adjusting')}</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MyChecklistsPage;
