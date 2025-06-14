
import { APIEndpoints } from '@/types/api';

interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    description: string;
    version: string;
    contact: {
      name: string;
      url: string;
      email: string;
    };
  };
  servers: Array<{
    url: string;
    description: string;
  }>;
  paths: Record<string, any>;
  components: {
    schemas: Record<string, any>;
    securitySchemes: Record<string, any>;
  };
  security: Array<Record<string, string[]>>;
}

export const generateOpenAPISpec = (): OpenAPISpec => {
  return {
    openapi: '3.0.3',
    info: {
      title: 'AstraAI Platform API',
      description: 'Comprehensive API for the AstraAI automation platform with workflow management, AI orchestration, and integration capabilities.',
      version: '1.0.0',
      contact: {
        name: 'AstraAI Support',
        url: 'https://docs.astraai.com',
        email: 'support@astraai.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Development server',
      },
      {
        url: 'https://api-staging.astraai.com',
        description: 'Staging server',
      },
      {
        url: 'https://api.astraai.com',
        description: 'Production server',
      },
    ],
    paths: {
      '/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'User login',
          description: 'Authenticate user and return JWT tokens',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                  },
                  required: ['email', 'password'],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/AuthResponse' },
                },
              },
            },
            '401': {
              description: 'Invalid credentials',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
      '/workflows': {
        get: {
          tags: ['Workflows'],
          summary: 'List workflows',
          description: 'Retrieve all workflows for the authenticated user',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'status',
              in: 'query',
              schema: {
                type: 'string',
                enum: ['active', 'paused', 'error'],
              },
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', minimum: 1, maximum: 100 },
            },
          ],
          responses: {
            '200': {
              description: 'List of workflows',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/APIResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Workflow' },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Workflows'],
          summary: 'Create workflow',
          description: 'Create a new workflow',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/WorkflowCreateRequest' },
              },
            },
          },
          responses: {
            '201': {
              description: 'Workflow created',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/APIResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/Workflow' },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/workflows/{id}/execute': {
        post: {
          tags: ['Workflows'],
          summary: 'Execute workflow',
          description: 'Trigger execution of a specific workflow',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/WorkflowExecuteRequest' },
              },
            },
          },
          responses: {
            '200': {
              description: 'Execution started',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/APIResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/WorkflowExecuteResponse' },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/ai/generate': {
        post: {
          tags: ['AI Services'],
          summary: 'Generate AI content',
          description: 'Generate content using AI models',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AIGenerateRequest' },
              },
            },
          },
          responses: {
            '200': {
              description: 'Content generated',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/APIResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/AIGenerateResponse' },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/integrations': {
        get: {
          tags: ['Integrations'],
          summary: 'List integrations',
          description: 'Retrieve all configured integrations',
          security: [{ BearerAuth: [] }],
          responses: {
            '200': {
              description: 'List of integrations',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/APIResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/IntegrationConfig' },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        APIResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
            error: { $ref: '#/components/schemas/APIError' },
            timestamp: { type: 'string', format: 'date-time' },
          },
          required: ['success', 'timestamp'],
        },
        APIError: {
          type: 'object',
          properties: {
            code: { type: 'string' },
            message: { type: 'string' },
            details: { type: 'object' },
            traceId: { type: 'string' },
          },
          required: ['code', 'message'],
        },
        AuthResponse: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
            expiresIn: { type: 'integer' },
            tokenType: { type: 'string', enum: ['Bearer'] },
          },
          required: ['accessToken', 'refreshToken', 'expiresIn', 'tokenType'],
        },
        Workflow: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['active', 'paused', 'error'] },
            triggers: {
              type: 'array',
              items: { $ref: '#/components/schemas/WorkflowTrigger' },
            },
            actions: {
              type: 'array',
              items: { $ref: '#/components/schemas/WorkflowAction' },
            },
            runs: { type: 'integer' },
            successRate: { type: 'number' },
            averageDuration: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          required: ['id', 'name', 'description', 'status'],
        },
        WorkflowCreateRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1, maxLength: 100 },
            description: { type: 'string', maxLength: 500 },
            triggers: {
              type: 'array',
              items: { $ref: '#/components/schemas/WorkflowTrigger' },
            },
            actions: {
              type: 'array',
              items: { $ref: '#/components/schemas/WorkflowAction' },
            },
          },
          required: ['name', 'description', 'triggers', 'actions'],
        },
        WorkflowExecuteRequest: {
          type: 'object',
          properties: {
            payload: { type: 'object' },
            async: { type: 'boolean', default: false },
            dryRun: { type: 'boolean', default: false },
          },
        },
        WorkflowExecuteResponse: {
          type: 'object',
          properties: {
            executionId: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'running', 'completed', 'failed'] },
            startedAt: { type: 'string', format: 'date-time' },
            estimatedDuration: { type: 'integer' },
            result: { type: 'object' },
          },
          required: ['executionId', 'status', 'startedAt'],
        },
        AIGenerateRequest: {
          type: 'object',
          properties: {
            prompt: { type: 'string', minLength: 1 },
            context: { type: 'object' },
            model: { type: 'string', enum: ['gpt-4', 'claude-3', 'custom'] },
            temperature: { type: 'number', minimum: 0, maximum: 2 },
            maxTokens: { type: 'integer', minimum: 1, maximum: 4000 },
            stream: { type: 'boolean', default: false },
          },
          required: ['prompt'],
        },
        AIGenerateResponse: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            content: { type: 'string' },
            model: { type: 'string' },
            usage: {
              type: 'object',
              properties: {
                promptTokens: { type: 'integer' },
                completionTokens: { type: 'integer' },
                totalTokens: { type: 'integer' },
              },
            },
            finishReason: { type: 'string', enum: ['stop', 'length', 'content_filter'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
          required: ['id', 'content', 'model', 'usage', 'finishReason', 'createdAt'],
        },
        IntegrationConfig: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            type: { type: 'string', enum: ['zoom', 'slack', 'jira', 'mongodb', 'influxdb', 'milvus'] },
            name: { type: 'string' },
            enabled: { type: 'boolean' },
            config: { type: 'object' },
            lastSync: { type: 'string', format: 'date-time' },
            status: { type: 'string', enum: ['connected', 'disconnected', 'error', 'syncing'] },
            metrics: { type: 'object' },
          },
          required: ['id', 'type', 'name', 'enabled', 'status'],
        },
      },
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      { BearerAuth: [] },
    ],
  };
};

export const downloadOpenAPISpec = () => {
  const spec = generateOpenAPISpec();
  const blob = new Blob([JSON.stringify(spec, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'astraai-openapi-spec.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

