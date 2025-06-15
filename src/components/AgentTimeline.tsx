
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { useAgents } from '@/hooks/useAgents';
import { useAgentTasks } from '@/hooks/useAgentTasks';
import { useAgentEvents } from '@/hooks/useAgentEvents';
import AgentTimelineHeader from './AgentTimelineHeader';
import AgentTimelineTabs from './AgentTimelineTabs';
import AgentTimelineContent from './AgentTimelineContent';
import AgentTimelineLoading from './AgentTimelineLoading';

interface AgentTimelineProps {
  agentId?: string;
  showAllAgents?: boolean;
  maxHeight?: string;
}

const AgentTimeline = ({ agentId, showAllAgents = false, maxHeight = "600px" }: AgentTimelineProps) => {
  const [activeTab, setActiveTab] = useState('events');

  // Use the new hooks
  const { data: agents, isLoading: agentsLoading } = useAgents();
  const { data: tasks, isLoading: tasksLoading } = useAgentTasks(agentId);
  const { data: events, isLoading: eventsLoading } = useAgentEvents(agentId);

  if (agentsLoading || tasksLoading || eventsLoading) {
    return <AgentTimelineLoading />;
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm shadow-xl">
      <AgentTimelineHeader 
        showAllAgents={showAllAgents}
        agentId={agentId}
        agents={agents}
      />
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <AgentTimelineTabs showAllAgents={showAllAgents} />
          <AgentTimelineContent
            showAllAgents={showAllAgents}
            maxHeight={maxHeight}
            agents={agents}
            tasks={tasks}
            events={events}
          />
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AgentTimeline;
