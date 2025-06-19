import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Settings, 
  Trash2,
  Activity,
  Cpu,
  HardDrive,
  Clock
} from 'lucide-react';
import { useAgentQuery, useAgentCommandMutation, useDeleteAgentMutation } from '@/hooks/useAgentService';
import { Progress } from '@/components/ui/progress';
import CreateAgentTask from '@/components/agents/CreateAgentTask';
import { Agent } from '@/types/agents';
import { useToast } from '@/hooks/use-toast';

interface AgentDetailPanelProps {
  agentId: string;
  onDeleted?: () => void;
}

const AgentDetailPanel = ({ agentId, onDeleted }: AgentDetailPanelProps) => {
  const { data: agent, isLoading } = useAgentQuery(agentId);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const commandMutation = useAgentCommandMutation();
  const deleteAgentMutation = useDeleteAgentMutation();
  const { toast } = useToast();

  const handleCommand = (command: string) => {
    commandMutation.mutate({ agentId, command });
  };

  const handleDeleteAgent = async () => {
    if (confirm('Are you sure you want to delete this agent? This action cannot be undone.')) {
      try {
        await deleteAgentMutation.mutateAsync(agentId);
        if (onDeleted) onDeleted();
      } catch (error) {
        console.error('Error deleting agent:', error);
      }
    }
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

  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <div className="h-6 w-48 bg-slate-700/50 animate-pulse rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 w-full bg-slate-700/50 animate-pulse rounded"></div>
            <div className="h-4 w-3/4 bg-slate-700/50 animate-pulse rounded"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-slate-700/50 animate-pulse rounded"></div>
              <div className="h-20 bg-slate-700/50 animate-pulse rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!agent) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <Activity className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-white text-lg font-medium mb-2">Agent Not Found</h3>
          <p className="text-slate-400">The requested agent could not be found or you don't have permission to view it.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              agent.status === 'active' ? 'bg-green-400 animate-pulse' :
              agent.status === 'busy' ? 'bg-blue-400 animate-pulse' :
              agent.status === 'error' ? 'bg-red-400' : 'bg-slate-400'
            }`} />
            <CardTitle className="text-white">{agent.name}</CardTitle>
            <Badge className={getStatusColor(agent.status)}>
              {agent.status}
            </Badge>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="text-slate-300 border-slate-600"
              onClick={() => setIsCreateTaskOpen(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              New Task
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-400 border-slate-600"
              onClick={handleDeleteAgent}
              disabled={deleteAgentMutation.isPending}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-slate-700/50">
            <TabsTrigger value="overview" className="text-slate-300">Overview</TabsTrigger>
            <TabsTrigger value="metrics" className="text-slate-300">Metrics</TabsTrigger>
            <TabsTrigger value="config" className="text-slate-300">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Description</h4>
              <p className="text-slate-300">{agent.description}</p>
            </div>

            <div className="bg-slate-700/50 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Capabilities</h4>
              <div className="flex flex-wrap gap-2">
                {agent.capabilities && agent.capabilities.length > 0 ? (
                  agent.capabilities.map((capability: string, index: number) => (
                    <Badge key={index} variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                      {capability}
                    </Badge>
                  ))
                ) : (
                  <p className="text-slate-400">No capabilities defined</p>
                )}
              </div>
            </div>

            {agent.currentTask && (
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-2">Current Task</h4>
                <p className="text-slate-300">{agent.currentTask}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-2">Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Tasks Completed</span>
                    <span className="text-white">{agent.performance?.tasksCompleted || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Success Rate</span>
                    <span className="text-green-400">{agent.performance?.successRate || 0}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Avg Response</span>
                    <span className="text-blue-400">{agent.performance?.averageResponseTime || 0}s</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-2">Status</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Type</span>
                    <span className="text-white capitalize">{agent.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Created</span>
                    <span className="text-white">{new Date(agent.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Last Active</span>
                    <span className="text-white">{new Date(agent.lastActive).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              {agent.status === 'active' || agent.status === 'busy' ? (
                <Button
                  onClick={() => handleCommand('pause')}
                  disabled={commandMutation.isPending}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause Agent
                </Button>
              ) : (
                <Button
                  onClick={() => handleCommand('start')}
                  disabled={commandMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Agent
                </Button>
              )}
              <Button
                onClick={() => handleCommand('restart')}
                disabled={commandMutation.isPending}
                variant="outline"
                className="text-slate-300 border-slate-600"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart
              </Button>
              <Button
                variant="outline"
                className="text-slate-300 border-slate-600"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  <h4 className="text-white font-medium">CPU Usage</h4>
                </div>
                <Progress value={agent.metrics?.cpuUsage || 0} className="h-2 mb-2" />
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Current</span>
                  <span className="text-white">{agent.metrics?.cpuUsage || 0}%</span>
                </div>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <HardDrive className="w-4 h-4 text-green-400" />
                  <h4 className="text-white font-medium">Memory Usage</h4>
                </div>
                <Progress value={agent.metrics?.memoryUsage || 0} className="h-2 mb-2" />
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Current</span>
                  <span className="text-white">{agent.metrics?.memoryUsage || 0}%</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <h4 className="text-white font-medium">Response Time</h4>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Average</span>
                <span className="text-white">{agent.performance?.averageResponseTime || 0}s</span>
              </div>
            </div>

            <div className="bg-slate-700/50 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Task Queue</h4>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Pending Tasks</span>
                <span className="text-white">{agent.metrics?.taskQueue || 0}</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="config" className="space-y-4 mt-4">
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Agent Configuration</h4>
              <pre className="text-slate-300 text-sm bg-slate-800/50 p-3 rounded overflow-auto">
                {JSON.stringify(agent.config || {}, null, 2)}
              </pre>
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>Create Task for {agent.name}</DialogTitle>
            </DialogHeader>
            <CreateAgentTask 
              agentId={agentId} 
              onSuccess={() => setIsCreateTaskOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AgentDetailPanel;