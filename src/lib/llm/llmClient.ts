/**
 * LLM client abstraction for provider registration and text generation
 * Provides unified interface for multiple LLM providers
 */

import { LLMProvider, LLMProviderConfiguration, LLMParameters, LLMUsage } from '../../types/domain';
import { OrchestratorError, createLLMError } from '../errors/OrchestratorError';
import { ERROR_CODES } from '../errors/errorCodes';
import { HttpClient, createHttpClient } from '../http/httpClient';
import { logger, createLLMLogger } from '../logging/logger';
import { circuitBreakerManager } from '../integrations/circuitBreaker';

export interface LLMRequest {
  prompt: string;
  parameters?: LLMParameters;
  model?: string;
}

export interface LLMResponse {
  text: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  finishReason?: string;
  metadata?: Record<string, unknown>;
}

export interface LLMProviderClient {
  generateText(request: LLMRequest, correlationId: string): Promise<LLMResponse>;
  getSupportedModels(): string[];
  validateModel(model: string): boolean;
  getProviderInfo(): {
    name: string;
    version: string;
    description: string;
  };
}

/**
 * Base LLM provider client
 */
export abstract class BaseLLMProviderClient implements LLMProviderClient {
  protected provider: LLMProvider;
  protected httpClient: HttpClient;
  protected logger: ReturnType<typeof createLLMLogger>;

  constructor(provider: LLMProvider, correlationId: string = 'default') {
    this.provider = provider;
    this.logger = createLLMLogger(provider.id, correlationId);
    this.httpClient = this.createHttpClient();
  }

  abstract generateText(request: LLMRequest, correlationId: string): Promise<LLMResponse>;
  abstract getSupportedModels(): string[];
  abstract getProviderInfo(): { name: string; version: string; description: string; };

  validateModel(model: string): boolean {
    return this.getSupportedModels().includes(model);
  }

  protected createHttpClient(): HttpClient {
    const config = this.provider.configuration;
    
    return createHttpClient({
      baseUrl: config.baseUrl,
      timeout: config.timeout || 30000,
      retryPolicy: config.retryPolicy,
      authentication: config.apiKey ? {
        type: 'bearer',
        credentials: { token: config.apiKey },
      } : undefined,
    });
  }

  protected async executeWithCircuitBreaker<T>(
    operation: string,
    fn: () => Promise<T>
  ): Promise<T> {
    if (this.provider.configuration.retryPolicy) {
      return circuitBreakerManager.execute(
        `llm.${this.provider.id}.${operation}`,
        fn,
        {
          failureThreshold: 3,
          recoveryTimeout: 30000,
          monitoringPeriod: 10000,
        }
      );
    }
    
    return fn();
  }
}

/**
 * OpenAI provider client
 */
export class OpenAIProviderClient extends BaseLLMProviderClient {
  getProviderInfo() {
    return {
      name: 'OpenAI',
      version: '1.0.0',
      description: 'OpenAI GPT models integration',
    };
  }

  getSupportedModels(): string[] {
    return [
      'gpt-4',
      'gpt-4-turbo',
      'gpt-3.5-turbo',
      'gpt-3.5-turbo-16k',
    ];
  }

  async generateText(request: LLMRequest, correlationId: string): Promise<LLMResponse> {
    return this.executeWithCircuitBreaker('generateText', async () => {
      const client = this.httpClient.withCorrelationId(correlationId);
      
      const model = request.model || 'gpt-3.5-turbo';
      if (!this.validateModel(model)) {
        throw createLLMError(
          ERROR_CODES.LLM_MODEL_NOT_SUPPORTED,
          `Model ${model} is not supported by OpenAI provider`,
          this.provider.id
        );
      }

      const response = await client.post('/chat/completions', {
        model,
        messages: [{ role: 'user', content: request.prompt }],
        temperature: request.parameters?.temperature || 0.7,
        max_tokens: request.parameters?.maxTokens || 1000,
        top_p: request.parameters?.topP,
        frequency_penalty: request.parameters?.frequencyPenalty,
        presence_penalty: request.parameters?.presencePenalty,
      });

      const choice = response.data.choices[0];
      if (!choice) {
        throw createLLMError(
          ERROR_CODES.LLM_RESPONSE_INVALID,
          'No response choices returned from OpenAI',
          this.provider.id
        );
      }

      return {
        text: choice.message.content,
        usage: {
          promptTokens: response.data.usage.prompt_tokens,
          completionTokens: response.data.usage.completion_tokens,
          totalTokens: response.data.usage.total_tokens,
        },
        model: response.data.model,
        finishReason: choice.finish_reason,
        metadata: {
          responseId: response.data.id,
          created: response.data.created,
        },
      };
    });
  }
}

/**
 * Anthropic (Claude) provider client
 */
export class AnthropicProviderClient extends BaseLLMProviderClient {
  getProviderInfo() {
    return {
      name: 'Anthropic',
      version: '1.0.0',
      description: 'Anthropic Claude models integration',
    };
  }

  getSupportedModels(): string[] {
    return [
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307',
    ];
  }

  async generateText(request: LLMRequest, correlationId: string): Promise<LLMResponse> {
    return this.executeWithCircuitBreaker('generateText', async () => {
      const client = this.httpClient.withCorrelationId(correlationId);
      
      const model = request.model || 'claude-3-sonnet-20240229';
      if (!this.validateModel(model)) {
        throw createLLMError(
          ERROR_CODES.LLM_MODEL_NOT_SUPPORTED,
          `Model ${model} is not supported by Anthropic provider`,
          this.provider.id
        );
      }

      const response = await client.post('/v1/messages', {
        model,
        messages: [{ role: 'user', content: request.prompt }],
        max_tokens: request.parameters?.maxTokens || 1000,
        temperature: request.parameters?.temperature || 0.7,
        top_p: request.parameters?.topP,
      });

      const content = response.data.content[0];
      if (!content || content.type !== 'text') {
        throw createLLMError(
          ERROR_CODES.LLM_RESPONSE_INVALID,
          'No text content returned from Anthropic',
          this.provider.id
        );
      }

      return {
        text: content.text,
        usage: {
          promptTokens: response.data.usage.input_tokens,
          completionTokens: response.data.usage.output_tokens,
          totalTokens: response.data.usage.input_tokens + response.data.usage.output_tokens,
        },
        model: response.data.model,
        finishReason: response.data.stop_reason,
        metadata: {
          responseId: response.data.id,
          stopSequence: response.data.stop_sequence,
        },
      };
    });
  }
}

/**
 * Google (Gemini) provider client
 */
export class GeminiProviderClient extends BaseLLMProviderClient {
  getProviderInfo() {
    return {
      name: 'Google Gemini',
      version: '1.0.0',
      description: 'Google Gemini models integration',
    };
  }

  getSupportedModels(): string[] {
    return [
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-pro',
    ];
  }

  async generateText(request: LLMRequest, correlationId: string): Promise<LLMResponse> {
    return this.executeWithCircuitBreaker('generateText', async () => {
      const client = this.httpClient.withCorrelationId(correlationId);
      
      const model = request.model || 'gemini-pro';
      if (!this.validateModel(model)) {
        throw createLLMError(
          ERROR_CODES.LLM_MODEL_NOT_SUPPORTED,
          `Model ${model} is not supported by Google provider`,
          this.provider.id
        );
      }

      const response = await client.post(`/v1/models/${model}:generateContent`, {
        contents: [{
          parts: [{ text: request.prompt }],
        }],
        generationConfig: {
          temperature: request.parameters?.temperature || 0.7,
          maxOutputTokens: request.parameters?.maxTokens || 1000,
          topP: request.parameters?.topP,
        },
      });

      const candidate = response.data.candidates[0];
      if (!candidate || !candidate.content) {
        throw createLLMError(
          ERROR_CODES.LLM_RESPONSE_INVALID,
          'No content returned from Google Gemini',
          this.provider.id
        );
      }

      const text = candidate.content.parts[0]?.text;
      if (!text) {
        throw createLLMError(
          ERROR_CODES.LLM_RESPONSE_INVALID,
          'No text content in response from Google Gemini',
          this.provider.id
        );
      }

      // Google doesn't provide detailed token usage in the response
      const estimatedPromptTokens = Math.ceil(request.prompt.length / 4);
      const estimatedCompletionTokens = Math.ceil(text.length / 4);

      return {
        text,
        usage: {
          promptTokens: estimatedPromptTokens,
          completionTokens: estimatedCompletionTokens,
          totalTokens: estimatedPromptTokens + estimatedCompletionTokens,
        },
        model,
        finishReason: candidate.finishReason,
        metadata: {
          safetyRatings: candidate.safetyRatings,
        },
      };
    });
  }
}

/**
 * LLM client manager
 */
export class LLMClient {
  private providers: Map<string, LLMProviderClient> = new Map();
  private defaultProviderId?: string;

  /**
   * Register an LLM provider
   */
  registerProvider(provider: LLMProvider): void {
    let client: LLMProviderClient;

    switch (provider.type.toLowerCase()) {
      case 'openai':
        client = new OpenAIProviderClient(provider);
        break;
      case 'anthropic':
        client = new AnthropicProviderClient(provider);
        break;
      case 'google':
      case 'gemini':
        client = new GeminiProviderClient(provider);
        break;
      default:
        throw createLLMError(
          ERROR_CODES.LLM_PROVIDER_CONFIGURATION_INVALID,
          `Unsupported LLM provider type: ${provider.type}`,
          provider.id
        );
    }

    this.providers.set(provider.id, client);
    
    logger.info('LLM provider registered', {
      providerId: provider.id,
      type: provider.type,
      supportedModels: client.getSupportedModels(),
    });
  }

  /**
   * Set default provider
   */
  setDefaultProvider(providerId: string): void {
    if (!this.providers.has(providerId)) {
      throw createLLMError(
        ERROR_CODES.LLM_PROVIDER_NOT_FOUND,
        `Provider ${providerId} not found`,
        providerId
      );
    }
    
    this.defaultProviderId = providerId;
    logger.info('Default LLM provider set', { providerId });
  }

  /**
   * Generate text using specified or default provider
   */
  async generateText(
    request: LLMRequest,
    correlationId: string,
    providerId?: string
  ): Promise<LLMResponse & { providerId: string }> {
    const targetProviderId = providerId || this.defaultProviderId;
    
    if (!targetProviderId) {
      throw createLLMError(
        ERROR_CODES.LLM_PROVIDER_NOT_FOUND,
        'No provider specified and no default provider set'
      );
    }

    const client = this.providers.get(targetProviderId);
    if (!client) {
      throw createLLMError(
        ERROR_CODES.LLM_PROVIDER_NOT_FOUND,
        `Provider ${targetProviderId} not found`,
        targetProviderId
      );
    }

    const startTime = Date.now();
    
    try {
      logger.info('LLM text generation started', {
        providerId: targetProviderId,
        correlationId,
        model: request.model,
        promptLength: request.prompt.length,
      });

      const response = await client.generateText(request, correlationId);
      const duration = Date.now() - startTime;

      // Log usage
      logger.logLLMUsage(
        targetProviderId,
        response.model,
        response.usage.promptTokens,
        response.usage.completionTokens,
        duration,
        { correlationId }
      );

      logger.info('LLM text generation completed', {
        providerId: targetProviderId,
        correlationId,
        duration,
        tokens: response.usage.totalTokens,
      });

      return {
        ...response,
        providerId: targetProviderId,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      logger.error('LLM text generation failed', error as Error, {
        providerId: targetProviderId,
        correlationId,
        duration,
      });

      throw error;
    }
  }

  /**
   * Get available providers
   */
  getProviders(): Array<{ id: string; info: ReturnType<LLMProviderClient['getProviderInfo']> }> {
    return Array.from(this.providers.entries()).map(([id, client]) => ({
      id,
      info: client.getProviderInfo(),
    }));
  }

  /**
   * Get supported models for a provider
   */
  getSupportedModels(providerId: string): string[] {
    const client = this.providers.get(providerId);
    return client ? client.getSupportedModels() : [];
  }

  /**
   * Get all supported models across all providers
   */
  getAllSupportedModels(): Record<string, string[]> {
    const models: Record<string, string[]> = {};
    
    for (const [providerId, client] of this.providers.entries()) {
      models[providerId] = client.getSupportedModels();
    }
    
    return models;
  }

  /**
   * Validate if a model is supported by a provider
   */
  isModelSupported(providerId: string, model: string): boolean {
    const client = this.providers.get(providerId);
    return client ? client.validateModel(model) : false;
  }

  /**
   * Remove a provider
   */
  removeProvider(providerId: string): boolean {
    const removed = this.providers.delete(providerId);
    
    if (removed && this.defaultProviderId === providerId) {
      this.defaultProviderId = undefined;
    }
    
    if (removed) {
      logger.info('LLM provider removed', { providerId });
    }
    
    return removed;
  }

  /**
   * Get provider count
   */
  getProviderCount(): number {
    return this.providers.size;
  }

  /**
   * Clear all providers
   */
  clearProviders(): void {
    this.providers.clear();
    this.defaultProviderId = undefined;
    logger.info('All LLM providers cleared');
  }
}

// Default LLM client instance
export const llmClient = new LLMClient();