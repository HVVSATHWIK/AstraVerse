
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Workflow, Integration, ActivityLog } from '@/types';

// Real data service for Supabase integration
export const useUserWorkflows = () => {
  return useQuery({
    queryKey: ['user-workflows'],
    queryFn: async () => {
      console.log('Fetching user workflows from Supabase...');
      const { data, error } = await supabase
        .from('user_workflows')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching workflows:', error);
        throw error;
      }

      console.log('Workflows fetched:', data);
      return data || [];
    },
    staleTime: 30000,
  });
};

export const useUserIntegrations = () => {
  return useQuery({
    queryKey: ['user-integrations'],
    queryFn: async () => {
      console.log('Fetching user integrations from Supabase...');
      const { data, error } = await supabase
        .from('user_integrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching integrations:', error);
        throw error;
      }

      console.log('Integrations fetched:', data);
      return data || [];
    },
    staleTime: 30000,
  });
};

export const useUserActivityLogs = (limit: number = 50) => {
  return useQuery({
    queryKey: ['user-activity-logs', limit],
    queryFn: async () => {
      console.log('Fetching user activity logs from Supabase...');
      const { data, error } = await supabase
        .from('user_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching activity logs:', error);
        throw error;
      }

      console.log('Activity logs fetched:', data);
      return data || [];
    },
    refetchInterval: 30000,
  });
};

export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (workflow: { name: string; description?: string; config?: any }) => {
      console.log('Creating workflow:', workflow);
      const { data, error } = await supabase
        .from('user_workflows')
        .insert([{
          ...workflow,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating workflow:', error);
        throw error;
      }

      console.log('Workflow created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-workflows'] });
    },
  });
};

export const useUpdateWorkflow = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<any> }) => {
      console.log('Updating workflow:', id, updates);
      const { data, error } = await supabase
        .from('user_workflows')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating workflow:', error);
        throw error;
      }

      console.log('Workflow updated:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-workflows'] });
    },
  });
};

export const useCreateIntegration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (integration: { 
      integration_type: string; 
      name: string; 
      config?: any; 
      enabled?: boolean 
    }) => {
      console.log('Creating integration:', integration);
      const { data, error } = await supabase
        .from('user_integrations')
        .insert([{
          ...integration,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating integration:', error);
        throw error;
      }

      console.log('Integration created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-integrations'] });
    },
  });
};

export const useLogActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (activity: { action: string; description: string; metadata?: any }) => {
      console.log('Logging activity:', activity);
      const { data, error } = await supabase
        .from('user_activity_logs')
        .insert([{
          ...activity,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error logging activity:', error);
        throw error;
      }

      console.log('Activity logged:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-activity-logs'] });
    },
  });
};
