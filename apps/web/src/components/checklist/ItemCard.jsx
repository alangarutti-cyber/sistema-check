
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import CriticalityBadge from '@/components/badges/CriticalityBadge.jsx';
import ResponseInput from './ResponseInput.jsx';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

const ItemCard = ({ item, index, response, onResponseChange }) => {
  const isCritical = item.critical;
  const isAnswered = response?.value !== undefined;

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 mb-6",
      isCritical ? "border-red-200 dark:border-red-900/50 shadow-sm" : "border-slate-200 dark:border-slate-800 shadow-sm",
      isAnswered ? "bg-slate-50/50 dark:bg-slate-900/20" : "bg-white dark:bg-slate-950"
    )}>
      <CardContent className="p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-base text-slate-600 dark:text-slate-400">
            {index + 1}
          </div>
          
          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">{item.title}</h4>
              {item.mandatory && (
                <span className="text-[10px] uppercase tracking-wider font-bold text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 px-2 py-1 rounded-md border border-red-100 dark:border-red-900/30">
                  Obrigatório
                </span>
              )}
              {isCritical && <CriticalityBadge level="critical" />}
            </div>
            
            {item.description && (
              <p className="text-base text-slate-600 dark:text-slate-400 mb-6 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                {item.description}
              </p>
            )}
            
            {isCritical && !isAnswered && (
              <div className="flex items-start gap-3 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-4 rounded-xl mb-6 border border-red-200 dark:border-red-900/50">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold mb-1">Atenção: Item Crítico</p>
                  <p className="opacity-90">A não conformidade neste item exigirá ação imediata e gerará um alerta no sistema.</p>
                </div>
              </div>
            )}

            <div className="mt-2">
              <ResponseInput 
                type={item.response_type} 
                value={response?.value}
                observation={response?.observation}
                onChange={(val) => onResponseChange(item.id, 'value', val)}
                onObservationChange={(val) => onResponseChange(item.id, 'observation', val)}
                requireEvidence={item.evidence_required}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemCard;
