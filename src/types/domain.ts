/**
 * Core domain types for the AstraVerse platform
 * Defines the fundamental data structures and their relationships
 */

// Base types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// User and Authentication
export interface User extends BaseEntity {
  email: string;
  name: string;
  roles: Role[];
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  resource: string;
  actions: string[];
}

// Workflow Management - Core domain with discriminated unions
export interface Workflow extends BaseEntity {
  name: string;
  description?: string;
  version: string;
  steps: WorkflowStep[];
  status: WorkflowStatus;
  metadata: Record<string, unknown>;
}

export type WorkflowStatus = 'draft' | 'active' | 'archived' | 'deprecated';

// Discriminated union for workflow steps
export type WorkflowStep = 
  | LLMStep 
  | IntegrationStep 
  | ConditionalStep 
  | LoopStep 
  | WaitStep;

export interface BaseStep {
  id: string;
  name: string;
  description?: string;
  position: number;
  nextStepId?: string;
  onError?: ErrorHandler;
}

export interface LLMStep extends BaseStep {
  type: 'llm';
  provider: string;
  promptTemplateId: string;
  parameters: LLMParameters;
  outputMapping?: Record<string, string>;
}

export interface IntegrationStep extends BaseStep {
  type: 'integration';
  adapterId: string;
  operation: string;
  parameters: Record<string, unknown>;
  retryPolicy?: RetryPolicy;
}

export interface ConditionalStep extends BaseStep {
  type: 'conditional';
  condition: string; // Expression to evaluate
  trueStepId: string;
  falseStepId?: string;
}

export interface LoopStep extends BaseStep {
  type: 'loop';
  iterable: string; // Expression that resolves to array
  loopStepId: string;
  maxIterations?: number;
}

export interface WaitStep extends BaseStep {
  type: 'wait';
  duration: number; // milliseconds
  condition?: string; // Optional condition to break wait
}

// LLM Configuration
export interface LLMParameters {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  model?: string;
  [key: string]: unknown;
}

// Error Handling
export interface ErrorHandler {
  strategy: 'retry' | 'skip' | 'fail' | 'fallback';
  retryPolicy?: RetryPolicy;
  fallbackStepId?: string;
}

export interface RetryPolicy {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

// Workflow Execution
export interface WorkflowRun extends BaseEntity {
  workflowId: string;
  workflowVersion: string;
  status: RunStatus;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  context: ExecutionContext;
  startedAt: Date;
  completedAt?: Date;
  error?: WorkflowError;
}

export type RunStatus = 
  | 'queued' 
  | 'running' 
  | 'completed' 
  | 'failed' 
  | 'cancelled' 
  | 'paused';

export interface ExecutionContext {
  correlationId: string;
  userId?: string;
  variables: Record<string, unknown>;
  stepResults: Record<string, StepResult>;
  metrics: ExecutionMetrics;
}

export interface StepResult {
  stepId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startedAt: Date;
  completedAt?: Date;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: WorkflowError;
  attempts: number;
}

export interface ExecutionMetrics {
  totalSteps: number;
  completedSteps: number;
  failedSteps: number;
  skippedSteps: number;
  totalDuration: number;
  stepDurations: Record<string, number>;
}

// Events - Append-only event log
export interface RunEvent {
  id: string;
  runId: string;
  type: RunEventType;
  timestamp: Date;
  payload: Record<string, unknown>;
  correlationId: string;
}

export type RunEventType =
  | 'run.started'
  | 'run.completed'
  | 'run.failed'
  | 'run.cancelled'
  | 'run.paused'
  | 'run.resumed'
  | 'step.started'
  | 'step.completed'
  | 'step.failed'
  | 'step.retrying'
  | 'step.skipped';

// Error Management
export interface WorkflowError {
  code: string;
  message: string;
  stepId?: string;
  retryable: boolean;
  context?: Record<string, unknown>;
  stackTrace?: string;
}

// Integration System
export interface Integration extends BaseEntity {
  name: string;
  type: string;
  description?: string;
  configuration: IntegrationConfiguration;
  status: IntegrationStatus;
  healthCheck?: HealthCheckConfig;
}

export type IntegrationStatus = 'active' | 'inactive' | 'error' | 'maintenance';

export interface IntegrationConfiguration {
  baseUrl?: string;
  authentication?: AuthenticationConfig;
  timeout?: number;
  retryPolicy?: RetryPolicy;
  circuitBreaker?: CircuitBreakerConfig;
  [key: string]: unknown;
}

export interface AuthenticationConfig {
  type: 'bearer' | 'basic' | 'apikey' | 'oauth2';
  credentials: Record<string, string>;
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  recoveryTimeout: number;
  monitoringPeriod: number;
}

export interface HealthCheckConfig {
  endpoint: string;
  interval: number;
  timeout: number;
  expectedStatus: number;
}

// LLM Management
export interface LLMProvider extends BaseEntity {
  name: string;
  type: string;
  configuration: LLMProviderConfiguration;
  status: 'active' | 'inactive' | 'error';
  supportedModels: string[];
}

export interface LLMProviderConfiguration {
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
  retryPolicy?: RetryPolicy;
  rateLimits?: RateLimitConfig;
  [key: string]: unknown;
}

export interface RateLimitConfig {
  requestsPerMinute: number;
  tokensPerMinute: number;
  concurrentRequests: number;
}

export interface PromptTemplate extends BaseEntity {
  name: string;
  version: string;
  content: string;
  variables: PromptVariable[];
  metadata: Record<string, unknown>;
  tags: string[];
}

export interface PromptVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  description?: string;
  defaultValue?: unknown;
  validation?: VariableValidation;
}

export interface VariableValidation {
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  enum?: unknown[];
}

export interface LLMUsage extends BaseEntity {
  providerId: string;
  modelName: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost?: number;
  duration: number;
  requestId: string;
  correlationId: string;
}

// Observability
export interface Metric {
  name: string;
  value: number;
  timestamp: Date;
  tags: Record<string, string>;
  type: 'counter' | 'gauge' | 'histogram' | 'summary';
}

export interface Trace {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operationName: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  tags: Record<string, string>;
  logs: TraceLog[];
  status: 'pending' | 'completed' | 'error';
}

export interface TraceLog {
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  fields?: Record<string, unknown>;
}

// Session Management
export interface SessionContext {
  sessionId: string;
  userId?: string;
  correlationId: string;
  startTime: Date;
  lastActivity: Date;
  metadata: Record<string, unknown>;
  permissions: string[];
}

// Configuration
export interface ApplicationConfig {
  server: ServerConfig;
  database: DatabaseConfig;
  logging: LoggingConfig;
  integrations: Record<string, IntegrationConfiguration>;
  llm: LLMConfig;
  security: SecurityConfig;
  observability: ObservabilityConfig;
}

export interface ServerConfig {
  port: number;
  host: string;
  cors: CorsConfig;
  timeout: number;
}

export interface CorsConfig {
  origin: string | string[];
  methods: string[];
  allowedHeaders: string[];
}

export interface DatabaseConfig {
  url: string;
  pool: PoolConfig;
  migrations: MigrationConfig;
}

export interface PoolConfig {
  min: number;
  max: number;
  idleTimeoutMillis: number;
}

export interface MigrationConfig {
  directory: string;
  tableName: string;
}

export interface LoggingConfig {
  level: string;
  format: string;
  outputs: LogOutput[];
  redaction: RedactionConfig;
}

export interface LogOutput {
  type: 'console' | 'file' | 'http';
  config: Record<string, unknown>;
}

export interface RedactionConfig {
  enabled: boolean;
  fields: string[];
  replacement: string;
}

export interface LLMConfig {
  defaultProvider: string;
  providers: Record<string, LLMProviderConfiguration>;
  promptCache: CacheConfig;
}

export interface CacheConfig {
  ttl: number;
  maxSize: number;
}

export interface SecurityConfig {
  jwt: JwtConfig;
  encryption: EncryptionConfig;
  rbac: RbacConfig;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
  issuer: string;
  audience: string;
}

export interface EncryptionConfig {
  algorithm: string;
  keySize: number;
  saltRounds: number;
}

export interface RbacConfig {
  enabled: boolean;
  defaultRole: string;
  superAdminRole: string;
}

export interface ObservabilityConfig {
  metrics: MetricsConfig;
  tracing: TracingConfig;
  healthCheck: HealthCheckConfig;
}

export interface MetricsConfig {
  enabled: boolean;
  collection: CollectionConfig;
  retention: RetentionConfig;
}

export interface CollectionConfig {
  interval: number;
  batchSize: number;
}

export interface RetentionConfig {
  duration: number;
  maxPoints: number;
}

export interface TracingConfig {
  enabled: boolean;
  sampleRate: number;
  exporterType: string;
  exporterConfig: Record<string, unknown>;
}