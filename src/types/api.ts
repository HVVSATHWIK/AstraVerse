
// API Contract Definitions for AstraAI Backend

// Common API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: APIError;
  timestamp: string;
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  traceId?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Authentication & Authorization
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'viewer';
  permissions: string[];
  tenantId: string;
  createdAt: string;
  lastLogin?: string;
}

// Workflow Engine API (/api/workflows)
export interface WorkflowCreateRequest {
  name: string;
  description: string;
  triggers: WorkflowTrigger[];
  actions: WorkflowAction[];
  config?: Record<string, any>;
}

export interface WorkflowUpdateRequest {
  name?: string;
  description?: string;
  status?: 'active' | 'paused' | 'error';
  triggers?: WorkflowTrigger[];
  actions?: WorkflowAction[];
  config?: Record<string, any>;
}

export interface WorkflowExecuteRequest {
  payload?: Record<string, any>;
  async?: boolean;
  dryRun?: boolean;
}

export interface WorkflowExecuteResponse {
  executionId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: string;
  estimatedDuration?: number;
  result?: Record<string, any>;
}

export interface WorkflowTrigger {
  id: string;
  type: 'webhook' | 'schedule' | 'event' | 'manual';
  config: Record<string, any>;
  enabled: boolean;
}

export interface WorkflowAction {
  id: string;
  type: 'ai_process' | 'integration_call' | 'notification' | 'data_transform';
  config: Record<string, any>;
  order: number;
  enabled: boolean;
}

// AI Orchestration API (/api/ai)
export interface AIGenerateRequest {
  prompt: string;
  context?: Record<string, any>;
  model?: 'gpt-4' | 'claude-3' | 'custom';
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface AIGenerateResponse {
  id: string;
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason: 'stop' | 'length' | 'content_filter';
  createdAt: string;
}

export interface AIProcessingJob {
  id: string;
  type: 'transcription' | 'analysis' | 'generation' | 'classification';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  input: Record<string, any>;
  output?: Record<string, any>;
  progress?: number;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

// Integration Gateway API (/api/integrations)
export interface IntegrationConfig {
  id: string;
  type: 'zoom' | 'slack' | 'jira' | 'mongodb' | 'influxdb' | 'milvus';
  name: string;
  enabled: boolean;
  config: Record<string, any>;
  lastSync?: string;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  metrics?: Record<string, number>;
}

export interface IntegrationTestRequest {
  integrationId: string;
  testType?: 'connection' | 'auth' | 'data';
}

export interface IntegrationTestResponse {
  success: boolean;
  message: string;
  latency?: number;
  details?: Record<string, any>;
}

export interface ZoomMeetingData {
  meetingId: string;
  title: string;
  startTime: string;
  duration: number;
  participants: string[];
  recordingUrl?: string;
  transcriptUrl?: string;
}

export interface SlackMessageData {
  channel: string;
  user: string;
  text: string;
  timestamp: string;
  threadTs?: string;
  attachments?: any[];
}

export interface JiraTicketData {
  key: string;
  summary: string;
  description: string;
  status: string;
  priority: string;
  assignee?: string;
  reporter: string;
  created: string;
  updated: string;
}

// Metrics & Analytics API (/api/metrics)
export interface MetricsQuery {
  timeRange: {
    start: string;
    end: string;
  };
  metrics: string[];
  groupBy?: string[];
  filters?: Record<string, any>;
}

export interface MetricsResponse {
  metrics: MetricData[];
  timeRange: {
    start: string;
    end: string;
  };
  granularity: string;
}

export interface MetricData {
  name: string;
  values: MetricValue[];
  unit: string;
  type: 'counter' | 'gauge' | 'histogram';
}

export interface MetricValue {
  timestamp: string;
  value: number;
  labels?: Record<string, string>;
}

// Pilot Features API (/api/pilot)
export interface PilotFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
  targetUsers?: string[];
  config?: Record<string, any>;
  createdAt: string;
}

export interface PilotAnalytics {
  featureId: string;
  metrics: {
    adoption: number;
    usage: number;
    feedback: number;
    performance: number;
  };
  trends: {
    daily: MetricValue[];
    weekly: MetricValue[];
  };
}

// Real-time Events (WebSocket)
export interface WebSocketMessage {
  type: 'workflow_status' | 'ai_progress' | 'integration_sync' | 'metric_update';
  payload: Record<string, any>;
  timestamp: string;
  id: string;
}

export interface WorkflowStatusEvent {
  workflowId: string;
  executionId: string;
  status: 'started' | 'progress' | 'completed' | 'failed';
  progress?: number;
  message?: string;
}

export interface AIProgressEvent {
  jobId: string;
  progress: number;
  stage: string;
  estimatedTimeRemaining?: number;
}

// API Endpoints Configuration
export interface APIEndpoints {
  // Authentication
  login: '/api/auth/login';
  refresh: '/api/auth/refresh';
  logout: '/api/auth/logout';
  profile: '/api/auth/profile';

  // Workflows
  workflows: '/api/workflows';
  workflowById: '/api/workflows/:id';
  executeWorkflow: '/api/workflows/:id/execute';
  workflowExecutions: '/api/workflows/:id/executions';

  // AI Services
  aiGenerate: '/api/ai/generate';
  aiJobs: '/api/ai/jobs';
  aiJobById: '/api/ai/jobs/:id';

  // Integrations
  integrations: '/api/integrations';
  integrationById: '/api/integrations/:id';
  testIntegration: '/api/integrations/:id/test';
  syncIntegration: '/api/integrations/:id/sync';

  // Metrics
  metrics: '/api/metrics';
  kpis: '/api/metrics/kpis';
  systemHealth: '/api/metrics/health';

  // Pilot Features
  pilotFeatures: '/api/pilot/features';
  pilotAnalytics: '/api/pilot/analytics/:featureId';

  // WebSocket
  websocket: '/ws';
}

