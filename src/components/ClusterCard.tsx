
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AgentCluster } from '@/types/agents';

interface ClusterCardProps {
  cluster: AgentCluster;
}

const ClusterCard = ({ cluster }: ClusterCardProps) => {
  const getClusterStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-400';
      case 'degraded':
        return 'text-yellow-400';
      case 'critical':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-sm font-medium">{cluster.name}</CardTitle>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getClusterStatusColor(cluster.status)}`} />
            <span className={`text-xs ${getClusterStatusColor(cluster.status)}`}>
              {cluster.status}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-slate-400">Agents</p>
              <p className="text-white font-medium">{cluster.agents.length}</p>
            </div>
            <div>
              <p className="text-slate-400">Load</p>
              <p className="text-blue-400 font-medium">{cluster.averageLoad.toFixed(1)}%</p>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Active Tasks</span>
              <span className="text-white">{cluster.activeTasks}/{cluster.totalTasks}</span>
            </div>
            <Progress 
              value={(cluster.activeTasks / cluster.totalTasks) * 100} 
              className="h-1"
            />
          </div>
          <div className="flex space-x-1">
            {cluster.agents.map((agent, idx) => (
              <div
                key={idx}
                className={`flex-1 h-1 rounded ${
                  agent.status === 'active' ? 'bg-green-400' :
                  agent.status === 'busy' ? 'bg-blue-400' :
                  agent.status === 'error' ? 'bg-red-400' : 'bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClusterCard;
