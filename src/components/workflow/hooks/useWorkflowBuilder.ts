
import React, { useState } from 'react';
import { useWorkflows, useExecuteWorkflow } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';

export const useWorkflowBuilder = () => {
  const { data: workflows, isLoading } = useWorkflows();
  const executeWorkflow = useExecuteWorkflow();
  const { toast } = useToast();
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [showGeminiAction, setShowGeminiAction] = useState(false);

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

  const handleGeminiResult = (result: any) => {
    toast({
      title: "Gemini AI Action Complete",
      description: `Generated ${result.content.length} characters of content.`,
    });
  };

  const handleTemplateSelect = (template: any) => {
    toast({
      title: "Template Selected",
      description: `${template.name} template is ready to use.`,
    });
  };

  const toggleGeminiAction = () => {
    setShowGeminiAction(!showGeminiAction);
  };

  return {
    workflows,
    isLoading,
    selectedWorkflow,
    setSelectedWorkflow,
    showGeminiAction,
    toggleGeminiAction,
    handleExecuteWorkflow,
    handleGeminiResult,
    handleTemplateSelect,
    isExecuting: executeWorkflow.isPending
  };
};
