import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  GitBranch,
  Clock,
  Activity,
  Settings
} from 'lucide-react';
import { Workflow, useUpdateWorkflow, useExecuteWorkflow } from '@/hooks/api/useWorkflows';
import WorkflowExecutionHistory from './WorkflowExecutionHistory';

interface WorkflowDetailViewProps {
  workflow: Workflow;
  onEdit: () => void;
  onDelete: () => void;
}

const WorkflowDetailView: React.FC<WorkflowDetailViewProps> = ({
  workflow,
  onEdit,
  onDelete
}) => {
  const updateWorkflow = useUpdateWorkflow();
  const executeWorkflow = useExecuteWorkflow();

  const handleToggleStatus = async () => {
    const newStatus = workflow.status === 'active' ? 'paused' : 'active';
    
    try {
      await updateWorkflow.mutateAsync({
        id: workflow.id,
        updates: { status: newStatus }
      });
    } catch (error) {
      console.error('Error toggling workflow status:', error);
    }
  };

  const handleExecuteWorkflow = async () => {
    try {
      await executeWorkflow.mutateAsync({ id: workflow.id });
    } catch (error) {
      console.error('Error executing workflow:', error);
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

  const getStepColor = (type: string) => {
    switch (type) {
      case 'trigger':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'action':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'condition':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'ai':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CardTitle className="text-white">{workflow.name}</CardTitle>
            <Badge variant="outline" className={getStatusColor(workflow.status)}>
              {workflow.status}
            </Badge>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleToggleStatus}
              className={workflow.status === 'active' 
                ? 'text-yellow-400 border-yellow-500/50' 
                : 'text-green-400 border-green-500/50'}
              disabled={updateWorkflow.isPending}
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
              onClick={handleExecuteWorkflow}
              className="text-blue-400 border-blue-500/50"
              disabled={executeWorkflow.isPending || workflow.status !== 'active'}
            >
              <Play className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onEdit}
              className="text-slate-300 border-slate-600"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onDelete}
              className="text-red-400 border-red-500/50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-slate-700/50">
            <TabsTrigger value="overview" className="text-slate-300">Overview</TabsTrigger>
            <TabsTrigger value="steps" className="text-slate-300">Steps</TabsTrigger>
            <TabsTrigger value="executions" className="text-slate-300">Executions</TabsTrigger>
            <TabsTrigger value="settings" className="text-slate-300">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Description</h4>
              <p className="text-slate-300">{workflow.description || 'No description provided'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <h4 className="text-white font-medium">Created</h4>
                </div>
                <p className="text-slate-300">{new Date(workflow.created_at).toLocaleString()}</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="w-4 h-4 text-green-400" />
                  <h4 className="text-white font-medium">Last Updated</h4>
                </div>
                <p className="text-slate-300">{new Date(workflow.updated_at).toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <GitBranch className="w-4 h-4 text-purple-400" />
                <h4 className="text-white font-medium">Steps Summary</h4>
              </div>
              <p className="text-slate-300">
                {workflow.steps && workflow.steps.length > 0
                  ? `This workflow has ${workflow.steps.length} steps`
                  : 'This workflow has no steps defined yet'}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="steps" className="space-y-4 mt-4">
            {workflow.steps && workflow.steps.length > 0 ? (
              <div className="space-y-2">
                {workflow.steps.map((step: any, index: number) => (
                  <div key={step.id} className="relative">
                    <div className="flex items-center space-x-4 p-4 bg-slate-700/50 border border-slate-600 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getStepColor(step.type)}>
                            {step.type}
                          </Badge>
                          <span className="text-white font-medium">{step.name}</span>
                        </div>
                        {step.description && (
                          <p className="text-slate-400 text-sm mt-1">{step.description}</p>
                        )}
                      </div>
                    </div>
                    {index < workflow.steps.length - 1 && (
                      <div className="flex justify-center my-2">
                        <div className="w-0.5 h-4 bg-slate-600"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400 mb-2">No steps defined</p>
                <Button
                  onClick={onEdit}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Add Steps
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="executions" className="space-y-4 mt-4">
            <WorkflowExecutionHistory workflowId={workflow.id} limit={10} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 mt-4">
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="w-4 h-4 text-blue-400" />
                <h4 className="text-white font-medium">Workflow Settings</h4>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h5 className="text-slate-300 text-sm font-medium mb-1">Workflow ID</h5>
                  <p className="text-slate-400 text-sm font-mono">{workflow.id}</p>
                </div>
                
                <div>
                  <h5 className="text-slate-300 text-sm font-medium mb-1">Raw Configuration</h5>
                  <div className="bg-slate-800 p-3 rounded-lg overflow-auto max-h-60">
                    <pre className="text-slate-300 text-xs">
                      {JSON.stringify(workflow, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WorkflowDetailView;