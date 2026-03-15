
import React from 'react';

const TimelineEvent = ({ timestamp, description, icon: Icon, details, isLast, colorClass = "text-primary bg-primary/10 border-primary/20" }) => {
  return (
    <div className="relative pl-8 pb-8 group">
      {!isLast && (
        <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-border group-hover:bg-primary/20 transition-colors" />
      )}
      <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border flex items-center justify-center ${colorClass} z-10`}>
        <Icon className="w-3 h-3" />
      </div>
      <div className="bg-card border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-bold text-foreground">{description}</span>
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md">{timestamp}</span>
        </div>
        {details && (
          <p className="text-sm text-muted-foreground mt-2 bg-background p-2 rounded-lg border">
            {details}
          </p>
        )}
      </div>
    </div>
  );
};

export default TimelineEvent;
