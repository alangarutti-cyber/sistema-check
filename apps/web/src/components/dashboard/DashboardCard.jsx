
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const DashboardCard = ({ title, value, icon: Icon, trend, trendValue, colorClass = "text-primary" }) => {
  return (
    <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className={cn("p-2 rounded-lg bg-muted", colorClass)}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
          {trend && (
            <span className={cn(
              "flex items-center text-xs font-medium",
              trend === 'up' ? "text-green-600" : "text-red-600"
            )}>
              {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
              {trendValue}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
