
import { Agent, AgentTask, AgentEvent, AgentStats, AgentCluster } from '@/types/agents';

export const mockAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Meeting Assistant',
    type: 'assistant',
    status: 'active',
    description: 'Handles meeting transcription and analysis',
    capabilities: ['transcription', 'sentiment-analysis', 'action-items', 'summarization'],
    currentTask: 'Transcribing Zoom meeting',
    performance: {
      tasksCompleted: 156,
      successRate: 94.2,
      averageResponseTime: 1.8,
      uptime: 99.1
    },
    config: {
      maxConcurrentTasks: 5,
      timeout: 30000,
      retryAttempts: 3,
      priority: 'high'
    },
    createdAt: '2024-05-01T10:00:00Z',
    lastActive: '2024-06-15T12:30:00Z',
    metrics: {
      cpuUsage: 45,
      memoryUsage: 67,
      taskQueue: 3
    }
  },
  {
    id: 'agent-2',
    name: 'Data Analyzer',
    type: 'analyzer',
    status: 'busy',
    description: 'Analyzes customer data and generates insights',
    capabilities: ['data-analysis', 'pattern-recognition', 'reporting', 'ml-inference'],
    currentTask: 'Processing customer churn analysis',
    performance: {
      tasksCompleted: 89,
      successRate: 91.7,
      averageResponseTime: 4.2,
      uptime: 97.8
    },
    config: {
      maxConcurrentTasks: 3,
      timeout: 60000,
      retryAttempts: 2,
      priority: 'medium'
    },
    createdAt: '2024-04-15T14:30:00Z',
    lastActive: '2024-06-15T12:25:00Z',
    metrics: {
      cpuUsage: 78,
      memoryUsage: 82,
      taskQueue: 5
    }
  },
  {
    id: 'agent-3',
    name: 'Workflow Executor',
    type: 'executor',
    status: 'idle',
    description: 'Executes automated workflows and tasks',
    capabilities: ['workflow-execution', 'api-integration', 'task-automation', 'scheduling'],
    performance: {
      tasksCompleted: 234,
      successRate: 96.8,
      averageResponseTime: 2.1,
      uptime: 98.5
    },
    config: {
      maxConcurrentTasks: 8,
      timeout: 45000,
      retryAttempts: 4,
      priority: 'high'
    },
    createdAt: '2024-03-20T09:15:00Z',
    lastActive: '2024-06-15T12:28:00Z',
    metrics: {
      cpuUsage: 23,
      memoryUsage: 34,
      taskQueue: 0
    }
  },
  {
    id: 'agent-4',
    name: 'System Monitor',
    type: 'monitor',
    status: 'active',
    description: 'Monitors system health and performance',
    capabilities: ['system-monitoring', 'alerting', 'health-checks', 'diagnostics'],
    currentTask: 'Monitoring API response times',
    performance: {
      tasksCompleted: 1024,
      successRate: 99.2,
      averageResponseTime: 0.5,
      uptime: 99.9
    },
    config: {
      maxConcurrentTasks: 10,
      timeout: 10000,
      retryAttempts: 5,
      priority: 'high'
    },
    createdAt: '2024-02-10T08:00:00Z',
    lastActive: '2024-06-15T12:31:00Z',
    metrics: {
      cpuUsage: 15,
      memoryUsage: 28,
      taskQueue: 1
    }
  },
  {
    id: 'agent-5',
    name: 'Integration Bot',
    type: 'executor',
    status: 'error',
    description: 'Manages external service integrations',
    capabilities: ['api-calls', 'data-sync', 'webhook-handling', 'error-recovery'],
    performance: {
      tasksCompleted: 67,
      successRate: 87.3,
      averageResponseTime: 3.4,
      uptime: 89.2
    },
    config: {
      maxConcurrentTasks: 4,
      timeout: 20000,
      retryAttempts: 3,
      priority: 'medium'
    },
    createdAt: '2024-06-01T16:45:00Z',
    lastActive: '2024-06-15T11:15:00Z',
    metrics: {
      cpuUsage: 0,
      memoryUsage: 12,
      taskQueue: 0
    }
  }
];

export const mockAgentTasks: AgentTask[] = [
  {
    id: 'task-1',
    agentId: 'agent-1',
    type: 'processing',
    status: 'running',
    priority: 'high',
    title: 'Transcribe Team Standup',
    description: 'Process audio from daily standup meeting',
    progress: 65,
    estimatedDuration: 300,
    createdAt: '2024-06-15T12:25:00Z',
    startedAt: '2024-06-15T12:26:00Z',
    retryCount: 0,
    maxRetries: 3
  },
  {
    id: 'task-2',
    agentId: 'agent-2',
    type: 'analysis',
    status: 'completed',
    priority: 'medium',
    title: 'Customer Sentiment Analysis',
    description: 'Analyze customer feedback sentiment trends',
    progress: 100,
    estimatedDuration: 480,
    actualDuration: 456,
    createdAt: '2024-06-15T11:30:00Z',
    startedAt: '2024-06-15T11:31:00Z',
    completedAt: '2024-06-15T11:38:36Z',
    retryCount: 0,
    maxRetries: 2
  },
  {
    id: 'task-3',
    agentId: 'agent-3',
    type: 'automation',
    status: 'queued',
    priority: 'low',
    title: 'Update Slack Notifications',
    description: 'Send weekly summary to team channels',
    progress: 0,
    estimatedDuration: 120,
    createdAt: '2024-06-15T12:30:00Z',
    retryCount: 0,
    maxRetries: 4
  },
  {
    id: 'task-4',
    agentId: 'agent-4',
    type: 'monitoring',
    status: 'running',
    priority: 'urgent',
    title: 'Database Health Check',
    description: 'Monitor database performance metrics',
    progress: 30,
    estimatedDuration: 60,
    createdAt: '2024-06-15T12:29:00Z',
    startedAt: '2024-06-15T12:29:30Z',
    retryCount: 0,
    maxRetries: 5
  },
  {
    id: 'task-5',
    agentId: 'agent-5',
    type: 'processing',
    status: 'failed',
    priority: 'medium',
    title: 'Sync CRM Data',
    description: 'Synchronize customer data with external CRM',
    progress: 45,
    estimatedDuration: 240,
    createdAt: '2024-06-15T11:45:00Z',
    startedAt: '2024-06-15T11:46:00Z',
    error: 'API rate limit exceeded',
    retryCount: 2,
    maxRetries: 3
  }
];

export const mockAgentEvents: AgentEvent[] = [
  {
    id: 'event-1',
    agentId: 'agent-1',
    type: 'task_complete',
    message: 'Successfully completed meeting transcription',
    timestamp: '2024-06-15T12:20:00Z',
    severity: 'success',
    metadata: { taskId: 'task-prev-1', duration: 280 }
  },
  {
    id: 'event-2',
    agentId: 'agent-2',
    type: 'start',
    message: 'Agent started processing customer data',
    timestamp: '2024-06-15T12:18:00Z',
    severity: 'info'
  },
  {
    id: 'event-3',
    agentId: 'agent-5',
    type: 'error',
    message: 'Failed to connect to external API',
    timestamp: '2024-06-15T11:47:00Z',
    severity: 'error',
    metadata: { errorCode: 'RATE_LIMIT', retryIn: 300 }
  },
  {
    id: 'event-4',
    agentId: 'agent-4',
    type: 'status_change',
    message: 'Agent status changed to active',
    timestamp: '2024-06-15T12:15:00Z',
    severity: 'info'
  },
  {
    id: 'event-5',
    agentId: 'agent-3',
    type: 'config_update',
    message: 'Updated max concurrent tasks to 8',
    timestamp: '2024-06-15T10:30:00Z',
    severity: 'info',
    metadata: { previousValue: 6, newValue: 8 }
  }
];

export const mockAgentStats: AgentStats = {
  totalAgents: 5,
  activeAgents: 3,
  totalTasks: 1247,
  completedTasks: 1156,
  failedTasks: 23,
  averageResponseTime: 2.4,
  systemLoad: 45.2,
  uptime: '15d 8h 42m'
};

export const mockAgentClusters: AgentCluster[] = [
  {
    id: 'cluster-1',
    name: 'Processing Cluster',
    agents: [mockAgents[0], mockAgents[1]],
    status: 'healthy',
    totalTasks: 245,
    activeTasks: 8,
    averageLoad: 56.5
  },
  {
    id: 'cluster-2',
    name: 'Automation Cluster',
    agents: [mockAgents[2], mockAgents[4]],
    status: 'degraded',
    totalTasks: 301,
    activeTasks: 3,
    averageLoad: 23.1
  },
  {
    id: 'cluster-3',
    name: 'Monitoring Cluster',
    agents: [mockAgents[3]],
    status: 'healthy',
    totalTasks: 1024,
    activeTasks: 1,
    averageLoad: 15.0
  }
];
