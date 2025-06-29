import { AIEngine, WorkflowDisplay, Integration, SystemMetrics, ActivityLog, KPIData } from '@/types';

export const mockAIEngines: AIEngine[] = [
  {
    id: 'drools-1',
    name: 'Drools Engine',
    status: 'active',
    description: 'Rule-based decision engine for business logic',
    version: '8.44.0',
    lastUpdated: '2024-06-14T10:30:00Z'
  },
  {
    id: 'llm-1',
    name: 'LLM Pipeline',
    status: 'active',
    description: 'Large Language Model processing pipeline',
    version: '2.1.3',
    lastUpdated: '2024-06-14T09:15:00Z'
  },
  {
    id: 'multimodal-1',
    name: 'Multi-modal Processor',
    status: 'active',
    description: 'Audio, video, and text processing engine',
    version: '1.7.2',
    lastUpdated: '2024-06-14T08:45:00Z'
  },
  {
    id: 'vector-1',
    name: 'Vector Embeddings',
    status: 'scaling',
    description: 'Semantic search and similarity matching',
    version: '3.2.1',
    lastUpdated: '2024-06-14T11:00:00Z'
  }
];

export const mockWorkflows: WorkflowDisplay[] = [
  {
    id: 'wf-1',
    name: 'Meeting Optimization',
    description: 'Automated transcription, analysis, and action item generation',
    status: 'active',
    triggers: ['Zoom Meeting Start', 'Calendar Event'],
    actions: [
      { name: 'Transcribe Audio', type: 'transcription' },
      { name: 'Generate Summary', type: 'generation' },
      { name: 'Create Action Items', type: 'extraction' },
      { name: 'Send Slack Notification', type: 'notification' }
    ],
    runs: 156,
    successRate: 94,
    averageDuration: 2.3,
    lastRun: '2024-06-14T11:30:00Z',
    createdAt: '2024-05-01T10:00:00Z',
    updatedAt: '2024-06-14T11:30:00Z'
  },
  {
    id: 'wf-2',
    name: 'Churn Alert Handler',
    description: 'Customer sentiment analysis and proactive outreach',
    status: 'active',
    triggers: ['Support Ticket', 'Customer Survey', 'Usage Analytics'],
    actions: [
      { name: 'Sentiment Analysis', type: 'analysis' },
      { name: 'Risk Scoring', type: 'scoring' },
      { name: 'Alert Sales Team', type: 'notification' },
      { name: 'Schedule Follow-up', type: 'calendar' }
    ],
    runs: 43,
    successRate: 87,
    averageDuration: 4.1,
    lastRun: '2024-06-14T10:15:00Z',
    createdAt: '2024-05-15T14:30:00Z',
    updatedAt: '2024-06-14T10:15:00Z'
  },
  {
    id: 'wf-3',
    name: 'Autonomous Scheduling',
    description: 'AI-powered meeting scheduling and coordination',
    status: 'paused',
    triggers: ['Email Request', 'Slack Command'],
    actions: [
      { name: 'Check Availability', type: 'calendar' },
      { name: 'Propose Times', type: 'generation' },
      { name: 'Send Invites', type: 'email' },
      { name: 'Add to Calendar', type: 'calendar' }
    ],
    runs: 89,
    successRate: 91,
    averageDuration: 1.8,
    lastRun: '2024-06-13T16:45:00Z',
    createdAt: '2024-04-20T09:00:00Z',
    updatedAt: '2024-06-13T16:45:00Z'
  }
];

export const mockIntegrations: Integration[] = [
  {
    id: 'zoom-1',
    name: 'Zoom',
    description: 'Video transcription and meeting insights',
    status: 'connected',
    icon: '🎥',
    metrics: { meetings: 45, transcriptions: 42 },
    config: { apiKey: '***', webhookUrl: 'https://api.astra.ai/webhooks/zoom' },
    lastSync: '2024-06-14T11:45:00Z',
    type: 'video'
  },
  {
    id: 'slack-1',
    name: 'Slack',
    description: 'Real-time notifications and slash commands',
    status: 'connected',
    icon: '💬',
    metrics: { channels: 12, notifications: 156 },
    config: { botToken: '***', signingSecret: '***' },
    lastSync: '2024-06-14T11:40:00Z',
    type: 'messaging'
  },
  {
    id: 'jira-1',
    name: 'Jira',
    description: 'Automated ticket creation and updates',
    status: 'connected',
    icon: '📋',
    metrics: { tickets: 23, automated: 18 },
    config: { domain: 'company.atlassian.net', apiToken: '***' },
    lastSync: '2024-06-14T11:30:00Z',
    type: 'project-management'
  },
  {
    id: 'mongodb-1',
    name: 'MongoDB',
    description: 'Metadata and document storage',
    status: 'connected',
    icon: '🗄️',
    metrics: { documents: '2.3M', size: '45GB' },
    config: { connectionString: '***', database: 'astraai' },
    lastSync: '2024-06-14T11:50:00Z',
    type: 'database'
  },
  {
    id: 'influxdb-1',
    name: 'InfluxDB',
    description: 'Time-series metrics and analytics',
    status: 'connected',
    icon: '📊',
    metrics: { points: '890K', queries: 1200 },
    config: { url: 'http://influxdb:8086', token: '***' },
    lastSync: '2024-06-14T11:55:00Z',
    type: 'database'
  },
  {
    id: 'milvus-1',
    name: 'Milvus',
    description: 'Vector embeddings and similarity search',
    status: 'warning',
    icon: '🔍',
    metrics: { vectors: '1.2M', searches: 450 },
    config: { host: 'milvus-server', port: 19530 },
    lastSync: '2024-06-14T10:30:00Z',
    type: 'vector-database'
  }
];

export const mockSystemMetrics: SystemMetrics[] = [
  { timestamp: '2024-06-14T06:00:00Z', throughput: 65, latency: 120, responseTime: 120, errors: 2, errorRate: 3.1, cpuUsage: 45, memoryUsage: 67, storageUsage: 42 },
  { timestamp: '2024-06-14T07:00:00Z', throughput: 72, latency: 115, responseTime: 115, errors: 1, errorRate: 1.4, cpuUsage: 52, memoryUsage: 69, storageUsage: 43 },
  { timestamp: '2024-06-14T08:00:00Z', throughput: 85, latency: 110, responseTime: 110, errors: 3, errorRate: 3.5, cpuUsage: 58, memoryUsage: 72, storageUsage: 44 },
  { timestamp: '2024-06-14T09:00:00Z', throughput: 95, latency: 100, responseTime: 100, errors: 1, errorRate: 1.1, cpuUsage: 65, memoryUsage: 75, storageUsage: 44 },
  { timestamp: '2024-06-14T10:00:00Z', throughput: 88, latency: 105, responseTime: 105, errors: 2, errorRate: 2.3, cpuUsage: 62, memoryUsage: 78, storageUsage: 45 },
  { timestamp: '2024-06-14T11:00:00Z', throughput: 92, latency: 102, responseTime: 102, errors: 1, errorRate: 1.1, cpuUsage: 68, memoryUsage: 82, storageUsage: 45 }
];

export const mockActivityLogs: ActivityLog[] = [
  {
    id: 'log-1',
    timestamp: '2024-06-14T11:55:00Z',
    type: 'transcription',
    message: 'Zoom meeting transcribed and analyzed',
    status: 'success',
    metadata: { meetingId: 'zoom-123', duration: '45m' }
  },
  {
    id: 'log-2',
    timestamp: '2024-06-14T11:50:00Z',
    type: 'alert',
    message: 'Slack alert triggered for customer churn',
    status: 'success',
    metadata: { customerId: 'cust-456', riskScore: 0.85 }
  },
  {
    id: 'log-3',
    timestamp: '2024-06-14T11:45:00Z',
    type: 'automation',
    message: 'Jira ticket auto-created from analysis',
    status: 'success',
    metadata: { ticketId: 'PROJ-789', priority: 'high' }
  },
  {
    id: 'log-4',
    timestamp: '2024-06-14T11:30:00Z',
    type: 'report',
    message: 'Weekly report generated',
    status: 'success',
    metadata: { reportType: 'weekly-summary', recipients: 5 }
  }
];

export const mockKPIData: KPIData = {
  meetingReduction: 23,
  taskCompletion: 87,
  taskCompletionRate: 87,
  responseLatency: 147,
  avgResponseTime: 147,
  customerSatisfaction: 92,
  automationRate: 76,
  activeEngines: 4,
  activeWorkflows: 23,
  throughput: "1.2TB/h",
  throughputStatus: "warning",
  responseTimeStatus: "healthy",
  cpuUsage: 68,
  memoryUsage: 82,
  storageUsage: 45
};