
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';
import { 
  LayoutDashboard, ClipboardList, CalendarCheck, FileText, 
  Calendar, Bell, Activity, Users, Settings, LogOut, 
  ChevronLeft, ChevronRight, Building2, AlertTriangle,
  PlusSquare, BookOpen, MessageCircle, ChevronDown, UserCog, MapPin, Layers, Lock
} from 'lucide-react';
import { cn } from '@/lib/utils.js';

const MainLayout = ({ children }) => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState({
    whatsapp: location.pathname.includes('/whatsapp-alerts'),
    orgStructure: location.pathname.includes('/settings/organizational-structure') || location.pathname.includes('/users')
  });

  const unreadAlerts = 2; // Mock counter

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = (key) => {
    setExpandedMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const navSections = [
    {
      title: 'Operações',
      items: [
        { name: 'Painel', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Meus Checklists', path: '/checklists', icon: ClipboardList },
        { name: 'Tarefas de Hoje', path: '/today-tasks', icon: CalendarCheck },
        { name: 'Ações Corretivas', path: '/corrective-actions', icon: AlertTriangle },
        { 
          name: 'WhatsApp Alerts', 
          icon: MessageCircle, 
          key: 'whatsapp',
          subItems: [
            { name: 'Configuração', path: '/whatsapp-alerts/settings' },
            { name: 'Histórico', path: '/whatsapp-alerts/history' },
            { name: 'Templates', path: '/whatsapp-alerts/templates' },
            { name: 'Regras', path: '/whatsapp-alerts/rules' },
          ]
        },
      ]
    },
    {
      title: 'Gestão',
      items: [
        { name: 'Modelos', path: '/models', icon: FileText },
        { name: 'Construtor', path: '/template-builder', icon: PlusSquare },
        { name: 'Agenda', path: '/schedule', icon: Calendar },
        { name: 'Alertas', path: '/alerts', icon: Bell, badge: unreadAlerts },
        { name: 'Desempenho', path: '/unit-performance', icon: Activity },
      ]
    },
    {
      title: 'Configurações',
      items: [
        { 
          name: 'Estrutura e Acessos', 
          icon: Settings, 
          key: 'orgStructure',
          subItems: [
            { name: 'Empresas', path: '/settings/organizational-structure/companies', icon: Building2 },
            { name: 'Unidades', path: '/settings/organizational-structure/units', icon: MapPin },
            { name: 'Setores', path: '/settings/organizational-structure/sectors', icon: Layers },
            { name: 'Usuários', path: '/users', icon: Users },
            { name: 'Permissões', path: '/settings/permissions', icon: Lock },
          ]
        },
        { name: 'Tutoriais', path: '/tutorials', icon: BookOpen },
      ]
    }
  ];

  const NavItem = ({ item, isCollapsed }) => {
    if (item.subItems) {
      const isExpanded = expandedMenus[item.key];
      const hasActiveChild = item.subItems.some(sub => location.pathname === sub.path || location.pathname.startsWith(`${sub.path}/`));
      
      return (
        <div className="space-y-1">
          <button
            onClick={() => {
              if (isCollapsed) setIsSidebarOpen(true);
              toggleMenu(item.key);
            }}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
              hasActiveChild && !isExpanded
                ? "bg-primary/5 text-primary font-bold" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className={cn("w-5 h-5 shrink-0", hasActiveChild ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </div>
            {!isCollapsed && (
              <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isExpanded ? "rotate-180" : "")} />
            )}
          </button>
          
          {!isCollapsed && isExpanded && (
            <div className="pl-10 pr-2 space-y-1 py-1">
              {item.subItems.map((sub, idx) => {
                const isSubActive = location.pathname === sub.path || location.pathname.startsWith(`${sub.path}/`);
                return (
                  <Link
                    key={idx}
                    to={sub.path}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                      isSubActive 
                        ? "bg-primary/10 text-primary font-bold" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
                    )}
                  >
                    {sub.icon && <sub.icon className="w-3.5 h-3.5" />}
                    {sub.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
    return (
      <Link
        to={item.path}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
          isActive 
            ? "bg-primary/10 text-primary font-bold" 
            : "text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
        )}
      >
        <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
        {!isCollapsed && (
          <span className="flex-1 truncate">{item.name}</span>
        )}
        {!isCollapsed && item.badge > 0 && (
          <span className="bg-critical text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            {item.badge}
          </span>
        )}
        {isCollapsed && item.badge > 0 && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-critical rounded-full border-2 border-card"></span>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden md:flex flex-col border-r bg-card transition-all duration-300 z-20",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0 shadow-sm">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            {isSidebarOpen && <span className="font-bold text-xl tracking-tight">CheckFlow</span>}
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"
          >
            {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-hide">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {isSidebarOpen && (
                <h3 className="px-3 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
              )}
              {section.items.map((item, itemIdx) => (
                <NavItem key={itemIdx} item={item} isCollapsed={!isSidebarOpen} />
              ))}
            </div>
          ))}
        </div>

        <div className="p-4 border-t shrink-0">
          <div className={cn("flex items-center gap-3 mb-4", !isSidebarOpen && "justify-center")}>
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 font-bold">
              {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{currentUser?.email || 'Usuário'}</p>
                <p className="text-xs text-muted-foreground capitalize font-medium">{currentUser?.role || 'Operador'}</p>
              </div>
            )}
          </div>
          <button 
            onClick={handleLogout} 
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-error/10 hover:text-error transition-colors font-medium",
              !isSidebarOpen && "justify-center"
            )}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Desktop Top Bar */}
        <header className="hidden md:flex h-16 bg-card border-b items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <Building2 className="w-4 h-4" />
            <span className="text-foreground font-bold">Rede CheckFlow</span>
            <span>/</span>
            <span>Matriz</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/alerts" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-critical rounded-full border-2 border-card"></span>
            </Link>
            <span className="text-sm font-medium text-muted-foreground">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-muted/10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
