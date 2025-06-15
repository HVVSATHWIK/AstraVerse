
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import HeroSection from './sections/HeroSection';
import QuickStartSection from './sections/QuickStartSection';
import SystemOverviewSection from './sections/SystemOverviewSection';
import LiveOperationsSection from './sections/LiveOperationsSection';
import PerformanceSection from './sections/PerformanceSection';

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
      <HeroSection />
      
      {/* Quick Start Section */}
      <QuickStartSection />

      {/* System Status Section */}
      <SystemOverviewSection kpis={kpis} kpisLoading={kpisLoading} />
      
      {/* Operational Details Section */}
      <LiveOperationsSection 
        aiEngines={aiEngines}
        aiEnginesLoading={aiEnginesLoading}
        activityLogs={activityLogs}
        activityLoading={activityLoading}
      />
      
      {/* Performance Analytics Section */}
      <PerformanceSection />
    </TabsContent>
  );
};

export default OverviewTab;
