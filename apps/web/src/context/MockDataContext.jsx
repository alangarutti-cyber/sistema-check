import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import apiServerClient from '@/lib/apiServerClient.js';
import { useAuth } from '@/context/AuthContext.jsx';

const MockDataContext = createContext();
const TEMPLATE_STORAGE_KEY = 'checkflow_templates';

const readTemplates = () => {
  try {
    const raw = localStorage.getItem(TEMPLATE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeTemplates = (templates) => {
  localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
};

const fetchJson = async (url, options = {}) => {
  const response = await apiServerClient.fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || payload.message || 'Erro ao processar requisição.');
  }
  return payload;
};

const mapCompany = (company) => ({
  ...company,
  tradeName: company.trade_name || company.tradeName || '',
  isActive: company.isActive ?? company.status !== 'inactive',
});

const mapUnit = (unit) => ({
  ...unit,
  isActive: unit.isActive ?? unit.status !== 'inactive',
});

const mapSector = (sector) => ({
  ...sector,
  isActive: sector.isActive ?? sector.status !== 'inactive',
});

const mapUser = (user) => ({
  ...user,
  status: user.status || 'active',
});

export const MockDataProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [mockData, setMockData] = useState({
    executions: [],
    alerts: [],
    correctiveActions: [],
    whatsappAlertsConfig: {
      enabled: true,
      responsiblePhone: '(11) 98765-4321',
      managerPhone: '(11) 91234-5678',
      escalationGroup: 'Gestores Regionais',
      selectedEvents: ['overdue', 'critical_item', 'non_compliance'],
      escalationTime: 30,
    },
    whatsappAlerts: [],
    whatsappTemplates: [],
    whatsappRules: [],
    whatsappRecipients: [],
    whatsappEscalationGroups: [],
  });

  const [realData, setRealData] = useState({
    users: [],
    companies: [],
    units: [],
    sectors: [],
    templates: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUsers = useCallback(async () => {
    const payload = await fetchJson('/users');
    setRealData((prev) => ({ ...prev, users: (payload.data || []).map(mapUser) }));
  }, []);

  const loadCompanies = useCallback(async () => {
    const payload = await fetchJson('/companies');
    setRealData((prev) => ({ ...prev, companies: (payload.data || []).map(mapCompany) }));
  }, []);

  const loadUnits = useCallback(async () => {
    const payload = await fetchJson('/units');
    setRealData((prev) => ({ ...prev, units: (payload.data || []).map(mapUnit) }));
  }, []);

  const loadSectors = useCallback(async () => {
    const payload = await fetchJson('/sectors');
    setRealData((prev) => ({ ...prev, sectors: (payload.data || []).map(mapSector) }));
  }, []);

  const loadTemplates = useCallback(async () => {
    setRealData((prev) => ({ ...prev, templates: readTemplates() }));
  }, []);

  const loadAllData = useCallback(async () => {
    if (!currentUser) {
      setRealData((prev) => ({ ...prev, users: [], companies: [], units: [], sectors: [] }));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([loadUsers(), loadCompanies(), loadUnits(), loadSectors(), loadTemplates()]);
    } catch (err) {
      console.error('Erro ao sincronizar dados:', err);
      setError(err.message);
      toast.error('Falha ao sincronizar dados com o servidor.');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, loadUsers, loadCompanies, loadUnits, loadSectors, loadTemplates]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const createUser = async (data) => {
    const payload = await fetchJson('/users', { method: 'POST', body: JSON.stringify(data) });
    await loadUsers();
    return payload.data;
  };

  const updateUser = async (id, data) => {
    const payload = await fetchJson(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    await loadUsers();
    return payload.data;
  };

  const deleteUser = async (id) => {
    await fetchJson(`/users/${id}`, { method: 'DELETE' });
    await loadUsers();
    return true;
  };

  const resetUserPassword = async (id, newPassword) => {
    const payload = await fetchJson(`/users/${id}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ password: newPassword }),
    });
    return payload;
  };

  const createCompany = async (data) => {
    const payload = await fetchJson('/companies', { method: 'POST', body: JSON.stringify(data) });
    await loadCompanies();
    return payload.data;
  };

  const updateCompany = async (id, data) => {
    const payload = await fetchJson(`/companies/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    await loadCompanies();
    return payload.data;
  };

  const deleteCompany = async (id) => {
    await fetchJson(`/companies/${id}`, { method: 'DELETE' });
    await Promise.all([loadCompanies(), loadUnits(), loadSectors()]);
    return true;
  };

  const createUnit = async (data) => {
    const payload = await fetchJson('/units', { method: 'POST', body: JSON.stringify(data) });
    await loadUnits();
    return payload.data;
  };

  const updateUnit = async (id, data) => {
    const payload = await fetchJson(`/units/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    await loadUnits();
    return payload.data;
  };

  const deleteUnit = async (id) => {
    await fetchJson(`/units/${id}`, { method: 'DELETE' });
    await Promise.all([loadUnits(), loadSectors()]);
    return true;
  };

  const createSector = async (data) => {
    const payload = await fetchJson('/sectors', { method: 'POST', body: JSON.stringify(data) });
    await loadSectors();
    return payload.data;
  };

  const updateSector = async (id, data) => {
    const payload = await fetchJson(`/sectors/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    await loadSectors();
    return payload.data;
  };

  const deleteSector = async (id) => {
    await fetchJson(`/sectors/${id}`, { method: 'DELETE' });
    await loadSectors();
    return true;
  };

  const saveTemplate = async (data) => {
    const templates = readTemplates();
    let saved;

    if (data.id) {
      saved = {
        ...templates.find((item) => item.id === data.id),
        ...data,
        updatedAt: new Date().toISOString(),
      };
      writeTemplates(templates.map((item) => (item.id === data.id ? saved : item)));
    } else {
      saved = {
        ...data,
        id: `TPL-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      writeTemplates([saved, ...templates]);
    }

    await loadTemplates();
    return saved;
  };

  const createTemplate = async (data) => saveTemplate(data);
  const updateTemplate = async (id, data) => saveTemplate({ ...data, id });

  const deleteTemplate = async (id) => {
    writeTemplates(readTemplates().filter((item) => item.id !== id));
    await loadTemplates();
    return true;
  };

  const duplicateTemplate = async (id) => {
    const original = readTemplates().find((item) => item.id === id);
    if (!original) throw new Error('Modelo não encontrado.');

    return saveTemplate({
      ...original,
      id: undefined,
      name: `${original.name} (Cópia)`,
      active: false,
    });
  };

  const createCrud = (collectionName) => ({
    getAll: () => mockData[collectionName] || [],
    getById: (id) => (mockData[collectionName] || []).find((item) => item.id === id),
    create: async (newItem) => new Promise((resolve) => {
      setTimeout(() => {
        const item = { ...newItem, id: `${collectionName.substring(0, 3).toUpperCase()}-${Date.now()}`, createdAt: new Date().toISOString() };
        setMockData((prev) => ({ ...prev, [collectionName]: [item, ...(prev[collectionName] || [])] }));
        resolve(item);
      }, 300);
    }),
    update: async (id, updates) => new Promise((resolve) => {
      setTimeout(() => {
        setMockData((prev) => ({
          ...prev,
          [collectionName]: (prev[collectionName] || []).map((item) => item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item),
        }));
        resolve(true);
      }, 300);
    }),
    delete: async (id) => new Promise((resolve) => {
      setTimeout(() => {
        setMockData((prev) => ({
          ...prev,
          [collectionName]: (prev[collectionName] || []).filter((item) => item.id !== id),
        }));
        resolve(true);
      }, 300);
    }),
  });

  const alertsCrud = createCrud('whatsappAlerts');
  const templatesCrud = createCrud('whatsappTemplates');
  const rulesCrud = createCrud('whatsappRules');
  const recipientsCrud = createCrud('whatsappRecipients');
  const escalationCrud = createCrud('whatsappEscalationGroups');
  const coreExecutionsCrud = createCrud('executions');
  const coreAlertsCrud = createCrud('alerts');
  const coreCorrectiveActionsCrud = createCrud('correctiveActions');

  const value = useMemo(() => ({
    ...mockData,
    ...realData,
    isLoading,
    isSyncing: isLoading,
    error,
    refreshData: loadAllData,

    getUsers: () => realData.users,
    getUserById: (id) => realData.users.find((u) => u.id === id),
    createUser,
    updateUser,
    deleteUser,
    resetUserPassword,

    getCompanies: () => realData.companies,
    getCompanyById: (id) => realData.companies.find((c) => c.id === id),
    createCompany,
    updateCompany,
    deleteCompany,

    getUnits: () => realData.units,
    getUnitById: (id) => realData.units.find((u) => u.id === id),
    getUnitsByCompany: (companyId) => realData.units.filter((u) => u.company_id === companyId),
    createUnit,
    updateUnit,
    deleteUnit,

    getSectors: () => realData.sectors,
    getSectorById: (id) => realData.sectors.find((s) => s.id === id),
    getSectorsByUnit: (unitId) => realData.sectors.filter((s) => s.unit_id === unitId),
    getSectorsByCompany: (companyId) => realData.sectors.filter((s) => s.company_id === companyId),
    createSector,
    updateSector,
    deleteSector,

    saveTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,

    saveExecution: coreExecutionsCrud.create,
    deleteExecution: coreExecutionsCrud.delete,
    updateAlert: coreAlertsCrud.update,
    deleteAlert: coreAlertsCrud.delete,
    addCorrectiveAction: coreCorrectiveActionsCrud.create,
    updateCorrectiveAction: coreCorrectiveActionsCrud.update,
    deleteCorrectiveAction: coreCorrectiveActionsCrud.delete,
    updateCorrectiveActionStatus: async (id, status, comments, evidence) => coreCorrectiveActionsCrud.update(id, { status, comments, evidence }),

    getAlertsByFilters: (filters) => (mockData.whatsappAlerts || []).filter((alert) => {
      if (!alert) return false;
      let match = true;
      if (filters.status && filters.status !== 'all') match = match && alert.status === filters.status;
      if (filters.priority && filters.priority !== 'all') match = match && alert.priority === filters.priority;
      if (filters.eventType && filters.eventType !== 'all') match = match && alert.eventType === filters.eventType;
      if (filters.unitId && filters.unitId !== 'all') match = match && alert.unitId === filters.unitId;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        match = match && (alert.checklistName?.toLowerCase().includes(searchLower) || (alert.destinataries || []).some((d) => d?.name?.toLowerCase().includes(searchLower) || d?.number?.includes(searchLower)));
      }
      return match;
    }),
    createAlert: alertsCrud.create,
    updateAlertWA: alertsCrud.update,
    deleteAlertWA: alertsCrud.delete,

    getTemplateById: templatesCrud.getById,
    createTemplateWA: templatesCrud.create,
    updateTemplateWA: templatesCrud.update,
    deleteTemplateWA: templatesCrud.delete,

    getRuleById: rulesCrud.getById,
    createRule: rulesCrud.create,
    updateRule: rulesCrud.update,
    deleteRule: rulesCrud.delete,

    getRecipientById: recipientsCrud.getById,
    createRecipient: recipientsCrud.create,
    updateRecipient: recipientsCrud.update,
    deleteRecipient: recipientsCrud.delete,

    getEscalationGroupById: escalationCrud.getById,
    createEscalationGroup: escalationCrud.create,
    updateEscalationGroup: escalationCrud.update,
    deleteEscalationGroup: escalationCrud.delete,
  }), [mockData, realData, isLoading, error, loadAllData]);

  return <MockDataContext.Provider value={value}>{children}</MockDataContext.Provider>;
};

export const useMockData = () => useContext(MockDataContext);
