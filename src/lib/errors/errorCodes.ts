/**
 * Central error code constants for the AstraVerse platform
 * Provides enumerated error codes for consistent error handling
 */

export const ERROR_CODES = {
  // General system errors (1000-1099)
  UNKNOWN_ERROR: 'SYS_1000',
  VALIDATION_ERROR: 'SYS_1001',
  CONFIGURATION_ERROR: 'SYS_1002',
  INITIALIZATION_ERROR: 'SYS_1003',
  TIMEOUT_ERROR: 'SYS_1004',
  PERMISSION_DENIED: 'SYS_1005',
  RATE_LIMIT_EXCEEDED: 'SYS_1006',
  SERVICE_UNAVAILABLE: 'SYS_1007',
  RESOURCE_NOT_FOUND: 'SYS_1008',
  RESOURCE_CONFLICT: 'SYS_1009',
  OPERATION_NOT_SUPPORTED: 'SYS_1010',

  // Workflow errors (2000-2099)
  WORKFLOW_NOT_FOUND: 'WF_2000',
  WORKFLOW_INVALID: 'WF_2001',
  WORKFLOW_VERSION_CONFLICT: 'WF_2002',
  WORKFLOW_EXECUTION_FAILED: 'WF_2003',
  WORKFLOW_STEP_FAILED: 'WF_2004',
  WORKFLOW_CANCELLED: 'WF_2005',
  WORKFLOW_TIMEOUT: 'WF_2006',
  WORKFLOW_INVALID_STATE: 'WF_2007',
  WORKFLOW_STEP_NOT_FOUND: 'WF_2008',
  WORKFLOW_CIRCULAR_DEPENDENCY: 'WF_2009',
  WORKFLOW_MAX_RETRIES_EXCEEDED: 'WF_2010',
  WORKFLOW_CONDITION_EVALUATION_FAILED: 'WF_2011',
  WORKFLOW_LOOP_LIMIT_EXCEEDED: 'WF_2012',

  // Integration errors (3000-3099)
  INTEGRATION_NOT_FOUND: 'INT_3000',
  INTEGRATION_CONFIGURATION_INVALID: 'INT_3001',
  INTEGRATION_CONNECTION_FAILED: 'INT_3002',
  INTEGRATION_AUTHENTICATION_FAILED: 'INT_3003',
  INTEGRATION_REQUEST_FAILED: 'INT_3004',
  INTEGRATION_RESPONSE_INVALID: 'INT_3005',
  INTEGRATION_TIMEOUT: 'INT_3006',
  INTEGRATION_RATE_LIMITED: 'INT_3007',
  INTEGRATION_CIRCUIT_BREAKER_OPEN: 'INT_3008',
  INTEGRATION_ADAPTER_NOT_FOUND: 'INT_3009',
  INTEGRATION_OPERATION_NOT_SUPPORTED: 'INT_3010',
  INTEGRATION_HEALTH_CHECK_FAILED: 'INT_3011',

  // LLM errors (4000-4099)
  LLM_PROVIDER_NOT_FOUND: 'LLM_4000',
  LLM_PROVIDER_CONFIGURATION_INVALID: 'LLM_4001',
  LLM_REQUEST_FAILED: 'LLM_4002',
  LLM_RESPONSE_INVALID: 'LLM_4003',
  LLM_MODEL_NOT_SUPPORTED: 'LLM_4004',
  LLM_QUOTA_EXCEEDED: 'LLM_4005',
  LLM_PROMPT_TEMPLATE_NOT_FOUND: 'LLM_4006',
  LLM_PROMPT_TEMPLATE_INVALID: 'LLM_4007',
  LLM_TOKEN_LIMIT_EXCEEDED: 'LLM_4008',
  LLM_CONTENT_FILTERED: 'LLM_4009',
  LLM_AUTHENTICATION_FAILED: 'LLM_4010',
  LLM_PROVIDER_UNAVAILABLE: 'LLM_4011',

  // Authentication & Authorization errors (5000-5099)
  AUTH_TOKEN_INVALID: 'AUTH_5000',
  AUTH_TOKEN_EXPIRED: 'AUTH_5001',
  AUTH_TOKEN_MISSING: 'AUTH_5002',
  AUTH_CREDENTIALS_INVALID: 'AUTH_5003',
  AUTH_USER_NOT_FOUND: 'AUTH_5004',
  AUTH_USER_DISABLED: 'AUTH_5005',
  AUTH_ROLE_NOT_FOUND: 'AUTH_5006',
  AUTH_PERMISSION_DENIED: 'AUTH_5007',
  AUTH_SESSION_EXPIRED: 'AUTH_5008',
  AUTH_SESSION_INVALID: 'AUTH_5009',
  AUTH_MFA_REQUIRED: 'AUTH_5010',
  AUTH_PASSWORD_INVALID: 'AUTH_5011',

  // Data & Validation errors (6000-6099)
  DATA_VALIDATION_FAILED: 'DATA_6000',
  DATA_SCHEMA_MISMATCH: 'DATA_6001',
  DATA_INTEGRITY_VIOLATION: 'DATA_6002',
  DATA_TRANSFORMATION_FAILED: 'DATA_6003',
  DATA_SERIALIZATION_FAILED: 'DATA_6004',
  DATA_DESERIALIZATION_FAILED: 'DATA_6005',
  DATA_ENCRYPTION_FAILED: 'DATA_6006',
  DATA_DECRYPTION_FAILED: 'DATA_6007',
  DATA_COMPRESSION_FAILED: 'DATA_6008',
  DATA_DECOMPRESSION_FAILED: 'DATA_6009',
  DATA_EXPORT_FAILED: 'DATA_6010',
  DATA_IMPORT_FAILED: 'DATA_6011',

  // Storage & Database errors (7000-7099)
  DB_CONNECTION_FAILED: 'DB_7000',
  DB_QUERY_FAILED: 'DB_7001',
  DB_TRANSACTION_FAILED: 'DB_7002',
  DB_CONSTRAINT_VIOLATION: 'DB_7003',
  DB_DEADLOCK_DETECTED: 'DB_7004',
  DB_SCHEMA_MIGRATION_FAILED: 'DB_7005',
  DB_BACKUP_FAILED: 'DB_7006',
  DB_RESTORE_FAILED: 'DB_7007',
  DB_INDEX_CORRUPTION: 'DB_7008',
  DB_DISK_FULL: 'DB_7009',
  DB_CONNECTION_POOL_EXHAUSTED: 'DB_7010',
  DB_LOCK_TIMEOUT: 'DB_7011',

  // Security errors (8000-8099)
  SECURITY_ENCRYPTION_FAILED: 'SEC_8000',
  SECURITY_DECRYPTION_FAILED: 'SEC_8001',
  SECURITY_HASH_VERIFICATION_FAILED: 'SEC_8002',
  SECURITY_SIGNATURE_INVALID: 'SEC_8003',
  SECURITY_CERTIFICATE_INVALID: 'SEC_8004',
  SECURITY_CERTIFICATE_EXPIRED: 'SEC_8005',
  SECURITY_KEY_NOT_FOUND: 'SEC_8006',
  SECURITY_KEY_EXPIRED: 'SEC_8007',
  SECURITY_AUDIT_LOG_FAILED: 'SEC_8008',
  SECURITY_THREAT_DETECTED: 'SEC_8009',
  SECURITY_INPUT_SANITIZATION_FAILED: 'SEC_8010',
  SECURITY_REDACTION_FAILED: 'SEC_8011',

  // Observability & Monitoring errors (9000-9099)
  METRICS_COLLECTION_FAILED: 'OBS_9000',
  METRICS_EXPORT_FAILED: 'OBS_9001',
  TRACE_CREATION_FAILED: 'OBS_9002',
  TRACE_EXPORT_FAILED: 'OBS_9003',
  LOG_WRITE_FAILED: 'OBS_9004',
  LOG_ROTATION_FAILED: 'OBS_9005',
  HEALTH_CHECK_FAILED: 'OBS_9006',
  ALERT_DISPATCH_FAILED: 'OBS_9007',
  DASHBOARD_RENDERING_FAILED: 'OBS_9008',
  PROFILING_FAILED: 'OBS_9009',
  SAMPLING_FAILED: 'OBS_9010',
  INSTRUMENTATION_FAILED: 'OBS_9011',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

// Error code metadata for better error handling
export interface ErrorCodeMetadata {
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  retryable: boolean;
  userMessage: string;
  documentation?: string;
}

export const ERROR_CODE_METADATA: Record<ErrorCode, ErrorCodeMetadata> = {
  // System errors
  [ERROR_CODES.UNKNOWN_ERROR]: {
    category: 'system',
    severity: 'critical',
    retryable: false,
    userMessage: 'An unexpected error occurred. Please try again or contact support.',
  },
  [ERROR_CODES.VALIDATION_ERROR]: {
    category: 'system',
    severity: 'medium',
    retryable: false,
    userMessage: 'The provided data is invalid. Please check your input and try again.',
  },
  [ERROR_CODES.CONFIGURATION_ERROR]: {
    category: 'system',
    severity: 'high',
    retryable: false,
    userMessage: 'System configuration error. Please contact support.',
  },
  [ERROR_CODES.INITIALIZATION_ERROR]: {
    category: 'system',
    severity: 'high',
    retryable: true,
    userMessage: 'System initialization failed. Please try again.',
  },
  [ERROR_CODES.TIMEOUT_ERROR]: {
    category: 'system',
    severity: 'medium',
    retryable: true,
    userMessage: 'Operation timed out. Please try again.',
  },
  [ERROR_CODES.PERMISSION_DENIED]: {
    category: 'system',
    severity: 'medium',
    retryable: false,
    userMessage: 'You do not have permission to perform this action.',
  },
  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: {
    category: 'system',
    severity: 'low',
    retryable: true,
    userMessage: 'Too many requests. Please wait a moment and try again.',
  },
  [ERROR_CODES.SERVICE_UNAVAILABLE]: {
    category: 'system',
    severity: 'high',
    retryable: true,
    userMessage: 'Service is temporarily unavailable. Please try again later.',
  },
  [ERROR_CODES.RESOURCE_NOT_FOUND]: {
    category: 'system',
    severity: 'low',
    retryable: false,
    userMessage: 'The requested resource was not found.',
  },
  [ERROR_CODES.RESOURCE_CONFLICT]: {
    category: 'system',
    severity: 'medium',
    retryable: false,
    userMessage: 'Resource conflict detected. Please refresh and try again.',
  },
  [ERROR_CODES.OPERATION_NOT_SUPPORTED]: {
    category: 'system',
    severity: 'medium',
    retryable: false,
    userMessage: 'This operation is not supported.',
  },

  // Workflow errors
  [ERROR_CODES.WORKFLOW_NOT_FOUND]: {
    category: 'workflow',
    severity: 'medium',
    retryable: false,
    userMessage: 'Workflow not found.',
  },
  [ERROR_CODES.WORKFLOW_INVALID]: {
    category: 'workflow',
    severity: 'medium',
    retryable: false,
    userMessage: 'Workflow configuration is invalid.',
  },
  [ERROR_CODES.WORKFLOW_VERSION_CONFLICT]: {
    category: 'workflow',
    severity: 'medium',
    retryable: false,
    userMessage: 'Workflow version conflict detected.',
  },
  [ERROR_CODES.WORKFLOW_EXECUTION_FAILED]: {
    category: 'workflow',
    severity: 'high',
    retryable: true,
    userMessage: 'Workflow execution failed. Please try again.',
  },
  [ERROR_CODES.WORKFLOW_STEP_FAILED]: {
    category: 'workflow',
    severity: 'medium',
    retryable: true,
    userMessage: 'A workflow step failed to execute.',
  },
  [ERROR_CODES.WORKFLOW_CANCELLED]: {
    category: 'workflow',
    severity: 'low',
    retryable: false,
    userMessage: 'Workflow execution was cancelled.',
  },
  [ERROR_CODES.WORKFLOW_TIMEOUT]: {
    category: 'workflow',
    severity: 'medium',
    retryable: true,
    userMessage: 'Workflow execution timed out.',
  },
  [ERROR_CODES.WORKFLOW_INVALID_STATE]: {
    category: 'workflow',
    severity: 'medium',
    retryable: false,
    userMessage: 'Workflow is in an invalid state.',
  },
  [ERROR_CODES.WORKFLOW_STEP_NOT_FOUND]: {
    category: 'workflow',
    severity: 'medium',
    retryable: false,
    userMessage: 'Workflow step not found.',
  },
  [ERROR_CODES.WORKFLOW_CIRCULAR_DEPENDENCY]: {
    category: 'workflow',
    severity: 'high',
    retryable: false,
    userMessage: 'Circular dependency detected in workflow.',
  },
  [ERROR_CODES.WORKFLOW_MAX_RETRIES_EXCEEDED]: {
    category: 'workflow',
    severity: 'medium',
    retryable: false,
    userMessage: 'Maximum retry attempts exceeded.',
  },
  [ERROR_CODES.WORKFLOW_CONDITION_EVALUATION_FAILED]: {
    category: 'workflow',
    severity: 'medium',
    retryable: true,
    userMessage: 'Failed to evaluate workflow condition.',
  },
  [ERROR_CODES.WORKFLOW_LOOP_LIMIT_EXCEEDED]: {
    category: 'workflow',
    severity: 'medium',
    retryable: false,
    userMessage: 'Workflow loop limit exceeded.',
  },

  // Integration errors
  [ERROR_CODES.INTEGRATION_NOT_FOUND]: {
    category: 'integration',
    severity: 'medium',
    retryable: false,
    userMessage: 'Integration not found.',
  },
  [ERROR_CODES.INTEGRATION_CONFIGURATION_INVALID]: {
    category: 'integration',
    severity: 'high',
    retryable: false,
    userMessage: 'Integration configuration is invalid.',
  },
  [ERROR_CODES.INTEGRATION_CONNECTION_FAILED]: {
    category: 'integration',
    severity: 'high',
    retryable: true,
    userMessage: 'Failed to connect to integration service.',
  },
  [ERROR_CODES.INTEGRATION_AUTHENTICATION_FAILED]: {
    category: 'integration',
    severity: 'high',
    retryable: false,
    userMessage: 'Integration authentication failed.',
  },
  [ERROR_CODES.INTEGRATION_REQUEST_FAILED]: {
    category: 'integration',
    severity: 'medium',
    retryable: true,
    userMessage: 'Integration request failed.',
  },
  [ERROR_CODES.INTEGRATION_RESPONSE_INVALID]: {
    category: 'integration',
    severity: 'medium',
    retryable: true,
    userMessage: 'Invalid response from integration service.',
  },
  [ERROR_CODES.INTEGRATION_TIMEOUT]: {
    category: 'integration',
    severity: 'medium',
    retryable: true,
    userMessage: 'Integration request timed out.',
  },
  [ERROR_CODES.INTEGRATION_RATE_LIMITED]: {
    category: 'integration',
    severity: 'low',
    retryable: true,
    userMessage: 'Integration rate limit exceeded.',
  },
  [ERROR_CODES.INTEGRATION_CIRCUIT_BREAKER_OPEN]: {
    category: 'integration',
    severity: 'medium',
    retryable: true,
    userMessage: 'Integration service is temporarily unavailable.',
  },
  [ERROR_CODES.INTEGRATION_ADAPTER_NOT_FOUND]: {
    category: 'integration',
    severity: 'medium',
    retryable: false,
    userMessage: 'Integration adapter not found.',
  },
  [ERROR_CODES.INTEGRATION_OPERATION_NOT_SUPPORTED]: {
    category: 'integration',
    severity: 'medium',
    retryable: false,
    userMessage: 'Integration operation not supported.',
  },
  [ERROR_CODES.INTEGRATION_HEALTH_CHECK_FAILED]: {
    category: 'integration',
    severity: 'medium',
    retryable: true,
    userMessage: 'Integration health check failed.',
  },

  // LLM errors
  [ERROR_CODES.LLM_PROVIDER_NOT_FOUND]: {
    category: 'llm',
    severity: 'medium',
    retryable: false,
    userMessage: 'LLM provider not found.',
  },
  [ERROR_CODES.LLM_PROVIDER_CONFIGURATION_INVALID]: {
    category: 'llm',
    severity: 'high',
    retryable: false,
    userMessage: 'LLM provider configuration is invalid.',
  },
  [ERROR_CODES.LLM_REQUEST_FAILED]: {
    category: 'llm',
    severity: 'medium',
    retryable: true,
    userMessage: 'LLM request failed.',
  },
  [ERROR_CODES.LLM_RESPONSE_INVALID]: {
    category: 'llm',
    severity: 'medium',
    retryable: true,
    userMessage: 'Invalid response from LLM provider.',
  },
  [ERROR_CODES.LLM_MODEL_NOT_SUPPORTED]: {
    category: 'llm',
    severity: 'medium',
    retryable: false,
    userMessage: 'LLM model not supported.',
  },
  [ERROR_CODES.LLM_QUOTA_EXCEEDED]: {
    category: 'llm',
    severity: 'medium',
    retryable: true,
    userMessage: 'LLM quota exceeded.',
  },
  [ERROR_CODES.LLM_PROMPT_TEMPLATE_NOT_FOUND]: {
    category: 'llm',
    severity: 'medium',
    retryable: false,
    userMessage: 'Prompt template not found.',
  },
  [ERROR_CODES.LLM_PROMPT_TEMPLATE_INVALID]: {
    category: 'llm',
    severity: 'medium',
    retryable: false,
    userMessage: 'Prompt template is invalid.',
  },
  [ERROR_CODES.LLM_TOKEN_LIMIT_EXCEEDED]: {
    category: 'llm',
    severity: 'medium',
    retryable: false,
    userMessage: 'LLM token limit exceeded.',
  },
  [ERROR_CODES.LLM_CONTENT_FILTERED]: {
    category: 'llm',
    severity: 'low',
    retryable: false,
    userMessage: 'Content was filtered by LLM provider.',
  },
  [ERROR_CODES.LLM_AUTHENTICATION_FAILED]: {
    category: 'llm',
    severity: 'high',
    retryable: false,
    userMessage: 'LLM provider authentication failed.',
  },
  [ERROR_CODES.LLM_PROVIDER_UNAVAILABLE]: {
    category: 'llm',
    severity: 'high',
    retryable: true,
    userMessage: 'LLM provider is temporarily unavailable.',
  },

  // Authentication & Authorization errors
  [ERROR_CODES.AUTH_TOKEN_INVALID]: {
    category: 'auth',
    severity: 'medium',
    retryable: false,
    userMessage: 'Authentication token is invalid.',
  },
  [ERROR_CODES.AUTH_TOKEN_EXPIRED]: {
    category: 'auth',
    severity: 'medium',
    retryable: false,
    userMessage: 'Authentication token has expired.',
  },
  [ERROR_CODES.AUTH_TOKEN_MISSING]: {
    category: 'auth',
    severity: 'medium',
    retryable: false,
    userMessage: 'Authentication token is missing.',
  },
  [ERROR_CODES.AUTH_CREDENTIALS_INVALID]: {
    category: 'auth',
    severity: 'medium',
    retryable: false,
    userMessage: 'Invalid credentials provided.',
  },
  [ERROR_CODES.AUTH_USER_NOT_FOUND]: {
    category: 'auth',
    severity: 'medium',
    retryable: false,
    userMessage: 'User not found.',
  },
  [ERROR_CODES.AUTH_USER_DISABLED]: {
    category: 'auth',
    severity: 'medium',
    retryable: false,
    userMessage: 'User account is disabled.',
  },
  [ERROR_CODES.AUTH_ROLE_NOT_FOUND]: {
    category: 'auth',
    severity: 'medium',
    retryable: false,
    userMessage: 'Role not found.',
  },
  [ERROR_CODES.AUTH_PERMISSION_DENIED]: {
    category: 'auth',
    severity: 'medium',
    retryable: false,
    userMessage: 'Permission denied.',
  },
  [ERROR_CODES.AUTH_SESSION_EXPIRED]: {
    category: 'auth',
    severity: 'medium',
    retryable: false,
    userMessage: 'Session has expired.',
  },
  [ERROR_CODES.AUTH_SESSION_INVALID]: {
    category: 'auth',
    severity: 'medium',
    retryable: false,
    userMessage: 'Session is invalid.',
  },
  [ERROR_CODES.AUTH_MFA_REQUIRED]: {
    category: 'auth',
    severity: 'medium',
    retryable: false,
    userMessage: 'Multi-factor authentication required.',
  },
  [ERROR_CODES.AUTH_PASSWORD_INVALID]: {
    category: 'auth',
    severity: 'medium',
    retryable: false,
    userMessage: 'Invalid password provided.',
  },

  // Data & Validation errors
  [ERROR_CODES.DATA_VALIDATION_FAILED]: {
    category: 'data',
    severity: 'medium',
    retryable: false,
    userMessage: 'Data validation failed.',
  },
  [ERROR_CODES.DATA_SCHEMA_MISMATCH]: {
    category: 'data',
    severity: 'medium',
    retryable: false,
    userMessage: 'Data schema mismatch.',
  },
  [ERROR_CODES.DATA_INTEGRITY_VIOLATION]: {
    category: 'data',
    severity: 'high',
    retryable: false,
    userMessage: 'Data integrity violation.',
  },
  [ERROR_CODES.DATA_TRANSFORMATION_FAILED]: {
    category: 'data',
    severity: 'medium',
    retryable: true,
    userMessage: 'Data transformation failed.',
  },
  [ERROR_CODES.DATA_SERIALIZATION_FAILED]: {
    category: 'data',
    severity: 'medium',
    retryable: true,
    userMessage: 'Data serialization failed.',
  },
  [ERROR_CODES.DATA_DESERIALIZATION_FAILED]: {
    category: 'data',
    severity: 'medium',
    retryable: true,
    userMessage: 'Data deserialization failed.',
  },
  [ERROR_CODES.DATA_ENCRYPTION_FAILED]: {
    category: 'data',
    severity: 'high',
    retryable: true,
    userMessage: 'Data encryption failed.',
  },
  [ERROR_CODES.DATA_DECRYPTION_FAILED]: {
    category: 'data',
    severity: 'high',
    retryable: true,
    userMessage: 'Data decryption failed.',
  },
  [ERROR_CODES.DATA_COMPRESSION_FAILED]: {
    category: 'data',
    severity: 'medium',
    retryable: true,
    userMessage: 'Data compression failed.',
  },
  [ERROR_CODES.DATA_DECOMPRESSION_FAILED]: {
    category: 'data',
    severity: 'medium',
    retryable: true,
    userMessage: 'Data decompression failed.',
  },
  [ERROR_CODES.DATA_EXPORT_FAILED]: {
    category: 'data',
    severity: 'medium',
    retryable: true,
    userMessage: 'Data export failed.',
  },
  [ERROR_CODES.DATA_IMPORT_FAILED]: {
    category: 'data',
    severity: 'medium',
    retryable: true,
    userMessage: 'Data import failed.',
  },

  // Storage & Database errors
  [ERROR_CODES.DB_CONNECTION_FAILED]: {
    category: 'database',
    severity: 'critical',
    retryable: true,
    userMessage: 'Database connection failed.',
  },
  [ERROR_CODES.DB_QUERY_FAILED]: {
    category: 'database',
    severity: 'high',
    retryable: true,
    userMessage: 'Database query failed.',
  },
  [ERROR_CODES.DB_TRANSACTION_FAILED]: {
    category: 'database',
    severity: 'high',
    retryable: true,
    userMessage: 'Database transaction failed.',
  },
  [ERROR_CODES.DB_CONSTRAINT_VIOLATION]: {
    category: 'database',
    severity: 'medium',
    retryable: false,
    userMessage: 'Database constraint violation.',
  },
  [ERROR_CODES.DB_DEADLOCK_DETECTED]: {
    category: 'database',
    severity: 'medium',
    retryable: true,
    userMessage: 'Database deadlock detected.',
  },
  [ERROR_CODES.DB_SCHEMA_MIGRATION_FAILED]: {
    category: 'database',
    severity: 'critical',
    retryable: false,
    userMessage: 'Database schema migration failed.',
  },
  [ERROR_CODES.DB_BACKUP_FAILED]: {
    category: 'database',
    severity: 'high',
    retryable: true,
    userMessage: 'Database backup failed.',
  },
  [ERROR_CODES.DB_RESTORE_FAILED]: {
    category: 'database',
    severity: 'high',
    retryable: true,
    userMessage: 'Database restore failed.',
  },
  [ERROR_CODES.DB_INDEX_CORRUPTION]: {
    category: 'database',
    severity: 'high',
    retryable: false,
    userMessage: 'Database index corruption detected.',
  },
  [ERROR_CODES.DB_DISK_FULL]: {
    category: 'database',
    severity: 'critical',
    retryable: false,
    userMessage: 'Database disk full.',
  },
  [ERROR_CODES.DB_CONNECTION_POOL_EXHAUSTED]: {
    category: 'database',
    severity: 'high',
    retryable: true,
    userMessage: 'Database connection pool exhausted.',
  },
  [ERROR_CODES.DB_LOCK_TIMEOUT]: {
    category: 'database',
    severity: 'medium',
    retryable: true,
    userMessage: 'Database lock timeout.',
  },

  // Security errors
  [ERROR_CODES.SECURITY_ENCRYPTION_FAILED]: {
    category: 'security',
    severity: 'high',
    retryable: true,
    userMessage: 'Encryption failed.',
  },
  [ERROR_CODES.SECURITY_DECRYPTION_FAILED]: {
    category: 'security',
    severity: 'high',
    retryable: true,
    userMessage: 'Decryption failed.',
  },
  [ERROR_CODES.SECURITY_HASH_VERIFICATION_FAILED]: {
    category: 'security',
    severity: 'high',
    retryable: false,
    userMessage: 'Hash verification failed.',
  },
  [ERROR_CODES.SECURITY_SIGNATURE_INVALID]: {
    category: 'security',
    severity: 'high',
    retryable: false,
    userMessage: 'Invalid signature.',
  },
  [ERROR_CODES.SECURITY_CERTIFICATE_INVALID]: {
    category: 'security',
    severity: 'high',
    retryable: false,
    userMessage: 'Invalid certificate.',
  },
  [ERROR_CODES.SECURITY_CERTIFICATE_EXPIRED]: {
    category: 'security',
    severity: 'high',
    retryable: false,
    userMessage: 'Certificate has expired.',
  },
  [ERROR_CODES.SECURITY_KEY_NOT_FOUND]: {
    category: 'security',
    severity: 'high',
    retryable: false,
    userMessage: 'Security key not found.',
  },
  [ERROR_CODES.SECURITY_KEY_EXPIRED]: {
    category: 'security',
    severity: 'high',
    retryable: false,
    userMessage: 'Security key has expired.',
  },
  [ERROR_CODES.SECURITY_AUDIT_LOG_FAILED]: {
    category: 'security',
    severity: 'medium',
    retryable: true,
    userMessage: 'Security audit log failed.',
  },
  [ERROR_CODES.SECURITY_THREAT_DETECTED]: {
    category: 'security',
    severity: 'critical',
    retryable: false,
    userMessage: 'Security threat detected.',
  },
  [ERROR_CODES.SECURITY_INPUT_SANITIZATION_FAILED]: {
    category: 'security',
    severity: 'high',
    retryable: false,
    userMessage: 'Input sanitization failed.',
  },
  [ERROR_CODES.SECURITY_REDACTION_FAILED]: {
    category: 'security',
    severity: 'medium',
    retryable: true,
    userMessage: 'Data redaction failed.',
  },

  // Observability & Monitoring errors
  [ERROR_CODES.METRICS_COLLECTION_FAILED]: {
    category: 'observability',
    severity: 'low',
    retryable: true,
    userMessage: 'Metrics collection failed.',
  },
  [ERROR_CODES.METRICS_EXPORT_FAILED]: {
    category: 'observability',
    severity: 'low',
    retryable: true,
    userMessage: 'Metrics export failed.',
  },
  [ERROR_CODES.TRACE_CREATION_FAILED]: {
    category: 'observability',
    severity: 'low',
    retryable: true,
    userMessage: 'Trace creation failed.',
  },
  [ERROR_CODES.TRACE_EXPORT_FAILED]: {
    category: 'observability',
    severity: 'low',
    retryable: true,
    userMessage: 'Trace export failed.',
  },
  [ERROR_CODES.LOG_WRITE_FAILED]: {
    category: 'observability',
    severity: 'medium',
    retryable: true,
    userMessage: 'Log write failed.',
  },
  [ERROR_CODES.LOG_ROTATION_FAILED]: {
    category: 'observability',
    severity: 'medium',
    retryable: true,
    userMessage: 'Log rotation failed.',
  },
  [ERROR_CODES.HEALTH_CHECK_FAILED]: {
    category: 'observability',
    severity: 'medium',
    retryable: true,
    userMessage: 'Health check failed.',
  },
  [ERROR_CODES.ALERT_DISPATCH_FAILED]: {
    category: 'observability',
    severity: 'medium',
    retryable: true,
    userMessage: 'Alert dispatch failed.',
  },
  [ERROR_CODES.DASHBOARD_RENDERING_FAILED]: {
    category: 'observability',
    severity: 'low',
    retryable: true,
    userMessage: 'Dashboard rendering failed.',
  },
  [ERROR_CODES.PROFILING_FAILED]: {
    category: 'observability',
    severity: 'low',
    retryable: true,
    userMessage: 'Profiling failed.',
  },
  [ERROR_CODES.SAMPLING_FAILED]: {
    category: 'observability',
    severity: 'low',
    retryable: true,
    userMessage: 'Sampling failed.',
  },
  [ERROR_CODES.INSTRUMENTATION_FAILED]: {
    category: 'observability',
    severity: 'low',
    retryable: true,
    userMessage: 'Instrumentation failed.',
  },
};

// Helper function to get error metadata
export function getErrorMetadata(code: ErrorCode): ErrorCodeMetadata {
  return ERROR_CODE_METADATA[code] || ERROR_CODE_METADATA[ERROR_CODES.UNKNOWN_ERROR];
}

// Helper function to check if error is retryable
export function isRetryableError(code: ErrorCode): boolean {
  return getErrorMetadata(code).retryable;
}

// Helper function to get user-friendly error message
export function getUserErrorMessage(code: ErrorCode): string {
  return getErrorMetadata(code).userMessage;
}