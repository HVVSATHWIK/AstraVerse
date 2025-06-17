
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import IntegrationHub from '@/components/integrations/IntegrationHub';

const IntegrationsTab = () => {
  return (
    <TabsContent value="integrations" className="space-y-8">
      <section className="space-y-6 animate-fade-in-3d">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white text-3d">Connected Services & Integration Hub</h2>
          <div className="h-px bg-gradient-to-r from-cyan-500/50 to-transparent flex-1 ml-6"></div>
        </div>
        <div className="animate-bounce-in-3d">
          <IntegrationHub />
        </div>
      </section>
    </TabsContent>
  );
};

export default IntegrationsTab;
