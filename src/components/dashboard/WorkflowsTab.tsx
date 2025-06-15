
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import WorkflowBuilder from '@/components/WorkflowBuilder';
import WorkflowControls from '@/components/WorkflowControls';

const WorkflowsTab = () => {
  return (
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
  );
};

export default WorkflowsTab;
