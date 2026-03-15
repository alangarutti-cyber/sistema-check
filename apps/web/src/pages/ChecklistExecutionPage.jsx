
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMockData } from '@/context/MockDataContext.jsx';
import EvidenceCapture from '@/components/checklist/EvidenceCapture.jsx';
import { ArrowLeft, Clock, AlertTriangle, Check, X, Minus, ChevronLeft, ChevronRight, Save, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// Mock items for execution
const mockItems = [
  { id: '1', title: 'Verificar extintores de incêndio', instruction: 'Garantir que todos os extintores estão presentes, pressurizados e com lacres.', critical: true, mandatory: true, type: 'yes_no' },
  { id: '2', title: 'Saídas de emergência desobstruídas', instruction: 'Verificar se não há caixas ou equipamentos bloqueando as portas.', critical: true, mandatory: true, type: 'yes_no' },
  { id: '3', title: 'Limpeza do piso', instruction: 'Verificar se o piso está varrido e sem riscos de escorregamento.', critical: false, mandatory: true, type: 'yes_no' },
  { id: '4', title: 'Temperatura do Freezer', instruction: 'Anotar a temperatura atual do freezer principal.', critical: true, mandatory: true, type: 'number' },
];

const ChecklistExecutionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { executions } = useMockData();
  const checklist = executions.find(e => e.id === id) || executions[0];
  
  // LocalStorage Draft Persistence
  const draftKey = `checklist_draft_${id}`;
  const [responses, setResponses] = useState(() => {
    const saved = localStorage.getItem(draftKey);
    return saved ? JSON.parse(saved) : {};
  });
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const saveDraft = (newResponses) => {
    localStorage.setItem(draftKey, JSON.stringify(newResponses));
    toast.success('Rascunho salvo', { duration: 1500 });
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const currentItem = mockItems[currentIndex];
  const currentResponse = responses[currentItem.id] || {};

  const handleResponse = (status) => {
    const newResponses = {
      ...responses,
      [currentItem.id]: { ...currentResponse, status }
    };
    setResponses(newResponses);
    saveDraft(newResponses);
    
    // Auto-advance if conform or NA, but stay if non-conform to allow observation
    if (status !== 'non_conform' && currentIndex < mockItems.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 400);
    }
  };

  const handleObservation = (text) => {
    const newResponses = {
      ...responses,
      [currentItem.id]: { ...currentResponse, observation: text }
    };
    setResponses(newResponses);
    localStorage.setItem(draftKey, JSON.stringify(newResponses));
  };

  const handleEvidence = (evidenceList) => {
    const newResponses = {
      ...responses,
      [currentItem.id]: { ...currentResponse, evidence: evidenceList }
    };
    setResponses(newResponses);
    localStorage.setItem(draftKey, JSON.stringify(newResponses));
  };

  const answeredCount = Object.keys(responses).filter(k => responses[k]?.status).length;
  const progress = Math.round((answeredCount / mockItems.length) * 100);

  const handleFinish = () => {
    const missingMandatory = mockItems.filter(i => i.mandatory && !responses[i.id]?.status);
    if (missingMandatory.length > 0) {
      toast.error('Por favor, responda todos os itens obrigatórios.');
      return;
    }
    localStorage.removeItem(draftKey);
    toast.success('Checklist finalizado com sucesso!');
    navigate('/dashboard');
  };

  // Swipe handlers
  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold && currentIndex < mockItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (info.offset.x > swipeThreshold && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden">
      {/* Sticky Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-full transition-colors bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
              <Clock className="w-4 h-4" /> {formatTime(elapsedTime)}
            </div>
          </div>
          <h1 className="text-2xl font-bold leading-tight mb-1.5 text-slate-900 dark:text-white truncate">{checklist.checklistName}</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate flex items-center gap-2">
            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{checklist.unit}</span>
            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{checklist.sector}</span>
            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Resp: {checklist.assignedTo}</span>
          </p>
          
          {/* Progress Bar */}
          <div className="mt-5 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wider text-slate-600 dark:text-slate-400">
              <span>Progresso da Inspeção</span>
              <span className="text-primary">{answeredCount} de {mockItems.length} ({progress}%)</span>
            </div>
            <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex cursor-pointer shadow-inner">
              {mockItems.map((item, idx) => {
                const status = responses[item.id]?.status;
                let color = 'bg-transparent';
                if (status === 'conform') color = 'bg-green-500';
                if (status === 'non_conform') color = 'bg-red-500';
                if (status === 'na') color = 'bg-slate-400';
                
                return (
                  <div 
                    key={item.id} 
                    onClick={() => setCurrentIndex(idx)}
                    className={`flex-1 border-r border-white/20 dark:border-slate-900/20 last:border-0 transition-all duration-300 ${color} ${idx === currentIndex ? 'ring-2 ring-primary ring-inset brightness-110' : ''}`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Swipeable Stepper */}
      <main className="flex-1 overflow-y-auto p-4 pb-32 touch-pan-y">
        <div className="max-w-3xl mx-auto h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.2 }}
              className={`bg-white dark:bg-slate-900 rounded-2xl border shadow-md overflow-hidden min-h-[60vh] flex flex-col ${
                currentResponse.status === 'non_conform' ? 'border-red-300 dark:border-red-800 ring-4 ring-red-500/10' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="p-6 sm:p-8 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    Item {currentIndex + 1} de {mockItems.length}
                  </span>
                  {currentItem.critical && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-red-600 text-white shadow-sm">
                      <AlertTriangle className="w-4 h-4" /> CRÍTICO
                    </span>
                  )}
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight text-slate-900 dark:text-white">
                  {currentItem.title}
                  {currentItem.mandatory && <span className="text-red-500 ml-2" title="Obrigatório">*</span>}
                </h2>
                
                <div className="bg-blue-50 dark:bg-blue-950/30 p-5 rounded-xl border border-blue-100 dark:border-blue-900/50 mb-8">
                  <p className="text-blue-900 dark:text-blue-200 text-lg leading-relaxed font-medium">
                    {currentItem.instruction}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 mt-auto">
                  <button
                    onClick={() => handleResponse('conform')}
                    className={`flex sm:flex-col items-center justify-center gap-3 h-16 sm:h-28 rounded-xl border-2 transition-all shadow-sm ${
                      currentResponse.status === 'conform' 
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 ring-2 ring-green-500/20' 
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-green-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${currentResponse.status === 'conform' ? 'bg-green-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                      <Check className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-lg">Conforme</span>
                  </button>
                  
                  <button
                    onClick={() => handleResponse('non_conform')}
                    className={`flex sm:flex-col items-center justify-center gap-3 h-16 sm:h-28 rounded-xl border-2 transition-all shadow-sm ${
                      currentResponse.status === 'non_conform' 
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 ring-2 ring-red-500/20' 
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-red-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${currentResponse.status === 'non_conform' ? 'bg-red-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                      <X className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-lg">Não Conforme</span>
                  </button>

                  <button
                    onClick={() => handleResponse('na')}
                    className={`flex sm:flex-col items-center justify-center gap-3 h-16 sm:h-28 rounded-xl border-2 transition-all shadow-sm ${
                      currentResponse.status === 'na' 
                        ? 'border-slate-500 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 ring-2 ring-slate-500/20' 
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${currentResponse.status === 'na' ? 'bg-slate-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                      <Minus className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-lg">N/A</span>
                  </button>
                </div>

                {/* Observation & Evidence (Auto-opens on non-conform) */}
                <AnimatePresence>
                  {(currentResponse.status === 'non_conform' || currentResponse.observation || currentResponse.evidence?.length > 0) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-6 overflow-hidden pt-6 border-t border-slate-200 dark:border-slate-800"
                    >
                      {currentResponse.status === 'non_conform' && currentItem.critical && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-5 rounded-xl flex gap-4 shadow-sm">
                          <AlertTriangle className="w-7 h-7 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-lg mb-1">Atenção: Item Crítico Reprovado</p>
                            <p className="text-sm opacity-90">Um alerta e uma ação corretiva serão gerados automaticamente ao finalizar a inspeção.</p>
                          </div>
                        </div>
                      )}

                      <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                        <label className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          Observação {currentResponse.status === 'non_conform' && <span className="text-red-500 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded text-[10px]">Obrigatório</span>}
                        </label>
                        <textarea
                          value={currentResponse.observation || ''}
                          onChange={(e) => handleObservation(e.target.value)}
                          placeholder="Descreva o problema encontrado em detalhes para facilitar a correção..."
                          className="w-full min-h-[120px] p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-y text-base shadow-sm transition-all"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Evidências Fotográficas</label>
                        <EvidenceCapture 
                          evidences={currentResponse.evidence || []} 
                          onSave={handleEvidence} 
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 pb-safe z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="flex items-center justify-center w-14 h-14 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0 shadow-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {currentIndex === mockItems.length - 1 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleFinish}
                  className="flex-1 flex items-center justify-center gap-2 h-14 rounded-xl bg-green-600 text-white font-bold text-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                >
                  <Check className="w-6 h-6" /> Finalizar Inspeção
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="mb-2">
                <p>Certifique-se de que todos os itens obrigatórios foram respondidos.</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={() => setCurrentIndex(prev => Math.min(mockItems.length - 1, prev + 1))}
              className="flex-1 flex items-center justify-center gap-2 h-14 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
            >
              Próximo Item <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChecklistExecutionPage;
