
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GeminiGenerateRequest, GeminiGenerateResponse, GeminiProcessingJob } from '@/types/gemini';
import { useToast } from '@/hooks/use-toast';

// Query Keys
export const geminiKeys = {
  all: ['gemini'] as const,
  jobs: () => [...geminiKeys.all, 'jobs'] as const,
  job: (id: string) => [...geminiKeys.jobs(), id] as const,
};

// Custom hook for Gemini AI generation
export const useGeminiGenerateMutation = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: GeminiGenerateRequest): Promise<GeminiGenerateResponse> => {
      console.log('Calling Gemini AI function with:', data);
      
      const { data: response, error } = await supabase.functions.invoke('gemini-ai', {
        body: data,
      });

      if (error) {
        console.error('Gemini function error:', error);
        throw new Error(error.message || 'Failed to generate content with Gemini');
      }

      if (response?.error) {
        console.error('Gemini API error:', response.error);
        throw new Error(response.error);
      }

      return response;
    },
    onSuccess: (response) => {
      toast({
        title: 'Gemini AI Generation Complete',
        description: `Generated ${response.content.length} characters successfully.`,
      });
    },
    onError: (error: any) => {
      console.error('Gemini generation error:', error);
      toast({
        title: 'Gemini AI Generation Failed',
        description: error.message || 'Failed to generate content with Gemini AI',
        variant: 'destructive',
      });
    },
  });
};

// Hook for creating AI processing jobs with Gemini
export const useCreateGeminiJobMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { type: string; input: GeminiGenerateRequest }): Promise<GeminiProcessingJob> => {
      // Create a job record first
      const job: GeminiProcessingJob = {
        id: `gemini-job-${Date.now()}`,
        type: data.type as any,
        status: 'queued',
        input: data.input,
        progress: 0,
        createdAt: new Date().toISOString(),
      };

      // Update job status to processing
      job.status = 'processing';
      job.progress = 50;

      try {
        // Call Gemini AI
        const { data: response, error } = await supabase.functions.invoke('gemini-ai', {
          body: data.input,
        });

        if (error || response?.error) {
          throw new Error(error?.message || response?.error || 'Gemini processing failed');
        }

        // Update job as completed
        job.status = 'completed';
        job.progress = 100;
        job.output = response;
        job.completedAt = new Date().toISOString();

        return job;
      } catch (error: any) {
        // Update job as failed
        job.status = 'failed';
        job.error = error.message;
        job.completedAt = new Date().toISOString();
        throw error;
      }
    },
    onSuccess: (job) => {
      queryClient.invalidateQueries({ queryKey: geminiKeys.jobs() });
      toast({
        title: 'Gemini Job Completed',
        description: `Job ${job.id} has been processed successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Gemini Job Failed',
        description: error.message || 'Failed to process Gemini job',
        variant: 'destructive',
      });
    },
  });
};

// Mock query for Gemini jobs (since we don't store them in database yet)
export const useGeminiJobsQuery = () => {
  return useQuery({
    queryKey: geminiKeys.jobs(),
    queryFn: () => Promise.resolve([] as GeminiProcessingJob[]),
    staleTime: 30000,
  });
};

export const useGeminiJobQuery = (id: string) => {
  return useQuery({
    queryKey: geminiKeys.job(id),
    queryFn: () => Promise.resolve(null as GeminiProcessingJob | null),
    enabled: !!id,
  });
};
