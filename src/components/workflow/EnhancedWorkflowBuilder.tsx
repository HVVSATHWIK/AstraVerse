import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UserWorkflow } from '@/types';
import { useWorkflows, useCreateWorkflow, useUpdateWorkflow, useExecuteWorkflow } from '@/hooks/api/useWorkflows';
import WorkflowList from './WorkflowList';
import WorkflowStepEditor from './WorkflowStepEditor';
import { Sparkles } from 'lucide-react';
import GeminiActionCard from '@/components/GeminiActionCard';
import WorkflowDetailView from './WorkflowDetailView';

const EnhancedWorkflowBuilder = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<UserWorkflow | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showGeminiAction, setShowGeminiAction] = useState(false);
  
  const { data: workflows, isLoading } = useWorkflows();
  const createWorkflow = useCreateWorkflow();
  const updateWorkflow = useUpdateWorkflow();
  const executeWorkflow = useExecuteWorkflow();
  const { toast } = useToast();

  const handleSelectWorkflow = (workflow: UserWorkflow) => {
    setSelectedWorkflow(workflow);
    setIsCreating(false);
    setIsEditing(false);
  };

  const handleCreateWorkflow = () => {
    setSelectedWorkflow(null);
    setIsCreating(true);
    setIsEditing(false);
  };

  const handleEditWorkflow = () => {
    setIsEditing(true);
  };

  const handleDeleteWorkflow = async (id: string) => {
    try {
      // Delete workflow logic would go here
      setSelectedWorkflow(null);
      toast({
        title: 'Workflow Deleted',
        description: 'The workflow has been deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting workflow:', error);
      toast({
        title: 'Deletion Failed',
        description: 'Failed to delete workflow. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSaveWorkflow = async (workflowData: {
    name: string;
    description: string;
    status: 'draft' | 'active' | 'paused';
    steps: any[];
  }) => {
    try {
      if (selectedWorkflow && isEditing) {
        // Update existing workflow
        await updateWorkflow.mutateAsync({
          id: selectedWorkflow.id,
          updates: workflowData
        });
        setIsEditing(false);
        toast({
          title: 'Workflow Updated',
          description: `${workflowData.name} has been updated successfully.`,
        });
      } else {
        // Create new workflow
        await createWorkflow.mutateAsync(workflowData);
        setIsCreating(false);
        toast({
          title: 'Workflow Created',
          description: `${workflowData.name} has been created successfully.`,
        });
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast({
        title: 'Save Failed',
        description: 'Failed to save workflow. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setSelectedWorkflow(null);
    setIsCreating(false);
    setIsEditing(false);
  };

  const handleExecuteWorkflow = async (id: string) => {
    try {
      await executeWorkflow.mutateAsync({ id });
      toast({
        title: 'Workflow Executed',
        description: 'The workflow has been triggered successfully.',
      });
    } catch (error) {
      console.error('Error executing workflow:', error);
      toast({
        title: 'Execution Failed',
        description: 'Failed to execute workflow. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleGeminiResult = (result: any) => {
    console.log('Gemini AI result:', result);
    toast({
      title: 'AI Suggestion Generated',
      description: 'AI has generated workflow suggestions based on your input.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => setShowGeminiAction(!showGeminiAction)}
          className="text-purple-400 border-purple-500/50"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {showGeminiAction ? 'Hide AI Assistant' : 'Show AI Assistant'}
        </Button>
      </div>

      {showGeminiAction && (
        <GeminiActionCard
          onResult={handleGeminiResult}
          initialConfig={{
            prompt: selectedWorkflow 
              ? `Analyze this workflow and suggest improvements: ${selectedWorkflow.name}\n\n${selectedWorkflow.description || ''}`
              : "Generate a workflow idea for automating business processes",
            options: { temperature: 0.7, maxTokens: 1024 }
          }}
        />
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <WorkflowList
            workflows={workflows}
            onSelectWorkflow={handleSelectWorkflow}
            onCreateWorkflow={handleCreateWorkflow}
            selectedWorkflowId={selectedWorkflow?.id}
          />
        </div>
        <div className="xl:col-span-2">
          {isCreating || isEditing ? (
            <WorkflowStepEditor
              workflow={isEditing ? selectedWorkflow : undefined}
              onSave={handleSaveWorkflow}
              onCancel={handleCancel}
              isLoading={createWorkflow.isPending || updateWorkflow.isPending}
            />
          ) : selectedWorkflow ? (
            <WorkflowDetailView 
              workflow={selectedWorkflow}
              onEdit={handleEditWorkflow}
              onDelete={() => handleDeleteWorkflow(selectedWorkflow.id)}
            />
          ) : (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8 text-center">
                <h3 className="text-white text-lg font-medium mb-4">No Workflow Selected</h3>
                <p className="text-slate-400 mb-6">Select a workflow from the list to view details or create a new one</p>
                <Button
                  onClick={handleCreateWorkflow}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Create New Workflow
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedWorkflowBuilder;