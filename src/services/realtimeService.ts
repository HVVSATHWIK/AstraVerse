
class RealtimeService {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private simulationIntervals: NodeJS.Timeout[] = [];

  connect() {
    console.log('Realtime service: Initializing connection...');
    
    if (import.meta.env.DEV) {
      console.log('Realtime service: Using enhanced mock mode in development');
      this.simulateRealtimeUpdates();
      return;
    }

    try {
      const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected successfully');
        this.reconnectAttempts = 0;
        this.startHeartbeat();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.stopHeartbeat();
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
      // Fallback to simulation mode
      this.simulateRealtimeUpdates();
    }
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts);
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
        this.reconnectAttempts++;
        this.connect();
      }, delay);
    } else {
      console.log('Max reconnection attempts reached, falling back to simulation mode');
      this.simulateRealtimeUpdates();
    }
  }

  private handleMessage(data: any) {
    const { type, payload } = data;
    console.log(`Handling message type: ${type}`, payload);
    const listeners = this.listeners.get(type) || [];
    listeners.forEach(listener => {
      try {
        listener(payload);
      } catch (error) {
        console.error('Error in message listener:', error);
      }
    });
  }

  subscribe(eventType: string, callback: Function) {
    console.log(`Subscribing to event type: ${eventType}`);
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
        console.log(`Unsubscribed from event type: ${eventType}`);
      }
    };
  }

  send(type: string, payload: any) {
    console.log(`Sending message type: ${type}`, payload);
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    } else {
      console.warn('WebSocket not connected, message not sent');
    }
  }

  disconnect() {
    console.log('Disconnecting realtime service...');
    this.stopHeartbeat();
    
    // Clear all simulation intervals
    this.simulationIntervals.forEach(interval => clearInterval(interval));
    this.simulationIntervals = [];
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private simulateRealtimeUpdates() {
    console.log('Starting enhanced simulation mode...');
    
    // Simulate metric updates every 15 seconds
    const metricsInterval = setInterval(() => {
      this.handleMessage({
        type: 'metrics-update',
        payload: {
          timestamp: new Date().toISOString(),
          throughput: Math.floor(Math.random() * 50) + 70,
          latency: Math.floor(Math.random() * 30) + 100,
          errors: Math.floor(Math.random() * 3),
          cpuUsage: Math.floor(Math.random() * 30) + 40,
          memoryUsage: Math.floor(Math.random() * 20) + 60,
          activeUsers: Math.floor(Math.random() * 100) + 50,
        }
      });
    }, 15000);

    // Simulate activity updates every 45 seconds
    const activityInterval = setInterval(() => {
      const activities = [
        'New meeting transcribed and analyzed',
        'Customer churn alert generated',
        'Workflow execution completed successfully',
        'Integration sync successful',
        'AI model training completed',
        'Data backup completed',
        'Security scan passed',
        'Performance optimization applied'
      ];
      
      this.handleMessage({
        type: 'activity-update',
        payload: {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: Math.random() > 0.5 ? 'transcription' : 'workflow',
          message: activities[Math.floor(Math.random() * activities.length)],
          status: Math.random() > 0.1 ? 'success' : 'warning'
        }
      });
    }, 45000);

    // Simulate notifications every 2 minutes
    const notificationInterval = setInterval(() => {
      const notifications = [
        { type: 'success', title: 'Task Completed', message: 'Document processing workflow finished' },
        { type: 'info', title: 'System Update', message: 'Real-time monitoring enhanced' },
        { type: 'warning', title: 'Resource Alert', message: 'Memory usage approaching limit' },
      ];
      
      const notification = notifications[Math.floor(Math.random() * notifications.length)];
      
      this.handleMessage({
        type: 'notification',
        payload: {
          id: `notif-${Date.now()}`,
          ...notification,
          timestamp: new Date().toISOString(),
          read: false
        }
      });
    }, 120000);

    // Store intervals for cleanup
    this.simulationIntervals.push(metricsInterval, activityInterval, notificationInterval);
    
    // Initial data burst
    setTimeout(() => {
      this.handleMessage({
        type: 'system-status',
        payload: {
          status: 'online',
          uptime: '99.9%',
          lastUpdate: new Date().toISOString()
        }
      });
    }, 1000);
  }
}

export const realtimeService = new RealtimeService();

// Auto-connect when module loads
if (typeof window !== 'undefined') {
  realtimeService.connect();
}
