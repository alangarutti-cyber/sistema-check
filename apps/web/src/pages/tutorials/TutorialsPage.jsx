
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout.jsx';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, PlayCircle, BookOpen, CheckCircle2, Clock, ArrowRight, HelpCircle, BookA, Trophy } from 'lucide-react';

export const mockTutorials = [
  { id: '1', title: 'Criando seu primeiro checklist', desc: 'Aprenda a usar o construtor de modelos para criar checklists personalizados.', level: 'Iniciante', time: '5 min', icon: BookOpen, completed: true },
  { id: '2', title: 'Executando um checklist', desc: 'Passo a passo de como preencher e finalizar um checklist na prática.', level: 'Iniciante', time: '4 min', icon: PlayCircle, completed: false },
  { id: '3', title: 'Gerenciando ações corretivas', desc: 'Como tratar não conformidades e acompanhar a resolução de problemas.', level: 'Intermediário', time: '7 min', icon: BookOpen, completed: false },
  { id: '4', title: 'Analisando o dashboard', desc: 'Entenda as métricas, gráficos e indicadores de desempenho da sua rede.', level: 'Intermediário', time: '6 min', icon: BookOpen, completed: false },
  { id: '5', title: 'Configurando alertas', desc: 'Como configurar notificações para problemas críticos e atrasos.', level: 'Avançado', time: '8 min', icon: BookOpen, completed: false },
  { id: '6', title: 'Gestão de usuários', desc: 'Adicionando membros da equipe e definindo permissões de acesso.', level: 'Intermediário', time: '5 min', icon: BookOpen, completed: false },
  { id: '7', title: 'Modelos avançados', desc: 'Utilizando lógica condicional e campos dinâmicos nos seus checklists.', level: 'Avançado', time: '10 min', icon: BookOpen, completed: false },
  { id: '8', title: 'Relatórios de desempenho', desc: 'Como exportar e analisar dados de conformidade por unidade.', level: 'Avançado', time: '6 min', icon: BookOpen, completed: false },
  { id: '9', title: 'Evidências fotográficas', desc: 'Melhores práticas para capturar e anexar fotos durante a execução.', level: 'Iniciante', time: '3 min', icon: BookOpen, completed: false },
  { id: '10', title: 'Assinaturas digitais', desc: 'Como coletar e validar assinaturas ao finalizar um checklist.', level: 'Intermediário', time: '4 min', icon: BookOpen, completed: false },
];

const TutorialsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Todos');

  const tabs = ['Todos', 'Iniciante', 'Intermediário', 'Avançado'];

  const filteredTutorials = mockTutorials.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'Todos' || t.level === activeTab;
    return matchesSearch && matchesTab;
  });

  const getLevelColor = (level) => {
    switch(level) {
      case 'Iniciante': return 'bg-[hsl(var(--tutorial-badge-beginner))]/10 text-[hsl(var(--tutorial-badge-beginner))] border-[hsl(var(--tutorial-badge-beginner))]/20';
      case 'Intermediário': return 'bg-[hsl(var(--tutorial-badge-intermediate))]/10 text-[hsl(var(--tutorial-badge-intermediate))] border-[hsl(var(--tutorial-badge-intermediate))]/20';
      case 'Avançado': return 'bg-[hsl(var(--tutorial-badge-advanced))]/10 text-[hsl(var(--tutorial-badge-advanced))] border-[hsl(var(--tutorial-badge-advanced))]/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-card p-8 rounded-3xl border shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Tutoriais e Ajuda</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">Aprenda a dominar o CheckFlow com nossos guias passo a passo, vídeos e central de conhecimento.</p>
          </div>
          <div className="flex gap-3 relative z-10">
            <Button variant="outline" onClick={() => navigate('/tutorials/faq')} className="gap-2 bg-background">
              <HelpCircle className="w-4 h-4" /> FAQ
            </Button>
            <Button variant="outline" onClick={() => navigate('/tutorials/glossary')} className="gap-2 bg-background">
              <BookA className="w-4 h-4" /> Glossário
            </Button>
            <Button onClick={() => navigate('/tutorials/progress')} className="gap-2">
              <Trophy className="w-4 h-4" /> Meu Progresso
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Buscar tutoriais..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 rounded-xl bg-card border-border shadow-sm text-base"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  activeTab === tab 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'bg-card text-muted-foreground hover:bg-muted border border-border'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map((tutorial) => (
            <div key={tutorial.id} className="tutorial-card group">
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300`}>
                    <tutorial.icon className="w-6 h-6" />
                  </div>
                  {tutorial.completed && (
                    <span className="flex items-center gap-1 text-xs font-bold text-success bg-success/10 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Concluído
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2 line-clamp-2">{tutorial.title}</h3>
                <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-1">{tutorial.desc}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={getLevelColor(tutorial.level)}>{tutorial.level}</Badge>
                    <span className="flex items-center text-xs font-medium text-muted-foreground">
                      <Clock className="w-3.5 h-3.5 mr-1" /> {tutorial.time}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-muted/30 border-t">
                <Button 
                  className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors" 
                  variant={tutorial.completed ? "outline" : "default"}
                  onClick={() => navigate(`/tutorials/${tutorial.id}`)}
                >
                  {tutorial.completed ? 'Revisar Tutorial' : 'Iniciar Tutorial'} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {filteredTutorials.length === 0 && (
            <div className="col-span-full py-20 text-center bg-card rounded-2xl border border-dashed">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-bold mb-2">Nenhum tutorial encontrado</h3>
              <p className="text-muted-foreground">Tente buscar com outras palavras-chave ou mude os filtros.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default TutorialsPage;
