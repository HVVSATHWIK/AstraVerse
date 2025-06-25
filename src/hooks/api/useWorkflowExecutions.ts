import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface WorkflowExecution {
  id: string;
  workflow_id: string;
  user_id: string;
  status: 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  result?: any;
  error?: string;
  execution_time?: number;
}

// Query keys
const workflowExecutionKeys = {
  all: ['workflow-executions'] as const,
  lists: () => [...workflowExecutionKeys.all, 'list'] as const,
  list: (workflowId?: string) => [...workflowExecutionKeys.lists(), workflowId] as const,
  details: () => [...workflowExecutionKeys.all, 'detail'] as const,
  detail: (id: string) => [...workflowExecutionKeys.details(), id] as const,
};

/**
 * Hook to fetch workflow executions, optionally filtered by workflow ID
 */
export const useWorkflowExecutions = (workflowId?: string, limit: number = 10) => {
  return useQuery({
    queryKey: workflowExecutionKeys.list(workflowId),
    queryFn: async () => {
      let query = supabase
        .from('workflow_executions')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(limit);
      
      if (workflowId) {
        query = query.eq('workflow_id', workflowId);
      }
      
      const { data, error } = await query;

      if (error) {
        console.error('Error fetching workflow executions:', error);
        throw error;
      }

      return data as WorkflowExecution[];
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: workflowId ? 5000 : false, // Poll for updates if viewing a specific workflow
  });
};

/**
 * Hook to fetch a specific workflow execution by ID
 */
export const useWorkflowExecution = (id: string) => {
  return useQuery({
    queryKey: workflowExecutionKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflow_executions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(`Error fetching workflow execution ${id}:`, error);
        throw error;
      }

      return data as WorkflowExecution;
    },
    enabled: !!id,
  });
};