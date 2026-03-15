
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { ClipboardList, User, Building2, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { currentUser, completeOnboarding } = useAuth();
  const [step, setStep] = useState(0);

  const handleFinish = () => {
    completeOnboarding();
    navigate('/dashboard');
  };

  const steps = [
    {
      id: 'welcome',
      icon: Sparkles,
      title: 'Bem-vindo ao CheckFlow!',
      desc: 'A plataforma definitiva para gestão de checklists e conformidade operacional. Vamos configurar seu ambiente em poucos passos.',
      color: 'text-primary bg-primary/10'
    },
    {
      id: 'profile',
      icon: User,
      title: 'Seu Perfil',
      desc: `Você está logado como ${currentUser?.name || 'Usuário'}. Seu nível de acesso é ${currentUser?.role === 'admin' ? 'Administrador' : 'Operador'}, o que define quais ações você pode realizar no sistema.`,
      color: 'text-secondary-foreground bg-secondary'
    },
    {
      id: 'unit',
      icon: Building2,
      title: 'Sua Unidade',
      desc: 'Você foi vinculado à Unidade Matriz. Todos os seus checklists e ações corretivas serão registrados para esta localidade por padrão.',
      color: 'text-warning bg-warning/10'
    },
    {
      id: 'first_task',
      icon: ClipboardList,
      title: 'Sua Primeira Tarefa',
      desc: 'Já preparamos um checklist de exemplo para você testar. Você pode encontrá-lo na aba "Tarefas de Hoje" no menu principal.',
      color: 'text-primary bg-primary/10'
    },
    {
      id: 'ready',
      icon: CheckCircle2,
      title: 'Tudo Pronto!',
      desc: 'Seu ambiente está configurado. Se precisar de ajuda, clique no botão de interrogação no canto inferior direito da tela.',
      color: 'text-success bg-success/10'
    }
  ];

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center p-4 sm:p-8">
      <div className="absolute inset-0 bg-grid-slate-200/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-800/[0.04]" />
      
      <div className="w-full max-w-2xl bg-card rounded-3xl border shadow-2xl overflow-hidden relative z-10 flex flex-col min-h-[500px]">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">CheckFlow</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleFinish} className="text-muted-foreground">
            Pular Tour
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-center max-w-md mx-auto"
            >
              <div className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center mb-8 ${current.color} shadow-inner`}>
                <current.icon className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold mb-4 tracking-tight">{current.title}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {current.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-muted/10 flex items-center justify-between">
          <div className="flex gap-2">
            {steps.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-2 rounded-full transition-all duration-300 ${idx === step ? 'w-8 bg-primary' : 'w-2 bg-border'}`} 
              />
            ))}
          </div>
          
          <div className="flex gap-3">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(s => s - 1)}>
                Anterior
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button onClick={() => setStep(s => s + 1)} className="gap-2">
                Próximo <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleFinish} className="gap-2 bg-success hover:bg-success/90 text-white">
                Começar a usar <CheckCircle2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
