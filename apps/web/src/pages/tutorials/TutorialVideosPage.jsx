
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout.jsx';
import VideoPlayerModal from '@/components/tutorials/VideoPlayerModal.jsx';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Clock } from 'lucide-react';

const mockVideos = [
  { id: 1, title: 'Visão Geral do Sistema', desc: 'Um tour completo pelas principais funcionalidades do CheckFlow.', duration: '05:30', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80' },
  { id: 2, title: 'Criando Modelos Dinâmicos', desc: 'Aprenda a usar o construtor drag-and-drop para criar checklists.', duration: '08:45', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80' },
  { id: 3, title: 'Execução no Mobile', desc: 'Como preencher checklists usando o aplicativo móvel.', duration: '04:15', thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80' },
  { id: 4, title: 'Gestão de Ações Corretivas', desc: 'Fluxo completo de resolução de não conformidades.', duration: '06:20', thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80' },
  { id: 5, title: 'Análise de Dados', desc: 'Extraindo insights valiosos do dashboard operacional.', duration: '07:10', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80' },
  { id: 6, title: 'Configuração de Unidades', desc: 'Como estruturar a hierarquia da sua rede de lojas.', duration: '03:50', thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80' },
  { id: 7, title: 'Permissões de Usuário', desc: 'Entendendo os papéis de Administrador, Gerente e Operador.', duration: '04:40', thumbnail: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&q=80' },
  { id: 8, title: 'Exportação de Relatórios', desc: 'Gerando PDFs e planilhas para auditorias externas.', duration: '05:15', thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80' },
];

const TutorialVideosPage = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Tutoriais em Vídeo</h1>
          <p className="text-muted-foreground">Aprenda visualmente com nossa biblioteca de vídeos explicativos.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockVideos.map((video) => (
            <Card key={video.id} className="overflow-hidden group cursor-pointer border-border hover:border-primary/50 transition-all duration-300" onClick={() => setSelectedVideo(video)}>
              <div className="aspect-video relative overflow-hidden bg-muted">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-primary shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-5 h-5 ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm">
                  <Clock className="w-3 h-3" /> {video.duration}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-base mb-1 line-clamp-1 group-hover:text-primary transition-colors">{video.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{video.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <VideoPlayerModal 
        isOpen={!!selectedVideo} 
        onClose={() => setSelectedVideo(null)} 
        video={selectedVideo} 
      />
    </MainLayout>
  );
};

export default TutorialVideosPage;
