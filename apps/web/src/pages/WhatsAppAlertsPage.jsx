
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout.jsx';
import { useMockData } from '@/context/MockDataContext.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MessageCircle, Settings, History, FileText, Zap, Send, AlertTriangle, XCircle, Clock, Users, Building2 } from 'lucide-react';

import AlertKPICard from '@/components/whatsapp/AlertKPICard.jsx';
import WhatsAppAlertsSettings from '@/components/whatsapp/WhatsAppAlertsSettings.jsx';
import WhatsAppAlertsHistory from '@/components/whatsapp/WhatsAppAlertsHistory.jsx';
import WhatsAppAlertsTemplates from '@/components/whatsapp/WhatsAppAlertsTemplates.jsx';
import WhatsAppAlertsRules from '@/components/whatsapp/WhatsAppAlertsRules.jsx';
import WhatsAppAlertsRecipients from '@/components/whatsapp/WhatsAppAlertsRecipients.jsx';
import SendTestAlertModal from '@/components/whatsapp/SendTestAlertModal.jsx';

const WhatsAppAlertsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    whatsappAlertsConfig, 
    whatsappAlerts, 
    whatsappTemplates, 
    whatsappRules,
    whatsappRecipients,
    whatsappEscalationGroups,
    saveWhatsAppConfig,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    createRule,
    updateRule,
    deleteRule
  } = useMockData();

  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  // Determine active tab from URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/history')) return 'history';
    if (path.includes('/templates')) return 'templates';
    if (path.includes('/rules')) return 'rules';
    if (path.includes('/recipients')) return 'recipients';
    if (path.includes('/settings')) return 'settings';
    return 'history'; // Default to history/main view
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.pathname]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    navigate(`/whatsapp-alerts/${value}`);
  };

  // Stats calculations with defensive checks
  const today = new Date().toISOString().split('T')[0];
  const safeAlerts = Array.isArray(whatsappAlerts) ? whatsappAlerts : [];
  
  const sentToday = safeAlerts.filter(a => a?.status === 'Enviado' && a?.scheduledAt?.startsWith(today)).length;
  const failedAlerts = safeAlerts.filter(a => a?.status === 'Falhou').length;
  const criticalAlerts = safeAlerts.filter(a => a?.priority === 'Crítica').length;
  const pendingAlerts = safeAlerts.filter(a => a?.status === 'Pendente').length;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 flex items-center gap-3" style={{letterSpacing: '-0.02em'}}>
              <div className="w-10 h-10 rounded-xl bg-[hsl(var(--wa-success))]/10 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-[hsl(var(--wa-success))]" />
              </div>
              WhatsApp Alerts
            </h1>
            <p className="text-muted-foreground text-lg">Central de notificações automáticas e escalonamentos.</p>
          </div>
          <Button onClick={() => setIsTestModalOpen(true)} className="gap-2 shadow-md bg-[hsl(var(--wa-success))] hover:bg-[hsl(var(--wa-success))]/90 text-white">
            <Send className="w-4 h-4" /> Enviar Alerta de Teste
          </Button>
        </div>

        {/* KPI Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <AlertKPICard title="Enviados Hoje" value={sentToday} icon={MessageCircle} colorClass="bg-[hsl(var(--wa-success))]/10 text-[hsl(var(--wa-success))]" trend={12} />
          <AlertKPICard title="Falhas de Envio" value={failedAlerts} icon={XCircle} colorClass="bg-[hsl(var(--wa-error))]/10 text-[hsl(var(--wa-error))]" trend={-5} />
          <AlertKPICard title="Pendentes" value={pendingAlerts} icon={Clock} colorClass="bg-[hsl(var(--wa-pending))]/10 text-[hsl(var(--wa-pending))]" />
          <AlertKPICard title="Alertas Críticos" value={criticalAlerts} icon={AlertTriangle} colorClass="bg-[hsl(var(--wa-error))]/10 text-[hsl(var(--wa-error))]" />
          <AlertKPICard title="Unidades c/ Alertas" value="3" subtitle="Fábrica A lidera" icon={Building2} colorClass="bg-[hsl(var(--wa-info))]/10 text-[hsl(var(--wa-info))]" />
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-5 max-w-3xl mb-8 h-auto p-1 bg-muted/50 rounded-xl">
            <TabsTrigger value="history" className="py-2.5 gap-2 rounded-lg data-[state=active]:shadow-sm"><History className="w-4 h-4 hidden sm:block"/> Histórico</TabsTrigger>
            <TabsTrigger value="templates" className="py-2.5 gap-2 rounded-lg data-[state=active]:shadow-sm"><FileText className="w-4 h-4 hidden sm:block"/> Templates</TabsTrigger>
            <TabsTrigger value="rules" className="py-2.5 gap-2 rounded-lg data-[state=active]:shadow-sm"><Zap className="w-4 h-4 hidden sm:block"/> Regras</TabsTrigger>
            <TabsTrigger value="recipients" className="py-2.5 gap-2 rounded-lg data-[state=active]:shadow-sm"><Users className="w-4 h-4 hidden sm:block"/> Contatos</TabsTrigger>
            <TabsTrigger value="settings" className="py-2.5 gap-2 rounded-lg data-[state=active]:shadow-sm"><Settings className="w-4 h-4 hidden sm:block"/> Config</TabsTrigger>
          </TabsList>
          
          <div className="min-h-[500px]">
            <TabsContent value="history" className="m-0 animate-in fade-in duration-300">
              <WhatsAppAlertsHistory alerts={safeAlerts} />
            </TabsContent>
            
            <TabsContent value="templates" className="m-0 animate-in fade-in duration-300">
              <WhatsAppAlertsTemplates 
                templates={whatsappTemplates || []} 
                onSave={updateTemplate} 
                onDelete={deleteTemplate} 
              />
            </TabsContent>
            
            <TabsContent value="rules" className="m-0 animate-in fade-in duration-300">
              <WhatsAppAlertsRules 
                rules={whatsappRules || []} 
                templates={whatsappTemplates || []}
                onSave={updateRule} 
                onDelete={deleteRule}
              />
            </TabsContent>

            <TabsContent value="recipients" className="m-0 animate-in fade-in duration-300">
              <WhatsAppAlertsRecipients 
                recipients={whatsappRecipients || []}
                escalationGroups={whatsappEscalationGroups || []}
              />
            </TabsContent>

            <TabsContent value="settings" className="m-0 animate-in fade-in duration-300">
              <div className="bg-card rounded-2xl border shadow-sm p-6">
                <WhatsAppAlertsSettings config={whatsappAlertsConfig || {}} onSave={saveWhatsAppConfig} />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <SendTestAlertModal 
        isOpen={isTestModalOpen} 
        onClose={() => setIsTestModalOpen(false)} 
        templates={whatsappTemplates || []} 
      />
    </MainLayout>
  );
};

export default WhatsAppAlertsPage;
