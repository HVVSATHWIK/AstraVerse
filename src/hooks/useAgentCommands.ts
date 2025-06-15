
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AgentTask } from '@/types/agents';
import { useToast } from '@/hooks/use-toast';

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
