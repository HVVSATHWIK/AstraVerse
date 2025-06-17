
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Tabs, TabsContent as InnerTabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import KPIOverview from '@/components/KPIOverview';
import RealTimeMetrics from '@/components/analytics/RealTimeMetrics';

const AnalyticsTab = () => {
  return (
    <TabsContent value="analytics" className="space-y-8">
      <section className="space-y-6 animate-fade-in-3d">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white text-3d">Analytics & Insights</h2>
          <div className="h-px bg-gradient-to-r from-emerald-500/50 to-transparent flex-1 ml-6"></div>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="realtime">Real-time</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <InnerTabsContent value="overview" className="space-y-6">
            <div className="animate-scale-in-3d">
              <KPIOverview />
            </div>
          </InnerTabsContent>

          <InnerTabsContent value="realtime" className="space-y-6">
            <div className="animate-scale-in-3d">
              <RealTimeMetrics />
            </div>
          </InnerTabsContent>

          <InnerTabsContent value="reports" className="space-y-6">
            <div className="animate-scale-in-3d">
              <KPIOverview />
            </div>
          </InnerTabsContent>

          <InnerTabsContent value="insights" className="space-y-6">
            <div className="animate-scale-in-3d">
              <RealTimeMetrics />
            </div>
          </InnerTabsContent>
        </Tabs>
      </section>
    </TabsContent>
  );
};

export default AnalyticsTab;
