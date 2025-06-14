
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Play, 
  Pause, 
  Plus, 
  Settings, 
  GitBranch, 
  MessageSquare, 
  Calendar,
  AlertTriangle,
  FileText,
  Zap
} from 'lucide-react';
import { useWorkflows, useExecuteWorkflow } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';

const WorkflowBuilder = () => {
  const { data: workflows, isLoading } = useWorkflows();
  const executeWorkflow = useExecuteWorkflow();
  const { toast } = useToast();
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);

  React.useEffect(() => {
    if (workflows && workflows.length > 0 && !selectedWorkflow) {
      setSelectedWorkflow(workflows[0]);
    }
  }, [workflows, selectedWorkflow]);

  const handleExecuteWorkflow = async (workflowId: string) => {
    try {
      await executeWorkflow.mutateAsync({ id: workflowId });
      toast({
        title: "Workflow Executed",
        description: "Workflow has been successfully executed.",
      });
    } catch (error) {
      toast({
        title: "Execution Failed",
        description: "Failed to execute workflow. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Active Workflows</h3>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-1" />
              New
            </Button>
          </div>
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="lg:col-span-2">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <Skeleton className="h-8 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-96 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!workflows || workflows.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-white mb-4">No Workflows Found</h3>
        <p className="text-slate-400 mb-6">Create your first workflow to get started.</p>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Workflow
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Workflow List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Active Workflows</h3>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
        </div>
        
        {workflows.map((workflow) => (
          <Card 
            key={workflow.id}
            className={`bg-slate-800/50 border-slate-700 backdrop-blur-sm cursor-pointer transition-all duration-200 ${
              selectedWorkflow?.id === workflow.id ? 'ring-2 ring-purple-500' : 'hover:bg-slate-800/70'
            }`}
            onClick={() => setSelectedWorkflow(workflow)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">{workflow.name}</CardTitle>
                <Badge 
                  variant="outline" 
                  className={workflow.status === 'active' 
                    ? 'bg-green-500/20 text-green-400 border-green-500/50'
                    : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                  }
                >
                  {workflow.status}
                </Badge>
              </div>
              <p className="text-slate-400 text-sm">{workflow.description}</p>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">{workflow.executions || 0} runs</span>
                <span className="text-green-400">{workflow.successRate || 0}% success</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workflow Details */}
      <div className="lg:col-span-2 space-y-6">
        {selectedWorkflow && (
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">{selectedWorkflow.name}</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-slate-300 border-slate-600"
                    onClick={() => handleExecuteWorkflow(selectedWorkflow.id)}
                    disabled={executeWorkflow.isPending}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Triggers */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                  Triggers
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedWorkflow.triggers?.map((trigger: any, index: number) => (
                    <div key={index} className="bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span className="text-slate-300">{trigger.name || trigger}</span>
                      </div>
                    </div>
                  )) || (
                    <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span className="text-slate-300">Manual Trigger</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <GitBranch className="w-5 h-5 mr-2 text-blue-400" />
                  Actions
                </h4>
                <div className="space-y-3">
                  {selectedWorkflow.actions?.map((action: any, index: number) => (
                    <div key={index} className="flex items-center space-x-4 bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="text-slate-300 flex-1">{action.name || action}</span>
                      <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
                        Active
                      </Badge>
                    </div>
                  )) || (
                    <div className="flex items-center space-x-4 bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full text-white text-sm font-bold">
                        1
                      </div>
                      <span className="text-slate-300 flex-1">Execute Action</span>
                      <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
                        Active
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 text-center">
                  <div className="text-2xl font-bold text-white">{selectedWorkflow.executions || 0}</div>
                  <div className="text-slate-400 text-sm">Total Runs</div>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 text-center">
                  <div className="text-2xl font-bold text-green-400">{selectedWorkflow.successRate || 0}%</div>
                  <div className="text-slate-400 text-sm">Success Rate</div>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 text-center">
                  <div className="text-2xl font-bold text-blue-400">{selectedWorkflow.avgDuration || '2.3s'}</div>
                  <div className="text-slate-400 text-sm">Avg Duration</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WorkflowBuilder;
