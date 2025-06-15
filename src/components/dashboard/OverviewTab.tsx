
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import ErrorBoundary from '@/components/ErrorBoundary';
import MainFeatures from '@/components/MainFeatures';
import QuickStartGuide from '@/components/QuickStartGuide';
import SystemStatusCards from '@/components/SystemStatusCards';
import AIEngineStatus from '@/components/AIEngineStatus';
import RecentActivity from '@/components/RecentActivity';
import SystemHealth from '@/components/SystemHealth';
import QuickActions from '@/components/QuickActions';
import LiveMetrics from '@/components/LiveMetrics';
import MetricsChart from '@/components/MetricsChart';

interface OverviewTabProps {
  kpis: any;
  kpisLoading: boolean;
  aiEngines: any;
  aiEnginesLoading: boolean;
  activityLogs: any;
  activityLoading: boolean;
}

const OverviewTab = ({
  kpis,
  kpisLoading,
  aiEngines,
  aiEnginesLoading,
  activityLogs,
  activityLoading
}: OverviewTabProps) => {
  return (
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
  );
};

export default OverviewTab;
