
import React from 'react';
import MainLayout from '@/components/MainLayout.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMockData } from '@/context/MockDataContext.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const CompaniesPage = () => {
  const { companies, units, sectors } = useMockData();
  const { t } = useTranslation();

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">{t('companies.title')}</h1>
          <p className="text-muted-foreground">{t('companies.subtitle')}</p>
        </div>

        <Tabs defaultValue="companies" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="companies">{t('companies.companies')}</TabsTrigger>
            <TabsTrigger value="units">{t('companies.units')}</TabsTrigger>
            <TabsTrigger value="sectors">{t('companies.sectors')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="companies" className="space-y-4">
            {companies.map(c => (
              <Card key={c.id}><CardContent className="p-4 font-medium">{c.name}</CardContent></Card>
            ))}
          </TabsContent>
          
          <TabsContent value="units" className="space-y-4">
            {units.map(u => (
              <Card key={u.id}><CardContent className="p-4 font-medium">{u.name} - {u.location}</CardContent></Card>
            ))}
          </TabsContent>

          <TabsContent value="sectors" className="space-y-4">
            {sectors.map(s => (
              <Card key={s.id}><CardContent className="p-4 font-medium">{s.name}</CardContent></Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default CompaniesPage;
