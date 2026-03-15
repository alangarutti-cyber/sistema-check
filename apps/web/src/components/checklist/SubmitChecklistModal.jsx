
import React from 'react';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const SubmitChecklistModal = ({ isOpen, onClose, onSubmit, summary }) => {
  if (!isOpen) return null;

  const hasCriticalIssues = summary.criticalItems > 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-card rounded-2xl shadow-xl border overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          <div className="p-6 border-b flex justify-between items-center bg-muted/30">
            <h2 className="text-xl font-bold">Review & Submit</h2>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {hasCriticalIssues && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3 text-red-800">
                <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">Critical Issues Found</h4>
                  <p className="text-sm opacity-90">You have marked {summary.criticalItems} critical items as non-compliant. Submitting this checklist will trigger immediate alerts to management.</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-xl border">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Completion</p>
                <p className="text-2xl font-bold">{summary.answered}/{summary.total}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-xl border">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Conformity</p>
                <p className="text-2xl font-bold text-primary">{summary.conformity}%</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 border rounded-xl cursor-pointer hover:bg-muted/30 transition-colors">
                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" required id="confirm-check" />
                <span className="text-sm font-medium leading-snug">
                  I confirm that I have personally inspected all items and the information provided is accurate to the best of my knowledge.
                </span>
              </label>
            </div>
          </div>

          <div className="p-6 border-t bg-muted/30 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => {
              const isChecked = document.getElementById('confirm-check').checked;
              if (!isChecked) {
                alert('Please confirm the checklist accuracy.');
                return;
              }
              onSubmit();
            }} className="gap-2">
              <CheckCircle className="w-4 h-4" /> Submit Final Report
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SubmitChecklistModal;
