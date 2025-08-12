/**
 * Integration adapter registry for managing and discovering adapters
 * Provides centralized adapter management and lookup functionality
 */

import { Integration } from '../../types/domain';
import { 
  IntegrationAdapter, 
  HttpIntegrationAdapter, 
  SlackIntegrationAdapter, 
  GitHubIntegrationAdapter,
  createAdapter,
  createAdapterContext,
  type AdapterContext,
  type AdapterResponse 
} from './adapter';
import { circuitBreakerManager } from './circuitBreaker';
import { OrchestratorError, createIntegrationError } from '../errors/OrchestratorError';
import { ERROR_CODES } from '../errors/errorCodes';
import { logger } from '../logging/logger';

export interface RegisteredAdapter {
  adapter: IntegrationAdapter;
  integration: Integration;
  registeredAt: Date;
  lastUsed?: Date;
  usageCount: number;
  healthStatus: 'unknown' | 'healthy' | 'unhealthy';
  lastHealthCheck?: Date;
}

export interface AdapterRegistryConfig {
  healthCheckInterval: number;
  enableCircuitBreaker: boolean;
  defaultCircuitBreakerConfig: {
    failureThreshold: number;
    recoveryTimeout: number;
    monitoringPeriod: number;
  };
}

const DEFAULT_CONFIG: AdapterRegistryConfig = {
  healthCheckInterval: 300000, // 5 minutes
  enableCircuitBreaker: true,
  defaultCircuitBreakerConfig: {
    failureThreshold: 5,
    recoveryTimeout: 60000,
    monitoringPeriod: 10000,
  },
};

/**
 * Central registry for managing integration adapters
 */
export class AdapterRegistry {
  private adapters: Map<string, RegisteredAdapter> = new Map();
  private integrations: Map<string, Integration> = new Map();
  private config: AdapterRegistryConfig;
  private healthCheckTimer?: NodeJS.Timeout;

  constructor(config: Partial<AdapterRegistryConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.startHealthChecking();
  }

  /**
   * Register an integration and create its adapter
   */
  async registerIntegration(integration: Integration): Promise<void> {
    try {
      // Store integration configuration
      this.integrations.set(integration.id, integration);

      // Create adapter for the integration
      const adapter = createAdapter(integration);

      // Register the adapter
      const registeredAdapter: RegisteredAdapter = {
        adapter,
        integration,
        registeredAt: new Date(),
        usageCount: 0,
        healthStatus: 'unknown',
      };

      this.adapters.set(integration.id, registeredAdapter);

      // Perform initial health check
      await this.performHealthCheck(integration.id);

      logger.info('Integration registered', {
        integrationId: integration.id,
        type: integration.type,
        name: integration.name,
      });
    } catch (error) {
      logger.error('Failed to register integration', error as Error, {
        integrationId: integration.id,
      });
      throw error;
    }
  }

  /**
   * Unregister an integration
   */
  unregisterIntegration(integrationId: string): boolean {
    const registered = this.adapters.get(integrationId);
    if (!registered) {
      return false;
    }

    this.adapters.delete(integrationId);
    this.integrations.delete(integrationId);

    logger.info('Integration unregistered', { integrationId });
    return true;
  }

  /**
   * Get an adapter by integration ID
   */
  getAdapter(integrationId: string): IntegrationAdapter | null {
    const registered = this.adapters.get(integrationId);
    return registered ? registered.adapter : null;
  }

  /**
   * Get integration configuration by ID
   */
  getIntegration(integrationId: string): Integration | null {
    return this.integrations.get(integrationId) || null;
  }

  /**
   * Execute an operation through an adapter with circuit breaker protection
   */
  async executeOperation(
    integrationId: string,
    operation: string,
    parameters: Record<string, unknown>,
    correlationId: string,
    userId?: string
  ): Promise<AdapterResponse> {
    const registered = this.adapters.get(integrationId);
    if (!registered) {
      throw createIntegrationError(
        ERROR_CODES.INTEGRATION_ADAPTER_NOT_FOUND,
        `Integration adapter not found: ${integrationId}`,
        integrationId
      );
    }

    // Check if integration is active
    if (registered.integration.status !== 'active') {
      throw createIntegrationError(
        ERROR_CODES.INTEGRATION_REQUEST_FAILED,
        `Integration is not active: ${integrationId} (status: ${registered.integration.status})`,
        integrationId
      );
    }

    // Update usage tracking
    registered.lastUsed = new Date();
    registered.usageCount++;

    // Create adapter context
    const context = createAdapterContext(registered.integration, correlationId, userId);

    // Execute with circuit breaker if enabled
    if (this.config.enableCircuitBreaker && registered.integration.configuration.circuitBreaker) {
      const circuitBreakerConfig = registered.integration.configuration.circuitBreaker;
      
      return circuitBreakerManager.execute(
        `integration.${integrationId}.${operation}`,
        () => registered.adapter.executeOperation(operation, parameters, context),
        circuitBreakerConfig
      );
    } else {
      return registered.adapter.executeOperation(operation, parameters, context);
    }
  }

  /**
   * Test connection for an integration
   */
  async testConnection(integrationId: string): Promise<boolean> {
    const registered = this.adapters.get(integrationId);
    if (!registered) {
      return false;
    }

    try {
      return await registered.adapter.testConnection();
    } catch (error) {
      logger.error('Connection test failed', error as Error, { integrationId });
      return false;
    }
  }

  /**
   * Perform health check for an integration
   */
  async performHealthCheck(integrationId: string): Promise<boolean> {
    const registered = this.adapters.get(integrationId);
    if (!registered) {
      return false;
    }

    try {
      const isHealthy = await registered.adapter.healthCheck();
      registered.healthStatus = isHealthy ? 'healthy' : 'unhealthy';
      registered.lastHealthCheck = new Date();

      if (!isHealthy) {
        logger.warn('Integration health check failed', { integrationId });
      }

      return isHealthy;
    } catch (error) {
      registered.healthStatus = 'unhealthy';
      registered.lastHealthCheck = new Date();
      
      logger.error('Health check error', error as Error, { integrationId });
      return false;
    }
  }

  /**
   * Get all registered integrations
   */
  getRegisteredIntegrations(): RegisteredAdapter[] {
    return Array.from(this.adapters.values());
  }

  /**
   * Get integrations by type
   */
  getIntegrationsByType(type: string): RegisteredAdapter[] {
    return Array.from(this.adapters.values()).filter(
      registered => registered.integration.type === type
    );
  }

  /**
   * Get healthy integrations
   */
  getHealthyIntegrations(): RegisteredAdapter[] {
    return Array.from(this.adapters.values()).filter(
      registered => registered.healthStatus === 'healthy'
    );
  }

  /**
   * Get integration statistics
   */
  getIntegrationStats(integrationId: string): {
    usageCount: number;
    lastUsed?: Date;
    healthStatus: string;
    lastHealthCheck?: Date;
    registeredAt: Date;
    circuitBreakerStats?: any;
  } | null {
    const registered = this.adapters.get(integrationId);
    if (!registered) {
      return null;
    }

    const stats = {
      usageCount: registered.usageCount,
      lastUsed: registered.lastUsed,
      healthStatus: registered.healthStatus,
      lastHealthCheck: registered.lastHealthCheck,
      registeredAt: registered.registeredAt,
    };

    // Add circuit breaker stats if available
    if (this.config.enableCircuitBreaker) {
      const circuitBreakerStats = circuitBreakerManager.getStats(`integration.${integrationId}`);
      if (circuitBreakerStats) {
        (stats as any).circuitBreakerStats = circuitBreakerStats;
      }
    }

    return stats;
  }

  /**
   * Get registry summary
   */
  getRegistrySummary(): {
    totalIntegrations: number;
    activeIntegrations: number;
    healthyIntegrations: number;
    unhealthyIntegrations: number;
    integrationsByType: Record<string, number>;
    totalUsage: number;
  } {
    const integrations = Array.from(this.adapters.values());
    
    const summary = {
      totalIntegrations: integrations.length,
      activeIntegrations: integrations.filter(r => r.integration.status === 'active').length,
      healthyIntegrations: integrations.filter(r => r.healthStatus === 'healthy').length,
      unhealthyIntegrations: integrations.filter(r => r.healthStatus === 'unhealthy').length,
      integrationsByType: {} as Record<string, number>,
      totalUsage: integrations.reduce((sum, r) => sum + r.usageCount, 0),
    };

    // Count by type
    for (const registered of integrations) {
      const type = registered.integration.type;
      summary.integrationsByType[type] = (summary.integrationsByType[type] || 0) + 1;
    }

    return summary;
  }

  /**
   * Start periodic health checking
   */
  private startHealthChecking(): void {
    if (this.config.healthCheckInterval > 0) {
      this.healthCheckTimer = setInterval(() => {
        this.performAllHealthChecks();
      }, this.config.healthCheckInterval);
    }
  }

  /**
   * Perform health checks for all integrations
   */
  private async performAllHealthChecks(): Promise<void> {
    const integrationIds = Array.from(this.adapters.keys());
    
    logger.debug('Performing health checks', { 
      integrationCount: integrationIds.length 
    });

    const results = await Promise.allSettled(
      integrationIds.map(id => this.performHealthCheck(id))
    );

    const successful = results.filter(r => r.status === 'fulfilled' && r.value).length;
    const failed = results.length - successful;

    if (failed > 0) {
      logger.warn('Health check summary', { 
        total: results.length,
        successful,
        failed 
      });
    }
  }

  /**
   * Discover available adapter types
   */
  getAvailableAdapterTypes(): Array<{
    type: string;
    name: string;
    description: string;
    supportedOperations: string[];
  }> {
    return [
      {
        type: 'http',
        name: 'HTTP/REST API',
        description: 'Generic HTTP/REST API integration',
        supportedOperations: ['get', 'post', 'put', 'delete'],
      },
      {
        type: 'slack',
        name: 'Slack',
        description: 'Slack workspace integration',
        supportedOperations: ['sendMessage', 'listChannels', 'getUserInfo'],
      },
      {
        type: 'github',
        name: 'GitHub',
        description: 'GitHub repository integration',
        supportedOperations: ['createIssue', 'getRepository', 'listPullRequests'],
      },
    ];
  }

  /**
   * Validate integration configuration before registration
   */
  validateIntegrationConfig(integration: Integration): string[] {
    const errors: string[] = [];

    // Basic validation
    if (!integration.name) {
      errors.push('Integration name is required');
    }

    if (!integration.type) {
      errors.push('Integration type is required');
    }

    if (!integration.configuration) {
      errors.push('Integration configuration is required');
    }

    // Type-specific validation
    switch (integration.type.toLowerCase()) {
      case 'slack':
        if (!integration.configuration.authentication?.credentials?.token) {
          errors.push('Slack integration requires bot token in authentication.credentials.token');
        }
        break;

      case 'github':
        if (!integration.configuration.authentication?.credentials?.token) {
          errors.push('GitHub integration requires personal access token in authentication.credentials.token');
        }
        break;

      case 'http':
      case 'rest':
        if (!integration.configuration.baseUrl) {
          errors.push('HTTP integration requires baseUrl in configuration');
        }
        break;
    }

    return errors;
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = undefined;
    }

    this.adapters.clear();
    this.integrations.clear();

    logger.info('Adapter registry destroyed');
  }
}

// Default adapter registry instance
export const adapterRegistry = new AdapterRegistry();

/**
 * Convenience function to register an integration
 */
export async function registerIntegration(integration: Integration): Promise<void> {
  return adapterRegistry.registerIntegration(integration);
}

/**
 * Convenience function to execute an operation
 */
export async function executeIntegrationOperation(
  integrationId: string,
  operation: string,
  parameters: Record<string, unknown>,
  correlationId: string,
  userId?: string
): Promise<AdapterResponse> {
  return adapterRegistry.executeOperation(integrationId, operation, parameters, correlationId, userId);
}