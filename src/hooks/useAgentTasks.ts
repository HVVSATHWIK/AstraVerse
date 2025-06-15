
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AgentTask } from '@/types/agents';
import { agentSimulation } from '@/services/agentSimulation';

export const useAgentTasks = (agentId?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['tasks', agentId],
    queryFn: async () => {
      const url = agentId ? `/api/agents/${agentId}/tasks` : '/api/tasks';
      const response = await fetch(url);
      const result = await response.json();
      return result.data as AgentTask[];
    },
    refetchInterval: 15000,
  });

  // Subscribe to real-time task updates
  useEffect(() => {
    const unsubscribe = agentSimulation.onTaskUpdate((updatedTask) => {
      queryClient.setQueryData(['tasks', agentId], (old: AgentTask[] | undefined) => {
        if (!old) return old;
        
        // If agentId filter is specified, only update tasks for that agent
        if (agentId && updatedTask.agentId !== agentId) return old;
        
        const taskExists = old.some(task => task.id === updatedTask.id);
        if (taskExists) {
          return old.map(task => 
            task.id === updatedTask.id ? updatedTask : task
          );
        } else {
          return [updatedTask, ...old];
        }
      });
      
      // Also update global tasks query if no agentId filter
      if (!agentId) {
        queryClient.setQueryData(['tasks'], (old: AgentTask[] | undefined) => {
          if (!old) return old;
          const taskExists = old.some(task => task.id === updatedTask.id);
          if (taskExists) {
            return old.map(task => 
              task.id === updatedTask.id ? updatedTask : task
            );
          } else {
            return [updatedTask, ...old];
          }
        });
      }
    });

    return unsubscribe;
  }, [queryClient, agentId]);

  return query;
};
