
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Copy, Check, Eye, EyeOff, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

const generatePassword = () => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  // Ensure at least one of each required type
  password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
  password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
  password += "0123456789"[Math.floor(Math.random() * 10)];
  password += "!@#$%^&*"[Math.floor(Math.random() * 8)];
  
  // Fill the rest
  for (let i = 0; i < 6; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  
  // Shuffle
  return password.split('').sort(() => 0.5 - Math.random()).join('');
};

const ResetPasswordModal = ({ isOpen, onClose, onConfirm, user, isLoading }) => {
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNewPassword(generatePassword());
      setShowPassword(false);
      setCopied(false);
    }
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(newPassword);
    setCopied(true);
    toast.success('Senha copiada para a área de transferência');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    await onConfirm(user.id, newPassword);
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isLoading && !open && onClose()}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-primary" />
            Redefinir Senha
          </DialogTitle>
          <DialogDescription>
            Você está gerando uma nova senha temporária para <strong>{user.name}</strong> ({user.email}).
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 space-y-4">
          <div className="bg-muted/30 p-4 rounded-xl border space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Nova senha gerada:</p>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  value={newPassword} 
                  readOnly 
                  className="font-mono text-lg tracking-wider pr-10 bg-background"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleCopy}
                className={copied ? "text-success border-success" : ""}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Copie esta senha e envie para o usuário. Ele poderá alterá-la no próximo acesso.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Confirmar Redefinição
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordModal;
