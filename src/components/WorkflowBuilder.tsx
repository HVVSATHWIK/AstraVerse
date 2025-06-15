
import React, { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GitBranch, 
  MessageSquare, 
  FileText,
  Sparkles
} from 'lucide-react';
import { useWorkflows, useExecuteWorkflow } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';
import GeminiActionCard from './GeminiActionCard';
import ChatWorkflowBuilder from './ChatWorkflowBuilder';
import ChatTemplates from './ChatTemplates';
import WorkflowList from './workflow/WorkflowList';
import WorkflowDetails from './workflow/WorkflowDetails';
import EmptyWorkflowState from './workflow/EmptyWorkflowState';
import AIActionsLibrary from './workflow/AIActionsLibrary';

const WorkflowBuilder = () => {
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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Active Workflows</h3>
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-slate-800/50 border-slate-700 p-4 rounded-lg">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-2">
          <div className="bg-slate-800/50 border-slate-700 p-6 rounded-lg">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="builder" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="builder" className="text-slate-300">
            <GitBranch className="w-4 h-4 mr-2" />
            Builder
          </TabsTrigger>
          <TabsTrigger value="chat" className="text-slate-300">
            <MessageSquare className="w-4 h-4 mr-2" />
            AI Chat
          </TabsTrigger>
          <TabsTrigger value="templates" className="text-slate-300">
            <FileText className="w-4 h-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="ai-actions" className="text-slate-300">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Actions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          {!workflows || workflows.length === 0 ? (
            <>
              <EmptyWorkflowState onToggleGeminiAction={toggleGeminiAction} />
              {showGeminiAction && (
                <div className="mt-8 max-w-2xl mx-auto">
                  <GeminiActionCard onResult={handleGeminiResult} />
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <WorkflowList
                workflows={workflows}
                selectedWorkflow={selectedWorkflow}
                onSelectWorkflow={setSelectedWorkflow}
                onToggleGeminiAction={toggleGeminiAction}
              />

              <div className="lg:col-span-2 space-y-6">
                {showGeminiAction && (
                  <GeminiActionCard onResult={handleGeminiResult} />
                )}
                
                {selectedWorkflow && (
                  <WorkflowDetails
                    workflow={selectedWorkflow}
                    onExecuteWorkflow={handleExecuteWorkflow}
                    isExecuting={executeWorkflow.isPending}
                  />
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <ChatWorkflowBuilder />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <ChatTemplates onSelectTemplate={handleTemplateSelect} />
        </TabsContent>

        <TabsContent value="ai-actions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GeminiActionCard onResult={handleGeminiResult} />
            <AIActionsLibrary />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowBuilder;
