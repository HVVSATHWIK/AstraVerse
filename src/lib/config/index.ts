/**
 * Typed configuration loader with fail-fast behavior
 * Loads and validates environment variables with sensible defaults
 */

import { z } from 'zod';
import { ApplicationConfig } from '../../types/domain';
import { OrchestratorError } from '../errors/OrchestratorError';
import { ERROR_CODES } from '../errors/errorCodes';

// Configuration schema with validation and defaults
const ConfigSchema = z.object({
  server: z.object({
    port: z.coerce.number().int().min(1).max(65535).default(3000),
    host: z.string().default('localhost'),
    cors: z.object({
      origin: z.union([
        z.string(),
        z.array(z.string())
      ]).default('*'),
      methods: z.array(z.string()).default(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']),
      allowedHeaders: z.array(z.string()).default(['Content-Type', 'Authorization', 'X-Correlation-ID']),
    }),
    timeout: z.coerce.number().int().min(0).default(30000),
  }),

  database: z.object({
    url: z.string().min(1),
    pool: z.object({
      min: z.coerce.number().int().min(0).default(2),
      max: z.coerce.number().int().min(1).default(10),
      idleTimeoutMillis: z.coerce.number().int().min(0).default(30000),
    }),
    migrations: z.object({
      directory: z.string().default('./migrations'),
      tableName: z.string().default('knex_migrations'),
    }),
  }),

  logging: z.object({
    level: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
    format: z.enum(['json', 'text']).default('json'),
    outputs: z.array(z.object({
      type: z.enum(['console', 'file', 'http']),
      config: z.record(z.unknown()),
    })).default([{ type: 'console', config: {} }]),
    redaction: z.object({
      enabled: z.coerce.boolean().default(true),
      fields: z.array(z.string()).default([
        'password', 'token', 'apiKey', 'secret', 'authorization'
      ]),
      replacement: z.string().default('[REDACTED]'),
    }),
  }),

  integrations: z.record(z.object({
    baseUrl: z.string().url().optional(),
    authentication: z.object({
      type: z.enum(['bearer', 'basic', 'apikey', 'oauth2']),
      credentials: z.record(z.string()),
    }).optional(),
    timeout: z.coerce.number().int().min(0).optional(),
    retryPolicy: z.object({
      maxAttempts: z.coerce.number().int().min(1).default(3),
      baseDelay: z.coerce.number().min(0).default(1000),
      maxDelay: z.coerce.number().min(0).default(10000),
      backoffMultiplier: z.coerce.number().min(1).default(2),
    }).optional(),
    circuitBreaker: z.object({
      failureThreshold: z.coerce.number().int().min(1).default(5),
      recoveryTimeout: z.coerce.number().int().min(0).default(60000),
      monitoringPeriod: z.coerce.number().int().min(0).default(10000),
    }).optional(),
  })).default({}),

  llm: z.object({
    defaultProvider: z.string().default('gemini'),
    providers: z.record(z.object({
      apiKey: z.string().optional(),
      baseUrl: z.string().url().optional(),
      timeout: z.coerce.number().int().min(0).default(30000),
      retryPolicy: z.object({
        maxAttempts: z.coerce.number().int().min(1).default(3),
        baseDelay: z.coerce.number().min(0).default(1000),
        maxDelay: z.coerce.number().min(0).default(10000),
        backoffMultiplier: z.coerce.number().min(1).default(2),
      }).optional(),
      rateLimits: z.object({
        requestsPerMinute: z.coerce.number().int().min(0).default(60),
        tokensPerMinute: z.coerce.number().int().min(0).default(100000),
        concurrentRequests: z.coerce.number().int().min(1).default(5),
      }).optional(),
    })).default({}),
    promptCache: z.object({
      ttl: z.coerce.number().int().min(0).default(3600000), // 1 hour
      maxSize: z.coerce.number().int().min(0).default(1000),
    }),
  }),

  security: z.object({
    jwt: z.object({
      secret: z.string().min(32),
      expiresIn: z.string().default('24h'),
      issuer: z.string().default('astraverse'),
      audience: z.string().default('astraverse-api'),
    }),
    encryption: z.object({
      algorithm: z.string().default('aes-256-gcm'),
      keySize: z.coerce.number().int().min(1).default(32),
      saltRounds: z.coerce.number().int().min(1).default(12),
    }),
    rbac: z.object({
      enabled: z.coerce.boolean().default(true),
      defaultRole: z.string().default('user'),
      superAdminRole: z.string().default('super_admin'),
    }),
  }),

  observability: z.object({
    metrics: z.object({
      enabled: z.coerce.boolean().default(true),
      collection: z.object({
        interval: z.coerce.number().int().min(0).default(10000), // 10 seconds
        batchSize: z.coerce.number().int().min(1).default(100),
      }),
      retention: z.object({
        duration: z.coerce.number().int().min(0).default(604800000), // 7 days
        maxPoints: z.coerce.number().int().min(0).default(100000),
      }),
    }),
    tracing: z.object({
      enabled: z.coerce.boolean().default(true),
      sampleRate: z.coerce.number().min(0).max(1).default(0.1),
      exporterType: z.string().default('console'),
      exporterConfig: z.record(z.unknown()).default({}),
    }),
    healthCheck: z.object({
      endpoint: z.string().url().default('http://localhost:3000/health'),
      interval: z.coerce.number().int().min(0).default(30000), // 30 seconds
      timeout: z.coerce.number().int().min(0).default(5000), // 5 seconds
      expectedStatus: z.coerce.number().int().min(100).max(599).default(200),
    }),
  }),
});

type ConfigInput = z.input<typeof ConfigSchema>;
type ConfigOutput = z.output<typeof ConfigSchema>;

/**
 * Environment variable mapping
 */
function getEnvironmentConfig(): ConfigInput {
  const env = process.env;

  // Parse CORS origin (can be string or array)
  let corsOrigin: string | string[] = env.CORS_ORIGIN || '*';
  if (corsOrigin.includes(',')) {
    corsOrigin = corsOrigin.split(',').map(origin => origin.trim());
  }

  return {
    server: {
      port: env.PORT,
      host: env.HOST,
      cors: {
        origin: corsOrigin,
        methods: env.CORS_METHODS?.split(',').map(m => m.trim()),
        allowedHeaders: env.CORS_ALLOWED_HEADERS?.split(',').map(h => h.trim()),
      },
      timeout: env.SERVER_TIMEOUT,
    },

    database: {
      url: env.DATABASE_URL,
      pool: {
        min: env.DB_POOL_MIN,
        max: env.DB_POOL_MAX,
        idleTimeoutMillis: env.DB_IDLE_TIMEOUT,
      },
      migrations: {
        directory: env.DB_MIGRATIONS_DIR,
        tableName: env.DB_MIGRATIONS_TABLE,
      },
    },

    logging: {
      level: env.LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error',
      format: env.LOG_FORMAT as 'json' | 'text',
      outputs: [], // Will be set to default by schema
      redaction: {
        enabled: env.LOG_REDACTION_ENABLED,
        fields: env.LOG_REDACTION_FIELDS?.split(',').map(f => f.trim()),
        replacement: env.LOG_REDACTION_REPLACEMENT,
      },
    },

    integrations: buildIntegrationConfig(),

    llm: {
      defaultProvider: env.LLM_DEFAULT_PROVIDER,
      providers: buildLLMProviderConfig(),
      promptCache: {
        ttl: env.CACHE_TTL,
        maxSize: env.CACHE_MAX_SIZE,
      },
    },

    security: {
      jwt: {
        secret: env.JWT_SECRET,
        expiresIn: env.JWT_EXPIRES_IN,
        issuer: env.JWT_ISSUER,
        audience: env.JWT_AUDIENCE,
      },
      encryption: {
        algorithm: env.ENCRYPTION_ALGORITHM,
        keySize: env.ENCRYPTION_KEY_SIZE,
        saltRounds: env.ENCRYPTION_SALT_ROUNDS,
      },
      rbac: {
        enabled: env.RBAC_ENABLED,
        defaultRole: env.RBAC_DEFAULT_ROLE,
        superAdminRole: env.RBAC_SUPER_ADMIN_ROLE,
      },
    },

    observability: {
      metrics: {
        enabled: env.METRICS_ENABLED,
        collection: {
          interval: env.METRICS_COLLECTION_INTERVAL,
          batchSize: env.METRICS_BATCH_SIZE,
        },
        retention: {
          duration: env.METRICS_RETENTION_DURATION,
          maxPoints: env.METRICS_MAX_POINTS,
        },
      },
      tracing: {
        enabled: env.TRACING_ENABLED,
        sampleRate: env.TRACING_SAMPLE_RATE,
        exporterType: env.TRACING_EXPORTER_TYPE,
        exporterConfig: {},
      },
      healthCheck: {
        endpoint: env.HEALTH_CHECK_ENDPOINT,
        interval: env.HEALTH_CHECK_INTERVAL,
        timeout: env.HEALTH_CHECK_TIMEOUT,
        expectedStatus: env.HEALTH_CHECK_EXPECTED_STATUS,
      },
    },
  };
}

/**
 * Build integration configuration from environment variables
 */
function buildIntegrationConfig(): Record<string, any> {
  const integrations: Record<string, any> = {};

  // Slack integration
  if (process.env.SLACK_BOT_TOKEN) {
    integrations.slack = {
      baseUrl: 'https://slack.com/api',
      authentication: {
        type: 'bearer',
        credentials: {
          token: process.env.SLACK_BOT_TOKEN,
        },
      },
      timeout: 10000,
    };
  }

  // GitHub integration
  if (process.env.GITHUB_TOKEN) {
    integrations.github = {
      baseUrl: 'https://api.github.com',
      authentication: {
        type: 'bearer',
        credentials: {
          token: process.env.GITHUB_TOKEN,
        },
      },
      timeout: 15000,
    };
  }

  // Notion integration
  if (process.env.NOTION_TOKEN) {
    integrations.notion = {
      baseUrl: 'https://api.notion.com/v1',
      authentication: {
        type: 'bearer',
        credentials: {
          token: process.env.NOTION_TOKEN,
        },
      },
      timeout: 10000,
    };
  }

  return integrations;
}

/**
 * Build LLM provider configuration from environment variables
 */
function buildLLMProviderConfig(): Record<string, any> {
  const providers: Record<string, any> = {};

  // OpenAI provider
  if (process.env.OPENAI_API_KEY) {
    providers.openai = {
      apiKey: process.env.OPENAI_API_KEY,
      baseUrl: 'https://api.openai.com/v1',
      timeout: 30000,
    };
  }

  // Anthropic provider
  if (process.env.ANTHROPIC_API_KEY) {
    providers.anthropic = {
      apiKey: process.env.ANTHROPIC_API_KEY,
      baseUrl: 'https://api.anthropic.com',
      timeout: 30000,
    };
  }

  // Google (Gemini) provider
  if (process.env.GOOGLE_API_KEY) {
    providers.gemini = {
      apiKey: process.env.GOOGLE_API_KEY,
      baseUrl: 'https://generativelanguage.googleapis.com/v1',
      timeout: 30000,
    };
  }

  return providers;
}

/**
 * Validate required environment variables
 */
function validateRequiredEnvVars(): void {
  const required = [
    'DATABASE_URL',
    'JWT_SECRET',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new OrchestratorError(
      ERROR_CODES.CONFIGURATION_ERROR,
      `Missing required environment variables: ${missing.join(', ')}`,
      {
        context: {
          additionalInfo: { missingVariables: missing },
        },
      }
    );
  }

  // Validate JWT secret length
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    throw new OrchestratorError(
      ERROR_CODES.CONFIGURATION_ERROR,
      'JWT_SECRET must be at least 32 characters long',
      {
        context: {
          additionalInfo: { actualLength: process.env.JWT_SECRET.length },
        },
      }
    );
  }
}

/**
 * Load and validate configuration
 */
export function loadConfig(): ApplicationConfig {
  try {
    // Validate required environment variables first
    validateRequiredEnvVars();

    // Get configuration from environment
    const envConfig = getEnvironmentConfig();

    // Parse and validate with schema
    const config = ConfigSchema.parse(envConfig);

    return config as ApplicationConfig;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join('; ');

      throw new OrchestratorError(
        ERROR_CODES.CONFIGURATION_ERROR,
        `Configuration validation failed: ${errorMessage}`,
        {
          context: {
            additionalInfo: { zodErrors: error.errors },
          },
        }
      );
    }

    throw error;
  }
}

/**
 * Load configuration with custom environment variables (for testing)
 */
export function loadConfigWithEnv(env: Record<string, string>): ApplicationConfig {
  const originalEnv = process.env;
  
  try {
    // Temporarily override process.env
    process.env = { ...originalEnv, ...env };
    return loadConfig();
  } finally {
    // Restore original environment
    process.env = originalEnv;
  }
}

/**
 * Get configuration value by path
 */
export function getConfigValue<T>(config: ApplicationConfig, path: string): T {
  const keys = path.split('.');
  let current: any = config;

  for (const key of keys) {
    if (current === null || current === undefined || !(key in current)) {
      throw new OrchestratorError(
        ERROR_CODES.CONFIGURATION_ERROR,
        `Configuration path '${path}' not found`,
        {
          context: {
            additionalInfo: { path, availableKeys: Object.keys(current || {}) },
          },
        }
      );
    }
    current = current[key];
  }

  return current as T;
}

/**
 * Check if configuration value exists
 */
export function hasConfigValue(config: ApplicationConfig, path: string): boolean {
  try {
    getConfigValue(config, path);
    return true;
  } catch {
    return false;
  }
}

// Global configuration instance
let globalConfig: ApplicationConfig | null = null;

/**
 * Initialize global configuration
 */
export function initializeConfig(): ApplicationConfig {
  if (!globalConfig) {
    globalConfig = loadConfig();
  }
  return globalConfig;
}

/**
 * Get global configuration instance
 */
export function getConfig(): ApplicationConfig {
  if (!globalConfig) {
    throw new OrchestratorError(
      ERROR_CODES.CONFIGURATION_ERROR,
      'Configuration not initialized. Call initializeConfig() first.',
    );
  }
  return globalConfig;
}

/**
 * Reset global configuration (for testing)
 */
export function resetConfig(): void {
  globalConfig = null;
}