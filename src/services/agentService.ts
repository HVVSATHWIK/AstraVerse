import { supabase } from '@/integrations/supabase/client';
import { Agent, AgentTask, AgentEvent } from '@/types/agents';

class AgentService {
  /**
   * Get all agents for the current user
   */
  async getAgents(): Promise<Agent[]> {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get a specific agent by ID
   */
  async getAgentById(id: string): Promise<Agent> {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching agent ${id}:`, error);
      throw error;
    }

    return data;
  }

  /**
   * Create a new agent
   */
  async createAgent(agent: Partial<Agent>): Promise<Agent> {
    const { data, error } = await supabase
      .from('agents')
      .insert([{
        name: agent.name,
        type: agent.type,
        status: agent.status || 'idle',
        description: agent.description,
        capabilities: agent.capabilities || [],
        config: agent.config || {},
        performance: {
          tasksCompleted: 0,
          successRate: 0,
          averageResponseTime: 0,
          uptime: 0
        },
        metrics: {
          cpuUsage: 0,
          memoryUsage: 0,
          taskQueue: 0
        }
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating agent:', error);
      throw error;
    }

    return data;
  }

  /**
   * Update an existing agent
   */
  async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent> {
    const { data, error } = await supabase
      .from('agents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating agent ${id}:`, error);
      throw error;
    }

    return data;
  }

  /**
   * Delete an agent
   */
  async deleteAgent(id: string): Promise<void> {
    const { error } = await supabase
      .from('agents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting agent ${id}:`, error);
      throw error;
    }
  }

  /**
   * Send a command to an agent
   */
  async sendCommand(agentId: string, command: string, parameters?: any): Promise<any> {
    // First try to use the Edge Function if available
    try {
      const { data, error } = await supabase.functions.invoke('agent-service', {
        body: { agent_id: agentId, command, parameters }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Edge function failed, falling back to direct DB update:', error);
      
      // Fallback to direct database updates
      let result = { success: false, message: 'Unknown command' };
      
      switch (command) {
        case 'start':
          await this.updateAgent(agentId, { status: 'active' });
          await this.createEvent(agentId, 'status_change', 'Agent status changed to active', 'info');
          result = { success: true, message: 'Agent started' };
          break;
          
        case 'pause':
          await this.updateAgent(agentId, { status: 'idle' });
          await this.createEvent(agentId, 'status_change', 'Agent status changed to idle', 'info');
          result = { success: true, message: 'Agent paused' };
          break;
          
        case 'restart':
          await this.updateAgent(agentId, { 
            status: 'active',
            metrics: {
              cpuUsage: 0,
              memoryUsage: 0,
              taskQueue: 0
            }
          });
          await this.createEvent(agentId, 'restart', 'Agent restarted', 'info');
          result = { success: true, message: 'Agent restarted' };
          break;
      }
      
      return result;
    }
  }

  /**
   * Get tasks for a specific agent
   */
  async getAgentTasks(agentId: string): Promise<AgentTask[]> {
    const { data, error } = await supabase
      .from('agent_tasks')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching tasks for agent ${agentId}:`, error);
      throw error;
    }

    return data || [];
  }

  /**
   * Create a new task for an agent
   */
  async createTask(task: Partial<AgentTask>): Promise<AgentTask> {
    const { data, error } = await supabase
      .from('agent_tasks')
      .insert([{
        agent_id: task.agentId,
        type: task.type,
        status: 'queued',
        priority: task.priority || 'medium',
        title: task.title,
        description: task.description,
        input: task.input || {},
        progress: 0,
        retry_count: 0,
        max_retries: task.maxRetries || 3
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      throw error;
    }

    // Update the agent status
    await this.updateAgent(task.agentId!, { status: 'busy' });

    // Log an event
    await this.createEvent(
      task.agentId!,
      'task_created',
      `New task created: ${task.title}`,
      'info',
      { task_id: data.id }
    );

    return data;
  }

  /**
   * Update a task
   */
  async updateTask(id: string, updates: Partial<AgentTask>): Promise<AgentTask> {
    const { data, error } = await supabase
      .from('agent_tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating task ${id}:`, error);
      throw error;
    }

    return data;
  }

  /**
   * Get events for a specific agent
   */
  async getAgentEvents(agentId: string, limit: number = 50): Promise<AgentEvent[]> {
    const { data, error } = await supabase
      .from('agent_events')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error(`Error fetching events for agent ${agentId}:`, error);
      throw error;
    }

    return data || [];
  }

  /**
   * Create a new event for an agent
   */
  async createEvent(
    agentId: string,
    type: string,
    message: string,
    severity: 'info' | 'warning' | 'error' | 'success',
    metadata?: Record<string, any>
  ): Promise<AgentEvent> {
    const { data, error } = await supabase
      .from('agent_events')
      .insert([{
        agent_id: agentId,
        type,
        message,
        severity,
        metadata
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating event:', error);
      throw error;
    }

    return data;
  }

  /**
   * Get system-wide agent statistics
   */
  async getAgentStats(): Promise<any> {
    const { data: agents, error: agentsError } = await supabase
      .from('agents')
      .select('id, status');

    if (agentsError) {
      console.error('Error fetching agents for stats:', agentsError);
      throw agentsError;
    }

    const { data: tasks, error: tasksError } = await supabase
      .from('agent_tasks')
      .select('id, status');

    if (tasksError) {
      console.error('Error fetching tasks for stats:', tasksError);
      throw tasksError;
    }

    // Calculate statistics
    const totalAgents = agents?.length || 0;
    const activeAgents = agents?.filter(a => a.status === 'active' || a.status === 'busy').length || 0;
    const totalTasks = tasks?.length || 0;
    const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0;
    const failedTasks = tasks?.filter(t => t.status === 'failed').length || 0;

    return {
      totalAgents,
      activeAgents,
      totalTasks,
      completedTasks,
      failedTasks,
      averageResponseTime: 2.4, // Placeholder - would need more complex query
      systemLoad: 45.2, // Placeholder
      uptime: '15d 8h 42m' // Placeholder
    };
  }
}

export const agentService = new AgentService();