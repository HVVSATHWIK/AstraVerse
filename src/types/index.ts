export interface AIEngine {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'scaling';
  description: string;
  version: string;
  lastUpdated: string;
}

export interface Workflow {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  steps: any[];
  status: 'draft' | 'active' | 'paused' | 'error';
  created_at: string;
  updated_at: string;
}

export interface WorkflowDisplay {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'error';
  triggers: string[];
  actions: string[];
  runs: number;
  executions?: number;
  successRate: number;
  averageDuration: number;
  avgDuration?: string;
  lastRun?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'warning';
  icon: string;
  metrics: Record<string, string | number>;
  config: Record<string, any>;
  lastSync?: string;
}

export interface SystemMetrics {
  timestamp: string;
  throughput: number;
  latency: number;
  responseTime: number;
  errors: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
  storageUsage: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'transcription' | 'alert' | 'automation' | 'report';
  message: string;
  status: 'success' | 'warning' | 'error';
  metadata?: Record<string, any>;
}

export interface KPIData {
  meetingReduction: number;
  taskCompletion: number;
  taskCompletionRate: number;
  responseLatency: number;
  avgResponseTime: number;
  customerSatisfaction: number;
  automationRate: number;
  activeEngines: number;
  activeWorkflows: number;
  throughput: string;
  throughputStatus: 'error' | 'warning' | 'healthy';
  responseTimeStatus: 'error' | 'warning' | 'healthy';
  cpuUsage: number;
  memoryUsage: number;
  storageUsage: number;
}

// Re-export workflow API types from api.ts
export type {
  WorkflowCreateRequest,
  WorkflowUpdateRequest,
  WorkflowExecuteRequest,
  WorkflowExecuteResponse,
  WorkflowTrigger,
  WorkflowAction
} from './api';

// Explicit exports to ensure bundler compatibility
export { Workflow };