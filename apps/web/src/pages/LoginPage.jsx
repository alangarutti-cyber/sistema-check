import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Não foi possível entrar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <div className="bg-card p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">{t('login.title')}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('login.email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded bg-background"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('login.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded bg-background"
              required
              disabled={isSubmitting}
            />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-primary-foreground p-2 rounded hover:bg-primary/90 disabled:opacity-50">
            {isSubmitting ? 'Entrando...' : t('login.submit')}
          </button>
        </form>
        <div className="mt-4 text-sm text-muted-foreground text-center">
          {t('login.hint')}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
