import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, Pause, Trash2, Edit, Plus } from 'lucide-react';
import { UserWorkflow } from '@/types';
import { useWorkflows, useUpdateWorkflow, useDeleteWorkflow, useExecuteWorkflow } from '@/hooks/api/useWorkflows';
import { useToast } from '@/hooks/use-toast';

interface WorkflowListProps {
  onSelectWorkflow?: (workflow: UserWorkflow) => void;
  onCreateWorkflow?: () => void;
  selectedWorkflowId?: string;
}

const WorkflowList = ({ onSelectWorkflow, onCreateWorkflow, selectedWorkflowId }: WorkflowListProps) => {
  const { data: workflows, isLoading, error } = useWorkflows();
  const updateWorkflow = useUpdateWorkflow();
  const deleteWorkflow = useDeleteWorkflow();
  const executeWorkflow = useExecuteWorkflow();
  const { toast } = useToast();

  const handleToggleStatus = async (workflow: UserWorkflow, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = workflow.status === 'active' ? 'paused' : 'active';
    
    try {
      await updateWorkflow.mutateAsync({
        id: workflow.id,
        updates: { status: newStatus }
      });
      
      toast({
        title: `Workflow ${newStatus === 'active' ? 'Activated' : 'Paused'}`,
        description: `${workflow.name} has been ${newStatus === 'active' ? 'activated' : 'paused'}.`,
      });
    } catch (error) {
      console.error('Error toggling workflow status:', error);
      toast({
        title: 'Status Update Failed',
        description: 'Failed to update workflow status.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteWorkflow = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete the workflow "${name}"?`)) {
      try {
        await deleteWorkflow.mutateAsync(id);
        toast({
          title: 'Workflow Deleted',
          description: `${name} has been deleted successfully.`,
        });
      } catch (error) {
        console.error('Error deleting workflow:', error);
        toast({
          title: 'Deletion Failed',
          description: 'Failed to delete workflow.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleExecuteWorkflow = async (workflow: UserWorkflow, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await executeWorkflow.mutateAsync({ id: workflow.id });
      toast({
        title: 'Workflow Executed',
        description: `${workflow.name} has been triggered successfully.`,
      });
    } catch (error) {
      console.error('Error executing workflow:', error);
      toast({
        title: 'Execution Failed',
        description: 'Failed to execute workflow.',
        variant: 'destructive',
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
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  if (error) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="text-center text-red-400">
            <p>Error loading workflows</p>
            <p className="text-sm">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Your Workflows</CardTitle>
        <Button 
          size="sm" 
          onClick={onCreateWorkflow}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          New Workflow
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border border-slate-700 rounded-lg">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-4 w-full mt-2" />
              <div className="flex justify-between mt-4">
                <Skeleton className="h-8 w-20" />
                <div className="space-x-2">
                  <Skeleton className="h-8 w-8 inline-block" />
                  <Skeleton className="h-8 w-8 inline-block" />
                </div>
              </div>
            </div>
          ))
        ) : workflows && workflows.length > 0 ? (
          workflows.map((workflow) => (
            <div 
              key={workflow.id} 
              className={`p-4 border rounded-lg hover:bg-slate-800/70 transition-colors cursor-pointer ${
                selectedWorkflowId === workflow.id 
                  ? 'border-purple-500 bg-slate-800/70' 
                  : 'border-slate-700'
              }`}
              onClick={() => onSelectWorkflow?.(workflow)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-white font-medium">{workflow.name}</h3>
                <Badge variant="outline" className={getStatusColor(workflow.status)}>
                  {workflow.status}
                </Badge>
              </div>
              <p className="text-slate-400 text-sm mt-1">{workflow.description}</p>
              <div className="flex justify-between mt-4">
                <div className="text-xs text-slate-500">
                  Created: {new Date(workflow.created_at).toLocaleDateString()}
                </div>
                <div className="space-x-2">
                  {workflow.status === 'active' ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => handleToggleStatus(workflow, e)}
                      className="text-yellow-400 border-yellow-500/50"
                    >
                      <Pause className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => handleToggleStatus(workflow, e)}
                      className="text-green-400 border-green-500/50"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => handleExecuteWorkflow(workflow, e)}
                    disabled={workflow.status !== 'active'}
                    className="text-blue-400 border-blue-500/50"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => handleDeleteWorkflow(workflow.id, workflow.name, e)}
                    className="text-red-400 border-red-500/50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-400 mb-4">No workflows found</p>
            <Button 
              onClick={onCreateWorkflow}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Workflow
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkflowList;