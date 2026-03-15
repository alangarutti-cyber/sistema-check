
import React from 'react';
import { CheckCircle2, Clock, AlertCircle, XCircle, AlertTriangle, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Clock },
  in_progress: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: PlayCircle },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2 },
  overdue: { label: 'Overdue', color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle },
  non_compliant: { label: 'Non-Compliant', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: XCircle },
  completed_with_issues: { label: 'Completed (Issues)', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: AlertTriangle },
};

const StatusBadge = ({ status, className }) => {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border", config.color, className)}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};

export default StatusBadge;
