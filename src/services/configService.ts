
interface PlatformConfig {
  features: {
    enableRealtime: boolean;
    enableAdvancedAnalytics: boolean;
    enableCustomLLM: boolean;
    maxWorkflows: number;
    maxIntegrations: number;
  };
  limits: {
    apiRequestsPerMinute: number;
    maxFileSize: number;
    maxConcurrentWorkflows: number;
  };
  endpoints: {
    api: string;
    websocket: string;
    documentation: string;
    support: string;
  };
  deployment: {
    environment: 'development' | 'staging' | 'production';
    version: string;
    buildNumber: string;
  };
}

class ConfigService {
  private config: PlatformConfig;

  constructor() {
    this.config = {
      features: {
        enableRealtime: true,
        enableAdvancedAnalytics: true,
        enableCustomLLM: false, // Enterprise only
        maxWorkflows: 50,
        maxIntegrations: 20,
      },
      limits: {
        apiRequestsPerMinute: 1000,
        maxFileSize: 100 * 1024 * 1024, // 100MB
        maxConcurrentWorkflows: 10,
      },
      endpoints: {
        api: import.meta.env.VITE_API_URL || '/api',
        websocket: import.meta.env.VITE_WS_URL || '/ws',
        documentation: 'https://docs.astraai.com',
        support: 'https://support.astraai.com',
      },
      deployment: {
        environment: (import.meta.env.MODE as any) || 'development',
        version: import.meta.env.VITE_APP_VERSION || '1.0.0',
        buildNumber: import.meta.env.VITE_BUILD_NUMBER || 'dev',
      },
    };
  }

  get(key?: keyof PlatformConfig): any {
    if (!key) return this.config;
    return this.config[key];
  }

  getFeature(feature: keyof PlatformConfig['features']): boolean | number {
    return this.config.features[feature];
  }

  getLimit(limit: keyof PlatformConfig['limits']): number {
    return this.config.limits[limit];
  }

  getEndpoint(endpoint: keyof PlatformConfig['endpoints']): string {
    return this.config.endpoints[endpoint];
  }

  isDevelopment(): boolean {
    return this.config.deployment.environment === 'development';
  }

  isProduction(): boolean {
    return this.config.deployment.environment === 'production';
  }

  getVersion(): string {
    return this.config.deployment.version;
  }
}

export const configService = new ConfigService();
