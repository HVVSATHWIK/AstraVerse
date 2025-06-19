import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  Activity
} from 'lucide-react';
import { useAgentTasksQuery } from '@/hooks/useAgentService';
import { formatTimestamp, getPriorityColor, getStatusColor } from '@/components/TimelineUtilities';

interface AgentTaskListProps {
  agentId: string;
}

const AgentTaskList = ({ agentId }: AgentTaskListProps) => {
  const { data: tasks, isLoading } = useAgentTasksQuery(agentId);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'running':
        return <Activity className="w-4 h-4 text-blue-400 animate-pulse" />;
      case 'queued':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-slate-400" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Agent Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-700/50 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Agent Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        {tasks && tasks.length > 0 ? (
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task.id} className="bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(task.status)}
                    <h4 className="text-white font-medium">{task.title}</h4>
                  </div>
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
                
                {task.status === 'running' && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-1" />
                  </div>
                )}
                
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>Created: {formatTimestamp(task.createdAt)}</span>
                  {task.completedAt && (
                    <span>Completed: {formatTimestamp(task.completedAt)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">No tasks found for this agent</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AgentTaskList;