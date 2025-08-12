/**
 * Structured JSON logging utility with redaction capabilities
 * Provides consistent logging across the AstraVerse platform
 */

import { OrchestratorError } from '../errors/OrchestratorError';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  correlationId?: string;
  userId?: string;
  operationId?: string;
  stepId?: string;
  resourceId?: string;
  component?: string;
  metadata?: Record<string, unknown>;
  error?: {
    code?: string;
    name: string;
    message: string;
    stack?: string;
    cause?: string;
  };
}

export interface LoggerConfig {
  level: LogLevel;
  redactionEnabled: boolean;
  redactionFields: string[];
  redactionReplacement: string;
  enableConsole: boolean;
  enableFile: boolean;
  filePath?: string;
  enableStructured: boolean;
}

const DEFAULT_CONFIG: LoggerConfig = {
  level: 'info',
  redactionEnabled: true,
  redactionFields: [
    'password',
    'token',
    'apiKey',
    'secret',
    'authorization',
    'cookie',
    'session',
    'ssn',
    'credit_card',
    'creditCard',
    'email',
    'phone',
    'address',
  ],
  redactionReplacement: '[REDACTED]',
  enableConsole: true,
  enableFile: false,
  enableStructured: true,
};

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private config: LoggerConfig;
  private context: Partial<LogEntry>;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.context = {};
  }

  /**
   * Create a child logger with additional context
   */
  child(context: Partial<LogEntry>): Logger {
    const childLogger = new Logger(this.config);
    childLogger.context = { ...this.context, ...context };
    return childLogger;
  }

  /**
   * Set correlation ID for all logs from this logger instance
   */
  withCorrelationId(correlationId: string): Logger {
    return this.child({ correlationId });
  }

  /**
   * Set user ID for all logs from this logger instance
   */
  withUserId(userId: string): Logger {
    return this.child({ userId });
  }

  /**
   * Set operation ID for all logs from this logger instance
   */
  withOperationId(operationId: string): Logger {
    return this.child({ operationId });
  }

  /**
   * Set step ID for all logs from this logger instance
   */
  withStepId(stepId: string): Logger {
    return this.child({ stepId });
  }

  /**
   * Set component name for all logs from this logger instance
   */
  withComponent(component: string): Logger {
    return this.child({ component });
  }

  /**
   * Log debug message
   */
  debug(message: string, metadata?: Record<string, unknown>): void {
    this.log('debug', message, metadata);
  }

  /**
   * Log info message
   */
  info(message: string, metadata?: Record<string, unknown>): void {
    this.log('info', message, metadata);
  }

  /**
   * Log warning message
   */
  warn(message: string, metadata?: Record<string, unknown>): void {
    this.log('warn', message, metadata);
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error | OrchestratorError, metadata?: Record<string, unknown>): void {
    const entry: LogEntry = this.createLogEntry('error', message, metadata);
    
    if (error) {
      entry.error = this.formatError(error);
    }

    this.writeLog(entry);
  }

  /**
   * Log workflow events
   */
  logWorkflowEvent(
    level: LogLevel,
    workflowId: string,
    stepId: string | undefined,
    event: string,
    metadata?: Record<string, unknown>
  ): void {
    this.log(level, `Workflow event: ${event}`, {
      ...metadata,
      workflowId,
      stepId,
      eventType: event,
    });
  }

  /**
   * Log integration events
   */
  logIntegrationEvent(
    level: LogLevel,
    integrationId: string,
    operation: string,
    event: string,
    metadata?: Record<string, unknown>
  ): void {
    this.log(level, `Integration event: ${event}`, {
      ...metadata,
      integrationId,
      operation,
      eventType: event,
    });
  }

  /**
   * Log LLM usage
   */
  logLLMUsage(
    providerId: string,
    model: string,
    promptTokens: number,
    completionTokens: number,
    duration: number,
    metadata?: Record<string, unknown>
  ): void {
    this.info('LLM usage', {
      ...metadata,
      providerId,
      model,
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      duration,
      eventType: 'llm_usage',
    });
  }

  /**
   * Log performance metrics
   */
  logPerformance(
    operation: string,
    duration: number,
    success: boolean,
    metadata?: Record<string, unknown>
  ): void {
    this.info('Performance metric', {
      ...metadata,
      operation,
      duration,
      success,
      eventType: 'performance',
    });
  }

  /**
   * Log security events
   */
  logSecurityEvent(
    event: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    metadata?: Record<string, unknown>
  ): void {
    const level: LogLevel = severity === 'critical' || severity === 'high' ? 'error' : 'warn';
    this.log(level, `Security event: ${event}`, {
      ...metadata,
      severity,
      eventType: 'security',
    });
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, metadata?: Record<string, unknown>): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry = this.createLogEntry(level, message, metadata);
    this.writeLog(entry);
  }

  /**
   * Check if the log level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.level];
  }

  /**
   * Create a log entry with all context and metadata
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...this.context,
    };

    if (metadata) {
      entry.metadata = this.config.redactionEnabled
        ? this.redactSensitiveData(metadata)
        : metadata;
    }

    return entry;
  }

  /**
   * Format error for logging
   */
  private formatError(error: Error | OrchestratorError): LogEntry['error'] {
    const errorData: LogEntry['error'] = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };

    if (error instanceof OrchestratorError) {
      errorData.code = error.code;
    }

    if (error.cause && error.cause instanceof Error) {
      errorData.cause = error.cause.message;
    }

    return errorData;
  }

  /**
   * Write log entry to configured outputs
   */
  private writeLog(entry: LogEntry): void {
    if (this.config.enableConsole) {
      this.writeToConsole(entry);
    }

    // File output would be implemented here in a real system
    // For now, we're keeping it simple with console output
  }

  /**
   * Write to console with appropriate formatting
   */
  private writeToConsole(entry: LogEntry): void {
    if (this.config.enableStructured) {
      // Structured JSON output
      /* eslint-disable no-console */
      console.log(JSON.stringify(entry));
      /* eslint-enable no-console */
    } else {
      // Human-readable output
      const timestamp = entry.timestamp;
      const level = entry.level.toUpperCase().padEnd(5);
      const correlation = entry.correlationId ? ` [${entry.correlationId}]` : '';
      const component = entry.component ? ` [${entry.component}]` : '';
      const message = entry.message;
      
      let logLine = `${timestamp} ${level}${correlation}${component} ${message}`;
      
      if (entry.metadata && Object.keys(entry.metadata).length > 0) {
        logLine += ` ${JSON.stringify(entry.metadata)}`;
      }
      
      if (entry.error) {
        logLine += ` ERROR: ${JSON.stringify(entry.error)}`;
      }

      /* eslint-disable no-console */
      switch (entry.level) {
        case 'debug':
          console.debug(logLine);
          break;
        case 'info':
          console.info(logLine);
          break;
        case 'warn':
          console.warn(logLine);
          break;
        case 'error':
          console.error(logLine);
          break;
      }
      /* eslint-enable no-console */
    }
  }

  /**
   * Redact sensitive data from objects
   */
  private redactSensitiveData(data: Record<string, unknown>): Record<string, unknown> {
    return this.deepRedact(data, this.config.redactionFields);
  }

  /**
   * Recursively redact sensitive fields
   */
  private deepRedact(
    obj: unknown,
    fieldsToRedact: string[]
  ): unknown {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.deepRedact(item, fieldsToRedact));
    }

    const result: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const lowerKey = key.toLowerCase();
      const shouldRedact = fieldsToRedact.some(field => 
        lowerKey.includes(field.toLowerCase())
      );

      if (shouldRedact) {
        result[key] = this.config.redactionReplacement;
      } else if (typeof value === 'object' && value !== null) {
        result[key] = this.deepRedact(value, fieldsToRedact);
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  /**
   * Update logger configuration
   */
  setConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): LoggerConfig {
    return { ...this.config };
  }
}

// Default logger instance
export const logger = new Logger();

// Logger factory function
export function createLogger(config?: Partial<LoggerConfig>): Logger {
  return new Logger(config);
}

// Convenience function for workflow logging
export function createWorkflowLogger(
  workflowId: string,
  correlationId: string,
  config?: Partial<LoggerConfig>
): Logger {
  return createLogger(config)
    .withComponent('workflow')
    .withCorrelationId(correlationId)
    .child({ resourceId: workflowId });
}

// Convenience function for integration logging
export function createIntegrationLogger(
  integrationId: string,
  correlationId: string,
  config?: Partial<LoggerConfig>
): Logger {
  return createLogger(config)
    .withComponent('integration')
    .withCorrelationId(correlationId)
    .child({ resourceId: integrationId });
}

// Convenience function for LLM logging
export function createLLMLogger(
  providerId: string,
  correlationId: string,
  config?: Partial<LoggerConfig>
): Logger {
  return createLogger(config)
    .withComponent('llm')
    .withCorrelationId(correlationId)
    .child({ resourceId: providerId });
}