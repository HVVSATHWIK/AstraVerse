
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

// Enhanced mock AI engines to include both Gemini and OpenAI with updated metrics
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
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    type: 'text-generation',
    status: 'active',
    usage: {
      requests: 156,
      tokens: 45234,
      cost: 12.45
    },
    performance: {
      latency: 520,
      accuracy: 94,
      uptime: 99.8
    },
    config: {
      model: 'gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 2048,
      topP: 1.0,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0
    }
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    type: 'text-generation',
    status: 'active',
    usage: {
      requests: 89,
      tokens: 34567,
      cost: 28.90
    },
    performance: {
      latency: 890,
      accuracy: 98,
      uptime: 99.9
    },
    config: {
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 4096,
      topP: 1.0,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0
    }
  }
];

// Enhanced mock workflows to include both Gemini and OpenAI-powered workflows
const enhancedMockWorkflows = [
  ...mockWorkflows,
  {
    id: 'gemini-content-workflow',
    name: 'AI Content Generation (Gemini)',
    description: 'Generate high-quality content using Gemini AI',
    status: 'active',
    triggers: ['Manual', 'Schedule', 'Webhook'],
    actions: [
      { name: 'Content Analysis', type: 'gemini_ai' },
      { name: 'Content Generation', type: 'gemini_ai' },
      { name: 'Quality Review', type: 'gemini_ai' },
      { name: 'Content Delivery', type: 'integration' }
    ],
    executions: 89,
    successRate: 97,
    avgDuration: '3.2s',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'openai-content-workflow',
    name: 'AI Content Generation (OpenAI)',
    description: 'Generate creative content using OpenAI GPT models',
    status: 'active',
    triggers: ['Manual', 'Schedule', 'API Call'],
    actions: [
      { name: 'Prompt Engineering', type: 'openai_ai' },
      { name: 'Content Generation', type: 'openai_ai' },
      { name: 'Content Refinement', type: 'openai_ai' },
      { name: 'Content Publishing', type: 'integration' }
    ],
    executions: 124,
    successRate: 95,
    avgDuration: '2.8s',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'multi-ai-workflow',
    name: 'Multi-AI Analysis Pipeline',
    description: 'Compare results from both Gemini and OpenAI models',
    status: 'active',
    triggers: ['Data Upload', 'API Call'],
    actions: [
      { name: 'Data Preprocessing', type: 'data_transform' },
      { name: 'Gemini Analysis', type: 'gemini_ai' },
      { name: 'OpenAI Analysis', type: 'openai_ai' },
      { name: 'Results Comparison', type: 'data_analysis' },
      { name: 'Report Generation', type: 'document_generation' }
    ],
    executions: 67,
    successRate: 92,
    avgDuration: '8.5s',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// AI Engines - enhanced with both Gemini and OpenAI
export const useAIEngines = () => {
  return useQuery({
    queryKey: ['ai-engines'],
    queryFn: () => USE_MOCK_DATA ? Promise.resolve(enhancedMockAIEngines) : apiService.getAIEngines(),
    staleTime: 30000,
  });
};

// Workflows - use enhanced mock data with both Gemini and OpenAI workflows when not authenticated
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
