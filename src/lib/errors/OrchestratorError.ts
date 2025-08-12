/**
 * Unified error class for the AstraVerse platform
 * Provides consistent error handling and context preservation
 */

import { ERROR_CODES, ErrorCode, getErrorMetadata, getUserErrorMessage } from './errorCodes';

export interface ErrorContext {
  correlationId?: string;
  userId?: string;
  operationId?: string;
  stepId?: string;
  resourceId?: string;
  additionalInfo?: Record<string, unknown>;
}

export interface ErrorOptions {
  cause?: Error;
  context?: ErrorContext;
  userMessage?: string;
  retryable?: boolean;
  statusCode?: number;
}

/**
 * Centralized error class that extends the native Error class
 * with additional context and metadata for better error handling
 */
export class OrchestratorError extends Error {
  public readonly code: ErrorCode;
  public readonly timestamp: Date;
  public readonly correlationId?: string;
  public readonly userId?: string;
  public readonly operationId?: string;
  public readonly stepId?: string;
  public readonly resourceId?: string;
  public readonly userMessage: string;
  public readonly retryable: boolean;
  public readonly severity: string;
  public readonly category: string;
  public readonly statusCode: number;
  public readonly context: ErrorContext;
  public readonly cause?: Error;

  constructor(
    code: ErrorCode,
    message: string,
    options: ErrorOptions = {}
  ) {
    super(message);
    
    this.name = 'OrchestratorError';
    this.code = code;
    this.timestamp = new Date();
    this.cause = options.cause;
    this.context = options.context || {};
    
    // Extract context properties for easy access
    this.correlationId = this.context.correlationId;
    this.userId = this.context.userId;
    this.operationId = this.context.operationId;
    this.stepId = this.context.stepId;
    this.resourceId = this.context.resourceId;

    // Get metadata for the error code
    const metadata = getErrorMetadata(code);
    this.category = metadata.category;
    this.severity = metadata.severity;
    this.retryable = options.retryable ?? metadata.retryable;
    this.userMessage = options.userMessage || getUserErrorMessage(code);
    
    // Set status code based on category and severity
    this.statusCode = options.statusCode || this.getDefaultStatusCode();

    // Ensure proper prototype chain
    Object.setPrototypeOf(this, OrchestratorError.prototype);
    
    // Capture stack trace if available
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OrchestratorError);
    }
  }

  private getDefaultStatusCode(): number {
    // Map error categories to HTTP status codes
    switch (this.category) {
      case 'auth':
        return this.code === ERROR_CODES.AUTH_PERMISSION_DENIED ? 403 : 401;
      case 'system':
        if (this.code === ERROR_CODES.RESOURCE_NOT_FOUND) return 404;
        if (this.code === ERROR_CODES.RESOURCE_CONFLICT) return 409;
        if (this.code === ERROR_CODES.VALIDATION_ERROR) return 400;
        if (this.code === ERROR_CODES.RATE_LIMIT_EXCEEDED) return 429;
        if (this.code === ERROR_CODES.SERVICE_UNAVAILABLE) return 503;
        return 500;
      case 'workflow':
      case 'integration':
      case 'llm':
      case 'data':
        return this.code.includes('NOT_FOUND') ? 404 : 400;
      case 'database':
      case 'security':
      case 'observability':
      default:
        return 500;
    }
  }

  /**
   * Convert error to JSON for logging and serialization
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      userMessage: this.userMessage,
      timestamp: this.timestamp.toISOString(),
      category: this.category,
      severity: this.severity,
      retryable: this.retryable,
      statusCode: this.statusCode,
      correlationId: this.correlationId,
      userId: this.userId,
      operationId: this.operationId,
      stepId: this.stepId,
      resourceId: this.resourceId,
      context: this.context,
      stack: this.stack,
      cause: this.cause ? {
        name: this.cause.name,
        message: this.cause.message,
        stack: this.cause.stack,
      } : undefined,
    };
  }

  /**
   * Create a new error with additional context
   */
  withContext(context: Partial<ErrorContext>): OrchestratorError {
    return new OrchestratorError(this.code, this.message, {
      cause: this.cause,
      context: { ...this.context, ...context },
      userMessage: this.userMessage,
      retryable: this.retryable,
      statusCode: this.statusCode,
    });
  }

  /**
   * Create a new error with a correlation ID
   */
  withCorrelationId(correlationId: string): OrchestratorError {
    return this.withContext({ correlationId });
  }

  /**
   * Create a new error with a user ID
   */
  withUserId(userId: string): OrchestratorError {
    return this.withContext({ userId });
  }

  /**
   * Create a new error with a step ID
   */
  withStepId(stepId: string): OrchestratorError {
    return this.withContext({ stepId });
  }

  /**
   * Create a new error with an operation ID
   */
  withOperationId(operationId: string): OrchestratorError {
    return this.withContext({ operationId });
  }

  /**
   * Check if this error should be retried
   */
  isRetryable(): boolean {
    return this.retryable;
  }

  /**
   * Check if this error is a client error (4xx status)
   */
  isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500;
  }

  /**
   * Check if this error is a server error (5xx status)
   */
  isServerError(): boolean {
    return this.statusCode >= 500;
  }

  /**
   * Check if this error is critical
   */
  isCritical(): boolean {
    return this.severity === 'critical';
  }

  /**
   * Create a safe version of the error for external exposure
   * (removes sensitive information)
   */
  toSafeJSON(): Record<string, unknown> {
    return {
      code: this.code,
      message: this.userMessage,
      timestamp: this.timestamp.toISOString(),
      category: this.category,
      retryable: this.retryable,
      statusCode: this.statusCode,
      correlationId: this.correlationId,
    };
  }
}

/**
 * Helper function to convert any error to an OrchestratorError
 */
export function toOrchestratorError(
  error: unknown,
  defaultCode: ErrorCode = ERROR_CODES.UNKNOWN_ERROR,
  context?: ErrorContext
): OrchestratorError {
  if (error instanceof OrchestratorError) {
    return context ? error.withContext(context) : error;
  }

  if (error instanceof Error) {
    return new OrchestratorError(defaultCode, error.message, {
      cause: error,
      context,
    });
  }

  // Handle string errors
  if (typeof error === 'string') {
    return new OrchestratorError(defaultCode, error, { context });
  }

  // Handle any other type of error
  return new OrchestratorError(defaultCode, 'An unknown error occurred', {
    context: {
      ...context,
      additionalInfo: { originalError: error },
    },
  });
}

/**
 * Helper function to create validation errors
 */
export function createValidationError(
  message: string,
  context?: ErrorContext
): OrchestratorError {
  return new OrchestratorError(ERROR_CODES.VALIDATION_ERROR, message, {
    context,
    statusCode: 400,
  });
}

/**
 * Helper function to create permission denied errors
 */
export function createPermissionError(
  message: string,
  context?: ErrorContext
): OrchestratorError {
  return new OrchestratorError(ERROR_CODES.PERMISSION_DENIED, message, {
    context,
    statusCode: 403,
  });
}

/**
 * Helper function to create resource not found errors
 */
export function createNotFoundError(
  resource: string,
  id: string,
  context?: ErrorContext
): OrchestratorError {
  return new OrchestratorError(
    ERROR_CODES.RESOURCE_NOT_FOUND,
    `${resource} with ID '${id}' not found`,
    {
      context: { ...context, resourceId: id },
      statusCode: 404,
    }
  );
}

/**
 * Helper function to create timeout errors
 */
export function createTimeoutError(
  operation: string,
  timeout: number,
  context?: ErrorContext
): OrchestratorError {
  return new OrchestratorError(
    ERROR_CODES.TIMEOUT_ERROR,
    `Operation '${operation}' timed out after ${timeout}ms`,
    {
      context: { ...context, operationId: operation },
      statusCode: 408,
    }
  );
}

/**
 * Helper function to create workflow errors
 */
export function createWorkflowError(
  code: ErrorCode,
  message: string,
  workflowId?: string,
  stepId?: string,
  context?: ErrorContext
): OrchestratorError {
  return new OrchestratorError(code, message, {
    context: {
      ...context,
      resourceId: workflowId,
      stepId,
    },
  });
}

/**
 * Helper function to create integration errors
 */
export function createIntegrationError(
  code: ErrorCode,
  message: string,
  integrationId?: string,
  context?: ErrorContext
): OrchestratorError {
  return new OrchestratorError(code, message, {
    context: {
      ...context,
      resourceId: integrationId,
    },
  });
}

/**
 * Helper function to create LLM errors
 */
export function createLLMError(
  code: ErrorCode,
  message: string,
  providerId?: string,
  context?: ErrorContext
): OrchestratorError {
  return new OrchestratorError(code, message, {
    context: {
      ...context,
      resourceId: providerId,
    },
  });
}