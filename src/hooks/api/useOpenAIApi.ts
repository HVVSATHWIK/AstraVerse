
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { OpenAIGenerateRequest, OpenAIGenerateResponse, OpenAIProcessingJob, OpenAIConfiguration } from '@/types/openai';
import { useToast } from '@/hooks/use-toast';

// Query Keys
export const openaiKeys = {
  all: ['openai'] as const,
  configurations: () => [...openaiKeys.all, 'configurations'] as const,
  configuration: (id: string) => [...openaiKeys.configurations(), id] as const,
  usageLogs: () => [...openaiKeys.all, 'usage-logs'] as const,
  jobs: () => [...openaiKeys.all, 'jobs'] as const,
  job: (id: string) => [...openaiKeys.jobs(), id] as const,
};

// Queries for OpenAI configurations
export const useOpenAIConfigurationsQuery = () => {
  return useQuery({
    queryKey: openaiKeys.configurations(),
    queryFn: async () => {
      console.log('Fetching OpenAI configurations...');
      const { data, error } = await supabase
        .from('openai_configurations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching OpenAI configurations:', error);
        throw error;
      }

      console.log('OpenAI configurations fetched:', data);
      return data || [];
    },
    staleTime: 30000,
  });
};

export const useOpenAIUsageLogsQuery = (limit: number = 50) => {
  return useQuery({
    queryKey: openaiKeys.usageLogs(),
    queryFn: async () => {
      console.log('Fetching OpenAI usage logs...');
      const { data, error } = await supabase
        .from('openai_usage_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching OpenAI usage logs:', error);
        throw error;
      }

      console.log('OpenAI usage logs fetched:', data);
      return data || [];
    },
    refetchInterval: 30000,
  });
};

// Custom hook for OpenAI content generation
export const useOpenAIGenerateMutation = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: OpenAIGenerateRequest): Promise<OpenAIGenerateResponse> => {
      console.log('Calling OpenAI function with:', data);
      
      const { data: response, error } = await supabase.functions.invoke('openai-generate', {
        body: data,
      });

      if (error) {
        console.error('OpenAI function error:', error);
        throw new Error(error.message || 'Failed to generate content with OpenAI');
      }

      if (response?.error) {
        console.error('OpenAI API error:', response.error);
        throw new Error(response.error);
      }

      return response;
    },
    onSuccess: (response) => {
      toast({
        title: 'OpenAI Generation Complete',
        description: `Generated ${response.content.length} characters successfully.`,
      });
    },
    onError: (error: any) => {
      console.error('OpenAI generation error:', error);
      toast({
        title: 'OpenAI Generation Failed',
        description: error.message || 'Failed to generate content with OpenAI',
        variant: 'destructive',
      });
    },
  });
};

// Hook for creating OpenAI configurations
export const useCreateOpenAIConfigurationMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: Omit<OpenAIConfiguration, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      console.log('Creating OpenAI configuration:', config);
      const { data, error } = await supabase
        .from('openai_configurations')
        .insert([{
          ...config,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating OpenAI configuration:', error);
        throw error;
      }

      console.log('OpenAI configuration created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: openaiKeys.configurations() });
      toast({
        title: 'Configuration Created',
        description: 'OpenAI configuration has been saved successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Configuration Failed',
        description: error.message || 'Failed to create OpenAI configuration',
        variant: 'destructive',
      });
    },
  });
};

// Hook for updating OpenAI configurations
export const useUpdateOpenAIConfigurationMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<OpenAIConfiguration> }) => {
      console.log('Updating OpenAI configuration:', id, updates);
      const { data, error } = await supabase
        .from('openai_configurations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating OpenAI configuration:', error);
        throw error;
      }

      console.log('OpenAI configuration updated:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: openaiKeys.configurations() });
      toast({
        title: 'Configuration Updated',
        description: 'OpenAI configuration has been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update OpenAI configuration',
        variant: 'destructive',
      });
    },
  });
};

// Hook for creating OpenAI processing jobs
export const useCreateOpenAIJobMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { type: string; input: OpenAIGenerateRequest }): Promise<OpenAIProcessingJob> => {
      const job: OpenAIProcessingJob = {
        id: `openai-job-${Date.now()}`,
        type: data.type as any,
        status: 'queued',
        input: data.input,
        progress: 0,
        createdAt: new Date().toISOString(),
      };

      job.status = 'processing';
      job.progress = 50;

      try {
        const { data: response, error } = await supabase.functions.invoke('openai-generate', {
          body: data.input,
        });

        if (error || response?.error) {
          throw new Error(error?.message || response?.error || 'OpenAI processing failed');
        }

        job.status = 'completed';
        job.progress = 100;
        job.output = response;
        job.completedAt = new Date().toISOString();

        return job;
      } catch (error: any) {
        job.status = 'failed';
        job.error = error.message;
        job.completedAt = new Date().toISOString();
        throw error;
      }
    },
    onSuccess: (job) => {
      queryClient.invalidateQueries({ queryKey: openaiKeys.jobs() });
      toast({
        title: 'OpenAI Job Completed',
        description: `Job ${job.id} has been processed successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'OpenAI Job Failed',
        description: error.message || 'Failed to process OpenAI job',
        variant: 'destructive',
      });
    },
  });
};

// Mock queries for jobs (since we don't store them in database yet)
export const useOpenAIJobsQuery = () => {
  return useQuery({
    queryKey: openaiKeys.jobs(),
    queryFn: () => Promise.resolve([] as OpenAIProcessingJob[]),
    staleTime: 30000,
  });
};

export const useOpenAIJobQuery = (id: string) => {
  return useQuery({
    queryKey: openaiKeys.job(id),
    queryFn: () => Promise.resolve(null as OpenAIProcessingJob | null),
    enabled: !!id,
  });
};
