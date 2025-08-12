/**
 * Zod validation schemas for runtime validation of domain types
 * Ensures data integrity and type safety at runtime
 */

import { z } from 'zod';

// Base schemas
export const BaseEntitySchema = z.object({
  id: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// User and Authentication schemas
export const PermissionSchema = z.object({
  id: z.string().min(1),
  resource: z.string().min(1),
  actions: z.array(z.string().min(1)),
});

export const RoleSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  permissions: z.array(PermissionSchema),
});

export const UserSchema = BaseEntitySchema.extend({
  email: z.string().email(),
  name: z.string().min(1),
  roles: z.array(RoleSchema),
});

// Workflow schemas
export const WorkflowStatusSchema = z.enum(['draft', 'active', 'archived', 'deprecated']);

export const RetryPolicySchema = z.object({
  maxAttempts: z.number().int().min(1),
  baseDelay: z.number().min(0),
  maxDelay: z.number().min(0),
  backoffMultiplier: z.number().min(1),
});

export const ErrorHandlerSchema = z.object({
  strategy: z.enum(['retry', 'skip', 'fail', 'fallback']),
  retryPolicy: RetryPolicySchema.optional(),
  fallbackStepId: z.string().optional(),
});

export const BaseStepSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  position: z.number().int().min(0),
  nextStepId: z.string().optional(),
  onError: ErrorHandlerSchema.optional(),
});

export const LLMParametersSchema = z.object({
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().min(1).optional(),
  topP: z.number().min(0).max(1).optional(),
  frequencyPenalty: z.number().min(-2).max(2).optional(),
  presencePenalty: z.number().min(-2).max(2).optional(),
  model: z.string().optional(),
}).catchall(z.unknown());

export const LLMStepSchema = BaseStepSchema.extend({
  type: z.literal('llm'),
  provider: z.string().min(1),
  promptTemplateId: z.string().min(1),
  parameters: LLMParametersSchema,
  outputMapping: z.record(z.string()).optional(),
});

export const IntegrationStepSchema = BaseStepSchema.extend({
  type: z.literal('integration'),
  adapterId: z.string().min(1),
  operation: z.string().min(1),
  parameters: z.record(z.unknown()),
  retryPolicy: RetryPolicySchema.optional(),
});

export const ConditionalStepSchema = BaseStepSchema.extend({
  type: z.literal('conditional'),
  condition: z.string().min(1),
  trueStepId: z.string().min(1),
  falseStepId: z.string().optional(),
});

export const LoopStepSchema = BaseStepSchema.extend({
  type: z.literal('loop'),
  iterable: z.string().min(1),
  loopStepId: z.string().min(1),
  maxIterations: z.number().int().min(1).optional(),
});

export const WaitStepSchema = BaseStepSchema.extend({
  type: z.literal('wait'),
  duration: z.number().int().min(0),
  condition: z.string().optional(),
});

export const WorkflowStepSchema = z.discriminatedUnion('type', [
  LLMStepSchema,
  IntegrationStepSchema,
  ConditionalStepSchema,
  LoopStepSchema,
  WaitStepSchema,
]);

export const WorkflowSchema = BaseEntitySchema.extend({
  name: z.string().min(1),
  description: z.string().optional(),
  version: z.string().min(1),
  steps: z.array(WorkflowStepSchema),
  status: WorkflowStatusSchema,
  metadata: z.record(z.unknown()),
});

// Execution schemas
export const RunStatusSchema = z.enum(['queued', 'running', 'completed', 'failed', 'cancelled', 'paused']);

export const StepResultSchema = z.object({
  stepId: z.string().min(1),
  status: z.enum(['pending', 'running', 'completed', 'failed', 'skipped']),
  startedAt: z.date(),
  completedAt: z.date().optional(),
  input: z.record(z.unknown()),
  output: z.record(z.unknown()).optional(),
  error: z.object({
    code: z.string().min(1),
    message: z.string().min(1),
    stepId: z.string().optional(),
    retryable: z.boolean(),
    context: z.record(z.unknown()).optional(),
    stackTrace: z.string().optional(),
  }).optional(),
  attempts: z.number().int().min(0),
});

export const ExecutionMetricsSchema = z.object({
  totalSteps: z.number().int().min(0),
  completedSteps: z.number().int().min(0),
  failedSteps: z.number().int().min(0),
  skippedSteps: z.number().int().min(0),
  totalDuration: z.number().min(0),
  stepDurations: z.record(z.number().min(0)),
});

export const ExecutionContextSchema = z.object({
  correlationId: z.string().min(1),
  userId: z.string().optional(),
  variables: z.record(z.unknown()),
  stepResults: z.record(StepResultSchema),
  metrics: ExecutionMetricsSchema,
});

export const WorkflowRunSchema = BaseEntitySchema.extend({
  workflowId: z.string().min(1),
  workflowVersion: z.string().min(1),
  status: RunStatusSchema,
  input: z.record(z.unknown()),
  output: z.record(z.unknown()).optional(),
  context: ExecutionContextSchema,
  startedAt: z.date(),
  completedAt: z.date().optional(),
  error: z.object({
    code: z.string().min(1),
    message: z.string().min(1),
    stepId: z.string().optional(),
    retryable: z.boolean(),
    context: z.record(z.unknown()).optional(),
    stackTrace: z.string().optional(),
  }).optional(),
});

// Event schemas
export const RunEventTypeSchema = z.enum([
  'run.started',
  'run.completed',
  'run.failed',
  'run.cancelled',
  'run.paused',
  'run.resumed',
  'step.started',
  'step.completed',
  'step.failed',
  'step.retrying',
  'step.skipped',
]);

export const RunEventSchema = z.object({
  id: z.string().min(1),
  runId: z.string().min(1),
  type: RunEventTypeSchema,
  timestamp: z.date(),
  payload: z.record(z.unknown()),
  correlationId: z.string().min(1),
});

// Integration schemas
export const IntegrationStatusSchema = z.enum(['active', 'inactive', 'error', 'maintenance']);

export const AuthenticationConfigSchema = z.object({
  type: z.enum(['bearer', 'basic', 'apikey', 'oauth2']),
  credentials: z.record(z.string()),
});

export const CircuitBreakerConfigSchema = z.object({
  failureThreshold: z.number().int().min(1),
  recoveryTimeout: z.number().int().min(0),
  monitoringPeriod: z.number().int().min(0),
});

export const HealthCheckConfigSchema = z.object({
  endpoint: z.string().url(),
  interval: z.number().int().min(0),
  timeout: z.number().int().min(0),
  expectedStatus: z.number().int().min(100).max(599),
});

export const IntegrationConfigurationSchema = z.object({
  baseUrl: z.string().url().optional(),
  authentication: AuthenticationConfigSchema.optional(),
  timeout: z.number().int().min(0).optional(),
  retryPolicy: RetryPolicySchema.optional(),
  circuitBreaker: CircuitBreakerConfigSchema.optional(),
}).catchall(z.unknown());

export const IntegrationSchema = BaseEntitySchema.extend({
  name: z.string().min(1),
  type: z.string().min(1),
  description: z.string().optional(),
  configuration: IntegrationConfigurationSchema,
  status: IntegrationStatusSchema,
  healthCheck: HealthCheckConfigSchema.optional(),
});

// LLM schemas
export const RateLimitConfigSchema = z.object({
  requestsPerMinute: z.number().int().min(0),
  tokensPerMinute: z.number().int().min(0),
  concurrentRequests: z.number().int().min(1),
});

export const LLMProviderConfigurationSchema = z.object({
  apiKey: z.string().optional(),
  baseUrl: z.string().url().optional(),
  timeout: z.number().int().min(0).optional(),
  retryPolicy: RetryPolicySchema.optional(),
  rateLimits: RateLimitConfigSchema.optional(),
}).catchall(z.unknown());

export const LLMProviderSchema = BaseEntitySchema.extend({
  name: z.string().min(1),
  type: z.string().min(1),
  configuration: LLMProviderConfigurationSchema,
  status: z.enum(['active', 'inactive', 'error']),
  supportedModels: z.array(z.string().min(1)),
});

export const VariableValidationSchema = z.object({
  pattern: z.string().optional(),
  minLength: z.number().int().min(0).optional(),
  maxLength: z.number().int().min(0).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  enum: z.array(z.unknown()).optional(),
});

export const PromptVariableSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['string', 'number', 'boolean', 'array', 'object']),
  required: z.boolean(),
  description: z.string().optional(),
  defaultValue: z.unknown().optional(),
  validation: VariableValidationSchema.optional(),
});

export const PromptTemplateSchema = BaseEntitySchema.extend({
  name: z.string().min(1),
  version: z.string().min(1),
  content: z.string().min(1),
  variables: z.array(PromptVariableSchema),
  metadata: z.record(z.unknown()),
  tags: z.array(z.string()),
});

export const LLMUsageSchema = BaseEntitySchema.extend({
  providerId: z.string().min(1),
  modelName: z.string().min(1),
  promptTokens: z.number().int().min(0),
  completionTokens: z.number().int().min(0),
  totalTokens: z.number().int().min(0),
  cost: z.number().min(0).optional(),
  duration: z.number().min(0),
  requestId: z.string().min(1),
  correlationId: z.string().min(1),
});

// Observability schemas
export const MetricSchema = z.object({
  name: z.string().min(1),
  value: z.number(),
  timestamp: z.date(),
  tags: z.record(z.string()),
  type: z.enum(['counter', 'gauge', 'histogram', 'summary']),
});

export const TraceLogSchema = z.object({
  timestamp: z.date(),
  level: z.enum(['debug', 'info', 'warn', 'error']),
  message: z.string().min(1),
  fields: z.record(z.unknown()).optional(),
});

export const TraceSchema = z.object({
  traceId: z.string().min(1),
  spanId: z.string().min(1),
  parentSpanId: z.string().optional(),
  operationName: z.string().min(1),
  startTime: z.date(),
  endTime: z.date().optional(),
  duration: z.number().min(0).optional(),
  tags: z.record(z.string()),
  logs: z.array(TraceLogSchema),
  status: z.enum(['pending', 'completed', 'error']),
});

// Session schemas
export const SessionContextSchema = z.object({
  sessionId: z.string().min(1),
  userId: z.string().optional(),
  correlationId: z.string().min(1),
  startTime: z.date(),
  lastActivity: z.date(),
  metadata: z.record(z.unknown()),
  permissions: z.array(z.string()),
});

// Configuration schemas
export const CorsConfigSchema = z.object({
  origin: z.union([z.string(), z.array(z.string())]),
  methods: z.array(z.string()),
  allowedHeaders: z.array(z.string()),
});

export const ServerConfigSchema = z.object({
  port: z.number().int().min(1).max(65535),
  host: z.string().min(1),
  cors: CorsConfigSchema,
  timeout: z.number().int().min(0),
});

export const PoolConfigSchema = z.object({
  min: z.number().int().min(0),
  max: z.number().int().min(1),
  idleTimeoutMillis: z.number().int().min(0),
});

export const MigrationConfigSchema = z.object({
  directory: z.string().min(1),
  tableName: z.string().min(1),
});

export const DatabaseConfigSchema = z.object({
  url: z.string().min(1),
  pool: PoolConfigSchema,
  migrations: MigrationConfigSchema,
});

export const LogOutputSchema = z.object({
  type: z.enum(['console', 'file', 'http']),
  config: z.record(z.unknown()),
});

export const RedactionConfigSchema = z.object({
  enabled: z.boolean(),
  fields: z.array(z.string()),
  replacement: z.string(),
});

export const LoggingConfigSchema = z.object({
  level: z.string().min(1),
  format: z.string().min(1),
  outputs: z.array(LogOutputSchema),
  redaction: RedactionConfigSchema,
});

export const CacheConfigSchema = z.object({
  ttl: z.number().int().min(0),
  maxSize: z.number().int().min(0),
});

export const LLMConfigSchema = z.object({
  defaultProvider: z.string().min(1),
  providers: z.record(LLMProviderConfigurationSchema),
  promptCache: CacheConfigSchema,
});

export const JwtConfigSchema = z.object({
  secret: z.string().min(1),
  expiresIn: z.string().min(1),
  issuer: z.string().min(1),
  audience: z.string().min(1),
});

export const EncryptionConfigSchema = z.object({
  algorithm: z.string().min(1),
  keySize: z.number().int().min(1),
  saltRounds: z.number().int().min(1),
});

export const RbacConfigSchema = z.object({
  enabled: z.boolean(),
  defaultRole: z.string().min(1),
  superAdminRole: z.string().min(1),
});

export const SecurityConfigSchema = z.object({
  jwt: JwtConfigSchema,
  encryption: EncryptionConfigSchema,
  rbac: RbacConfigSchema,
});

export const CollectionConfigSchema = z.object({
  interval: z.number().int().min(0),
  batchSize: z.number().int().min(1),
});

export const RetentionConfigSchema = z.object({
  duration: z.number().int().min(0),
  maxPoints: z.number().int().min(0),
});

export const MetricsConfigSchema = z.object({
  enabled: z.boolean(),
  collection: CollectionConfigSchema,
  retention: RetentionConfigSchema,
});

export const TracingConfigSchema = z.object({
  enabled: z.boolean(),
  sampleRate: z.number().min(0).max(1),
  exporterType: z.string().min(1),
  exporterConfig: z.record(z.unknown()),
});

export const ObservabilityConfigSchema = z.object({
  metrics: MetricsConfigSchema,
  tracing: TracingConfigSchema,
  healthCheck: HealthCheckConfigSchema,
});

export const ApplicationConfigSchema = z.object({
  server: ServerConfigSchema,
  database: DatabaseConfigSchema,
  logging: LoggingConfigSchema,
  integrations: z.record(IntegrationConfigurationSchema),
  llm: LLMConfigSchema,
  security: SecurityConfigSchema,
  observability: ObservabilityConfigSchema,
});

// Helper function to validate workflow step
export function validateWorkflowStep(step: unknown) {
  return WorkflowStepSchema.parse(step);
}

// Helper function to validate workflow
export function validateWorkflow(workflow: unknown) {
  return WorkflowSchema.parse(workflow);
}

// Helper function to validate workflow run
export function validateWorkflowRun(run: unknown) {
  return WorkflowRunSchema.parse(run);
}

// Helper function to validate configuration
export function validateApplicationConfig(config: unknown) {
  return ApplicationConfigSchema.parse(config);
}