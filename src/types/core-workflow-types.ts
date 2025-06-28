// Core workflow type definitions
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