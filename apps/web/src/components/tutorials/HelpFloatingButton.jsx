
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, BookOpen, PlayCircle, MessageCircle as MessageCircleQuestion, BookA, LifeBuoy, Bug, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ContactFormModal from '@/components/tutorials/ContactFormModal.jsx';
import BugReportModal from '@/components/tutorials/BugReportModal.jsx';

const HelpFloatingButton = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showBug, setShowBug] = useState(false);

  const handleNavigate = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button 
              size="icon" 
              className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-primary text-primary-foreground"
            >
              {isOpen ? <X className="w-6 h-6" /> : <HelpCircle className="w-6 h-6" />}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-2 mb-2 mr-2 rounded-2xl shadow-xl border-border/50" align="end" sideOffset={16}>
            <div className="p-3 border-b mb-2">
              <h4 className="font-bold text-base">Como podemos ajudar?</h4>
              <p className="text-xs text-muted-foreground">Acesse nossos recursos ou fale conosco.</p>
            </div>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start font-medium" onClick={() => handleNavigate('/tutorials')}>
                <BookOpen className="w-4 h-4 mr-3 text-primary" /> Ver Tutoriais
              </Button>
              <Button variant="ghost" className="w-full justify-start font-medium" onClick={() => handleNavigate('/tutorials/videos')}>
                <PlayCircle className="w-4 h-4 mr-3 text-primary" /> Tutoriais em Vídeo
              </Button>
              <Button variant="ghost" className="w-full justify-start font-medium" onClick={() => handleNavigate('/tutorials/faq')}>
                <MessageCircleQuestion className="w-4 h-4 mr-3 text-primary" /> Abrir FAQ
              </Button>
              <Button variant="ghost" className="w-full justify-start font-medium" onClick={() => handleNavigate('/tutorials/glossary')}>
                <BookA className="w-4 h-4 mr-3 text-primary" /> Ver Glossário
              </Button>
              <div className="h-px bg-border my-2 mx-2" />
              <Button variant="ghost" className="w-full justify-start font-medium" onClick={() => { setIsOpen(false); setShowContact(true); }}>
                <LifeBuoy className="w-4 h-4 mr-3 text-success" /> Contatar Suporte
              </Button>
              <Button variant="ghost" className="w-full justify-start font-medium text-muted-foreground hover:text-error hover:bg-error/10" onClick={() => { setIsOpen(false); setShowBug(true); }}>
                <Bug className="w-4 h-4 mr-3" /> Reportar Bug
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <ContactFormModal isOpen={showContact} onClose={() => setShowContact(false)} />
      <BugReportModal isOpen={showBug} onClose={() => setShowBug(false)} />
    </>
  );
};

export default HelpFloatingButton;
