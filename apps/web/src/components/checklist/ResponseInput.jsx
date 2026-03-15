
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Camera, Upload, Check, X, PenTool } from 'lucide-react';
import { cn } from '@/lib/utils';

const ResponseInput = ({ type, value, onChange, observation, onObservationChange, requireEvidence }) => {
  const [isSigning, setIsSigning] = useState(false);
  const fileInputRef = useRef(null);

  const renderInput = () => {
    switch (type) {
      case 'yes_no':
        return (
          <div className="flex gap-3">
            <Button 
              type="button"
              variant={value === 'yes' ? 'default' : 'outline'} 
              className={cn(
                "flex-1 h-12 text-base font-semibold transition-all",
                value === 'yes' 
                  ? 'bg-green-600 hover:bg-green-700 text-white border-green-600 ring-2 ring-green-600/20 ring-offset-1' 
                  : 'bg-white dark:bg-slate-900 border-slate-300 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
              )}
              onClick={() => onChange('yes')}
            >
              <Check className="w-5 h-5 mr-2" /> Sim
            </Button>
            <Button 
              type="button"
              variant={value === 'no' ? 'default' : 'outline'} 
              className={cn(
                "flex-1 h-12 text-base font-semibold transition-all",
                value === 'no' 
                  ? 'bg-red-600 hover:bg-red-700 text-white border-red-600 ring-2 ring-red-600/20 ring-offset-1' 
                  : 'bg-white dark:bg-slate-900 border-slate-300 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
              )}
              onClick={() => onChange('no')}
            >
              <X className="w-5 h-5 mr-2" /> Não
            </Button>
          </div>
        );
      case 'compliant_non_compliant':
        return (
          <div className="flex gap-3">
            <Button 
              type="button"
              variant={value === 'compliant' ? 'default' : 'outline'} 
              className={cn(
                "flex-1 h-12 text-base font-semibold transition-all",
                value === 'compliant' 
                  ? 'bg-green-600 hover:bg-green-700 text-white border-green-600 ring-2 ring-green-600/20 ring-offset-1' 
                  : 'bg-white dark:bg-slate-900 border-slate-300 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
              )}
              onClick={() => onChange('compliant')}
            >
              <Check className="w-5 h-5 mr-2" /> Conforme
            </Button>
            <Button 
              type="button"
              variant={value === 'non_compliant' ? 'default' : 'outline'} 
              className={cn(
                "flex-1 h-12 text-base font-semibold transition-all",
                value === 'non_compliant' 
                  ? 'bg-red-600 hover:bg-red-700 text-white border-red-600 ring-2 ring-red-600/20 ring-offset-1' 
                  : 'bg-white dark:bg-slate-900 border-slate-300 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
              )}
              onClick={() => onChange('non_compliant')}
            >
              <X className="w-5 h-5 mr-2" /> Não Conforme
            </Button>
          </div>
        );
      case 'short_text':
        return (
          <Input 
            value={value || ''} 
            onChange={(e) => onChange(e.target.value)} 
            placeholder="Digite sua resposta..." 
            className="w-full bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 focus:border-primary focus:ring-primary" 
          />
        );
      case 'long_text':
        return (
          <Textarea 
            value={value || ''} 
            onChange={(e) => onChange(e.target.value)} 
            placeholder="Digite sua resposta detalhada..." 
            className="w-full min-h-[100px] bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 focus:border-primary focus:ring-primary" 
          />
        );
      case 'number':
        return (
          <Input 
            type="number" 
            value={value || ''} 
            onChange={(e) => onChange(e.target.value)} 
            placeholder="0" 
            className="max-w-[200px] bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 focus:border-primary focus:ring-primary" 
          />
        );
      case 'photo':
        return (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer flex flex-col items-center justify-center text-center group"
          >
            <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6 text-primary" />
            </div>
            <p className="font-medium text-slate-700 dark:text-slate-300">Clique para tirar foto</p>
            <p className="text-sm text-slate-500 mt-1">ou selecione um arquivo da galeria</p>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => {
              if (e.target.files?.[0]) onChange(URL.createObjectURL(e.target.files[0]));
            }} />
            {value && (
              <div className="mt-4 p-2 bg-white dark:bg-slate-800 rounded-lg border shadow-sm w-full max-w-xs">
                <img src={value} alt="Preview" className="w-full h-32 object-cover rounded-md" />
              </div>
            )}
          </div>
        );
      case 'signature':
        return (
          <div className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-4 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2 mb-3 text-slate-700 dark:text-slate-300 font-medium">
              <PenTool className="w-4 h-4" />
              <span>Assinatura Necessária</span>
            </div>
            <div className="w-full h-40 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg mb-4 flex items-center justify-center text-slate-400">
              {value ? (
                <span className="text-primary font-medium">Assinatura registrada</span>
              ) : (
                <span>Área de assinatura (Canvas)</span>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => onChange(null)} className="bg-white">Limpar</Button>
              <Button onClick={() => onChange('signed')} className="bg-primary text-white">Confirmar Assinatura</Button>
            </div>
          </div>
        );
      default:
        return (
          <Input 
            value={value || ''} 
            onChange={(e) => onChange(e.target.value)} 
            placeholder="Digite sua resposta..." 
            className="w-full bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700" 
          />
        );
    }
  };

  return (
    <div className="space-y-5 w-full">
      <div className="w-full">
        {renderInput()}
      </div>
      
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Observações (Opcional)</Label>
          <Textarea 
            value={observation || ''} 
            onChange={(e) => onObservationChange(e.target.value)}
            placeholder="Adicione notas, detalhes ou justificativas..."
            className="resize-y min-h-[80px] bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 focus:border-primary focus:ring-primary shadow-sm"
          />
        </div>
        
        {requireEvidence && type !== 'photo' && (
          <div className="space-y-2 bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50">
            <Label className="text-sm font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2">
              <Camera className="w-4 h-4" /> Evidência Obrigatória
            </Label>
            <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mb-3">Este item requer o anexo de uma foto ou documento.</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2 bg-white hover:bg-slate-50 border-slate-300">
                <Camera className="w-4 h-4" /> Tirar Foto
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-white hover:bg-slate-50 border-slate-300">
                <Upload className="w-4 h-4" /> Enviar Arquivo
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponseInput;
