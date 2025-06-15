
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from './api';
import { 
  mockAIEngines, 
  mockWorkflows, 
  mockIntegrations, 
  mockSystemMetrics, 
  mockActivityLogs, 
  mockKPIData 
} from './mockData';
import { 
  useUserWorkflows, 
  useUserIntegrations, 
  useUserActivityLogs,
  useCreateWorkflow,
  useUpdateWorkflow,
  useCreateIntegration,
  useLogActivity
} from './supabaseDataService';
import { useAuth } from '@/hooks/useAuth';
import { AIEngine, Workflow, Integration, SystemMetrics, ActivityLog, KPIData } from '@/types';

// Environment flag to use mock data during development
const USE_MOCK_DATA = import.meta.env.DEV;

// AI Engines - still using mock data as this is system-level data
export const useAIEngines = () => {
  return useQuery({
    queryKey: ['ai-engines'],
    queryFn: () => USE_MOCK_DATA ? Promise.resolve(mockAIEngines) : apiService.getAIEngines(),
    staleTime: 30000,
  });
};

// Workflows - use real data when authenticated, mock data otherwise
export const useWorkflows = () => {
  const { user } = useAuth();
  const realDataQuery = useUserWorkflows();
  const mockDataQuery = useQuery({
    queryKey: ['workflows-mock'],
    queryFn: () => Promise.resolve(mockWorkflows),
    staleTime: 30000,
    enabled: !user, // Only run when not authenticated
  });

  if (user) {
    return realDataQuery;
  }
  return mockDataQuery;
};

// Integrations - use real data when authenticated, mock data otherwise
export const useIntegrations = () => {
  const { user } = useAuth();
  const realDataQuery = useUserIntegrations();
  const mockDataQuery = useQuery({
    queryKey: ['integrations-mock'],
    queryFn: () => Promise.resolve(mockIntegrations),
    staleTime: 30000,
    enabled: !user,
  });

  if (user) {
    return realDataQuery;
  }
  return mockDataQuery;
};

// Activity Logs - use real data when authenticated, mock data otherwise
export const useActivityLogs = (limit: number = 50) => {
  const { user } = useAuth();
  const realDataQuery = useUserActivityLogs(limit);
  const mockDataQuery = useQuery({
    queryKey: ['activity-logs-mock', limit],
    queryFn: () => Promise.resolve(mockActivityLogs),
    refetchInterval: 30000,
    enabled: !user,
  });

  if (user) {
    return realDataQuery;
  }
  return mockDataQuery;
};

// System metrics and KPIs - still using mock data as this is system-level
export const useSystemMetrics = (timeRange: '1h' | '24h' | '7d' | '30d' = '24h') => {
  return useQuery({
    queryKey: ['system-metrics', timeRange],
    queryFn: () => USE_MOCK_DATA ? Promise.resolve(mockSystemMetrics) : apiService.getSystemMetrics(timeRange),
    refetchInterval: 60000,
  });
};

export const useKPIs = () => {
  return useQuery({
    queryKey: ['kpis'],
    queryFn: () => USE_MOCK_DATA ? Promise.resolve(mockKPIData) : apiService.getKPIs(),
    staleTime: 300000,
  });
};

// Export the real data mutations for authenticated users
export { useCreateWorkflow, useUpdateWorkflow, useCreateIntegration, useLogActivity };

// Legacy mutation hooks for backward compatibility
export const useUpdateIntegration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Integration> }) => 
      USE_MOCK_DATA ? Promise.resolve({ ...mockIntegrations.find(i => i.id === id)!, ...data }) : apiService.updateIntegration(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      queryClient.invalidateQueries({ queryKey: ['user-integrations'] });
    },
  });
};

export const useExecuteWorkflow = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: Record<string, any> }) => 
      USE_MOCK_DATA ? Promise.resolve({ executionId: `exec-${Date.now()}` }) : apiService.executeWorkflow(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      queryClient.invalidateQueries({ queryKey: ['user-workflows'] });
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
      queryClient.invalidateQueries({ queryKey: ['user-activity-logs'] });
    },
  });
};

export const useTestIntegration = () => {
  return useMutation({
    mutationFn: (id: string) => 
      USE_MOCK_DATA ? Promise.resolve({ success: true, message: 'Mock test successful' }) : apiService.testIntegration(id),
  });
};
