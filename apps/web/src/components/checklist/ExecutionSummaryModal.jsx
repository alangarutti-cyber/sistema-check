
import React from 'react';
import { CheckCircle, AlertTriangle, X, ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const ExecutionSummaryModal = ({ isOpen, onClose, onSubmit, summary }) => {
  const { t } = useTranslation();
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
          className="relative w-full max-w-md bg-card rounded-2xl shadow-xl border overflow-hidden z-10 flex flex-col"
        >
          <div className="p-6 border-b flex justify-between items-center bg-muted/30">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">{t('execution.summary_title')}</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {hasCriticalIssues && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex gap-3 text-destructive">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">{t('execution.critical_issues_detected')}</h4>
                  <p className="text-sm opacity-90">{t('execution.critical_warning')}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-xl border flex flex-col items-center justify-center text-center">
                <p className="text-3xl font-bold text-foreground mb-1">{summary.answered}/{summary.total}</p>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t('execution.items_completed')}</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-xl border flex flex-col items-center justify-center text-center">
                <p className={`text-3xl font-bold mb-1 ${summary.conformity >= 80 ? 'text-success' : summary.conformity >= 50 ? 'text-warning' : 'text-destructive'}`}>
                  {summary.conformity}%
                </p>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t('execution.conformity')}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-background border rounded-lg">
                <span className="text-sm font-medium text-muted-foreground">{t('execution.non_conformities')}</span>
                <span className="font-bold">{summary.nonConformities || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background border rounded-lg">
                <span className="text-sm font-medium text-muted-foreground">{t('execution.observations_added')}</span>
                <span className="font-bold">{summary.observations || 0}</span>
              </div>
            </div>
          </div>

          <div className="p-6 border-t bg-muted/30 flex flex-col sm:flex-row justify-end gap-3">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto h-12 sm:h-10">
              {t('execution.review_again')}
            </Button>
            <Button onClick={onSubmit} className="w-full sm:w-auto h-12 sm:h-10 gap-2">
              <CheckCircle className="w-4 h-4" /> {t('execution.confirm_submit')}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ExecutionSummaryModal;
