import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Info, 
  Calendar, 
  Clock,
  User
} from 'lucide-react';
import { Agent } from '@/types/agents';

interface AgentOverviewPanelProps {
  agent: Agent;
}

const AgentOverviewPanel = ({ agent }: AgentOverviewPanelProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'busy':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'idle':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'offline':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Info className="w-5 h-5 text-blue-400" />
          <span>Agent Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-slate-700/50 p-4 rounded-lg">
          <h4 className="text-white font-medium mb-2">Description</h4>
          <p className="text-slate-300">{agent.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <User className="w-4 h-4 text-blue-400" />
              <h4 className="text-white font-medium">Agent Details</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Type</span>
                <span className="text-white text-sm capitalize">{agent.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Status</span>
                <Badge className={getStatusColor(agent.status)}>
                  {agent.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="bg-slate-700/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-green-400" />
              <h4 className="text-white font-medium">Timestamps</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Created</span>
                <span className="text-white text-sm">{new Date(agent.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Last Active</span>
                <span className="text-white text-sm">{new Date(agent.lastActive).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>

        {agent.currentTask && (
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              <h4 className="text-white font-medium">Current Task</h4>
            </div>
            <p className="text-slate-300">{agent.currentTask}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AgentOverviewPanel;