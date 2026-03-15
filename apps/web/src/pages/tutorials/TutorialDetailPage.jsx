
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout.jsx';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { X, ChevronLeft, ChevronRight, Check, Lightbulb, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockTutorials } from './TutorialsPage.jsx';

// Mock steps for any tutorial ID
const getMockSteps = (tutorialId) => {
  return [
    {
      title: 'Acessando a ferramenta',
      desc: 'Para começar, navegue até a seção correspondente no menu lateral esquerdo. Esta é a sua central de comando para esta funcionalidade.',
      tip: 'Você pode usar o atalho de teclado Ctrl+K para buscar rapidamente qualquer página.',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80'
    },
    {
      title: 'Preenchendo as informações básicas',
      desc: 'Insira os dados necessários nos campos indicados. Certifique-se de que todas as informações obrigatórias (marcadas com *) estejam preenchidas corretamente.',
      tip: 'Nomes claros e descritivos ajudam sua equipe a entender o propósito mais rapidamente.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80'
    },
    {
      title: 'Configurações avançadas',
      desc: 'Nesta etapa, você pode definir regras específicas, como obrigatoriedade de evidências, alertas de criticidade e responsáveis.',
      tip: 'Itens críticos geram alertas automáticos no dashboard quando marcados como Não Conforme.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'
    },
    {
      title: 'Salvando e publicando',
      desc: 'Revise todas as informações. Quando estiver pronto, clique no botão verde "Salvar" no canto superior direito. A alteração estará disponível imediatamente para a equipe.',
      tip: 'Você pode salvar como rascunho se precisar terminar depois.',
      image: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&q=80'
    }
  ];
};

const TutorialDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const tutorial = mockTutorials.find(t => t.id === id) || mockTutorials[0];
  const steps = getMockSteps(id);
  
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Finish tutorial
      navigate('/tutorials/progress');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const step = steps[currentStep];

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto min-h-[calc(100vh-8rem)] flex flex-col pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 bg-card p-4 rounded-2xl border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <tutorial.icon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">{tutorial.title}</h1>
              <div className="flex items-center gap-3 mt-1">
                <Badge variant="secondary" className="text-xs">{tutorial.level}</Badge>
                <span className="flex items-center text-xs font-medium text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 mr-1" /> {tutorial.time}
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => navigate('/tutorials')} className="text-muted-foreground hover:text-foreground">
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-bold mb-2 text-muted-foreground">
            <span>Passo {currentStep + 1} de {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
            {steps.map((_, idx) => (
              <div 
                key={idx} 
                className={`flex-1 border-r border-background last:border-0 transition-colors duration-500 ${idx <= currentStep ? 'bg-primary' : 'bg-transparent'}`}
              />
            ))}
          </div>
        </div>

        {/* Content Area */}
        <Card className="flex-1 flex flex-col overflow-hidden border-none shadow-lg bg-card relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 p-8 md:p-12 flex flex-col"
            >
              <div className="max-w-2xl mx-auto w-full">
                <span className="text-primary font-bold tracking-wider uppercase text-sm mb-3 block">
                  Passo {currentStep + 1}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">{step.title}</h2>
                
                <div className="aspect-video w-full bg-muted rounded-2xl overflow-hidden mb-8 border shadow-sm relative group">
                  <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {step.desc}
                </p>

                {step.tip && (
                  <div className="bg-accent/50 border border-accent-foreground/10 rounded-xl p-5 flex gap-4 items-start">
                    <div className="p-2 bg-background rounded-full shadow-sm shrink-0">
                      <Lightbulb className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">Dica Pro</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.tip}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Footer Navigation */}
          <div className="p-6 border-t bg-muted/10 flex items-center justify-between mt-auto">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handlePrev} 
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ChevronLeft className="w-5 h-5" /> Anterior
            </Button>

            <div className="flex gap-2 hidden md:flex">
              {steps.map((_, idx) => (
                <div key={idx} className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === currentStep ? 'bg-primary' : 'bg-border'}`} />
              ))}
            </div>

            <Button 
              size="lg" 
              onClick={handleNext}
              className={`gap-2 ${currentStep === steps.length - 1 ? 'bg-success hover:bg-success/90 text-white' : ''}`}
            >
              {currentStep === steps.length - 1 ? (
                <>Concluir Tutorial <Check className="w-5 h-5" /></>
              ) : (
                <>Próximo <ChevronRight className="w-5 h-5" /></>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default TutorialDetailPage;
