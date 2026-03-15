
import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Maximize2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const EvidenceCapture = ({ onSave, evidences = [] }) => {
  const [localEvidences, setLocalEvidences] = useState(evidences);
  const [comment, setComment] = useState('');
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, implement compression here before creating URL
      const newEvidence = {
        id: Date.now().toString(),
        url: URL.createObjectURL(file),
        file: file,
        comment: comment
      };
      const updated = [...localEvidences, newEvidence];
      setLocalEvidences(updated);
      setComment('');
      if (onSave) onSave(updated);
    }
  };

  const removeEvidence = (id) => {
    const updated = localEvidences.filter(e => e.id !== id);
    setLocalEvidences(updated);
    if (onSave) onSave(updated);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col gap-3">
        <Input 
          placeholder="Adicionar Comentário..." 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="h-12 text-base bg-background"
        />
        <div className="flex gap-3">
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1 h-14 gap-2 bg-background hover:bg-muted text-base font-medium"
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera className="w-5 h-5" /> Tirar Foto
          </Button>
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            className="hidden" 
            ref={cameraInputRef}
            onChange={handleFileSelect} 
          />
          
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1 h-14 gap-2 bg-background hover:bg-muted text-base font-medium"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-5 h-5" /> Enviar Foto
          </Button>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileSelect} 
          />
        </div>
      </div>

      {localEvidences.length > 0 && (
        <div className="space-y-3 mt-4">
          <p className="text-sm font-medium text-muted-foreground">
            Evidências ({localEvidences.length})
          </p>
          <div className="grid grid-cols-1 gap-3">
            {localEvidences.map((ev) => (
              <Card key={ev.id} className="p-3 flex items-start gap-3 overflow-hidden">
                <div className="w-20 h-20 rounded-lg bg-muted shrink-0 overflow-hidden relative group">
                  <img src={ev.url} alt="Evidência" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0 py-1">
                  <p className="text-sm text-foreground line-clamp-2">
                    {ev.comment || "Sem comentário"}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeEvidence(ev.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceCapture;
