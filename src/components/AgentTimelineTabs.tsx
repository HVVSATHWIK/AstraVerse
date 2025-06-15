
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AgentTimelineTabsProps {
  showAllAgents: boolean;
}

const AgentTimelineTabs = ({ showAllAgents }: AgentTimelineTabsProps) => {
  return (
    <TabsList className="bg-slate-700/50 border-slate-600">
      {showAllAgents && (
        <TabsTrigger value="agents" className="data-[state=active]:bg-purple-600">
          Agents
        </TabsTrigger>
      )}
      <TabsTrigger value="tasks" className="data-[state=active]:bg-purple-600">
        Tasks
      </TabsTrigger>
      <TabsTrigger value="events" className="data-[state=active]:bg-purple-600">
        Events
      </TabsTrigger>
    </TabsList>
  );
};

export default AgentTimelineTabs;
