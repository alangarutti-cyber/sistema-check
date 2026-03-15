
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Clock, XCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const alertConfig = {
  critical_item_found: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
  execution_delay: { icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
  checklist_failed: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
};

const AlertCard = ({ alert, onClick }) => {
  const config = alertConfig[alert.type] || alertConfig.execution_delay;
  const Icon = config.icon;

  return (
    <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group" onClick={onClick}>
      <CardContent className="p-4 flex items-start gap-4">
        <div className={cn("p-2.5 rounded-full shrink-0", config.bg, config.color)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="text-sm font-semibold text-foreground truncate">{alert.checklistName}</h4>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {new Date(alert.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{alert.message}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{alert.unit}</span>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs group-hover:text-primary">
              View Details <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertCard;
