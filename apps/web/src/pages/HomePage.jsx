
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ClipboardList, ShieldCheck, BarChart3, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">CheckFlow</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Entrar
            </Link>
            <Button asChild>
              <Link to="/login">Começar Agora</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-balance">
              A plataforma definitiva para <span className="text-primary">gestão de checklists</span> e conformidade.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Padronize operações, garanta a qualidade e acompanhe o desempenho de todas as suas unidades em tempo real com o CheckFlow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" className="w-full sm:w-auto gap-2 text-base h-12 px-8" asChild>
                <Link to="/login">
                  Acessar Plataforma <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-12 px-8" asChild>
                <Link to="/tutorials">Ver Tutoriais</Link>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Tudo que você precisa para operar com excelência</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Nossas ferramentas foram desenhadas para simplificar a rotina de auditores, gerentes e operadores.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Checklists Dinâmicos</h3>
                <p className="text-muted-foreground leading-relaxed">Crie modelos personalizados com diferentes tipos de respostas, exigência de fotos e assinaturas digitais.</p>
              </div>

              <div className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-success/10 text-success rounded-xl flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Ações Corretivas</h3>
                <p className="text-muted-foreground leading-relaxed">Gere planos de ação automaticamente quando não conformidades críticas forem identificadas.</p>
              </div>

              <div className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-warning/10 text-warning rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Dashboard em Tempo Real</h3>
                <p className="text-muted-foreground leading-relaxed">Acompanhe o nível de conformidade da sua rede, identifique gargalos e tome decisões baseadas em dados.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary" />
            <span className="font-bold tracking-tight">CheckFlow</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CheckFlow. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacidade</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Termos</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
