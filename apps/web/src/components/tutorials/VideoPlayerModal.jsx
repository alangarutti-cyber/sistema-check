
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, PlayCircle } from 'lucide-react';

const VideoPlayerModal = ({ isOpen, onClose, video }) => {
  if (!video) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-black border-border">
        <DialogHeader className="p-4 bg-card border-b absolute top-0 left-0 right-0 z-10 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-foreground">{video.title}</DialogTitle>
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="w-4 h-4" /> Abrir em Nova Aba
            </Button>
          </div>
        </DialogHeader>
        
        <div className="aspect-video w-full bg-black relative flex items-center justify-center group">
          {/* Placeholder for actual video player (e.g., iframe or HTML5 video) */}
          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-primary/90 rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform shadow-xl">
              <PlayCircle className="w-10 h-10 ml-1" />
            </div>
          </div>
          
          {/* Fake Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="h-1 w-full bg-white/30 rounded-full mb-4 cursor-pointer">
              <div className="h-full w-1/3 bg-primary rounded-full relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow" />
              </div>
            </div>
            <div className="flex justify-between text-white text-sm font-medium">
              <span>01:23 / {video.duration}</span>
              <span>HD</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayerModal;
