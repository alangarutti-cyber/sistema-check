
import React from 'react';
import { cn } from '@/lib/utils';

const criticalityConfig = {
  critical: 'bg-red-100 text-red-800 border-red-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-blue-100 text-blue-800 border-blue-200',
};

const CriticalityBadge = ({ level, className }) => {
  const colorClass = criticalityConfig[level?.toLowerCase()] || criticalityConfig.low;

  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border uppercase tracking-wider", colorClass, className)}>
      {level}
    </span>
  );
};

export default CriticalityBadge;
