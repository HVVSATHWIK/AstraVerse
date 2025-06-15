
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import ChatWorkflowBuilder from '@/components/ChatWorkflowBuilder';
import DocumentProcessor from '@/components/document/DocumentProcessor';
import MeetingAutomation from '@/components/meeting/MeetingAutomation';
import WorkflowMarketplace from '@/components/workflow/WorkflowMarketplace';
import SmartWorkflowRecommendations from '@/components/workflow/SmartWorkflowRecommendations';
import AdvancedAnalytics from '@/components/analytics/AdvancedAnalytics';
import GeminiActionCard from '@/components/GeminiActionCard';
import AIActionsLibrary from '@/components/workflow/AIActionsLibrary';

interface OtherTabsContentProps {
  onGeminiResult: (result: any) => void;
}

const OtherTabsContent = ({ onGeminiResult }: OtherTabsContentProps) => {
  return (
    <>
      <TabsContent value="chat" className="space-y-6">
        <ChatWorkflowBuilder />
      </TabsContent>

      <TabsContent value="documents" className="space-y-6">
        <DocumentProcessor />
      </TabsContent>

      <TabsContent value="meetings" className="space-y-6">
        <MeetingAutomation />
      </TabsContent>

      <TabsContent value="marketplace" className="space-y-6">
        <WorkflowMarketplace />
      </TabsContent>

      <TabsContent value="recommendations" className="space-y-6">
        <SmartWorkflowRecommendations />
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6">
        <AdvancedAnalytics />
      </TabsContent>

      <TabsContent value="ai-actions" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GeminiActionCard onResult={onGeminiResult} />
          <AIActionsLibrary />
        </div>
      </TabsContent>
    </>
  );
};

export default OtherTabsContent;
