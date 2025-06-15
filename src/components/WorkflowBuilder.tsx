
import React from 'react';
import { useWorkflowBuilder } from './workflow/hooks/useWorkflowBuilder';
import WorkflowBuilderTabs from './workflow/WorkflowBuilderTabs';
import BuilderTabContent from './workflow/tabs/BuilderTabContent';
import OtherTabsContent from './workflow/tabs/OtherTabsContent';
import WorkflowBuilderLoading from './workflow/WorkflowBuilderLoading';

const WorkflowBuilder = () => {
  const {
    workflows,
    isLoading,
    selectedWorkflow,
    setSelectedWorkflow,
    showGeminiAction,
    toggleGeminiAction,
    handleExecuteWorkflow,
    handleGeminiResult,
    isExecuting
  } = useWorkflowBuilder();

  if (isLoading) {
    return <WorkflowBuilderLoading />;
  }

  return (
    <div className="space-y-6">
      <WorkflowBuilderTabs defaultValue="builder">
        <BuilderTabContent
          workflows={workflows}
          selectedWorkflow={selectedWorkflow}
          onSelectWorkflow={setSelectedWorkflow}
          showGeminiAction={showGeminiAction}
          onToggleGeminiAction={toggleGeminiAction}
          onExecuteWorkflow={handleExecuteWorkflow}
          isExecuting={isExecuting}
          onGeminiResult={handleGeminiResult}
        />
        
        <OtherTabsContent onGeminiResult={handleGeminiResult} />
      </WorkflowBuilderTabs>
    </div>
  );
};

export default WorkflowBuilder;
