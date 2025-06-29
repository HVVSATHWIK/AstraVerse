import React from 'react';
import AIEngineStatus from '@/components/AIEngineStatus';
import RecentActivity from '@/components/RecentActivity';
import LiveMetrics from '@/components/LiveMetrics';
import WorkflowControls from '@/components/WorkflowControls';

interface LiveOperationsSectionProps {
  aiEngines: any;
  aiEnginesLoading: boolean;
  activityLogs: any;
  activityLoading: boolean;
}

const LiveOperationsSection = ({ 
  aiEngines, 
  aiEnginesLoading, 
  activityLogs, 
  activityLoading 
}: LiveOperationsSectionProps) => {
  return (
    <section className="space-y-6 animate-fade-in-3d stagger-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white text-3d">Live Operations</h2>
        <div className="h-px bg-gradient-to-r from-green-500/50 to-transparent flex-1 ml-6"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 animate-scale-in-3d stagger-5">
          <AIEngineStatus aiEngines={aiEngines} isLoading={aiEnginesLoading} />
        </div>
        <div className="lg:col-span-3 animate-scale-in-3d stagger-6">
          <RecentActivity activityLogs={activityLogs} isLoading={activityLoading} />
        </div>
        <div className="lg:col-span-3 animate-bounce-in-3d stagger-6">
          <LiveMetrics />
        </div>
        <div className="lg:col-span-3 animate-scale-in-3d stagger-5">
          <WorkflowControls />
        </div>
      </div>
    </section>
  );
};

export default LiveOperationsSection;