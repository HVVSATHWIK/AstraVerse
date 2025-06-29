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
import { AIEngine, WorkflowDisplay, Integration, SystemMetrics, ActivityLog, KPIData, UserWorkflow } from '@/types';
import { useMetrics } from '@/hooks/api/useMetrics';

// Environment flag to use mock data during development
const USE_MOCK_DATA = import.meta.env.DEV;

// Enhanced mock AI engines to include Gemini with updated metrics
const enhancedMockAIEngines = [
  ...mockAIEngines,
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    type: 'text-generation',
    status: 'active',
    usage: {
      requests: 234,
      tokens: 67891,
      cost: 18.75
    },
    performance: {
      latency: 680,
      accuracy: 96,
      uptime: 99.9
    },
    config: {
      model: 'gemini-1.5-flash',
      temperature: 0.7,
      maxTokens: 2048,
      topK: 40,
      topP: 0.95,
      safetySettings: {
        harassment: 'BLOCK_MEDIUM_AND_ABOVE',
        hateSpeech: 'BLOCK_MEDIUM_AND_ABOVE',
        sexuallyExplicit: 'BLOCK_MEDIUM_AND_ABOVE',
        dangerousContent: 'BLOCK_MEDIUM_AND_ABOVE'
      }
    }
  }
];

// Enhanced mock workflows to match UserWorkflow type with steps property
const enhancedMockWorkflows: UserWorkflow[] = [
  {
    id: 'gemini-content-workflow',
    name: 'AI Content Generation (Gemini)',
    description: 'Generate high-quality content using Gemini AI',
    status: 'active',
    config: {
      steps: [
        { id: '1', type: 'trigger', name: 'Manual Trigger', config: {} },
        { id: '2', type: 'action', name: 'Content Analysis', config: { type: 'gemini_ai' } },
        { id: '3', type: 'action', name: 'Content Generation', config: { type: 'gemini_ai' } },
        { id: '4', type: 'action', name: 'Quality Review', config: { type: 'gemini_ai' } },
        { id: '5', type: 'action', name: 'Content Delivery', config: { type: 'integration' } }
      ]
    },
    user_id: 'mock-user-id',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'ai-analysis-workflow',
    name: 'AI Analysis Pipeline',
    description: 'Automated content analysis using Gemini AI',
    status: 'active',
    config: {
      steps: [
        { id: '1', type: 'trigger', name: 'Data Upload', config: {} },
        { id: '2', type: 'action', name: 'Data Preprocessing', config: { type: 'data_transform' } },
        { id: '3', type: 'action', name: 'Gemini Analysis', config: { type: 'gemini_ai' } },
        { id: '4', type: 'action', name: 'Results Processing', config: { type: 'data_analysis' } },
        { id: '5', type: 'action', name: 'Report Generation', config: { type: 'document_generation' } }
      ]
    },
    user_id: 'mock-user-id',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Convert existing mockWorkflows to UserWorkflow format
  ...mockWorkflows.map((workflow): UserWorkflow => ({
    id: workflow.id,
    name: workflow.name,
    description: workflow.description,
    status: workflow.status as 'active' | 'paused' | 'error',
    config: {
      steps: [
        // Convert triggers to trigger steps
        ...workflow.triggers.map((trigger, index) => ({
          id: `trigger-${index}`,
          type: 'trigger' as const,
          name: trigger,
          config: {}
        })),
        // Convert actions to action steps
        ...workflow.actions.map((action, index) => ({
          id: `action-${index}`,
          type: 'action' as const,
          name: typeof action === 'string' ? action : action.name,
          config: { type: typeof action === 'string' ? 'default' : action.type }
        }))
      ]
    },
    user_id: 'mock-user-id',
    created_at: workflow.createdAt,
    updated_at: workflow.updatedAt,
  }))
];

// AI Engines - enhanced with Gemini
export const useAIEngines = () => {
  return useQuery({
    queryKey: ['ai-engines'],
    queryFn: () => USE_MOCK_DATA ? Promise.resolve(enhancedMockAIEngines) : apiService.getAIEngines(),
    staleTime: 30000,
  });
};

// Workflows - use enhanced mock data with Gemini workflows when not authenticated
export const useWorkflows = () => {
  const { user } = useAuth();
  const realDataQuery = useUserWorkflows();
  const mockDataQuery = useQuery({
    queryKey: ['workflows-mock'],
    queryFn: () => Promise.resolve(enhancedMockWorkflows),
    staleTime: 30000,
    enabled: !user,
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

// System metrics and KPIs - use real data when authenticated, mock data otherwise
export const useSystemMetrics = (timeRange: '1h' | '24h' | '7d' | '30d' = '24h') => {
  return useQuery({
    queryKey: ['system-metrics', timeRange],
    queryFn: () => USE_MOCK_DATA ? Promise.resolve(mockSystemMetrics) : apiService.getSystemMetrics(timeRange),
    refetchInterval: 60000,
  });
};

export const useKPIs = () => {
  const { user } = useAuth();
  const realDataQuery = useMetrics();
  const mockDataQuery = useQuery({
    queryKey: ['kpis-mock'],
    queryFn: () => Promise.resolve(mockKPIData),
    staleTime: 300000,
    enabled: !user,
  });

  if (user) {
    return realDataQuery;
  }
  return mockDataQuery;
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