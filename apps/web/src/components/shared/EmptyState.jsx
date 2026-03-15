
import React from 'react';
import { cn } from '@/lib/utils';

const EmptyState = ({ icon: Icon, title, description, action, className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center bg-card rounded-2xl border border-dashed border-border/60", className)}>
      {Icon && (
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-5 text-muted-foreground">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
