
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Activity,
  Cpu,
  HardDrive,
} from 'lucide-react';
import { Agent } from '@/types/agents';

interface AgentCardProps {
  agent: Agent;
  isSelected: boolean;
  onSelect: (agentId: string) => void;
  onCommand: (agentId: string, command: string) => void;
  isCommandPending: boolean;
}

const AgentCard = ({ agent, isSelected, onSelect, onCommand, isCommandPending }: AgentCardProps) => {
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
    <Card 
      className={`bg-slate-800/50 border-slate-700/50 cursor-pointer transition-all hover:border-purple-500/50 ${
        isSelected ? 'border-purple-500/50 bg-slate-700/50' : ''
      }`}
      onClick={() => onSelect(isSelected ? '' : agent.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              agent.status === 'active' ? 'bg-green-400 animate-pulse' :
              agent.status === 'busy' ? 'bg-blue-400 animate-pulse' :
              agent.status === 'error' ? 'bg-red-400' : 'bg-slate-400'
            }`} />
            <div>
              <CardTitle className="text-white text-sm font-medium">{agent.name}</CardTitle>
              <p className="text-slate-400 text-xs">{agent.type}</p>
            </div>
          </div>
          <Badge className={getStatusColor(agent.status)}>
            {agent.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="flex items-center space-x-1">
                <Cpu className="w-3 h-3 text-blue-400" />
                <span className="text-slate-400">CPU</span>
              </div>
              <Progress value={agent.metrics.cpuUsage} className="h-1 mt-1" />
              <span className="text-white text-xs">{agent.metrics.cpuUsage}%</span>
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <HardDrive className="w-3 h-3 text-green-400" />
                <span className="text-slate-400">Memory</span>
              </div>
              <Progress value={agent.metrics.memoryUsage} className="h-1 mt-1" />
              <span className="text-white text-xs">{agent.metrics.memoryUsage}%</span>
            </div>
          </div>

          {/* Current Task */}
          {agent.currentTask && (
            <div className="p-2 bg-slate-700/50 rounded text-xs">
              <div className="flex items-center space-x-1 mb-1">
                <Activity className="w-3 h-3 text-blue-400" />
                <span className="text-blue-400">Active Task</span>
              </div>
              <p className="text-slate-300 truncate">{agent.currentTask}</p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <p className="text-slate-400">Tasks</p>
              <p className="text-white font-medium">{agent.performance.tasksCompleted}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400">Success</p>
              <p className="text-green-400 font-medium">{agent.performance.successRate}%</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400">Queue</p>
              <p className="text-white font-medium">{agent.metrics.taskQueue}</p>
            </div>
          </div>

          {/* Control Buttons */}
          {isSelected && (
            <div className="pt-2 border-t border-slate-700/50">
              <div className="flex space-x-2">
                {agent.status === 'active' || agent.status === 'busy' ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCommand(agent.id, 'pause');
                    }}
                    disabled={isCommandPending}
                  >
                    <Pause className="w-3 h-3 mr-1" />
                    Pause
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCommand(agent.id, 'start');
                    }}
                    disabled={isCommandPending}
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Start
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-8 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCommand(agent.id, 'restart');
                  }}
                  disabled={isCommandPending}
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Restart
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentCard;
