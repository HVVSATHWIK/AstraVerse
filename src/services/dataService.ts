
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
import { AIEngine, Workflow, Integration, SystemMetrics, ActivityLog, KPIData } from '@/types';

// Environment flag to use mock data during development
const USE_MOCK_DATA = import.meta.env.DEV;

// Query hooks for data fetching
export const useAIEngines = () => {
  return useQuery({
    queryKey: ['ai-engines'],
    queryFn: () => USE_MOCK_DATA ? Promise.resolve(mockAIEngines) : apiService.getAIEngines(),
    staleTime: 30000, // 30 seconds
  });
};

export const useWorkflows = () => {
  return useQuery({
    queryKey: ['workflows'],
    queryFn: () => USE_MOCK_DATA ? Promise.resolve(mockWorkflows) : apiService.getWorkflows(),
    staleTime: 30000,
  });
};

export const useIntegrations = () => {
  return useQuery({
    queryKey: ['integrations'],
    queryFn: () => USE_MOCK_DATA ? Promise.resolve(mockIntegrations) : apiService.getIntegrations(),
    staleTime: 30000,
  });
};

export const useSystemMetrics = (timeRange: '1h' | '24h' | '7d' | '30d' = '24h') => {
  return useQuery({
    queryKey: ['system-metrics', timeRange],
    queryFn: () => USE_MOCK_DATA ? Promise.resolve(mockSystemMetrics) : apiService.getSystemMetrics(timeRange),
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useActivityLogs = (limit: number = 50) => {
  return useQuery({
    queryKey: ['activity-logs', limit],
    queryFn: () => USE_MOCK_DATA ? Promise.resolve(mockActivityLogs) : apiService.getActivityLogs(limit),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useKPIs = () => {
  return useQuery({
    queryKey: ['kpis'],
    queryFn: () => USE_MOCK_DATA ? Promise.resolve(mockKPIData) : apiService.getKPIs(),
    staleTime: 300000, // 5 minutes
  });
};

// Mutation hooks for data modifications
export const useUpdateWorkflow = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Workflow> }) => 
      USE_MOCK_DATA ? Promise.resolve({ ...mockWorkflows.find(w => w.id === id)!, ...data }) : apiService.updateWorkflow(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
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
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
    },
  });
};

export const useUpdateIntegration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Integration> }) => 
      USE_MOCK_DATA ? Promise.resolve({ ...mockIntegrations.find(i => i.id === id)!, ...data }) : apiService.updateIntegration(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
    },
  });
};

export const useTestIntegration = () => {
  return useMutation({
    mutationFn: (id: string) => 
      USE_MOCK_DATA ? Promise.resolve({ success: true, message: 'Mock test successful' }) : apiService.testIntegration(id),
  });
};
