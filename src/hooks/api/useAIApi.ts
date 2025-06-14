
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/apiClient';
import { 
  AIGenerateRequest, 
  AIGenerateResponse, 
  AIProcessingJob, 
  APIResponse 
} from '@/types/api';
import { useToast } from '@/hooks/use-toast';

// Query Keys
export const aiKeys = {
  all: ['ai'] as const,
  jobs: () => [...aiKeys.all, 'jobs'] as const,
  job: (id: string) => [...aiKeys.jobs(), id] as const,
};

// Queries
export const useAIJobsQuery = () => {
  return useQuery({
    queryKey: aiKeys.jobs(),
    queryFn: () => apiClient.get<APIResponse<AIProcessingJob[]>>('/ai/jobs'),
    select: (response) => response.data?.data || [],
    refetchInterval: 2000, // Poll for job updates
  });
};

export const useAIJobQuery = (id: string) => {
  return useQuery({
    queryKey: aiKeys.job(id),
    queryFn: () => apiClient.get<APIResponse<AIProcessingJob>>(`/ai/jobs/${id}`),
    select: (response) => response.data?.data,
    enabled: !!id,
    refetchInterval: 1000, // Frequent polling for individual job
  });
};

// Mutations
export const useAIGenerateMutation = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: AIGenerateRequest) => 
      apiClient.post<APIResponse<AIGenerateResponse>>('/ai/generate', data),
    onSuccess: (response) => {
      toast({
        title: 'AI Generation Complete',
        description: 'Your AI request has been processed successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'AI Generation Failed',
        description: error.response?.data?.error?.message || 'Failed to generate AI response',
        variant: 'destructive',
      });
    },
  });
};

export const useCreateAIJobMutation = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: { type: string; input: Record<string, any> }) => 
      apiClient.post<APIResponse<AIProcessingJob>>('/ai/jobs', data),
    onSuccess: (response) => {
      toast({
        title: 'AI Job Created',
        description: `Job ${response.data?.data?.id} has been queued for processing.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Job Creation Failed',
        description: error.response?.data?.error?.message || 'Failed to create AI job',
        variant: 'destructive',
      });
    },
  });
};

