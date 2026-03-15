
import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Image as ImageIcon, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

const EvidenceUpload = ({ onUpload, evidenceList = [] }) => {
  const [comment, setComment] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const { t } = useTranslation();

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      
      // Simulate upload delay for better UX feedback
      setTimeout(() => {
        const newFile = {
          id: Date.now().toString(),
          name: e.target.files[0].name,
          url: URL.createObjectURL(e.target.files[0]),
          comment: comment
        };
        onUpload([...evidenceList, newFile]);
        setComment('');
        setIsUploading(false);
      }, 600);
    }
  };

  const removeEvidence = (id) => {
    onUpload(evidenceList.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
      <div className="space-y-4">
        <div className="flex items-center gap-3 bg-white dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="pl-3 text-slate-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <Input 
            placeholder="Adicionar comentário à evidência..." 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border-0 bg-transparent shadow-none focus-visible:ring-0 px-1"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            type="button" 
            onClick={() => cameraInputRef.current?.click()}
            disabled={isUploading}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-primary/50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              {isUploading ? <Loader2 className="w-6 h-6 text-primary animate-spin" /> : <Camera className="w-6 h-6 text-slate-500 group-hover:text-primary" />}
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tirar Foto</span>
            <span className="text-xs text-slate-500 mt-1">Usar câmera do dispositivo</span>
          </button>
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            className="hidden" 
            ref={cameraInputRef}
            onChange={handleFileSelect} 
          />
          
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-primary/50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              {isUploading ? <Loader2 className="w-6 h-6 text-primary animate-spin" /> : <Upload className="w-6 h-6 text-slate-500 group-hover:text-primary" />}
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Enviar Arquivo</span>
            <span className="text-xs text-slate-500 mt-1">Galeria ou documentos</span>
          </button>
          <input 
            type="file" 
            accept="image/*,application/pdf" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileSelect} 
          />
        </div>
      </div>

      {evidenceList.length > 0 && (
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Evidências Anexadas ({evidenceList.length})</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {evidenceList.map((file) => (
              <div key={file.id} className="relative group rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-3 flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-slate-200 dark:border-slate-700">
                  {file.url ? (
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0 py-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{file.name}</p>
                  {file.comment ? (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{file.comment}</p>
                  ) : (
                    <p className="text-xs text-slate-400 italic mt-1">Sem comentário</p>
                  )}
                </div>
                <button 
                  type="button"
                  onClick={() => removeEvidence(file.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Remover evidência"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceUpload;
