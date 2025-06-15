
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Agent, AgentTask, AgentEvent, AgentStats, AgentCluster } from '@/types/agents';
import { agentSimulation } from '@/services/agentSimulation';
import { useToast } from '@/hooks/use-toast';

// Agent data hooks
export const useAgents = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const response = await fetch('/api/agents');
      const result = await response.json();
      return result.data as Agent[];
    },
    refetchInterval: 30000,
  });

  // Subscribe to real-time agent updates
  useEffect(() => {
    const unsubscribe = agentSimulation.onAgentUpdate((updatedAgent) => {
      queryClient.setQueryData(['agents'], (old: Agent[] | undefined) => {
        if (!old) return old;
        return old.map(agent => 
          agent.id === updatedAgent.id ? updatedAgent : agent
        );
      });
    });

    return unsubscribe;
  }, [queryClient]);

  return query;
};

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

export const useAgentStats = () => {
  return useQuery({
    queryKey: ['agent-stats'],
    queryFn: async () => {
      const response = await fetch('/api/agents/stats');
      const result = await response.json();
      return result.data as AgentStats;
    },
    refetchInterval: 30000,
  });
};

export const useAgentClusters = () => {
  return useQuery({
    queryKey: ['clusters'],
    queryFn: async () => {
      const response = await fetch('/api/clusters');
      const result = await response.json();
      return result.data as AgentCluster[];
    },
    refetchInterval: 30000,
  });
};

// Agent command mutations
export const useAgentCommand = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ agentId, command, parameters }: { 
      agentId: string; 
      command: string; 
      parameters?: any 
    }) => {
      const response = await fetch(`/api/agents/${agentId}/commands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, parameters }),
      });
      
      if (!response.ok) {
        throw new Error('Command failed');
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Command Executed",
        description: `${variables.command} command sent successfully`,
      });
      
      // Invalidate agent queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      queryClient.invalidateQueries({ queryKey: ['agent-stats'] });
    },
    onError: (error, variables) => {
      toast({
        title: "Command Failed",
        description: `Failed to execute ${variables.command} command`,
        variant: "destructive",
      });
    },
  });
};

export const useCreateAgentTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (taskData: Partial<AgentTask>) => {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Task Created",
        description: "New agent task has been created successfully",
      });
      
      // Invalidate task queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: () => {
      toast({
        title: "Creation Failed",
        description: "Failed to create new task",
        variant: "destructive",
      });
    },
  });
};
