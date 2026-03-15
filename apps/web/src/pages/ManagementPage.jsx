
import React from 'react';
import MainLayout from '@/components/MainLayout.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminDashboard from '@/pages/dashboards/AdminDashboard.jsx';

const ManagementPage = () => {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Management Panel</h1>
          <p className="text-muted-foreground">Deep dive into operational metrics and compliance data.</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="units">By Unit</TabsTrigger>
            <TabsTrigger value="sectors">By Sector</TabsTrigger>
            <TabsTrigger value="employees">By Employee</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <AdminDashboard />
          </TabsContent>
          
          <TabsContent value="units">
            <div className="p-8 text-center bg-card rounded-xl border border-border/50">
              <p className="text-muted-foreground">Unit specific metrics will appear here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ManagementPage;
