
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const ProgressBar = ({ percentage, color = 'bg-primary', label, className }) => {
  const safePercentage = Math.min(Math.max(percentage || 0, 0), 100);
  
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          <span className="text-sm font-bold">{safePercentage}%</span>
        </div>
      )}
      <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${safePercentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
