/**
 * Integration adapter interface and helper functions
 * Provides a standardized interface for external service integrations
 */

import { Integration, IntegrationConfiguration, RetryPolicy } from '../../types/domain';
import { OrchestratorError, createIntegrationError } from '../errors/OrchestratorError';
import { ERROR_CODES } from '../errors/errorCodes';
import { HttpClient, createHttpClient } from '../http/httpClient';
import { logger, createIntegrationLogger } from '../logging/logger';

export interface AdapterContext {
  correlationId: string;
  userId?: string;
  integration: Integration;
  logger: ReturnType<typeof createIntegrationLogger>;
}

export interface AdapterResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    retryable: boolean;
  };
  metadata?: Record<string, unknown>;
}

export interface AdapterOperation {
  name: string;
  description: string;
  parameters: Record<string, {
    type: string;
    required: boolean;
    description: string;
    default?: unknown;
  }>;
}

/**
 * Base integration adapter interface
 */
export abstract class IntegrationAdapter {
  protected integration: Integration;
  protected httpClient: HttpClient;
  protected logger: ReturnType<typeof createIntegrationLogger>;

  constructor(integration: Integration, correlationId: string = 'default') {
    this.integration = integration;
    this.logger = createIntegrationLogger(integration.id, correlationId);
    this.httpClient = this.createHttpClient();
  }

  /**
   * Get adapter information
   */
  abstract getInfo(): {
    name: string;
    version: string;
    description: string;
    supportedOperations: AdapterOperation[];
  };

  /**
   * Test connection to the integration
   */
  abstract testConnection(): Promise<boolean>;

  /**
   * Execute an operation
   */
  abstract executeOperation(
    operation: string,
    parameters: Record<string, unknown>,
    context: AdapterContext
  ): Promise<AdapterResponse>;

  /**
   * Health check for the integration
   */
  async healthCheck(): Promise<boolean> {
    try {
      return await this.testConnection();
    } catch (error) {
      this.logger.error('Health check failed', error as Error);
      return false;
    }
  }

  /**
   * Create HTTP client with integration configuration
   */
  protected createHttpClient(): HttpClient {
    const config = this.integration.configuration;
    
    return createHttpClient({
      baseUrl: config.baseUrl,
      timeout: config.timeout || 10000,
      retryPolicy: config.retryPolicy,
      authentication: config.authentication,
    });
  }

  /**
   * Execute operation with error handling and logging
   */
  protected async safeExecute<T>(
    operationName: string,
    executor: () => Promise<T>,
    context: AdapterContext
  ): Promise<AdapterResponse<T>> {
    const startTime = Date.now();
    
    try {
      this.logger.info(`Executing operation: ${operationName}`, {
        correlationId: context.correlationId,
        userId: context.userId,
      });

      const result = await executor();
      const duration = Date.now() - startTime;

      this.logger.info(`Operation completed: ${operationName}`, {
        correlationId: context.correlationId,
        duration,
      });

      return {
        success: true,
        data: result,
        metadata: {
          operationName,
          duration,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.logger.error(`Operation failed: ${operationName}`, error as Error, {
        correlationId: context.correlationId,
        duration,
      });

      let errorCode = ERROR_CODES.INTEGRATION_REQUEST_FAILED;
      let retryable = true;

      if (error instanceof OrchestratorError) {
        errorCode = error.code;
        retryable = error.retryable;
      } else if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('403')) {
          errorCode = ERROR_CODES.INTEGRATION_AUTHENTICATION_FAILED;
          retryable = false;
        } else if (error.message.includes('404')) {
          errorCode = ERROR_CODES.INTEGRATION_OPERATION_NOT_SUPPORTED;
          retryable = false;
        } else if (error.message.includes('429')) {
          errorCode = ERROR_CODES.INTEGRATION_RATE_LIMITED;
          retryable = true;
        } else if (error.message.includes('timeout')) {
          errorCode = ERROR_CODES.INTEGRATION_TIMEOUT;
          retryable = true;
        }
      }

      return {
        success: false,
        error: {
          code: errorCode,
          message: error instanceof Error ? error.message : String(error),
          retryable,
        },
        metadata: {
          operationName,
          duration,
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  /**
   * Validate operation parameters
   */
  protected validateParameters(
    operation: string,
    parameters: Record<string, unknown>
  ): void {
    const operationInfo = this.getInfo().supportedOperations.find(op => op.name === operation);
    
    if (!operationInfo) {
      throw createIntegrationError(
        ERROR_CODES.INTEGRATION_OPERATION_NOT_SUPPORTED,
        `Operation '${operation}' is not supported by this adapter`,
        this.integration.id
      );
    }

    // Validate required parameters
    for (const [paramName, paramConfig] of Object.entries(operationInfo.parameters)) {
      if (paramConfig.required && !(paramName in parameters)) {
        throw createIntegrationError(
          ERROR_CODES.VALIDATION_ERROR,
          `Required parameter '${paramName}' is missing for operation '${operation}'`,
          this.integration.id
        );
      }
    }
  }
}

/**
 * HTTP-based integration adapter for REST APIs
 */
export class HttpIntegrationAdapter extends IntegrationAdapter {
  getInfo() {
    return {
      name: 'HTTP Integration',
      version: '1.0.0',
      description: 'Generic HTTP/REST API integration adapter',
      supportedOperations: [
        {
          name: 'get',
          description: 'Perform HTTP GET request',
          parameters: {
            path: { type: 'string', required: true, description: 'API endpoint path' },
            params: { type: 'object', required: false, description: 'Query parameters' },
            headers: { type: 'object', required: false, description: 'Additional headers' },
          },
        },
        {
          name: 'post',
          description: 'Perform HTTP POST request',
          parameters: {
            path: { type: 'string', required: true, description: 'API endpoint path' },
            body: { type: 'object', required: false, description: 'Request body' },
            headers: { type: 'object', required: false, description: 'Additional headers' },
          },
        },
        {
          name: 'put',
          description: 'Perform HTTP PUT request',
          parameters: {
            path: { type: 'string', required: true, description: 'API endpoint path' },
            body: { type: 'object', required: false, description: 'Request body' },
            headers: { type: 'object', required: false, description: 'Additional headers' },
          },
        },
        {
          name: 'delete',
          description: 'Perform HTTP DELETE request',
          parameters: {
            path: { type: 'string', required: true, description: 'API endpoint path' },
            headers: { type: 'object', required: false, description: 'Additional headers' },
          },
        },
      ],
    };
  }

  async testConnection(): Promise<boolean> {
    try {
      if (this.integration.healthCheck) {
        const response = await this.httpClient.get(this.integration.healthCheck.endpoint);
        return response.status === this.integration.healthCheck.expectedStatus;
      }
      
      // Basic connectivity test - try to reach base URL
      const response = await this.httpClient.get('/');
      return response.status < 500;
    } catch {
      return false;
    }
  }

  async executeOperation(
    operation: string,
    parameters: Record<string, unknown>,
    context: AdapterContext
  ): Promise<AdapterResponse> {
    this.validateParameters(operation, parameters);

    return this.safeExecute(operation, async () => {
      const client = this.httpClient.withCorrelationId(context.correlationId);
      
      switch (operation) {
        case 'get':
          return client.get(
            parameters.path as string,
            {
              params: parameters.params as Record<string, string>,
              headers: parameters.headers as Record<string, string>,
            }
          );

        case 'post':
          return client.post(
            parameters.path as string,
            parameters.body,
            {
              headers: parameters.headers as Record<string, string>,
            }
          );

        case 'put':
          return client.put(
            parameters.path as string,
            parameters.body,
            {
              headers: parameters.headers as Record<string, string>,
            }
          );

        case 'delete':
          return client.delete(
            parameters.path as string,
            {
              headers: parameters.headers as Record<string, string>,
            }
          );

        default:
          throw createIntegrationError(
            ERROR_CODES.INTEGRATION_OPERATION_NOT_SUPPORTED,
            `Operation '${operation}' is not supported`,
            this.integration.id
          );
      }
    }, context);
  }
}

/**
 * Slack integration adapter
 */
export class SlackIntegrationAdapter extends IntegrationAdapter {
  getInfo() {
    return {
      name: 'Slack Integration',
      version: '1.0.0',
      description: 'Slack workspace integration for messaging and notifications',
      supportedOperations: [
        {
          name: 'sendMessage',
          description: 'Send a message to a Slack channel',
          parameters: {
            channel: { type: 'string', required: true, description: 'Channel ID or name' },
            text: { type: 'string', required: true, description: 'Message text' },
            attachments: { type: 'array', required: false, description: 'Message attachments' },
          },
        },
        {
          name: 'listChannels',
          description: 'List all channels in the workspace',
          parameters: {
            types: { type: 'string', required: false, description: 'Channel types to include' },
            limit: { type: 'number', required: false, description: 'Maximum number of channels' },
          },
        },
        {
          name: 'getUserInfo',
          description: 'Get information about a user',
          parameters: {
            user: { type: 'string', required: true, description: 'User ID' },
          },
        },
      ],
    };
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.httpClient.get('/auth.test');
      return response.data.ok === true;
    } catch {
      return false;
    }
  }

  async executeOperation(
    operation: string,
    parameters: Record<string, unknown>,
    context: AdapterContext
  ): Promise<AdapterResponse> {
    this.validateParameters(operation, parameters);

    return this.safeExecute(operation, async () => {
      const client = this.httpClient.withCorrelationId(context.correlationId);

      switch (operation) {
        case 'sendMessage':
          return client.post('/chat.postMessage', {
            channel: parameters.channel,
            text: parameters.text,
            attachments: parameters.attachments,
          });

        case 'listChannels':
          return client.get('/conversations.list', {
            params: {
              types: parameters.types as string || 'public_channel,private_channel',
              limit: String(parameters.limit || 100),
            },
          });

        case 'getUserInfo':
          return client.get('/users.info', {
            params: { user: parameters.user as string },
          });

        default:
          throw createIntegrationError(
            ERROR_CODES.INTEGRATION_OPERATION_NOT_SUPPORTED,
            `Operation '${operation}' is not supported`,
            this.integration.id
          );
      }
    }, context);
  }
}

/**
 * GitHub integration adapter
 */
export class GitHubIntegrationAdapter extends IntegrationAdapter {
  getInfo() {
    return {
      name: 'GitHub Integration',
      version: '1.0.0',
      description: 'GitHub repository and workflow integration',
      supportedOperations: [
        {
          name: 'createIssue',
          description: 'Create a new issue in a repository',
          parameters: {
            owner: { type: 'string', required: true, description: 'Repository owner' },
            repo: { type: 'string', required: true, description: 'Repository name' },
            title: { type: 'string', required: true, description: 'Issue title' },
            body: { type: 'string', required: false, description: 'Issue body' },
            labels: { type: 'array', required: false, description: 'Issue labels' },
          },
        },
        {
          name: 'getRepository',
          description: 'Get repository information',
          parameters: {
            owner: { type: 'string', required: true, description: 'Repository owner' },
            repo: { type: 'string', required: true, description: 'Repository name' },
          },
        },
        {
          name: 'listPullRequests',
          description: 'List pull requests in a repository',
          parameters: {
            owner: { type: 'string', required: true, description: 'Repository owner' },
            repo: { type: 'string', required: true, description: 'Repository name' },
            state: { type: 'string', required: false, description: 'PR state (open, closed, all)' },
          },
        },
      ],
    };
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.httpClient.get('/user');
      return response.status === 200;
    } catch {
      return false;
    }
  }

  async executeOperation(
    operation: string,
    parameters: Record<string, unknown>,
    context: AdapterContext
  ): Promise<AdapterResponse> {
    this.validateParameters(operation, parameters);

    return this.safeExecute(operation, async () => {
      const client = this.httpClient.withCorrelationId(context.correlationId);

      switch (operation) {
        case 'createIssue':
          return client.post(`/repos/${parameters.owner}/${parameters.repo}/issues`, {
            title: parameters.title,
            body: parameters.body,
            labels: parameters.labels,
          });

        case 'getRepository':
          return client.get(`/repos/${parameters.owner}/${parameters.repo}`);

        case 'listPullRequests':
          return client.get(`/repos/${parameters.owner}/${parameters.repo}/pulls`, {
            params: {
              state: parameters.state as string || 'open',
            },
          });

        default:
          throw createIntegrationError(
            ERROR_CODES.INTEGRATION_OPERATION_NOT_SUPPORTED,
            `Operation '${operation}' is not supported`,
            this.integration.id
          );
      }
    }, context);
  }
}

/**
 * Create adapter context
 */
export function createAdapterContext(
  integration: Integration,
  correlationId: string,
  userId?: string
): AdapterContext {
  return {
    correlationId,
    userId,
    integration,
    logger: createIntegrationLogger(integration.id, correlationId),
  };
}

/**
 * Adapter factory function
 */
export function createAdapter(integration: Integration, correlationId?: string): IntegrationAdapter {
  switch (integration.type.toLowerCase()) {
    case 'http':
    case 'rest':
      return new HttpIntegrationAdapter(integration, correlationId);
    
    case 'slack':
      return new SlackIntegrationAdapter(integration, correlationId);
    
    case 'github':
      return new GitHubIntegrationAdapter(integration, correlationId);
    
    default:
      // Default to HTTP adapter for unknown types
      logger.warn(`Unknown integration type: ${integration.type}, using HTTP adapter`);
      return new HttpIntegrationAdapter(integration, correlationId);
  }
}