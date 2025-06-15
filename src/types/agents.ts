
export interface Agent {
  id: string;
  name: string;
  type: 'assistant' | 'analyzer' | 'executor' | 'monitor';
  status: 'active' | 'idle' | 'busy' | 'error' | 'offline';
  description: string;
  capabilities: string[];
  currentTask?: string;
  performance: {
    tasksCompleted: number;
    successRate: number;
    averageResponseTime: number;
    uptime: number;
  };
  config: {
    maxConcurrentTasks: number;
    timeout: number;
    retryAttempts: number;
    priority: 'low' | 'medium' | 'high';
  };
  createdAt: string;
  lastActive: string;
  metrics: {
    cpuUsage: number;
    memoryUsage: number;
    taskQueue: number;
  };
}

export interface AgentTask {
  id: string;
  agentId: string;
  type: 'analysis' | 'processing' | 'monitoring' | 'automation';
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  input?: Record<string, any>;
  output?: Record<string, any>;
  progress: number;
  estimatedDuration?: number;
  actualDuration?: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  retryCount: number;
  maxRetries: number;
}

export interface AgentEvent {
  id: string;
  agentId: string;
  type: 'start' | 'stop' | 'error' | 'task_complete' | 'status_change' | 'config_update';
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
  severity: 'info' | 'warning' | 'error' | 'success';
}

export interface AgentMetrics {
  agentId: string;
  timestamp: string;
  cpuUsage: number;
  memoryUsage: number;
  taskQueue: number;
  activeConnections: number;
  responseTime: number;
  throughput: number;
}

export interface AgentCluster {
  id: string;
  name: string;
  agents: Agent[];
  status: 'healthy' | 'degraded' | 'critical';
  totalTasks: number;
  activeTasks: number;
  averageLoad: number;
}

export interface AgentCommand {
  id: string;
  agentId: string;
  command: 'start' | 'stop' | 'restart' | 'pause' | 'resume' | 'configure' | 'assign_task';
  parameters?: Record<string, any>;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  issuedBy: string;
  issuedAt: string;
  executedAt?: string;
  result?: string;
}

export interface AgentStats {
  totalAgents: number;
  activeAgents: number;
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageResponseTime: number;
  systemLoad: number;
  uptime: string;
}
