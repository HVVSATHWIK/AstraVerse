import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Activity,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { useWorkflowExecutions, WorkflowExecution } from '@/hooks/api/useWorkflowExecutions';

interface WorkflowExecutionHistoryProps {
  workflowId?: string;
  limit?: number;
}

const WorkflowExecutionHistory: React.FC<WorkflowExecutionHistoryProps> = ({ 
  workflowId,
  limit = 5
}) => {
  const { data: executions, isLoading, error } = useWorkflowExecutions(workflowId, limit);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'running':
        return <Activity className="w-4 h-4 text-blue-400 animate-pulse" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'running':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatDuration = (milliseconds?: number) => {
    if (!milliseconds) return 'N/A';
    
    if (milliseconds < 1000) {
      return `${milliseconds}ms`;
    }
    
    const seconds = Math.floor(milliseconds / 1000);
    if (seconds < 60) {
      return `${seconds}s`;
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (error) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="text-center text-red-400">
            <p>Error loading execution history</p>
            <p className="text-sm">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Activity className="w-5 h-5 text-blue-400" />
          <span>Execution History</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border border-slate-700 rounded-lg">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-4 w-full mt-2" />
              <div className="flex justify-between mt-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))
        ) : executions && executions.length > 0 ? (
          executions.map((execution: WorkflowExecution) => (
            <div key={execution.id} className="p-4 border border-slate-700 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(execution.status)}
                  <span className="text-white font-medium">Execution {execution.id.substring(0, 8)}</span>
                </div>
                <Badge variant="outline" className={getStatusColor(execution.status)}>
                  {execution.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div className="flex items-center space-x-2 text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <span>Started: {formatDate(execution.started_at)}</span>
                </div>
                
                {execution.completed_at && (
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span>Duration: {formatDuration(execution.execution_time)}</span>
                  </div>
                )}
              </div>
              
              {execution.error && (
                <div className="mt-2 p-2 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-sm">
                  Error: {execution.error}
                </div>
              )}
              
              {execution.result && (
                <div className="mt-2 p-2 bg-slate-700/50 border border-slate-600 rounded text-slate-300 text-sm">
                  <div className="flex items-center space-x-2">
                    <ArrowRight className="w-3 h-3" />
                    <span>Steps executed: {execution.result.steps_executed}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-400 mb-2">No execution history found</p>
            <p className="text-slate-500 text-sm">
              {workflowId 
                ? 'This workflow has not been executed yet' 
                : 'No workflows have been executed yet'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkflowExecutionHistory;