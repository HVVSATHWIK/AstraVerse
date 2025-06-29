import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import HeroSection from './sections/HeroSection';
import QuickStartSection from './sections/QuickStartSection';
import SystemOverviewSection from './sections/SystemOverviewSection';
import LiveOperationsSection from './sections/LiveOperationsSection';
import PerformanceSection from './sections/PerformanceSection';
import TutorialTrigger from '@/components/tutorial/TutorialTrigger';
import DemoDataSeeder from '@/components/DemoDataSeeder';
import { useAuth } from '@/hooks/useAuth';

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
  const { user } = useAuth();

  return (
    <TabsContent value="overview" className="space-y-8">
      {/* Tutorial Trigger */}
      <div className="flex justify-end">
        <TutorialTrigger variant="dashboard" />
      </div>

      {/* Hero Section - What AstraAI Does */}
      <div data-tutorial="main-features">
        <HeroSection />
      </div>
      
      {/* Demo Data Setup for Authenticated Users */}
      {user && (
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <DemoDataSeeder />
        </div>
      )}
      
      {/* Quick Start Section */}
      <QuickStartSection />

      {/* System Status Section */}
      <div data-tutorial="system-overview">
        <SystemOverviewSection kpis={kpis} kpisLoading={kpisLoading} />
      </div>
      
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