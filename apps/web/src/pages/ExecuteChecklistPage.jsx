
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout.jsx';
import { useMockData } from '@/context/MockDataContext.jsx';
import { useExecutionDraft } from '@/hooks/useExecutionDraft.js';
import ItemCard from '@/components/checklist/ItemCard.jsx';
import ProgressBar from '@/components/badges/ProgressBar.jsx';
import SubmitChecklistModal from '@/components/checklist/SubmitChecklistModal.jsx';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const mockItems = [
  { id: '1', title: 'Check fire extinguishers', description: 'Ensure all extinguishers are present and pressurized.', response_type: 'compliant_non_compliant', mandatory: true, critical: true, evidence_required: true },
  { id: '2', title: 'Emergency exits clear', description: 'Verify no obstructions block emergency pathways.', response_type: 'yes_no', mandatory: true, critical: false },
  { id: '3', title: 'Temperature reading', description: 'Record the current ambient temperature in Celsius.', response_type: 'number', mandatory: false, critical: false },
  { id: '4', title: 'General cleanliness', description: 'Rate the overall cleanliness of the sector.', response_type: 'short_text', mandatory: true, critical: false }
];

const ExecuteChecklistPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { executions } = useMockData();
  
  const checklist = useMemo(() => executions.find(e => e.id === id) || executions[0], [executions, id]);
  
  const { draft, saveDraft, lastSaved, clearDraft } = useExecutionDraft(id, {});
  const [responses, setResponses] = useState(draft || {});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Keep a ref of the latest responses for the auto-save interval to avoid dependency loops
  const responsesRef = useRef(responses);
  useEffect(() => {
    responsesRef.current = responses;
  }, [responses]);

  // Auto-save every 30 seconds using the ref
  useEffect(() => {
    const interval = setInterval(() => {
      saveDraft(responsesRef.current);
    }, 30000);
    return () => clearInterval(interval);
  }, [saveDraft]);

  const handleResponseChange = (itemId, field, value) => {
    setResponses(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value
      }
    }));
  };

  const answeredCount = Object.keys(responses).filter(k => responses[k]?.value !== undefined).length;
  const progress = Math.round((answeredCount / mockItems.length) * 100);
  
  const conformityScore = Object.values(responses).reduce((acc, curr) => {
    if (curr.value === 'yes' || curr.value === 'compliant') return acc + 1;
    return acc;
  }, 0);
  const conformityPercentage = answeredCount > 0 ? Math.round((conformityScore / answeredCount) * 100) : 0;
  
  const criticalItemsCount = mockItems.filter(i => i.critical && (responses[i.id]?.value === 'no' || responses[i.id]?.value === 'non_compliant')).length;

  const handleManualSave = () => {
    saveDraft(responses);
    toast.success('Draft saved successfully.');
  };

  const handlePreSubmit = () => {
    const missingMandatory = mockItems.filter(i => i.mandatory && responses[i.id]?.value === undefined);
    if (missingMandatory.length > 0) {
      toast.error(`Please complete ${missingMandatory.length} mandatory item(s) before submitting.`);
      return;
    }
    setIsModalOpen(true);
  };

  const handleFinalSubmit = () => {
    clearDraft();
    setIsModalOpen(false);
    toast.success('Checklist submitted successfully!');
    navigate('/history');
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto pb-32">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Checklists
        </button>

        <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 text-balance">{checklist.checklistName}</h1>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary/50"></span> {checklist.unit}</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary/50"></span> {checklist.sector}</span>
              </div>
            </div>
            <div className="w-full md:w-56 shrink-0 bg-muted/30 p-4 rounded-xl border">
              <ProgressBar percentage={progress} label="Completion" color="bg-primary" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {mockItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ItemCard 
                item={item} 
                index={index}
                response={responses[item.id]}
                onResponseChange={handleResponseChange}
              />
            </motion.div>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-background/90 backdrop-blur-xl border-t p-4 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <div className="max-w-3xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {lastSaved ? `Draft saved at ${new Date(lastSaved).toLocaleTimeString()}` : 'Not saved yet'}
            </div>
            <div className="flex w-full sm:w-auto gap-3">
              <Button variant="secondary" onClick={handleManualSave} className="flex-1 sm:flex-none gap-2">
                <Save className="w-4 h-4" /> Save Draft
              </Button>
              <Button onClick={handlePreSubmit} className="flex-1 sm:flex-none gap-2 shadow-md">
                <CheckCircle className="w-4 h-4" /> Review & Submit
              </Button>
            </div>
          </div>
        </div>

        <SubmitChecklistModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFinalSubmit}
          summary={{
            total: mockItems.length,
            answered: answeredCount,
            conformity: conformityPercentage,
            criticalItems: criticalItemsCount
          }}
        />
      </div>
    </MainLayout>
  );
};

export default ExecuteChecklistPage;
