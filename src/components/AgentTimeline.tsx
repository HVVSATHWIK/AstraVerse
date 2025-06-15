
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Activity, 
  Zap
} from 'lucide-react';
import { Agent, AgentTask, AgentEvent } from '@/types/agents';
import { useAgents, useAgentTasks, useAgentEvents } from '@/hooks/useAgents';
import AgentTimelineCard from './AgentTimelineCard';
import TaskTimelineItem from './TaskTimelineItem';
import EventTimelineItem from './EventTimelineItem';

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
                  {agents?.map(agent => (
                    <AgentTimelineCard key={agent.id} agent={agent} />
                  ))}
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
                  tasks?.map(task => {
                    const agent = agents?.find(a => a.id === task.agentId);
                    return (
                      <TaskTimelineItem 
                        key={task.id}
                        task={task} 
                        agent={agent}
                        showAllAgents={showAllAgents}
                      />
                    );
                  })
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
                  events?.map(event => {
                    const agent = agents?.find(a => a.id === event.agentId);
                    return (
                      <EventTimelineItem 
                        key={event.id}
                        event={event} 
                        agent={agent}
                        showAllAgents={showAllAgents}
                      />
                    );
                  })
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
