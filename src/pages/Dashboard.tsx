
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
import QuickActions from '@/components/QuickActions';
import LiveMetrics from '@/components/LiveMetrics';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-1500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-6">
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
              <TabsList className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 p-1 shadow-xl">
                <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-slate-300 font-medium">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="workflows" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-slate-300 font-medium">
                  Workflows
                </TabsTrigger>
                <TabsTrigger value="integrations" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-slate-300 font-medium">
                  Integrations
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-slate-300 font-medium">
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="pilot" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-slate-300 font-medium">
                  Pilot Mode
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                <div className="xl:col-span-2">
                  <AIEngineStatus aiEngines={aiEngines} isLoading={aiEnginesLoading} />
                </div>
                <div className="xl:col-span-2">
                  <RecentActivity activityLogs={activityLogs} isLoading={activityLoading} />
                </div>
                <div className="xl:col-span-1">
                  <QuickActions />
                </div>
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <SystemHealth />
                <LiveMetrics />
                <div className="xl:col-span-1">
                  <MetricsChart />
                </div>
              </div>
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
