import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserWorkflow } from '@/types';

export interface CreateWorkflowInput {
  name: string;
  description?: string;
  steps?: any[];
  status?: 'draft' | 'active' | 'paused' | 'error';
}

export interface UpdateWorkflowInput {
  name?: string;
  description?: string;
  steps?: any[];
  status?: 'draft' | 'active' | 'paused' | 'error';
}

// Query keys for React Query
const workflowKeys = {
  all: ['workflows'] as const,
  lists: () => [...workflowKeys.all, 'list'] as const,
  list: (filters: string) => [...workflowKeys.lists(), { filters }] as const,
  details: () => [...workflowKeys.all, 'detail'] as const,
  detail: (id: string) => [...workflowKeys.details(), id] as const,
};

/**
 * Hook to fetch all workflows for the current user
 */
export const useWorkflows = () => {
  return useQuery({
    queryKey: workflowKeys.lists(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_workflows')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching workflows:', error);
        throw error;
      }

      return data as UserWorkflow[];
    },
    staleTime: 30000, // 30 seconds
  });
};

/**
 * Hook to fetch a specific workflow by ID
 */
export const useWorkflow = (id: string) => {
  return useQuery({
    queryKey: workflowKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_workflows')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(`Error fetching workflow ${id}:`, error);
        throw error;
      }

      return data as UserWorkflow;
    },
    enabled: !!id,
  });
};

/**
 * Hook to create a new workflow
 */
export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: CreateWorkflowInput) => {
      const { data, error } = await supabase
        .from('user_workflows')
        .insert([{
          name: input.name,
          description: input.description || null,
          steps: input.steps || [],
          status: input.status || 'draft',
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating workflow:', error);
        throw error;
      }

      return data as UserWorkflow;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.lists() });
      toast({
        title: 'Workflow Created',
        description: `${data.name} has been created successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Creation Failed',
        description: error.message || 'Failed to create workflow',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook to update an existing workflow
 */
export const useUpdateWorkflow = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateWorkflowInput }) => {
      const { data, error } = await supabase
        .from('user_workflows')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating workflow ${id}:`, error);
        throw error;
      }

      return data as UserWorkflow;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.lists() });
      queryClient.invalidateQueries({ queryKey: workflowKeys.detail(variables.id) });
      toast({
        title: 'Workflow Updated',
        description: `${data.name} has been updated successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update workflow',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook to delete a workflow
 */
export const useDeleteWorkflow = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_workflows')
        .delete()
        .eq('id', id);

      if (error) {
        console.error(`Error deleting workflow ${id}:`, error);
        throw error;
      }

      return id;
    },
    onSuccess: (id) => {
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
        description: error.message || 'Failed to delete workflow',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook to execute a workflow
 */
export const useExecuteWorkflow = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload?: Record<string, any> }) => {
      // In a real implementation, this would call a Supabase Edge Function
      // For now, we'll simulate execution with a direct update
      const { data, error } = await supabase
        .from('user_workflows')
        .update({ 
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`Error executing workflow ${id}:`, error);
        throw error;
      }

      // Log the execution in activity logs
      await supabase
        .from('user_activity_logs')
        .insert([{
          action: 'workflow_executed',
          description: `Executed workflow: ${data.name}`,
          metadata: { workflow_id: id, payload }
        }]);

      return {
        executionId: `exec-${Date.now()}`,
        status: 'running',
        startedAt: new Date().toISOString(),
        workflow: data
      };
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: workflowKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['user-activity-logs'] });
      
      toast({
        title: 'Workflow Executed',
        description: `Execution started for ${result.workflow.name}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Execution Failed',
        description: error.message || 'Failed to execute workflow',
        variant: 'destructive',
      });
    },
  });
};