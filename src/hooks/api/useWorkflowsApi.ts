
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/apiClient';
import { 
  Workflow, 
  WorkflowCreateRequest, 
  WorkflowUpdateRequest, 
  WorkflowExecuteRequest, 
  WorkflowExecuteResponse 
} from '@/types';
import { APIResponse } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

// Query Keys
export const workflowKeys = {
  all: ['workflows'] as const,
  lists: () => [...workflowKeys.all, 'list'] as const,
  list: (filters: string) => [...workflowKeys.lists(), { filters }] as const,
  details: () => [...workflowKeys.all, 'detail'] as const,
  detail: (id: string) => [...workflowKeys.details(), id] as const,
  executions: (id: string) => [...workflowKeys.detail(id), 'executions'] as const,
};

// Queries
export const useWorkflowsQuery = () => {
  return useQuery({
    queryKey: workflowKeys.lists(),
    queryFn: () => apiClient.get<APIResponse<Workflow[]>>('/workflows'),
    select: (response) => response.data?.data || [],
    staleTime: 30000,
  });
};

export const useWorkflowQuery = (id: string) => {
  return useQuery({
    queryKey: workflowKeys.detail(id),
    queryFn: () => apiClient.get<APIResponse<Workflow>>(`/workflows/${id}`),
    select: (response) => response.data?.data,
    enabled: !!id,
  });
};

export const useWorkflowExecutionsQuery = (workflowId: string) => {
  return useQuery({
    queryKey: workflowKeys.executions(workflowId),
    queryFn: () => apiClient.get<APIResponse<WorkflowExecuteResponse[]>>(`/workflows/${workflowId}/executions`),
    select: (response) => response.data?.data || [],
    enabled: !!workflowId,
    refetchInterval: 5000, // Poll for updates
  });
};

// Mutations
export const useCreateWorkflowMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: WorkflowCreateRequest) => 
      apiClient.post<APIResponse<Workflow>>('/workflows', data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.lists() });
      toast({
        title: 'Workflow Created',
        description: `${response.data?.data?.name} has been created successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Creation Failed',
        description: error.response?.data?.error?.message || 'Failed to create workflow',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateWorkflowMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: WorkflowUpdateRequest }) =>
      apiClient.put<APIResponse<Workflow>>(`/workflows/${id}`, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.lists() });
      queryClient.invalidateQueries({ queryKey: workflowKeys.detail(variables.id) });
      toast({
        title: 'Workflow Updated',
        description: `${response.data?.data?.name} has been updated successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.response?.data?.error?.message || 'Failed to update workflow',
        variant: 'destructive',
      });
    },
  });
};

export const useExecuteWorkflowMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: WorkflowExecuteRequest }) =>
      apiClient.post<APIResponse<WorkflowExecuteResponse>>(`/workflows/${id}/execute`, payload),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.executions(variables.id) });
      toast({
        title: 'Workflow Executed',
        description: `Execution started with ID: ${response.data?.data?.executionId}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Execution Failed',
        description: error.response?.data?.error?.message || 'Failed to execute workflow',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteWorkflowMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/workflows/${id}`),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.lists() });
      queryClient.removeQueries({ queryKey: workflowKeys.detail(id) });
      toast({
        title: 'Workflow Deleted',
        description: 'Workflow has been deleted successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Deletion Failed',
        description: error.response?.data?.error?.message || 'Failed to delete workflow',
        variant: 'destructive',
      });
    },
  });
};

