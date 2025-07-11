// Core workflow type definitions
export interface CoreWorkflow {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  config: {
    steps?: any[];
  };
  status: 'draft' | 'active' | 'paused' | 'error';
  runs?: number;
  successRate?: number;
  created_at: string;
  updated_at: string;
}

export interface WorkflowDisplay {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'error';
  triggers: string[];
  actions: Array<{name: string; type: string}>;
  runs: number;
  executions?: number;
  successRate: number;
  averageDuration: number;
  avgDuration?: string;
  lastRun?: string;
  createdAt: string;
  updatedAt: string;
}