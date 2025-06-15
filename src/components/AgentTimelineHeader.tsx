
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { Agent } from '@/types/agents';

interface AgentTimelineHeaderProps {
  showAllAgents: boolean;
  agentId?: string;
  agents?: Agent[];
}

const AgentTimelineHeader = ({ showAllAgents, agentId, agents }: AgentTimelineHeaderProps) => {
  const getTitle = () => {
    if (showAllAgents) return 'Agent System Timeline';
    if (agentId) {
      const agent = agents?.find(a => a.id === agentId);
      return agent ? `${agent.name} Timeline` : 'Timeline';
    }
    return 'Timeline';
  };

  return (
    <CardHeader>
      <CardTitle className="text-white flex items-center space-x-2">
        <Activity className="w-5 h-5 text-purple-400" />
        <span>{getTitle()}</span>
      </CardTitle>
    </CardHeader>
  );
};

export default AgentTimelineHeader;
