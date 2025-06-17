
import React, { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import ErrorBoundary from '@/components/ErrorBoundary';
import { RealtimeProvider } from '@/contexts/RealtimeContext';
import { useKPIs, useAIEngines, useActivityLogs } from '@/services/dataService';
import { Toaster } from '@/components/ui/toaster';

// Import dashboard components
import DashboardHeader from '@/components/DashboardHeader';
import Enhanced3DBackground from '@/components/Background3D/Enhanced3DBackground';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import OverviewTab from '@/components/dashboard/OverviewTab';
import WorkflowsTab from '@/components/dashboard/WorkflowsTab';
import AgentsTab from '@/components/dashboard/AgentsTab';
import IntegrationsTab from '@/components/dashboard/IntegrationsTab';
import AnalyticsTab from '@/components/dashboard/AnalyticsTab';
import PilotTab from '@/components/dashboard/PilotTab';
import MobileOptimizedView from '@/components/mobile/MobileOptimizedView';
import { useIsMobile } from '@/hooks/use-mobile';

const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: kpis, isLoading: kpisLoading } = useKPIs();
  const { data: aiEngines, isLoading: aiEnginesLoading } = useAIEngines();
  const { data: activityLogs, isLoading: activityLoading } = useActivityLogs(4);
  const isMobile = useIsMobile();

  const dashboardContent = (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden transform-3d perspective-container">
      {/* Enhanced 3D Background System */}
      {!isMobile && (
        <Enhanced3DBackground
          enableParticles={true}
          enableShapes={true}
          enableGrid={true}
          enableInteractive={true}
          particleCount={35}
          performance="medium"
        />
      )}

      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header with enhanced 3D effects */}
        <div className="animate-slide-up-3d">
          <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Main Tabs with 3D enhancements */}
        <ErrorBoundary>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8 animate-fade-in-3d">
            <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
            
            <OverviewTab
              kpis={kpis}
              kpisLoading={kpisLoading}
              aiEngines={aiEngines}
              aiEnginesLoading={aiEnginesLoading}
              activityLogs={activityLogs}
              activityLoading={activityLoading}
            />
            
            <WorkflowsTab />
            <AgentsTab />
            <IntegrationsTab />
            <AnalyticsTab />
            <PilotTab />
          </Tabs>
        </ErrorBoundary>
      </div>
      <Toaster />
    </div>
  );

  return (
    <MobileOptimizedView activeTab={activeTab} onTabChange={setActiveTab}>
      {dashboardContent}
    </MobileOptimizedView>
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
