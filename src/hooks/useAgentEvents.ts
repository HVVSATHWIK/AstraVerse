
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AgentEvent } from '@/types/agents';
import { agentSimulation } from '@/services/agentSimulation';
import { useToast } from '@/hooks/use-toast';

export const useAgentEvents = (agentId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ['events', agentId],
    queryFn: async () => {
      const url = agentId ? `/api/agents/${agentId}/events` : '/api/events';
      const response = await fetch(url);
      const result = await response.json();
      return result.data as AgentEvent[];
    },
    refetchInterval: 30000,
  });

  // Subscribe to real-time event updates
  useEffect(() => {
    const unsubscribe = agentSimulation.onNewEvent((newEvent) => {
      queryClient.setQueryData(['events', agentId], (old: AgentEvent[] | undefined) => {
        if (!old) return [newEvent];
        
        // If agentId filter is specified, only update events for that agent
        if (agentId && newEvent.agentId !== agentId) return old;
        
        return [newEvent, ...old];
      });
      
      // Also update global events query if no agentId filter
      if (!agentId) {
        queryClient.setQueryData(['events'], (old: AgentEvent[] | undefined) => {
          if (!old) return [newEvent];
          return [newEvent, ...old];
        });
      }

      // Show toast notification for important events
      if (newEvent.severity === 'error') {
        toast({
          title: "Agent Error",
          description: newEvent.message,
          variant: "destructive",
        });
      } else if (newEvent.severity === 'success' && newEvent.type === 'task_complete') {
        toast({
          title: "Task Completed",
          description: newEvent.message,
        });
      }
    });

    return unsubscribe;
  }, [queryClient, agentId, toast]);

  return query;
};
