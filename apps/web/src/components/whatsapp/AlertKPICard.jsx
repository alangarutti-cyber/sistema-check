
import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

const AlertKPICard = ({ title, value, icon: Icon, colorClass, trend, subtitle }) => {
  return (
    <Card className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow border-border/60 shadow-sm bg-card">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-[hsl(var(--wa-success))]/10 text-[hsl(var(--wa-success))]' : 'bg-[hsl(var(--wa-error))]/10 text-[hsl(var(--wa-error))]'}`}>
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
};

export default AlertKPICard;
