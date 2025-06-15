import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  TrendingUp,
  Activity,
  Cpu,
  HardDrive,
  Clock,
  CheckCircle,
  Zap,
  Users
} from 'lucide-react';
import { Agent, AgentStats, AgentCluster } from '@/types/agents';
import { useAgents, useAgentStats, useAgentClusters, useAgentCommand } from '@/hooks/useAgents';
import { Skeleton } from '@/components/ui/skeleton';

const AgentControlPanel = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  // Use the new hooks
  const { data: agents, isLoading: agentsLoading } = useAgents();
  const { data: stats, isLoading: statsLoading } = useAgentStats();
  const { data: clusters, isLoading: clustersLoading } = useAgentClusters();
  const commandMutation = useAgentCommand();

  const executeCommand = (agentId: string, command: string, parameters?: any) => {
    commandMutation.mutate({ agentId, command, parameters });
  };

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

  const renderAgentCard = (agent: Agent) => (
    <Card 
      key={agent.id} 
      className={`bg-slate-800/50 border-slate-700/50 cursor-pointer transition-all hover:border-purple-500/50 ${
        selectedAgent === agent.id ? 'border-purple-500/50 bg-slate-700/50' : ''
      }`}
      onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
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
          <Badge className={getStatusColor(agent.status)} size="sm">
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
          {selectedAgent === agent.id && (
            <div className="pt-2 border-t border-slate-700/50">
              <div className="flex space-x-2">
                {agent.status === 'active' || agent.status === 'busy' ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      executeCommand(agent.id, 'pause');
                    }}
                    disabled={commandMutation.isPending}
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
                      executeCommand(agent.id, 'start');
                    }}
                    disabled={commandMutation.isPending}
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
                    executeCommand(agent.id, 'restart');
                  }}
                  disabled={commandMutation.isPending}
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

  const renderClusterCard = (cluster: AgentCluster) => (
    <Card key={cluster.id} className="bg-slate-800/50 border-slate-700/50">
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

  if (agentsLoading || statsLoading || clustersLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <Skeleton className="h-6 w-48 bg-slate-700" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 bg-slate-700" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Overview Stats */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <span>System Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-slate-300 text-sm">Total Agents</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats?.totalAgents}</p>
              <p className="text-xs text-green-400">{stats?.activeAgents} active</p>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-slate-300 text-sm">Completed Tasks</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats?.completedTasks}</p>
              <p className="text-xs text-slate-400">of {stats?.totalTasks} total</p>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-slate-300 text-sm">Avg Response</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats?.averageResponseTime}s</p>
              <p className="text-xs text-slate-400">response time</p>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Cpu className="w-5 h-5 text-yellow-400" />
                <span className="text-slate-300 text-sm">System Load</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats?.systemLoad}%</p>
              <p className="text-xs text-slate-400">current load</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agent Management Tabs */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Zap className="w-5 h-5 text-purple-400" />
            <span>Agent Control Center</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="agents" className="w-full">
            <TabsList className="bg-slate-700/50 border-slate-600">
              <TabsTrigger value="agents" className="data-[state=active]:bg-purple-600">
                Agents ({agents?.length})
              </TabsTrigger>
              <TabsTrigger value="clusters" className="data-[state=active]:bg-purple-600">
                Clusters ({clusters?.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="agents" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agents?.map(renderAgentCard)}
              </div>
            </TabsContent>
            
            <TabsContent value="clusters" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clusters?.map(renderClusterCard)}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentControlPanel;
