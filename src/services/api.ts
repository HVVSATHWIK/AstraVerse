
import { AIEngine, Workflow, Integration, SystemMetrics, ActivityLog, KPIData } from '@/types';

class APIService {
  private baseURL = '/api';

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // AI Engine methods
  async getAIEngines(): Promise<AIEngine[]> {
    return this.request<AIEngine[]>('/ai-engines');
  }

  async updateAIEngine(id: string, data: Partial<AIEngine>): Promise<AIEngine> {
    return this.request<AIEngine>(`/ai-engines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Workflow methods
  async getWorkflows(): Promise<Workflow[]> {
    return this.request<Workflow[]>('/workflows');
  }

  async createWorkflow(workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workflow> {
    return this.request<Workflow>('/workflows', {
      method: 'POST',
      body: JSON.stringify(workflow),
    });
  }

  async updateWorkflow(id: string, data: Partial<Workflow>): Promise<Workflow> {
    return this.request<Workflow>(`/workflows/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteWorkflow(id: string): Promise<void> {
    return this.request<void>(`/workflows/${id}`, {
      method: 'DELETE',
    });
  }

  async executeWorkflow(id: string, payload?: Record<string, any>): Promise<{ executionId: string }> {
    return this.request<{ executionId: string }>(`/workflows/${id}/execute`, {
      method: 'POST',
      body: JSON.stringify(payload || {}),
    });
  }

  // Integration methods
  async getIntegrations(): Promise<Integration[]> {
    return this.request<Integration[]>('/integrations');
  }

  async updateIntegration(id: string, data: Partial<Integration>): Promise<Integration> {
    return this.request<Integration>(`/integrations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async testIntegration(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/integrations/${id}/test`, {
      method: 'POST',
    });
  }

  // Metrics methods
  async getSystemMetrics(timeRange: '1h' | '24h' | '7d' | '30d' = '24h'): Promise<SystemMetrics[]> {
    return this.request<SystemMetrics[]>(`/metrics?range=${timeRange}`);
  }

  async getKPIs(): Promise<KPIData> {
    return this.request<KPIData>('/metrics/kpis');
  }

  // Activity methods
  async getActivityLogs(limit: number = 50): Promise<ActivityLog[]> {
    return this.request<ActivityLog[]>(`/activity?limit=${limit}`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

export const apiService = new APIService();
