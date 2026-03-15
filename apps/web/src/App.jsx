
import React, { useEffect } from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext.jsx';
import { MockDataProvider } from '@/context/MockDataContext.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import { Toaster } from 'sonner';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config.js';
import { TooltipProvider } from '@/components/ui/tooltip';

// Pages
import HomePage from '@/pages/HomePage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import DashboardPage from '@/pages/DashboardPage.jsx';
import MyChecklistsPage from '@/pages/MyChecklistsPage.jsx';
import TodayTasksPage from '@/pages/TodayTasksPage.jsx';
import ChecklistExecutionPage from '@/pages/ChecklistExecutionPage.jsx';
import HistoryPage from '@/pages/HistoryPage.jsx';
import ExecutionDetailPage from '@/pages/ExecutionDetailPage.jsx';
import ModelsPage from '@/pages/ModelsPage.jsx';
import TemplateBuilder from '@/pages/TemplateBuilder.jsx';
import SchedulePage from '@/pages/SchedulePage.jsx';
import ManagementPage from '@/pages/ManagementPage.jsx';
import AlertsPage from '@/pages/AlertsPage.jsx';
import UsersPage from '@/pages/UsersPage.jsx';
import SettingsPage from '@/pages/SettingsPage.jsx';
import CorrectiveActionsPage from '@/pages/CorrectiveActionsPage.jsx';
import UnitPerformancePage from '@/pages/UnitPerformancePage.jsx';
import WhatsAppAlertsPage from '@/pages/WhatsAppAlertsPage.jsx';

// Organizational Structure Pages
import CompaniesPage from '@/pages/organizational-structure/CompaniesPage.jsx';
import UnitsPage from '@/pages/organizational-structure/UnitsPage.jsx';
import SectorsPage from '@/pages/organizational-structure/SectorsPage.jsx';

// Tutorial Pages
import TutorialsPage from '@/pages/tutorials/TutorialsPage.jsx';
import TutorialDetailPage from '@/pages/tutorials/TutorialDetailPage.jsx';
import TutorialVideosPage from '@/pages/tutorials/TutorialVideosPage.jsx';
import FAQPage from '@/pages/tutorials/FAQPage.jsx';
import GlossaryPage from '@/pages/tutorials/GlossaryPage.jsx';
import TutorialProgressPage from '@/pages/tutorials/TutorialProgressPage.jsx';
import OnboardingPage from '@/pages/OnboardingPage.jsx';

// Global Components
import HelpFloatingButton from '@/components/tutorials/HelpFloatingButton.jsx';

const OnboardingCheck = ({ children }) => {
  const { hasSeenOnboarding, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && !hasSeenOnboarding) {
      navigate('/onboarding');
    }
  }, [currentUser, hasSeenOnboarding, navigate]);

  return children;
};

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ErrorBoundary>
        <AuthProvider>
          <MockDataProvider>
            <TooltipProvider>
              <Router>
                <OnboardingCheck>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
                    
                    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                    <Route path="/checklists" element={<ProtectedRoute><MyChecklistsPage /></ProtectedRoute>} />
                    <Route path="/today-tasks" element={<ProtectedRoute><TodayTasksPage /></ProtectedRoute>} />
                    <Route path="/checklist-execution/:id" element={<ProtectedRoute><ChecklistExecutionPage /></ProtectedRoute>} />
                    <Route path="/corrective-actions" element={<ProtectedRoute><CorrectiveActionsPage /></ProtectedRoute>} />
                    <Route path="/unit-performance" element={<ProtectedRoute><UnitPerformancePage /></ProtectedRoute>} />
                    
                    {/* WhatsApp Alerts Module */}
                    <Route path="/whatsapp-alerts" element={<ProtectedRoute><WhatsAppAlertsPage /></ProtectedRoute>} />
                    <Route path="/whatsapp-alerts/settings" element={<ProtectedRoute><WhatsAppAlertsPage /></ProtectedRoute>} />
                    <Route path="/whatsapp-alerts/history" element={<ProtectedRoute><WhatsAppAlertsPage /></ProtectedRoute>} />
                    <Route path="/whatsapp-alerts/templates" element={<ProtectedRoute><WhatsAppAlertsPage /></ProtectedRoute>} />
                    <Route path="/whatsapp-alerts/rules" element={<ProtectedRoute><WhatsAppAlertsPage /></ProtectedRoute>} />
                    <Route path="/whatsapp-alerts/recipients" element={<ProtectedRoute><WhatsAppAlertsPage /></ProtectedRoute>} />
                    
                    {/* Organizational Structure & Users */}
                    <Route path="/settings/organizational-structure/companies" element={<ProtectedRoute><CompaniesPage /></ProtectedRoute>} />
                    <Route path="/settings/organizational-structure/units" element={<ProtectedRoute><UnitsPage /></ProtectedRoute>} />
                    <Route path="/settings/organizational-structure/sectors" element={<ProtectedRoute><SectorsPage /></ProtectedRoute>} />
                    <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />

                    <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
                    <Route path="/history/:id" element={<ProtectedRoute><ExecutionDetailPage /></ProtectedRoute>} />
                    <Route path="/models" element={<ProtectedRoute><ModelsPage /></ProtectedRoute>} />
                    <Route path="/template-builder" element={<ProtectedRoute><TemplateBuilder /></ProtectedRoute>} />
                    <Route path="/schedule" element={<ProtectedRoute><SchedulePage /></ProtectedRoute>} />
                    <Route path="/management" element={<ProtectedRoute><ManagementPage /></ProtectedRoute>} />
                    <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

                    {/* Tutorials */}
                    <Route path="/tutorials" element={<ProtectedRoute><TutorialsPage /></ProtectedRoute>} />
                    <Route path="/tutorials/:id" element={<ProtectedRoute><TutorialDetailPage /></ProtectedRoute>} />
                    <Route path="/tutorials/videos" element={<ProtectedRoute><TutorialVideosPage /></ProtectedRoute>} />
                    <Route path="/tutorials/faq" element={<ProtectedRoute><FAQPage /></ProtectedRoute>} />
                    <Route path="/tutorials/glossary" element={<ProtectedRoute><GlossaryPage /></ProtectedRoute>} />
                    <Route path="/tutorials/progress" element={<ProtectedRoute><TutorialProgressPage /></ProtectedRoute>} />
                    
                    {/* Catch-all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                  
                  {/* Global Floating Help Button */}
                  <HelpFloatingButton />
                </OnboardingCheck>
              </Router>
              <Toaster position="top-right" richColors />
            </TooltipProvider>
          </MockDataProvider>
        </AuthProvider>
      </ErrorBoundary>
    </I18nextProvider>
  );
}

export default App;
