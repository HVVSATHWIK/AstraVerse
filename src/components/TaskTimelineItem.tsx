
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  Activity
} from 'lucide-react';
import { Agent, AgentTask } from '@/types/agents';
import { getStatusColor, getPriorityColor, formatTimestamp } from './TimelineUtilities';

interface TaskTimelineItemProps {
  task: AgentTask;
  agent?: Agent;
  showAllAgents: boolean;
}

const TaskTimelineItem = ({ task, agent, showAllAgents }: TaskTimelineItemProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'running':
      case 'active':
        return <Activity className="w-4 h-4 text-blue-400 animate-pulse" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div key={task.id} className="flex items-start space-x-4 p-4 border-l-2 border-slate-700/50 hover:border-purple-500/50 transition-colors">
      <div className="flex-shrink-0 mt-1">
        {getStatusIcon(task.status)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-white font-medium truncate">{task.title}</h4>
          <div className="flex items-center space-x-2">
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
            <Badge className={getStatusColor(task.status)}>
              {task.status}
            </Badge>
          </div>
        </div>
        <p className="text-slate-400 text-sm mb-2">{task.description}</p>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-4">
            {showAllAgents && agent && (
              <span>Agent: {agent.name}</span>
            )}
            <span>Created: {formatTimestamp(task.createdAt)}</span>
            {task.status === 'running' && (
              <span className="text-blue-400">Progress: {task.progress}%</span>
            )}
          </div>
          {task.estimatedDuration && (
            <span>ETA: {Math.floor(task.estimatedDuration / 60)}m</span>
          )}
        </div>
        {task.status === 'running' && (
          <div className="mt-2">
            <div className="w-full bg-slate-700 rounded-full h-1.5">
              <div 
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>
        )}
        {task.error && (
          <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs">
            Error: {task.error}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskTimelineItem;
