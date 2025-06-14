
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, Pause, Square, MoreVertical, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useWorkflows, useUpdateWorkflow, useExecuteWorkflow } from '@/services/dataService';
import { toast } from '@/hooks/use-toast';
import ErrorBoundary from './ErrorBoundary';

const WorkflowControls = () => {
  const { data: workflows, isLoading } = useWorkflows();
  const updateWorkflow = useUpdateWorkflow();
  const executeWorkflow = useExecuteWorkflow();

  const handleToggleWorkflow = async (workflowId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    
    try {
      await updateWorkflow.mutateAsync({
        id: workflowId,
        data: { status: newStatus as 'active' | 'paused' | 'error' }
      });
      
      toast({
        title: `Workflow ${newStatus}`,
        description: `Workflow has been ${newStatus === 'active' ? 'resumed' : 'paused'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update workflow status",
        variant: "destructive",
      });
    }
  };

  const handleExecuteWorkflow = async (workflowId: string, workflowName: string) => {
    try {
      await executeWorkflow.mutateAsync({ id: workflowId });
      
      toast({
        title: "Workflow Executed",
        description: `${workflowName} has been triggered successfully`,
      });
    } catch (error) {
      toast({
        title: "Execution Failed",
        description: "Failed to execute workflow",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <ErrorBoundary>
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Workflow Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-slate-600 rounded-lg">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))
          ) : workflows && workflows.length > 0 ? (
            workflows.map((workflow) => (
              <div key={workflow.id} className="flex items-center justify-between p-4 border border-slate-600 rounded-lg">
                <div>
                  <h3 className="text-white font-medium">{workflow.name}</h3>
                  <p className="text-slate-400 text-sm">{workflow.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="outline" className={getStatusColor(workflow.status)}>
                      {workflow.status}
                    </Badge>
                    <span className="text-slate-500 text-xs">
                      {workflow.runs} runs • {workflow.successRate}% success
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleWorkflow(workflow.id, workflow.status)}
                    disabled={updateWorkflow.isPending}
                    className="text-white border-slate-600"
                  >
                    {workflow.status === 'active' ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExecuteWorkflow(workflow.id, workflow.name)}
                    disabled={executeWorkflow.isPending || workflow.status !== 'active'}
                    className="text-white border-slate-600"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Run
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline" className="text-white border-slate-600">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-slate-800 border-slate-700">
                      <DropdownMenuItem className="text-red-400">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-400 text-center py-8">No workflows found</p>
          )}
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

export default WorkflowControls;
