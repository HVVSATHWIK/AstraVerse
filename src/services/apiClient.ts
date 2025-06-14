
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import env from '@/config/environment';

class APIClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: env.get('apiUrl'),
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for auth
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        
        // Add trace ID for debugging
        config.headers['X-Trace-ID'] = `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        if (env.get('debugMode')) {
          console.log('API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            headers: config.headers,
            data: config.data,
          });
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        if (env.get('debugMode')) {
          console.log('API Response:', {
            status: response.status,
            url: response.config.url,
            data: response.data,
          });
        }
        return response;
      },
      async (error) => {
        if (env.get('debugMode')) {
          console.error('API Error:', {
            status: error.response?.status,
            url: error.config?.url,
            message: error.message,
            data: error.response?.data,
          });
        }

        // Handle 401 - Unauthorized
        if (error.response?.status === 401) {
          this.clearToken();
          // Redirect to login or refresh token
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }

        // Handle network errors
        if (!error.response) {
          throw new Error('Network error - please check your connection');
        }

        return Promise.reject(error);
      }
    );
  }

  // Authentication methods
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  loadTokenFromStorage() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.token = token;
    }
  }

  // HTTP methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get(url, config);
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put(url, data, config);
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.patch(url, data, config);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete(url, config);
  }

  // Utility methods
  getBaseURL(): string {
    return this.client.defaults.baseURL || '';
  }

  updateBaseURL(baseURL: string) {
    this.client.defaults.baseURL = baseURL;
  }
}

export const apiClient = new APIClient();

// Initialize token from storage
apiClient.loadTokenFromStorage();

export default apiClient;

