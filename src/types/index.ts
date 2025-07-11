export interface AIEngine {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'scaling';
  description: string;
  version: string;
  lastUpdated: string;
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
  type?: string;
  integration_type?: string;
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

// Re-export workflow types from core-workflow-types.ts with renamed identifier
export type { CoreWorkflow as UserWorkflow, WorkflowDisplay } from './core-workflow-types';

// Re-export workflow API types from api.ts
export type {
  WorkflowCreateRequest,
  WorkflowUpdateRequest,
  WorkflowExecuteRequest,
  WorkflowExecuteResponse,
  WorkflowTrigger,
  WorkflowAction
} from './api';