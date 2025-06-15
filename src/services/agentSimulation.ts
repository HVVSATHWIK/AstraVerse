
import { Agent, AgentTask, AgentEvent } from '@/types/agents';
import { mockAgents, mockAgentTasks, mockAgentEvents } from '@/services/mockAgentData';

class AgentSimulationService {
  private simulationInterval: NodeJS.Timeout | null = null;
  private listeners: Array<(event: AgentEvent) => void> = [];
  private taskUpdateListeners: Array<(task: AgentTask) => void> = [];
  private agentUpdateListeners: Array<(agent: Agent) => void> = [];

  start() {
    if (this.simulationInterval) {
      this.stop();
    }

    // Simulate real-time updates every 5-15 seconds
    this.simulationInterval = setInterval(() => {
      this.simulateRandomUpdate();
    }, Math.random() * 10000 + 5000);

    console.log('🤖 Agent simulation started');
  }

  stop() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    console.log('🛑 Agent simulation stopped');
  }

  private simulateRandomUpdate() {
    const updateType = Math.random();
    
    if (updateType < 0.4) {
      this.simulateTaskProgress();
    } else if (updateType < 0.7) {
      this.simulateAgentStatusChange();
    } else {
      this.simulateNewEvent();
    }
  }

  private simulateTaskProgress() {
    const runningTasks = mockAgentTasks.filter(t => t.status === 'running');
    if (runningTasks.length === 0) return;

    const task = runningTasks[Math.floor(Math.random() * runningTasks.length)];
    const progressIncrease = Math.random() * 15 + 5; // 5-20% progress
    
    task.progress = Math.min(100, task.progress + progressIncrease);
    
    if (task.progress >= 100) {
      task.status = Math.random() > 0.1 ? 'completed' : 'failed';
      task.completedAt = new Date().toISOString();
      
      if (task.status === 'completed' && task.estimatedDuration) {
        task.actualDuration = task.estimatedDuration + Math.random() * 60000 - 30000; // ±30s variance
      }
      
      // Update agent current task
      const agent = mockAgents.find(a => a.id === task.agentId);
      if (agent && agent.currentTask) {
        agent.currentTask = undefined;
        agent.status = 'idle';
        agent.performance.tasksCompleted += 1;
        agent.lastActive = new Date().toISOString();
        this.notifyAgentUpdate(agent);
      }
      
      // Create completion event
      const event: AgentEvent = {
        id: `event-${Date.now()}`,
        agentId: task.agentId,
        type: task.status === 'completed' ? 'task_complete' : 'error',
        message: task.status === 'completed' 
          ? `Successfully completed "${task.title}"`
          : `Failed to complete "${task.title}"`,
        timestamp: new Date().toISOString(),
        severity: task.status === 'completed' ? 'success' : 'error',
        metadata: { 
          taskId: task.id, 
          duration: task.actualDuration,
          progress: task.progress 
        }
      };
      
      mockAgentEvents.unshift(event);
      this.notifyNewEvent(event);
    }
    
    this.notifyTaskUpdate(task);
  }

  private simulateAgentStatusChange() {
    const agent = mockAgents[Math.floor(Math.random() * mockAgents.length)];
    const previousStatus = agent.status;
    
    // Simulate realistic status transitions
    switch (agent.status) {
      case 'idle':
        if (Math.random() > 0.7) {
          agent.status = 'active';
          agent.currentTask = this.generateRandomTask();
        }
        break;
      case 'active':
        if (Math.random() > 0.8) {
          agent.status = Math.random() > 0.5 ? 'busy' : 'idle';
        }
        break;
      case 'busy':
        if (Math.random() > 0.6) {
          agent.status = 'active';
        }
        break;
      case 'error':
        if (Math.random() > 0.3) {
          agent.status = 'idle';
          agent.currentTask = undefined;
        }
        break;
    }
    
    // Update metrics
    agent.metrics.cpuUsage = Math.max(0, Math.min(100, 
      agent.metrics.cpuUsage + (Math.random() - 0.5) * 20
    ));
    agent.metrics.memoryUsage = Math.max(0, Math.min(100, 
      agent.metrics.memoryUsage + (Math.random() - 0.5) * 15
    ));
    agent.metrics.taskQueue = Math.max(0, 
      agent.metrics.taskQueue + Math.floor((Math.random() - 0.5) * 3)
    );
    
    agent.lastActive = new Date().toISOString();
    
    if (previousStatus !== agent.status) {
      const event: AgentEvent = {
        id: `event-${Date.now()}`,
        agentId: agent.id,
        type: 'status_change',
        message: `Agent status changed from ${previousStatus} to ${agent.status}`,
        timestamp: new Date().toISOString(),
        severity: 'info',
        metadata: { 
          previousStatus, 
          newStatus: agent.status 
        }
      };
      
      mockAgentEvents.unshift(event);
      this.notifyNewEvent(event);
    }
    
    this.notifyAgentUpdate(agent);
  }

  private simulateNewEvent() {
    const agent = mockAgents[Math.floor(Math.random() * mockAgents.length)];
    const eventTypes = ['start', 'config_update', 'error'];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    let message = '';
    let severity: 'info' | 'warning' | 'error' | 'success' = 'info';
    let metadata = {};
    
    switch (eventType) {
      case 'start':
        message = 'Agent started processing new workflow';
        severity = 'info';
        break;
      case 'config_update':
        message = 'Configuration updated successfully';
        severity = 'info';
        metadata = { setting: 'maxConcurrentTasks', value: agent.config.maxConcurrentTasks };
        break;
      case 'error':
        message = 'Temporary connection error resolved';
        severity = 'warning';
        break;
    }
    
    const event: AgentEvent = {
      id: `event-${Date.now()}`,
      agentId: agent.id,
      type: eventType as any,
      message,
      timestamp: new Date().toISOString(),
      severity,
      metadata
    };
    
    mockAgentEvents.unshift(event);
    this.notifyNewEvent(event);
  }

  private generateRandomTask(): string {
    const tasks = [
      'Processing customer feedback analysis',
      'Updating knowledge base entries',
      'Monitoring system performance',
      'Generating weekly reports',
      'Analyzing data patterns',
      'Executing scheduled maintenance',
      'Processing workflow automation',
      'Handling integration requests'
    ];
    
    return tasks[Math.floor(Math.random() * tasks.length)];
  }

  // Event subscription methods
  onNewEvent(callback: (event: AgentEvent) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  onTaskUpdate(callback: (task: AgentTask) => void) {
    this.taskUpdateListeners.push(callback);
    return () => {
      this.taskUpdateListeners = this.taskUpdateListeners.filter(l => l !== callback);
    };
  }

  onAgentUpdate(callback: (agent: Agent) => void) {
    this.agentUpdateListeners.push(callback);
    return () => {
      this.agentUpdateListeners = this.agentUpdateListeners.filter(l => l !== callback);
    };
  }

  private notifyNewEvent(event: AgentEvent) {
    this.listeners.forEach(callback => callback(event));
  }

  private notifyTaskUpdate(task: AgentTask) {
    this.taskUpdateListeners.forEach(callback => callback(task));
  }

  private notifyAgentUpdate(agent: Agent) {
    this.agentUpdateListeners.forEach(callback => callback(agent));
  }
}

export const agentSimulation = new AgentSimulationService();

// Auto-start simulation in development
if (import.meta.env.DEV) {
  agentSimulation.start();
}
