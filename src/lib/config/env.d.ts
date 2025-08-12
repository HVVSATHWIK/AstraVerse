/**
 * Type declarations for environment variables
 * Ensures type safety for configuration loading
 */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Server Configuration
      NODE_ENV: 'development' | 'staging' | 'production' | 'test';
      PORT: string;
      HOST: string;
      
      // Database Configuration
      DATABASE_URL: string;
      DB_POOL_MIN: string;
      DB_POOL_MAX: string;
      DB_IDLE_TIMEOUT: string;
      
      // Security Configuration
      JWT_SECRET: string;
      JWT_EXPIRES_IN: string;
      JWT_ISSUER: string;
      JWT_AUDIENCE: string;
      ENCRYPTION_KEY: string;
      
      // LLM Configuration
      LLM_DEFAULT_PROVIDER: string;
      OPENAI_API_KEY?: string;
      ANTHROPIC_API_KEY?: string;
      GOOGLE_API_KEY?: string;
      
      // Integration Configuration
      SLACK_BOT_TOKEN?: string;
      GITHUB_TOKEN?: string;
      NOTION_TOKEN?: string;
      
      // Observability Configuration
      METRICS_ENABLED: string;
      TRACING_ENABLED: string;
      TRACING_SAMPLE_RATE: string;
      LOG_LEVEL: string;
      
      // Cache Configuration
      REDIS_URL?: string;
      CACHE_TTL: string;
      
      // CORS Configuration
      CORS_ORIGIN: string;
      
      // Health Check Configuration
      HEALTH_CHECK_INTERVAL: string;
      HEALTH_CHECK_TIMEOUT: string;
      
      // Circuit Breaker Configuration
      CIRCUIT_BREAKER_FAILURE_THRESHOLD: string;
      CIRCUIT_BREAKER_RECOVERY_TIMEOUT: string;
      
      // Rate Limiting Configuration
      RATE_LIMIT_WINDOW: string;
      RATE_LIMIT_MAX_REQUESTS: string;
      
      // File Upload Configuration
      MAX_FILE_SIZE: string;
      UPLOAD_DIR: string;
      
      // Email Configuration
      SMTP_HOST?: string;
      SMTP_PORT?: string;
      SMTP_USER?: string;
      SMTP_PASSWORD?: string;
      
      // Webhook Configuration
      WEBHOOK_SECRET?: string;
      
      // Feature Flags
      FEATURE_ADVANCED_WORKFLOWS: string;
      FEATURE_MULTI_TENANT: string;
      FEATURE_ANALYTICS: string;
    }
  }
}