
interface EnvironmentConfig {
  // API Configuration
  apiUrl: string;
  wsUrl: string;
  
  // Feature Flags
  pilotMode: boolean;
  enableMockApi: boolean;
  enableRealtime: boolean;
  enableAnalytics: boolean;
  
  // Development
  isDevelopment: boolean;
  isProduction: boolean;
  debugMode: boolean;
  
  // App Info
  version: string;
  buildNumber: string;
  environment: 'development' | 'staging' | 'production';
  
  // External Services
  sentryDsn?: string;
  posthogKey?: string;
  mixpanelToken?: string;
}

class EnvironmentService {
  private config: EnvironmentConfig;

  constructor() {
    this.config = {
      // API URLs
      apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
      wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:3001/ws',
      
      // Feature Flags
      pilotMode: import.meta.env.VITE_PILOT_MODE === 'true',
      enableMockApi: import.meta.env.VITE_ENABLE_MOCK_API !== 'false', // Default to true
      enableRealtime: import.meta.env.VITE_ENABLE_REALTIME !== 'false',
      enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
      
      // Environment Detection
      isDevelopment: import.meta.env.DEV,
      isProduction: import.meta.env.PROD,
      debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
      
      // App Metadata
      version: import.meta.env.VITE_APP_VERSION || '1.0.0-dev',
      buildNumber: import.meta.env.VITE_BUILD_NUMBER || 'dev',
      environment: (import.meta.env.VITE_ENVIRONMENT as any) || 'development',
      
      // External Services
      sentryDsn: import.meta.env.VITE_SENTRY_DSN,
      posthogKey: import.meta.env.VITE_POSTHOG_KEY,
      mixpanelToken: import.meta.env.VITE_MIXPANEL_TOKEN,
    };

    // Log configuration in development
    if (this.config.isDevelopment && this.config.debugMode) {
      console.log('Environment Configuration:', this.config);
    }
  }

  get<K extends keyof EnvironmentConfig>(key: K): EnvironmentConfig[K] {
    return this.config[key];
  }

  getAll(): EnvironmentConfig {
    return { ...this.config };
  }

  // Feature flag helpers
  isFeatureEnabled(feature: 'pilotMode' | 'enableMockApi' | 'enableRealtime' | 'enableAnalytics'): boolean {
    return this.config[feature];
  }

  // API URL helpers
  getApiEndpoint(path: string): string {
    const baseUrl = this.config.apiUrl.replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  }

  getWebSocketUrl(): string {
    return this.config.wsUrl;
  }

  // Environment helpers
  isDev(): boolean {
    return this.config.isDevelopment;
  }

  isProd(): boolean {
    return this.config.isProduction;
  }

  getEnvironmentName(): string {
    return this.config.environment;
  }

  // Runtime configuration updates
  updateFeatureFlag(feature: keyof Pick<EnvironmentConfig, 'pilotMode' | 'enableMockApi' | 'enableRealtime' | 'enableAnalytics'>, enabled: boolean): void {
    this.config[feature] = enabled;
    
    if (this.config.debugMode) {
      console.log(`Feature flag updated: ${feature} = ${enabled}`);
    }

    // Persist to localStorage for development
    if (this.config.isDevelopment) {
      localStorage.setItem(`astra_feature_${feature}`, String(enabled));
    }

    // Emit custom event for components to react
    window.dispatchEvent(new CustomEvent('featureFlagChanged', {
      detail: { feature, enabled }
    }));
  }

  // Load persisted feature flags from localStorage in development
  loadPersistedFlags(): void {
    if (!this.config.isDevelopment) return;

    const flags: (keyof Pick<EnvironmentConfig, 'pilotMode' | 'enableMockApi' | 'enableRealtime' | 'enableAnalytics'>)[] = [
      'pilotMode', 'enableMockApi', 'enableRealtime', 'enableAnalytics'
    ];

    flags.forEach(flag => {
      const persisted = localStorage.getItem(`astra_feature_${flag}`);
      if (persisted !== null) {
        this.config[flag] = persisted === 'true';
      }
    });
  }
}

export const env = new EnvironmentService();

// Load persisted flags on initialization
env.loadPersistedFlags();

export default env;

