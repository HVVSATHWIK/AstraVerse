
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden transform-3d perspective-container">
      {/* Enhanced animated background elements with 3D effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-background-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-3d"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-2xl animate-pulse-3d"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-xl animate-background-float"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-pink-500/10 rounded-full blur-xl animate-float-3d"></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-green-500/15 rounded-full blur-2xl animate-wiggle-3d"></div>
        <div className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-yellow-500/15 rounded-full blur-xl animate-pulse-3d"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header with enhanced 3D effects */}
        <div className="animate-slide-up-3d">
          <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Main Tabs with 3D enhancements */}
        <ErrorBoundary>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8 animate-fade-in-3d">
            <div className="hidden md:block animate-scale-in-3d stagger-1">
              <TabsList className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 p-1 shadow-xl rounded-4xl glass-dark hover-lift-3d transform-3d">
                <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-slate-300 font-medium rounded-3xl btn-3d transition-all duration-300">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="workflows" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-slate-300 font-medium rounded-3xl btn-3d transition-all duration-300">
                  Workflows
                </TabsTrigger>
                <TabsTrigger value="integrations" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-slate-300 font-medium rounded-3xl btn-3d transition-all duration-300">
                  Integrations
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-slate-300 font-medium rounded-3xl btn-3d transition-all duration-300">
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="pilot" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-slate-300 font-medium rounded-3xl btn-3d transition-all duration-300">
                  Pilot Mode
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-8">
              {/* Hero Section - What AstraAI Does */}
              <section className="space-y-6 animate-bounce-in-3d">
                <MainFeatures />
              </section>
              
              {/* Quick Start Section */}
              <section className="space-y-6 animate-fade-in-3d stagger-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white text-3d">Getting Started</h2>
                  <div className="h-px bg-gradient-to-r from-purple-500/50 to-transparent flex-1 ml-6"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-3 animate-scale-in-3d stagger-3">
                    <QuickStartGuide />
                  </div>
                  <div className="lg:col-span-1 animate-scale-in-3d stagger-4">
                    <QuickActions />
                  </div>
                </div>
              </section>

              {/* System Status Section */}
              <section className="space-y-6 animate-slide-up-3d stagger-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white text-3d">System Overview</h2>
                  <div className="h-px bg-gradient-to-r from-blue-500/50 to-transparent flex-1 ml-6"></div>
                </div>
                <ErrorBoundary>
                  <div className="animate-bounce-in-3d stagger-4">
                    <SystemStatusCards kpis={kpis} isLoading={kpisLoading} />
                  </div>
                </ErrorBoundary>
              </section>
              
              {/* Operational Details Section */}
              <section className="space-y-6 animate-fade-in-3d stagger-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white text-3d">Live Operations</h2>
                  <div className="h-px bg-gradient-to-r from-green-500/50 to-transparent flex-1 ml-6"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-4 animate-scale-in-3d stagger-5">
                    <AIEngineStatus aiEngines={aiEngines} isLoading={aiEnginesLoading} />
                  </div>
                  <div className="lg:col-span-5 animate-scale-in-3d stagger-6">
                    <RecentActivity activityLogs={activityLogs} isLoading={activityLoading} />
                  </div>
                  <div className="lg:col-span-3 animate-bounce-in-3d stagger-6">
                    <LiveMetrics />
                  </div>
                </div>
              </section>
              
              {/* Performance Analytics Section */}
              <section className="space-y-6 animate-slide-up-3d stagger-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white text-3d">Performance & Health</h2>
                  <div className="h-px bg-gradient-to-r from-orange-500/50 to-transparent flex-1 ml-6"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="animate-scale-in-3d stagger-6">
                    <SystemHealth />
                  </div>
                  <div className="animate-bounce-in-3d stagger-6">
                    <MetricsChart />
                  </div>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="workflows" className="space-y-8">
              <section className="space-y-6 animate-fade-in-3d">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white text-3d">Workflow Management</h2>
                  <div className="h-px bg-gradient-to-r from-purple-500/50 to-transparent flex-1 ml-6"></div>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div className="animate-scale-in-3d stagger-1">
                    <WorkflowBuilder />
                  </div>
                  <div className="animate-scale-in-3d stagger-2">
                    <WorkflowControls />
                  </div>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-8">
              <section className="space-y-6 animate-fade-in-3d">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white text-3d">Connected Services</h2>
                  <div className="h-px bg-gradient-to-r from-cyan-500/50 to-transparent flex-1 ml-6"></div>
                </div>
                <div className="animate-bounce-in-3d">
                  <IntegrationsGrid />
                </div>
              </section>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-8">
              <section className="space-y-6 animate-fade-in-3d">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white text-3d">Analytics & Insights</h2>
                  <div className="h-px bg-gradient-to-r from-emerald-500/50 to-transparent flex-1 ml-6"></div>
                </div>
                <div className="animate-scale-in-3d">
                  <KPIOverview />
                </div>
              </section>
            </TabsContent>

            <TabsContent value="pilot" className="space-y-8">
              <section className="space-y-6 animate-fade-in-3d">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white text-3d">Pilot Program</h2>
                  <div className="h-px bg-gradient-to-r from-yellow-500/50 to-transparent flex-1 ml-6"></div>
                </div>
                <div className="animate-bounce-in-3d">
                  <PilotPricing />
                </div>
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
