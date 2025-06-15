
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import AgentTimeline from '@/components/AgentTimeline';
import AgentControlPanel from '@/components/AgentControlPanel';

const AgentsTab = () => {
  return (
    <TabsContent value="agents" className="space-y-8">
      <section className="space-y-6 animate-fade-in-3d">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white text-3d">Agent Management</h2>
          <div className="h-px bg-gradient-to-r from-purple-500/50 to-transparent flex-1 ml-6"></div>
        </div>
        
        {/* Agent Control Panel */}
        <div className="animate-scale-in-3d stagger-1">
          <AgentControlPanel />
        </div>
        
        {/* Agent Timeline */}
        <div className="animate-bounce-in-3d stagger-2">
          <AgentTimeline showAllAgents={true} maxHeight="500px" />
        </div>
      </section>
    </TabsContent>
  );
};

export default AgentsTab;
