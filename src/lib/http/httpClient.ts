/**
 * HTTP client wrapper with retry logic and authentication
 * Provides consistent HTTP handling across the platform
 */

import { OrchestratorError, createTimeoutError, createIntegrationError } from '../errors/OrchestratorError';
import { ERROR_CODES } from '../errors/errorCodes';
import { logger } from '../logging/logger';
import type { RetryPolicy, AuthenticationConfig } from '../../types/domain';

export interface HttpClientConfig {
  baseUrl?: string;
  timeout?: number;
  retryPolicy?: RetryPolicy;
  authentication?: AuthenticationConfig;
  defaultHeaders?: Record<string, string>;
  maxRedirects?: number;
  validateStatus?: (status: number) => boolean;
}

export interface HttpRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  url: string;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
  timeout?: number;
  retryPolicy?: RetryPolicy;
  validateStatus?: (status: number) => boolean;
}

export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: HttpRequestOptions;
}

export interface HttpError extends Error {
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
  config?: HttpRequestOptions;
  response?: HttpResponse;
}

const DEFAULT_CONFIG: Required<Omit<HttpClientConfig, 'baseUrl' | 'authentication'>> = {
  timeout: 10000,
  retryPolicy: {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
  },
  defaultHeaders: {
    'Content-Type': 'application/json',
    'User-Agent': 'AstraVerse-Client/1.0',
  },
  maxRedirects: 5,
  validateStatus: (status: number) => status >= 200 && status < 300,
};

export class HttpClient {
  private config: HttpClientConfig;
  private correlationId?: string;

  constructor(config: HttpClientConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Set correlation ID for all requests
   */
  withCorrelationId(correlationId: string): HttpClient {
    const client = new HttpClient(this.config);
    client.correlationId = correlationId;
    return client;
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, options: Partial<HttpRequestOptions> = {}): Promise<HttpResponse<T>> {
    return this.request<T>({ ...options, method: 'GET', url });
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, body?: any, options: Partial<HttpRequestOptions> = {}): Promise<HttpResponse<T>> {
    return this.request<T>({ ...options, method: 'POST', url, body });
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, body?: any, options: Partial<HttpRequestOptions> = {}): Promise<HttpResponse<T>> {
    return this.request<T>({ ...options, method: 'PUT', url, body });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, options: Partial<HttpRequestOptions> = {}): Promise<HttpResponse<T>> {
    return this.request<T>({ ...options, method: 'DELETE', url });
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, body?: any, options: Partial<HttpRequestOptions> = {}): Promise<HttpResponse<T>> {
    return this.request<T>({ ...options, method: 'PATCH', url, body });
  }

  /**
   * HEAD request
   */
  async head(url: string, options: Partial<HttpRequestOptions> = {}): Promise<HttpResponse<void>> {
    return this.request<void>({ ...options, method: 'HEAD', url });
  }

  /**
   * Core request method with retry logic
   */
  async request<T = any>(options: HttpRequestOptions): Promise<HttpResponse<T>> {
    const requestConfig = this.buildRequestConfig(options);
    const retryPolicy = options.retryPolicy || this.config.retryPolicy!;

    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= retryPolicy.maxAttempts; attempt++) {
      try {
        logger.debug('HTTP request attempt', {
          correlationId: this.correlationId,
          attempt,
          maxAttempts: retryPolicy.maxAttempts,
          method: options.method,
          url: this.buildUrl(options.url, options.params),
        });

        const response = await this.performRequest<T>(requestConfig);
        
        logger.debug('HTTP request successful', {
          correlationId: this.correlationId,
          attempt,
          status: response.status,
          method: options.method,
          url: this.buildUrl(options.url, options.params),
        });

        return response;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        logger.warn('HTTP request failed', {
          correlationId: this.correlationId,
          attempt,
          maxAttempts: retryPolicy.maxAttempts,
          method: options.method,
          url: this.buildUrl(options.url, options.params),
          error: lastError.message,
        });

        // Don't retry on final attempt or non-retryable errors
        if (attempt === retryPolicy.maxAttempts || !this.isRetryableError(error)) {
          break;
        }

        // Calculate delay for next attempt
        const delay = Math.min(
          retryPolicy.baseDelay * Math.pow(retryPolicy.backoffMultiplier, attempt - 1),
          retryPolicy.maxDelay
        );

        logger.debug('Retrying HTTP request', {
          correlationId: this.correlationId,
          nextAttempt: attempt + 1,
          delayMs: delay,
        });

        await this.delay(delay);
      }
    }

    // All attempts failed, throw the last error
    throw this.convertToOrchestratorError(lastError!, options);
  }

  /**
   * Build full request configuration
   */
  private buildRequestConfig(options: HttpRequestOptions): HttpRequestOptions {
    const headers = {
      ...this.config.defaultHeaders,
      ...options.headers,
    };

    // Add correlation ID header if available
    if (this.correlationId) {
      headers['X-Correlation-ID'] = this.correlationId;
    }

    // Add authentication headers
    if (this.config.authentication) {
      const authHeaders = this.buildAuthHeaders(this.config.authentication);
      Object.assign(headers, authHeaders);
    }

    return {
      ...options,
      url: this.buildUrl(options.url, options.params),
      headers,
      timeout: options.timeout || this.config.timeout,
      validateStatus: options.validateStatus || this.config.validateStatus,
    };
  }

  /**
   * Build authentication headers
   */
  private buildAuthHeaders(auth: AuthenticationConfig): Record<string, string> {
    switch (auth.type) {
      case 'bearer':
        return { Authorization: `Bearer ${auth.credentials.token}` };
      
      case 'basic':
        const encoded = Buffer.from(`${auth.credentials.username}:${auth.credentials.password}`).toString('base64');
        return { Authorization: `Basic ${encoded}` };
      
      case 'apikey':
        if (auth.credentials.headerName) {
          return { [auth.credentials.headerName]: auth.credentials.apiKey };
        }
        return { 'X-API-Key': auth.credentials.apiKey };
      
      case 'oauth2':
        return { Authorization: `Bearer ${auth.credentials.accessToken}` };
      
      default:
        return {};
    }
  }

  /**
   * Build full URL with query parameters
   */
  private buildUrl(url: string, params?: Record<string, string>): string {
    const baseUrl = this.config.baseUrl || '';
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;

    if (!params || Object.keys(params).length === 0) {
      return fullUrl;
    }

    const urlObj = new URL(fullUrl);
    Object.entries(params).forEach(([key, value]) => {
      urlObj.searchParams.set(key, value);
    });

    return urlObj.toString();
  }

  /**
   * Perform the actual HTTP request using fetch
   */
  private async performRequest<T>(config: HttpRequestOptions): Promise<HttpResponse<T>> {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, config.timeout);

    try {
      const fetchOptions: RequestInit = {
        method: config.method,
        headers: config.headers,
        signal: controller.signal,
      };

      // Add body for requests that support it
      if (config.body && ['POST', 'PUT', 'PATCH'].includes(config.method)) {
        if (typeof config.body === 'string') {
          fetchOptions.body = config.body;
        } else {
          fetchOptions.body = JSON.stringify(config.body);
        }
      }

      const response = await fetch(config.url, fetchOptions);

      // Check if status is valid
      const validateStatus = config.validateStatus || DEFAULT_CONFIG.validateStatus;
      if (!validateStatus(response.status)) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Parse response data
      let data: T;
      const contentType = response.headers.get('content-type') || '';
      
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else if (config.method === 'HEAD') {
        data = undefined as T;
      } else {
        data = await response.text() as T;
      }

      // Convert headers to plain object
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers,
        config,
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw createTimeoutError('HTTP request', config.timeout!);
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: unknown): boolean {
    if (error instanceof OrchestratorError) {
      return error.isRetryable();
    }

    // Network errors are generally retryable
    if (error instanceof Error) {
      // Connection errors
      if (error.message.includes('fetch') || error.message.includes('network')) {
        return true;
      }

      // Server errors (5xx) are retryable
      if (error.message.includes('HTTP 5')) {
        return true;
      }

      // Rate limiting (429) is retryable
      if (error.message.includes('HTTP 429')) {
        return true;
      }

      // Request timeout (408) is retryable
      if (error.message.includes('HTTP 408')) {
        return true;
      }
    }

    return false;
  }

  /**
   * Convert error to OrchestratorError
   */
  private convertToOrchestratorError(error: Error, config: HttpRequestOptions): OrchestratorError {
    if (error instanceof OrchestratorError) {
      return error;
    }

    let errorCode = ERROR_CODES.INTEGRATION_REQUEST_FAILED;
    
    if (error.message.includes('timeout') || error.name === 'AbortError') {
      errorCode = ERROR_CODES.INTEGRATION_TIMEOUT;
    } else if (error.message.includes('HTTP 401')) {
      errorCode = ERROR_CODES.INTEGRATION_AUTHENTICATION_FAILED;
    } else if (error.message.includes('HTTP 429')) {
      errorCode = ERROR_CODES.INTEGRATION_RATE_LIMITED;
    } else if (error.message.includes('fetch') || error.message.includes('network')) {
      errorCode = ERROR_CODES.INTEGRATION_CONNECTION_FAILED;
    }

    return createIntegrationError(
      errorCode,
      error.message,
      undefined,
      {
        correlationId: this.correlationId,
        additionalInfo: {
          method: config.method,
          url: config.url,
          headers: config.headers,
        },
      }
    );
  }

  /**
   * Delay utility for retry backoff
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Create a new client with different configuration
   */
  withConfig(config: Partial<HttpClientConfig>): HttpClient {
    return new HttpClient({ ...this.config, ...config });
  }

  /**
   * Create a new client with different base URL
   */
  withBaseUrl(baseUrl: string): HttpClient {
    return this.withConfig({ baseUrl });
  }

  /**
   * Create a new client with authentication
   */
  withAuth(authentication: AuthenticationConfig): HttpClient {
    return this.withConfig({ authentication });
  }

  /**
   * Create a new client with custom headers
   */
  withHeaders(headers: Record<string, string>): HttpClient {
    const defaultHeaders = { ...this.config.defaultHeaders, ...headers };
    return this.withConfig({ defaultHeaders });
  }

  /**
   * Create a new client with timeout
   */
  withTimeout(timeout: number): HttpClient {
    return this.withConfig({ timeout });
  }

  /**
   * Get current configuration
   */
  getConfig(): HttpClientConfig {
    return { ...this.config };
  }
}

// Default HTTP client instance
export const httpClient = new HttpClient();

// Factory function for creating HTTP clients
export function createHttpClient(config?: HttpClientConfig): HttpClient {
  return new HttpClient(config);
}