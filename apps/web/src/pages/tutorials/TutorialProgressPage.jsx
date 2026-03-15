
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout.jsx';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, CheckCircle2, PlayCircle, Circle, ArrowRight } from 'lucide-react';
import { mockTutorials } from './TutorialsPage.jsx';

const TutorialProgressPage = () => {
  const navigate = useNavigate();
  
  const completedCount = mockTutorials.filter(t => t.completed).length;
  const totalCount = mockTutorials.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const achievements = [
    { id: 1, title: 'Iniciante', desc: 'Completou 3 tutoriais básicos', icon: Star, unlocked: true },
    { id: 2, title: 'Intermediário', desc: 'Completou 3 tutoriais intermediários', icon: Star, unlocked: false },
    { id: 3, title: 'Avançado', desc: 'Completou 3 tutoriais avançados', icon: Star, unlocked: false },
    { id: 4, title: 'Mestre do CheckFlow', desc: 'Completou todos os tutoriais', icon: Trophy, unlocked: false },
  ];

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Meu Progresso</h1>
          <p className="text-muted-foreground">Acompanhe sua jornada de aprendizado no CheckFlow.</p>
        </div>

        {/* Overview Card */}
        <Card className="p-8 bg-gradient-to-br from-primary/10 to-background border-primary/20">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-full border-8 border-primary/20 flex items-center justify-center relative shrink-0">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" className="text-transparent" />
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="289" strokeDashoffset={289 - (289 * progressPercent) / 100} className="text-primary transition-all duration-1000" />
              </svg>
              <div className="text-center">
                <span className="text-3xl font-black text-primary">{progressPercent}%</span>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">Continue assim!</h2>
              <p className="text-muted-foreground mb-4">Você já completou {completedCount} de {totalCount} tutoriais disponíveis. Completar tutoriais ajuda você a extrair o máximo da plataforma.</p>
              <Button onClick={() => navigate('/tutorials')} className="gap-2">
                Explorar Tutoriais <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Achievements */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-warning" /> Conquistas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map(ach => (
              <Card key={ach.id} className={`p-5 text-center transition-all ${ach.unlocked ? 'bg-card border-warning/50 shadow-sm' : 'bg-muted/30 border-dashed opacity-60'}`}>
                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${ach.unlocked ? 'bg-warning/20 text-warning' : 'bg-muted text-muted-foreground'}`}>
                  <ach.icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm mb-1">{ach.title}</h4>
                <p className="text-xs text-muted-foreground">{ach.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* List */}
        <div>
          <h3 className="text-xl font-bold mb-4">Trilha de Aprendizado</h3>
          <div className="space-y-3">
            {mockTutorials.map(tutorial => (
              <Card key={tutorial.id} className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="shrink-0">
                  {tutorial.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-bold text-base truncate ${tutorial.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                    {tutorial.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px] py-0">{tutorial.level}</Badge>
                    <span className="text-xs text-muted-foreground">{tutorial.time}</span>
                  </div>
                </div>
                <Button 
                  variant={tutorial.completed ? "ghost" : "secondary"} 
                  size="sm"
                  onClick={() => navigate(`/tutorials/${tutorial.id}`)}
                >
                  {tutorial.completed ? 'Revisar' : 'Continuar'}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TutorialProgressPage;
