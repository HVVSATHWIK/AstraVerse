
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ErrorBoundary from '@/components/ErrorBoundary';
import { RealtimeProvider } from '@/contexts/RealtimeContext';
import { useKPIs, useAIEngines, useActivityLogs } from '@/services/dataService';
import { Toaster } from '@/components/ui/toaster';

// Import new components
import DashboardHeader from '@/components/DashboardHeader';
import SystemStatusCards from '@/components/SystemStatusCards';
import AIEngineStatus from '@/components/AIEngineStatus';
import RecentActivity from '@/components/RecentActivity';
import SystemHealth from '@/components/SystemHealth';
import PilotPricing from '@/components/PilotPricing';
import IntegrationsGrid from '@/components/IntegrationsGrid';

// Import existing components
import MetricsChart from '@/components/MetricsChart';
import WorkflowBuilder from '@/components/WorkflowBuilder';
import WorkflowControls from '@/components/WorkflowControls';
import KPIOverview from '@/components/KPIOverview';

const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: kpis, isLoading: kpisLoading } = useKPIs();
  const { data: aiEngines, isLoading: aiEnginesLoading } = useAIEngines();
  const { data: activityLogs, isLoading: activityLoading } = useActivityLogs(4);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Status Cards */}
        <ErrorBoundary>
          <SystemStatusCards kpis={kpis} isLoading={kpisLoading} />
        </ErrorBoundary>

        {/* Main Tabs */}
        <ErrorBoundary>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="hidden md:block">
              <TabsList className="bg-white border border-gray-200 p-1">
                <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="workflows" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Workflows
                </TabsTrigger>
                <TabsTrigger value="integrations" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Integrations
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="pilot" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Pilot Mode
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <AIEngineStatus aiEngines={aiEngines} isLoading={aiEnginesLoading} />
                <RecentActivity activityLogs={activityLogs} isLoading={activityLoading} />
                <SystemHealth />
              </div>
              <MetricsChart />
            </TabsContent>

            <TabsContent value="workflows" className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <WorkflowBuilder />
                <WorkflowControls />
              </div>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6">
              <IntegrationsGrid />
            </TabsContent>

            <TabsContent value="analytics">
              <KPIOverview />
            </TabsContent>

            <TabsContent value="pilot">
              <PilotPricing />
            </TabsContent>
          </Tabs>
        </ErrorBoundary>
      </div>
      <Toaster />
    </div>
  );
};

const Dashboard = () => {
  return (
    <RealtimeProvider>
      <DashboardContent />
    </RealtimeProvider>
  );
};

export default Dashboard;
