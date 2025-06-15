import { http, HttpResponse } from 'msw';
import { 
  APIResponse, 
  WorkflowExecuteResponse, 
  AIGenerateResponse, 
  IntegrationTestResponse,
  MetricsResponse,
  PilotFeature,
  PilotAnalytics
} from '@/types/api';
import { mockWorkflows, mockIntegrations, mockKPIData } from '@/services/mockData';
import { 
  mockAgents, 
  mockAgentTasks, 
  mockAgentEvents, 
  mockAgentStats,
  mockAgentClusters 
} from '@/services/mockAgentData';

// Helper function to create API responses
const createAPIResponse = <T>(data: T, success = true): APIResponse<T> => ({
  success,
  data,
  timestamp: new Date().toISOString(),
});

const createErrorResponse = (code: string, message: string): APIResponse => ({
  success: false,
  error: {
    code,
    message,
    traceId: `trace-${Date.now()}`,
  },
  timestamp: new Date().toISOString(),
});

export const handlers = [
  // Authentication endpoints
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    
    // Simulate login validation
    if (body.email === 'demo@astraai.com' && body.password === 'demo123') {
      return HttpResponse.json(createAPIResponse({
        accessToken: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
        expiresIn: 3600,
        tokenType: 'Bearer' as const,
      }));
    }
    
    return HttpResponse.json(
      createErrorResponse('INVALID_CREDENTIALS', 'Invalid email or password'),
      { status: 401 }
    );
  }),

  http.get('/api/auth/profile', () => {
    return HttpResponse.json(createAPIResponse({
      id: 'user-1',
      email: 'demo@astraai.com',
      name: 'Demo User',
      role: 'admin' as const,
      permissions: ['workflows:read', 'workflows:write', 'integrations:read', 'ai:use'],
      tenantId: 'tenant-1',
      createdAt: '2024-01-01T00:00:00Z',
      lastLogin: new Date().toISOString(),
    }));
  }),

  // Workflow Engine endpoints
  http.get('/api/workflows', () => {
    return HttpResponse.json(createAPIResponse(mockWorkflows));
  }),

  http.get('/api/workflows/:id', ({ params }) => {
    const workflow = mockWorkflows.find(w => w.id === params.id);
    if (!workflow) {
      return HttpResponse.json(
        createErrorResponse('WORKFLOW_NOT_FOUND', 'Workflow not found'),
        { status: 404 }
      );
    }
    return HttpResponse.json(createAPIResponse(workflow));
  }),

  http.post('/api/workflows/:id/execute', async ({ params, request }) => {
    const body = await request.json() as { payload?: Record<string, any> };
    
    const executionResponse: WorkflowExecuteResponse = {
      executionId: `exec-${Date.now()}`,
      status: 'running',
      startedAt: new Date().toISOString(),
      estimatedDuration: 30000, // 30 seconds
    };

    // Simulate async execution
    setTimeout(() => {
      // In a real app, this would be sent via WebSocket
      console.log(`Workflow ${params.id} execution completed:`, executionResponse.executionId);
    }, 2000);

    return HttpResponse.json(createAPIResponse(executionResponse));
  }),

  http.put('/api/workflows/:id', async ({ params, request }) => {
    const body = await request.json() as any;
    const workflow = mockWorkflows.find(w => w.id === params.id);
    
    if (!workflow) {
      return HttpResponse.json(
        createErrorResponse('WORKFLOW_NOT_FOUND', 'Workflow not found'),
        { status: 404 }
      );
    }

    // Update workflow in mock data
    Object.assign(workflow, body, { updatedAt: new Date().toISOString() });
    
    return HttpResponse.json(createAPIResponse(workflow));
  }),

  // AI Orchestration endpoints
  http.post('/api/ai/generate', async ({ request }) => {
    const body = await request.json() as { prompt: string; model?: string };
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const response: AIGenerateResponse = {
      id: `ai-${Date.now()}`,
      content: `Generated response for: "${body.prompt}"\n\nThis is a mock AI response that demonstrates the API contract.`,
      model: body.model || 'gpt-4',
      usage: {
        promptTokens: 50,
        completionTokens: 100,
        totalTokens: 150,
      },
      finishReason: 'stop',
      createdAt: new Date().toISOString(),
    };

    return HttpResponse.json(createAPIResponse(response));
  }),

  http.get('/api/ai/jobs', () => {
    const jobs = [
      {
        id: 'job-1',
        type: 'transcription' as const,
        status: 'completed' as const,
        input: { meetingId: 'zoom-123' },
        output: { transcript: 'Meeting transcript...' },
        progress: 100,
        createdAt: '2024-06-14T10:00:00Z',
        completedAt: '2024-06-14T10:05:00Z',
      },
      {
        id: 'job-2',
        type: 'analysis' as const,
        status: 'processing' as const,
        input: { document: 'analysis-doc.pdf' },
        progress: 75,
        createdAt: '2024-06-14T11:00:00Z',
      },
    ];

    return HttpResponse.json(createAPIResponse(jobs));
  }),

  // Integration Gateway endpoints
  http.get('/api/integrations', () => {
    return HttpResponse.json(createAPIResponse(mockIntegrations));
  }),

  http.post('/api/integrations/:id/test', async ({ params }) => {
    // Simulate test delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const response: IntegrationTestResponse = {
      success: Math.random() > 0.2, // 80% success rate
      message: 'Connection test completed successfully',
      latency: Math.floor(Math.random() * 500) + 100,
      details: {
        endpoint: 'https://api.example.com/test',
        timestamp: new Date().toISOString(),
      },
    };

    return HttpResponse.json(createAPIResponse(response));
  }),

  http.put('/api/integrations/:id', async ({ params, request }) => {
    const body = await request.json() as any;
    const integration = mockIntegrations.find(i => i.id === params.id);
    
    if (!integration) {
      return HttpResponse.json(
        createErrorResponse('INTEGRATION_NOT_FOUND', 'Integration not found'),
        { status: 404 }
      );
    }

    // Update integration
    Object.assign(integration, body);
    
    return HttpResponse.json(createAPIResponse(integration));
  }),

  // Metrics endpoints
  http.get('/api/metrics/kpis', () => {
    return HttpResponse.json(createAPIResponse(mockKPIData));
  }),

  http.post('/api/metrics', async ({ request }) => {
    const body = await request.json() as any;
    
    const response: MetricsResponse = {
      metrics: [
        {
          name: 'throughput',
          values: Array.from({ length: 24 }, (_, i) => ({
            timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
            value: Math.floor(Math.random() * 100) + 50,
          })),
          unit: 'requests/hour',
          type: 'gauge',
        },
        {
          name: 'latency',
          values: Array.from({ length: 24 }, (_, i) => ({
            timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
            value: Math.floor(Math.random() * 200) + 100,
          })),
          unit: 'ms',
          type: 'gauge',
        },
      ],
      timeRange: {
        start: new Date(Date.now() - 24 * 3600000).toISOString(),
        end: new Date().toISOString(),
      },
      granularity: '1h',
    };

    return HttpResponse.json(createAPIResponse(response));
  }),

  // Agent Management endpoints
  http.get('/api/agents', () => {
    return HttpResponse.json(createAPIResponse(mockAgents));
  }),

  http.get('/api/agents/:id', ({ params }) => {
    const agent = mockAgents.find(a => a.id === params.id);
    if (!agent) {
      return HttpResponse.json(
        createErrorResponse('AGENT_NOT_FOUND', 'Agent not found'),
        { status: 404 }
      );
    }
    return HttpResponse.json(createAPIResponse(agent));
  }),

  http.put('/api/agents/:id', async ({ params, request }) => {
    const body = await request.json() as any;
    const agent = mockAgents.find(a => a.id === params.id);
    
    if (!agent) {
      return HttpResponse.json(
        createErrorResponse('AGENT_NOT_FOUND', 'Agent not found'),
        { status: 404 }
      );
    }

    Object.assign(agent, body, { lastActive: new Date().toISOString() });
    return HttpResponse.json(createAPIResponse(agent));
  }),

  http.post('/api/agents/:id/commands', async ({ params, request }) => {
    const body = await request.json() as { command: string; parameters?: any };
    
    // Simulate command execution
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = {
      commandId: `cmd-${Date.now()}`,
      agentId: params.id,
      command: body.command,
      status: 'completed',
      result: `Command ${body.command} executed successfully`,
      executedAt: new Date().toISOString(),
    };

    return HttpResponse.json(createAPIResponse(response));
  }),

  // Agent Tasks endpoints
  http.get('/api/agents/:id/tasks', ({ params }) => {
    const tasks = mockAgentTasks.filter(t => t.agentId === params.id);
    return HttpResponse.json(createAPIResponse(tasks));
  }),

  http.get('/api/tasks', () => {
    return HttpResponse.json(createAPIResponse(mockAgentTasks));
  }),

  http.post('/api/tasks', async ({ request }) => {
    const body = await request.json() as any;
    
    const newTask = {
      id: `task-${Date.now()}`,
      ...body,
      status: 'queued',
      progress: 0,
      createdAt: new Date().toISOString(),
      retryCount: 0,
    };

    mockAgentTasks.unshift(newTask);
    return HttpResponse.json(createAPIResponse(newTask));
  }),

  http.put('/api/tasks/:id', async ({ params, request }) => {
    const body = await request.json() as any;
    const task = mockAgentTasks.find(t => t.id === params.id);
    
    if (!task) {
      return HttpResponse.json(
        createErrorResponse('TASK_NOT_FOUND', 'Task not found'),
        { status: 404 }
      );
    }

    Object.assign(task, body);
    return HttpResponse.json(createAPIResponse(task));
  }),

  // Agent Events endpoints
  http.get('/api/agents/:id/events', ({ params, request }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    
    const events = mockAgentEvents
      .filter(e => e.agentId === params.id)
      .slice(0, limit);
    
    return HttpResponse.json(createAPIResponse(events));
  }),

  http.get('/api/events', ({ request }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '100');
    
    const events = mockAgentEvents.slice(0, limit);
    return HttpResponse.json(createAPIResponse(events));
  }),

  // Agent Statistics endpoints
  http.get('/api/agents/stats', () => {
    return HttpResponse.json(createAPIResponse(mockAgentStats));
  }),

  http.get('/api/agents/:id/metrics', ({ params, request }) => {
    const url = new URL(request.url);
    const timeRange = url.searchParams.get('range') || '1h';
    
    // Generate mock metrics data
    const metrics = Array.from({ length: 20 }, (_, i) => ({
      agentId: params.id,
      timestamp: new Date(Date.now() - (19 - i) * 60000).toISOString(),
      cpuUsage: Math.floor(Math.random() * 100),
      memoryUsage: Math.floor(Math.random() * 100),
      taskQueue: Math.floor(Math.random() * 10),
      activeConnections: Math.floor(Math.random() * 50),
      responseTime: Math.floor(Math.random() * 1000) + 100,
      throughput: Math.floor(Math.random() * 100) + 20,
    }));

    return HttpResponse.json(createAPIResponse(metrics));
  }),

  // Agent Clusters endpoints
  http.get('/api/clusters', () => {
    return HttpResponse.json(createAPIResponse(mockAgentClusters));
  }),

  http.get('/api/clusters/:id', ({ params }) => {
    const cluster = mockAgentClusters.find(c => c.id === params.id);
    if (!cluster) {
      return HttpResponse.json(
        createErrorResponse('CLUSTER_NOT_FOUND', 'Cluster not found'),
        { status: 404 }
      );
    }
    return HttpResponse.json(createAPIResponse(cluster));
  }),

  // Health check
  http.get('/api/health', () => {
    return HttpResponse.json(createAPIResponse({
      status: 'healthy',
      services: {
        database: 'healthy',
        cache: 'healthy',
        messageQueue: 'healthy',
      },
      uptime: '5d 12h 34m',
      version: '1.0.0',
    }));
  }),
];
