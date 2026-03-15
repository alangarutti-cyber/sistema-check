
import React from 'react';
import { cn } from '@/lib/utils';

const UserStatusBadge = ({ status, className }) => {
  const isActive = status === 'active' || status === true;
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
      isActive 
        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
        : "bg-muted text-muted-foreground border-border",
      className
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full", isActive ? "bg-emerald-500" : "bg-muted-foreground")} />
      {isActive ? 'Ativo' : 'Inativo'}
    </span>
  );
};

export default UserStatusBadge;
