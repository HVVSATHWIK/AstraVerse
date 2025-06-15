
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import KPIOverview from '@/components/KPIOverview';

const AnalyticsTab = () => {
  return (
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
  );
};

export default AnalyticsTab;
