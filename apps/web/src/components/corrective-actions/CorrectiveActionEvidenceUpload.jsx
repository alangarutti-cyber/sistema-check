
import React, { useState } from 'react';
import { UploadCloud, X, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CorrectiveActionEvidenceUpload = ({ onFileSelect, maxSize = 20971520 }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError('');
    if (!selectedFile) return;

    if (selectedFile.size > maxSize) {
      setError(`O arquivo excede o limite de ${maxSize / (1024 * 1024)}MB.`);
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Apenas imagens (JPEG, PNG, GIF, WEBP) e PDFs são permitidos.');
      return;
    }

    setFile(selectedFile);
    if (onFileSelect) onFileSelect(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (onFileSelect) onFileSelect(null);
  };

  return (
    <div className="w-full">
      {!file ? (
        <div 
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <UploadCloud className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium mb-1">Arraste e solte a evidência aqui</p>
          <p className="text-xs text-muted-foreground mb-4">Imagens ou PDF até 20MB</p>
          <label className="cursor-pointer">
            <span className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Selecionar Arquivo
            </span>
            <input type="file" className="hidden" onChange={handleChange} accept="image/*,.pdf" />
          </label>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 border rounded-xl bg-muted/30">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shrink-0 border">
              {file.type.includes('image') ? <ImageIcon className="w-5 h-5 text-primary" /> : <FileText className="w-5 h-5 text-primary" />}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={removeFile} className="text-muted-foreground hover:text-error shrink-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
      {error && <p className="text-xs text-error mt-2">{error}</p>}
    </div>
  );
};

export default CorrectiveActionEvidenceUpload;
