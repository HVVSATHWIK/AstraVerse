import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define the metrics data structure
export interface MetricsData {
  meetingReduction: number;
  taskCompletionRate: number;
  avgResponseTime: number;
  customerSatisfaction: number;
  activeWorkflows?: number;
  activeAgents?: number;
  totalTasks?: number;
  completedTasks?: number;
  cpuUsage?: number;
  memoryUsage?: number;
  storageUsage?: number;
  [key: string]: number | undefined;
}

// Query keys for React Query
const metricsKeys = {
  all: ['metrics'] as const,
  latest: () => [...metricsKeys.all, 'latest'] as const,
  byDate: (startDate: string, endDate: string) => 
    [...metricsKeys.all, 'byDate', startDate, endDate] as const,
};

/**
 * Hook to fetch the latest metrics for the current user
 */
export const useMetrics = () => {
  return useQuery({
    queryKey: metricsKeys.latest(),
    queryFn: async () => {
      // Get the latest metrics for each metric_name
      const { data, error } = await supabase
        .rpc('get_latest_metrics', {
          p_user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) {
        console.error('Error fetching metrics:', error);
        throw error;
      }

      // Convert the array of metrics to an object
      const metricsObject: MetricsData = {
        meetingReduction: 0,
        taskCompletionRate: 0,
        avgResponseTime: 0,
        customerSatisfaction: 0
      };

      data?.forEach(metric => {
        metricsObject[metric.metric_name] = Number(metric.metric_value);
      });

      return metricsObject;
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  });
};

/**
 * Hook to fetch metrics for a specific date range
 */
export const useMetricsByDate = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: metricsKeys.byDate(startDate, endDate),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('metrics')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching metrics by date:', error);
        throw error;
      }

      return data;
    },
    staleTime: 300000, // 5 minutes
  });
};

/**
 * Hook to update a metric
 */
export const useUpdateMetric = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      metricName, 
      value 
    }: { 
      metricName: string; 
      value: number 
    }) => {
      const { data, error } = await supabase
        .from('metrics')
        .insert([{
          user_id: (await supabase.auth.getUser()).data.user?.id,
          metric_name: metricName,
          metric_value: value
        }]);

      if (error) {
        console.error('Error updating metric:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: metricsKeys.all });
      toast({
        title: 'Metric Updated',
        description: 'The metric has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'Failed to update metric',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook to seed initial metrics for a new user
 */
export const useSeedInitialMetrics = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Initial metrics to seed
      const initialMetrics = [
        { metric_name: 'meetingReduction', metric_value: 23 },
        { metric_name: 'taskCompletionRate', metric_value: 87 },
        { metric_name: 'avgResponseTime', metric_value: 147 },
        { metric_name: 'customerSatisfaction', metric_value: 92 },
        { metric_name: 'activeWorkflows', metric_value: 5 },
        { metric_name: 'activeAgents', metric_value: 3 },
        { metric_name: 'totalTasks', metric_value: 120 },
        { metric_name: 'completedTasks', metric_value: 104 },
      ];

      // Insert all metrics
      const { data, error } = await supabase
        .from('metrics')
        .insert(initialMetrics.map(metric => ({
          user_id: userId,
          metric_name: metric.metric_name,
          metric_value: metric.metric_value
        })));

      if (error) {
        console.error('Error seeding initial metrics:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: metricsKeys.all });
      toast({
        title: 'Metrics Initialized',
        description: 'Initial metrics have been set up for your dashboard.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Initialization Failed',
        description: error instanceof Error ? error.message : 'Failed to initialize metrics',
        variant: 'destructive',
      });
    },
  });
};