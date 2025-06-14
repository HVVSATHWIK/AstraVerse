
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ErrorBoundary from '@/components/ErrorBoundary';
import { RealtimeProvider } from '@/contexts/RealtimeContext';
import { useKPIs, useAIEngines, useActivityLogs } from '@/services/dataService';
import { Toaster } from '@/components/ui/toaster';

// Import new components
import DashboardHeader from '@/components/DashboardHeader';
import MainFeatures from '@/components/MainFeatures';
import QuickStartGuide from '@/components/QuickStartGuide';
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

      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Tabs */}
        <ErrorBoundary>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="hidden md:block">
              <TabsList className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 p-1 shadow-xl rounded-4xl">
                <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-slate-300 font-medium rounded-3xl">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="workflows" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-slate-300 font-medium rounded-3xl">
                  Workflows
                </TabsTrigger>
                <TabsTrigger value="integrations" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-slate-300 font-medium rounded-3xl">
                  Integrations
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-slate-300 font-medium rounded-3xl">
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="pilot" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-slate-300 font-medium rounded-3xl">
                  Pilot Mode
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-8">
              {/* Hero Section - What AstraAI Does */}
              <section className="space-y-6">
                <MainFeatures />
              </section>
              
              {/* Quick Start Section */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Getting Started</h2>
                  <div className="h-px bg-gradient-to-r from-purple-500/50 to-transparent flex-1 ml-6"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-3">
                    <QuickStartGuide />
                  </div>
                  <div className="lg:col-span-1">
                    <QuickActions />
                  </div>
                </div>
              </section>

              {/* System Status Section */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">System Overview</h2>
                  <div className="h-px bg-gradient-to-r from-blue-500/50 to-transparent flex-1 ml-6"></div>
                </div>
                <ErrorBoundary>
                  <SystemStatusCards kpis={kpis} isLoading={kpisLoading} />
                </ErrorBoundary>
              </section>
              
              {/* Operational Details Section */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Live Operations</h2>
                  <div className="h-px bg-gradient-to-r from-green-500/50 to-transparent flex-1 ml-6"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-4">
                    <AIEngineStatus aiEngines={aiEngines} isLoading={aiEnginesLoading} />
                  </div>
                  <div className="lg:col-span-5">
                    <RecentActivity activityLogs={activityLogs} isLoading={activityLoading} />
                  </div>
                  <div className="lg:col-span-3">
                    <LiveMetrics />
                  </div>
                </div>
              </section>
              
              {/* Performance Analytics Section */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Performance & Health</h2>
                  <div className="h-px bg-gradient-to-r from-orange-500/50 to-transparent flex-1 ml-6"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SystemHealth />
                  <MetricsChart />
                </div>
              </section>
            </TabsContent>

            <TabsContent value="workflows" className="space-y-8">
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Workflow Management</h2>
                  <div className="h-px bg-gradient-to-r from-purple-500/50 to-transparent flex-1 ml-6"></div>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <WorkflowBuilder />
                  <WorkflowControls />
                </div>
              </section>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-8">
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Connected Services</h2>
                  <div className="h-px bg-gradient-to-r from-cyan-500/50 to-transparent flex-1 ml-6"></div>
                </div>
                <IntegrationsGrid />
              </section>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-8">
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Analytics & Insights</h2>
                  <div className="h-px bg-gradient-to-r from-emerald-500/50 to-transparent flex-1 ml-6"></div>
                </div>
                <KPIOverview />
              </section>
            </TabsContent>

            <TabsContent value="pilot" className="space-y-8">
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Pilot Program</h2>
                  <div className="h-px bg-gradient-to-r from-yellow-500/50 to-transparent flex-1 ml-6"></div>
                </div>
                <PilotPricing />
              </section>
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
