
class RealtimeService {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 1000;

  connect() {
    if (import.meta.env.DEV) {
      console.log('Realtime service: Using mock mode in development');
      this.simulateRealtimeUpdates();
      return;
    }

    try {
      const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
        this.reconnectAttempts++;
        this.connect();
      }, this.reconnectInterval * Math.pow(2, this.reconnectAttempts));
    }
  }

  private handleMessage(data: any) {
    const { type, payload } = data;
    const listeners = this.listeners.get(type) || [];
    listeners.forEach(listener => listener(payload));
  }

  subscribe(eventType: string, callback: Function) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(eventType) || [];
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }

  send(type: string, payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private simulateRealtimeUpdates() {
    // Simulate metric updates every 30 seconds
    setInterval(() => {
      this.handleMessage({
        type: 'metrics-update',
        payload: {
          timestamp: new Date().toISOString(),
          throughput: Math.floor(Math.random() * 50) + 70,
          latency: Math.floor(Math.random() * 30) + 100,
          errors: Math.floor(Math.random() * 3),
        }
      });
    }, 30000);

    // Simulate activity updates every 2 minutes
    setInterval(() => {
      const activities = [
        'New meeting transcribed and analyzed',
        'Customer churn alert generated',
        'Workflow execution completed',
        'Integration sync successful'
      ];
      
      this.handleMessage({
        type: 'activity-update',
        payload: {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'transcription',
          message: activities[Math.floor(Math.random() * activities.length)],
          status: 'success'
        }
      });
    }, 120000);
  }
}

export const realtimeService = new RealtimeService();
