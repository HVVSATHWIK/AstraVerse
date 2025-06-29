import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { agentService } from '@/services/agentService';
import { Agent, AgentTask, AgentEvent } from '@/types/agents';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const agentKeys = {
  all: ['agents'] as const,
  lists: () => [...agentKeys.all, 'list'] as const,
  list: (filters: string) => [...agentKeys.lists(), { filters }] as const,
  details: () => [...agentKeys.all, 'detail'] as const,
  detail: (id: string) => [...agentKeys.details(), id] as const,
  tasks: (agentId?: string) => 
    agentId 
      ? [...agentKeys.detail(agentId), 'tasks'] as const
      : ['tasks'] as const,
  events: (agentId?: string) => 
    agentId 
      ? [...agentKeys.detail(agentId), 'events'] as const
      : ['events'] as const,
  stats: () => [...agentKeys.all, 'stats'] as const,
};

// Queries
export const useAgentsQuery = () => {
  return useQuery({
    queryKey: agentKeys.lists(),
    queryFn: () => agentService.getAgents(),
    staleTime: 30000,
  });
};

export const useAgentQuery = (id: string) => {
  return useQuery({
    queryKey: agentKeys.detail(id),
    queryFn: () => agentService.getAgentById(id),
    enabled: !!id,
  });
};

export const useAgentTasksQuery = (agentId?: string) => {
  return useQuery({
    queryKey: agentKeys.tasks(agentId),
    queryFn: () => agentId 
      ? agentService.getAgentTasks(agentId)
      : Promise.resolve([]),
    enabled: !!agentId,
    refetchInterval: 15000,
  });
};

export const useAgentEventsQuery = (agentId?: string, limit: number = 50) => {
  return useQuery({
    queryKey: [...agentKeys.events(agentId), limit],
    queryFn: () => agentId 
      ? agentService.getAgentEvents(agentId, limit)
      : Promise.resolve([]),
    enabled: !!agentId,
    refetchInterval: 30000,
  });
};

export const useAgentStatsQuery = () => {
  return useQuery({
    queryKey: agentKeys.stats(),
    queryFn: () => agentService.getAgentStats(),
    staleTime: 60000,
  });
};

// Mutations
export const useCreateAgentMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (agent: Partial<Agent>) => agentService.createAgent(agent),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
      toast({
        title: 'Agent Created',
        description: `${data.name} has been created successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Creation Failed',
        description: error.message || 'Failed to create agent',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateAgentMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Agent> }) => 
      agentService.updateAgent(id, updates),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: agentKeys.detail(variables.id) });
      toast({
        title: 'Agent Updated',
        description: `${data.name} has been updated successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update agent',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteAgentMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (id: string) => agentService.deleteAgent(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
      queryClient.removeQueries({ queryKey: agentKeys.detail(id) });
      toast({
        title: 'Agent Deleted',
        description: 'Agent has been deleted successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Deletion Failed',
        description: error.message || 'Failed to delete agent',
        variant: 'destructive',
      });
    },
  });
};

export const useAgentCommandMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ agentId, command, parameters }: { 
      agentId: string; 
      command: string; 
      parameters?: any 
    }) => agentService.sendCommand(agentId, command, parameters),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.detail(variables.agentId) });
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: agentKeys.events(variables.agentId) });
      toast({
        title: 'Command Executed',
        description: data.message || `${variables.command} command executed successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Command Failed',
        description: error.message || 'Failed to execute command',
        variant: 'destructive',
      });
    },
  });
};

export const useCreateAgentTaskMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (task: Partial<AgentTask>) => agentService.createTask(task),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.tasks(variables.agentId) });
      queryClient.invalidateQueries({ queryKey: agentKeys.detail(variables.agentId!) });
      toast({
        title: 'Task Created',
        description: `${data.title} has been created successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Task Creation Failed',
        description: error.message || 'Failed to create task',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateAgentTaskMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<AgentTask> }) => 
      agentService.updateTask(id, updates),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.tasks(data.agentId) });
      toast({
        title: 'Task Updated',
        description: `${data.title} has been updated successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Task Update Failed',
        description: error.message || 'Failed to update task',
        variant: 'destructive',
      });
    },
  });
};