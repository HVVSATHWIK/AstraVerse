
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';
import { Agent } from '@/types/agents';
import { getStatusColor } from './TimelineUtilities';

interface AgentTimelineCardProps {
  agent: Agent;
}

const AgentTimelineCard = ({ agent }: AgentTimelineCardProps) => {
  return (
    <Card key={agent.id} className="bg-slate-800/50 border-slate-700/50 mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              agent.status === 'active' ? 'bg-green-400 animate-pulse' :
              agent.status === 'busy' ? 'bg-blue-400 animate-pulse' :
              agent.status === 'error' ? 'bg-red-400' : 'bg-slate-400'
            }`} />
            <div>
              <CardTitle className="text-white text-lg">{agent.name}</CardTitle>
              <p className="text-slate-400 text-sm">{agent.description}</p>
            </div>
          </div>
          <Badge className={getStatusColor(agent.status)}>
            {agent.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-slate-400">Tasks Completed</p>
            <p className="text-white font-medium">{agent.performance.tasksCompleted}</p>
          </div>
          <div>
            <p className="text-slate-400">Success Rate</p>
            <p className="text-green-400 font-medium">{agent.performance.successRate}%</p>
          </div>
          <div>
            <p className="text-slate-400">Avg Response</p>
            <p className="text-blue-400 font-medium">{agent.performance.averageResponseTime}s</p>
          </div>
          <div>
            <p className="text-slate-400">Queue</p>
            <p className="text-white font-medium">{agent.metrics.taskQueue}</p>
          </div>
        </div>
        {agent.currentTask && (
          <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
              <span className="text-white text-sm font-medium">Current Task:</span>
            </div>
            <p className="text-slate-300 text-sm mt-1">{agent.currentTask}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AgentTimelineCard;
