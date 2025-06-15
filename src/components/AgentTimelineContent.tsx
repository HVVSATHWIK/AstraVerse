
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, Zap } from 'lucide-react';
import { Agent, AgentTask, AgentEvent } from '@/types/agents';
import AgentTimelineCard from './AgentTimelineCard';
import TaskTimelineItem from './TaskTimelineItem';
import EventTimelineItem from './EventTimelineItem';

interface AgentTimelineContentProps {
  showAllAgents: boolean;
  maxHeight: string;
  agents?: Agent[];
  tasks?: AgentTask[];
  events?: AgentEvent[];
}

const AgentTimelineContent = ({ 
  showAllAgents, 
  maxHeight, 
  agents, 
  tasks, 
  events 
}: AgentTimelineContentProps) => {
  const renderEmptyState = (icon: React.ReactNode, message: string) => (
    <div className="text-center py-8 text-slate-400">
      {icon}
      <p>{message}</p>
    </div>
  );

  return (
    <>
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
              renderEmptyState(
                <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />,
                "No tasks found"
              )
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
              renderEmptyState(
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />,
                "No events found"
              )
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
    </>
  );
};

export default AgentTimelineContent;
