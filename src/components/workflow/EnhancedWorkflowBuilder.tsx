import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Workflow, useCreateWorkflow, useUpdateWorkflow, useExecuteWorkflow } from '@/hooks/api/useWorkflows';
import WorkflowList from './WorkflowList';
import WorkflowStepEditor from './WorkflowStepEditor';
import { Sparkles } from 'lucide-react';
import GeminiActionCard from '@/components/GeminiActionCard';

const EnhancedWorkflowBuilder = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showGeminiAction, setShowGeminiAction] = useState(false);
  
  const createWorkflow = useCreateWorkflow();
  const updateWorkflow = useUpdateWorkflow();
  const executeWorkflow = useExecuteWorkflow();
  const { toast } = useToast();

  const handleSelectWorkflow = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setIsCreating(false);
  };

  const handleCreateWorkflow = () => {
    setSelectedWorkflow(null);
    setIsCreating(true);
  };

  const handleSaveWorkflow = async (workflowData: {
    name: string;
    description: string;
    status: 'draft' | 'active' | 'paused';
    steps: any[];
  }) => {
    try {
      if (selectedWorkflow) {
        // Update existing workflow
        await updateWorkflow.mutateAsync({
          id: selectedWorkflow.id,
          updates: workflowData
        });
        setSelectedWorkflow(null);
      } else {
        // Create new workflow
        await createWorkflow.mutateAsync(workflowData);
        setIsCreating(false);
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
    }
  };

  const handleCancel = () => {
    setSelectedWorkflow(null);
    setIsCreating(false);
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
            onSelectWorkflow={handleSelectWorkflow}
            onCreateWorkflow={handleCreateWorkflow}
          />
        </div>
        <div className="xl:col-span-2">
          {isCreating || selectedWorkflow ? (
            <WorkflowStepEditor
              workflow={selectedWorkflow || undefined}
              onSave={handleSaveWorkflow}
              onCancel={handleCancel}
              isLoading={createWorkflow.isPending || updateWorkflow.isPending}
            />
          ) : (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8 text-center">
                <h3 className="text-white text-lg font-medium mb-4">No Workflow Selected</h3>
                <p className="text-slate-400 mb-6">Select a workflow from the list to edit or create a new one</p>
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