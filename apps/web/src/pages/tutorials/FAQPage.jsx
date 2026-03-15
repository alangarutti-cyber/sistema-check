
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout.jsx';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Search, Link as LinkIcon, AlertCircle, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

const mockFAQs = [
  { id: '1', category: 'Geral', q: 'O que é o CheckFlow?', a: 'O CheckFlow é uma plataforma completa para gestão de checklists operacionais, auditorias e planos de ação, focada em garantir a conformidade e padronização de processos em redes de unidades.' },
  { id: '2', category: 'Geral', q: 'Como altero minha senha?', a: 'Vá em Configurações > Meu Perfil e clique em "Alterar Senha". Você receberá um e-mail com as instruções de redefinição.' },
  { id: '3', category: 'Execução', q: 'Posso preencher checklists offline?', a: 'Sim! O aplicativo móvel permite baixar os checklists agendados e preenchê-os sem internet. A sincronização ocorre automaticamente quando a conexão for restabelecida.' },
  { id: '4', category: 'Execução', q: 'Como anexo uma foto?', a: 'Durante a execução, em itens que permitem evidências, clique no botão "Tirar Foto" ou "Enviar Foto". Você pode adicionar comentários a cada imagem.' },
  { id: '5', category: 'Modelos', q: 'Qual a diferença entre item obrigatório e crítico?', a: 'Itens obrigatórios impedem a finalização do checklist se não forem respondidos. Itens críticos, quando marcados como "Não Conforme", geram alertas imediatos e ações corretivas automáticas.' },
  { id: '6', category: 'Ações Corretivas', q: 'Quem pode fechar uma ação corretiva?', a: 'Apenas o usuário responsável atribuído à ação ou um Administrador do sistema pode alterar o status para "Resolvida".' },
  { id: '7', category: 'Dashboard', q: 'Com que frequência os dados são atualizados?', a: 'O dashboard operacional é atualizado em tempo real assim que um checklist é finalizado ou uma ação corretiva muda de status.' },
];

const categories = ['Todos', 'Geral', 'Execução', 'Modelos', 'Ações Corretivas', 'Dashboard'];

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filteredFAQs = mockFAQs.filter(faq => {
    const matchesSearch = faq.q.toLowerCase().includes(searchTerm.toLowerCase()) || faq.a.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = activeCategory === 'Todos' || faq.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const handleCopyLink = (id) => {
    navigator.clipboard.writeText(`${window.location.origin}/tutorials/faq#${id}`);
    toast.success('Link copiado para a área de transferência!');
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="text-center py-10 bg-card rounded-3xl border shadow-sm">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-3">Perguntas Frequentes</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">Encontre respostas rápidas para as dúvidas mais comuns sobre o uso da plataforma.</p>
          
          <div className="max-w-md mx-auto mt-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Busque por palavras-chave..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 rounded-full bg-background border-border shadow-sm text-base"
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === cat 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'bg-card text-muted-foreground hover:bg-muted border border-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="bg-card rounded-2xl border shadow-sm p-2 md:p-6">
          {filteredFAQs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {filteredFAQs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} id={faq.id} className="border-b border-border last:border-0 px-4">
                  <AccordionTrigger className="text-left font-bold text-lg hover:text-primary py-6">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                    <p className="mb-4">{faq.a}</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                      <Button variant="outline" size="sm" onClick={() => handleCopyLink(faq.id)} className="gap-2 text-xs h-8">
                        <LinkIcon className="w-3 h-3" /> Copiar Link
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2 text-xs h-8 text-muted-foreground hover:text-error">
                        <AlertCircle className="w-3 h-3" /> Reportar Desatualizado
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhuma pergunta encontrada para sua busca.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default FAQPage;
