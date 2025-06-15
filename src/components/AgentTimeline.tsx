import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Activity, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Zap
} from 'lucide-react';
import { Agent, AgentTask, AgentEvent } from '@/types/agents';
import { useAgents, useAgentTasks, useAgentEvents } from '@/hooks/useAgents';

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'running':
      case 'active':
        return <Activity className="w-4 h-4 text-blue-400 animate-pulse" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'running':
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'busy':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'idle':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case 'error':
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'queued':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'low':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const renderAgentCard = (agent: Agent) => (
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

  const renderTaskItem = (task: AgentTask) => {
    const agent = agents?.find(a => a.id === task.agentId);
    
    return (
      <div key={task.id} className="flex items-start space-x-4 p-4 border-l-2 border-slate-700/50 hover:border-purple-500/50 transition-colors">
        <div className="flex-shrink-0 mt-1">
          {getStatusIcon(task.status)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-medium truncate">{task.title}</h4>
            <div className="flex items-center space-x-2">
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              <Badge className={getStatusColor(task.status)}>
                {task.status}
              </Badge>
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-2">{task.description}</p>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center space-x-4">
              {showAllAgents && agent && (
                <span>Agent: {agent.name}</span>
              )}
              <span>Created: {formatTimestamp(task.createdAt)}</span>
              {task.status === 'running' && (
                <span className="text-blue-400">Progress: {task.progress}%</span>
              )}
            </div>
            {task.estimatedDuration && (
              <span>ETA: {Math.floor(task.estimatedDuration / 60)}m</span>
            )}
          </div>
          {task.status === 'running' && (
            <div className="mt-2">
              <div className="w-full bg-slate-700 rounded-full h-1.5">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
          )}
          {task.error && (
            <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs">
              Error: {task.error}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderEventItem = (event: AgentEvent) => {
    const agent = agents?.find(a => a.id === event.agentId);
    
    return (
      <div key={event.id} className="flex items-start space-x-4 p-4 border-l-2 border-slate-700/50 hover:border-purple-500/50 transition-colors">
        <div className="flex-shrink-0 mt-1">
          {getStatusIcon(event.severity)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white font-medium capitalize">{event.type.replace('_', ' ')}</span>
            <span className="text-slate-500 text-xs">{formatTimestamp(event.timestamp)}</span>
          </div>
          <p className="text-slate-300 text-sm mb-1">{event.message}</p>
          <div className="flex items-center space-x-4 text-xs text-slate-500">
            {showAllAgents && agent && (
              <span>Agent: {agent.name}</span>
            )}
            <Badge className={getStatusColor(event.severity)}>
              {event.severity}
            </Badge>
          </div>
          {event.metadata && (
            <div className="mt-2 p-2 bg-slate-700/30 rounded text-xs text-slate-400">
              {Object.entries(event.metadata).map(([key, value]) => (
                <div key={key}>
                  <span className="text-slate-500">{key}:</span> {String(value)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (agentsLoading || tasksLoading || eventsLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <Skeleton className="h-6 w-48 bg-slate-700" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-4 rounded-full bg-slate-700" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4 bg-slate-700" />
                  <Skeleton className="h-3 w-1/2 bg-slate-700" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Activity className="w-5 h-5 text-purple-400" />
          <span>
            {showAllAgents ? 'Agent System Timeline' : 
             agentId ? agents?.find(a => a.id === agentId)?.name + ' Timeline' : 
             'Timeline'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
          
          {showAllAgents && (
            <TabsContent value="agents">
              <ScrollArea style={{ height: maxHeight }}>
                <div className="space-y-4">
                  {agents?.map(renderAgentCard)}
                </div>
              </ScrollArea>
            </TabsContent>
          )}
          
          <TabsContent value="tasks">
            <ScrollArea style={{ height: maxHeight }}>
              <div className="space-y-2">
                {tasks?.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No tasks found</p>
                  </div>
                ) : (
                  tasks?.map(renderTaskItem)
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="events">
            <ScrollArea style={{ height: maxHeight }}>
              <div className="space-y-2">
                {events?.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No events found</p>
                  </div>
                ) : (
                  events?.map(renderEventItem)
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AgentTimeline;
