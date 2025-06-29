import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import WorkflowList from '@/components/workflow/WorkflowList';
import WorkflowDetails from '@/components/workflow/WorkflowDetails';
import EmptyWorkflowState from '@/components/workflow/EmptyWorkflowState';
import GeminiActionCard from '@/components/GeminiActionCard';

interface BuilderTabContentProps {
  workflows: any[] | undefined;
  selectedWorkflow: any;
  onSelectWorkflow: (workflow: any) => void;
  showGeminiAction: boolean;
  onToggleGeminiAction: () => void;
  onExecuteWorkflow: (workflowId: string) => void;
  isExecuting: boolean;
  onGeminiResult: (result: any) => void;
}

const BuilderTabContent = ({
  workflows,
  selectedWorkflow,
  onSelectWorkflow,
  showGeminiAction,
  onToggleGeminiAction,
  onExecuteWorkflow,
  isExecuting,
  onGeminiResult
}: BuilderTabContentProps) => {
  return (
    <TabsContent value="builder" className="space-y-6">
      {!workflows || workflows.length === 0 ? (
        <>
          <EmptyWorkflowState onToggleGeminiAction={onToggleGeminiAction} />
          {showGeminiAction && (
            <div className="mt-8 max-w-2xl mx-auto">
              <GeminiActionCard onResult={onGeminiResult} />
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <WorkflowList
            workflows={workflows}
            selectedWorkflowId={selectedWorkflow?.id}
            onSelectWorkflow={onSelectWorkflow}
            onCreateWorkflow={() => {}}
          />

          <div className="lg:col-span-2 space-y-6">
            {showGeminiAction && (
              <GeminiActionCard onResult={onGeminiResult} />
            )}
            
            {selectedWorkflow && (
              <WorkflowDetails
                workflow={selectedWorkflow}
                onExecuteWorkflow={onExecuteWorkflow}
                isExecuting={isExecuting}
              />
            )}
          </div>
        </div>
      )}
    </TabsContent>
  );
};

export default BuilderTabContent;