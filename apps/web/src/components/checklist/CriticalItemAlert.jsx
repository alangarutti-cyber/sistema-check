
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const CriticalItemAlert = ({ message }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 mb-4"
    >
      <div className="relative flex-shrink-0 mt-0.5">
        <AlertTriangle className="w-5 h-5 text-red-600 relative z-10" />
        <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-20"></div>
      </div>
      <div className="flex-1 text-sm font-medium leading-relaxed">
        {message || "This is a critical item. Non-compliance requires immediate action and mandatory observation."}
      </div>
    </motion.div>
  );
};

export default CriticalItemAlert;
