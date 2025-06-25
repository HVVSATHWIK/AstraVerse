import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WorkflowBuilder from '@/components/WorkflowBuilder';
import WorkflowControls from '@/components/WorkflowControls';
import GeminiActionCard from '@/components/GeminiActionCard';
import GeminiTemplateLibrary from '@/components/GeminiTemplateLibrary';
import AdvancedWorkflowBuilder from '@/components/AdvancedWorkflowBuilder';
import GeminiUsageMonitor from '@/components/GeminiUsageMonitor';
import GeminiPlayground from '@/components/GeminiPlayground';
import DocumentProcessor from '@/components/document/DocumentProcessor';
import MeetingAutomation from '@/components/meeting/MeetingAutomation';
import AdvancedAnalytics from '@/components/analytics/AdvancedAnalytics';
import WorkflowTemplateManager from '@/components/workflow/WorkflowTemplateManager';
import EnhancedWorkflowBuilder from '@/components/workflow/EnhancedWorkflowBuilder';
import { Workflow } from '@/types';

const WorkflowsTab = () => {
  const [activeSubTab, setActiveSubTab] = useState('builder');
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleGeminiResult = (result: any) => {
    console.log('Gemini AI result received in WorkflowsTab:', result);
  };

  const handleSelectWorkflow = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setIsCreating(false);
  };

  const handleCreateWorkflow = () => {
    setSelectedWorkflow(null);
    setIsCreating(true);
  };

  return (
    <TabsContent value="workflows" className="space-y-8">
      <section className="space-y-6 animate-fade-in-3d">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white text-3d">Comprehensive Workflow Management</h2>
          <div className="h-px bg-gradient-to-r from-purple-500/50 to-transparent flex-1 ml-6"></div>
        </div>
        
        {/* Enhanced Workflow Tabs with All Features */}
        <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700 grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-9 gap-1">
            <TabsTrigger value="builder" className="text-slate-300 text-xs lg:text-sm">Builder</TabsTrigger>
            <TabsTrigger value="advanced" className="text-slate-300 text-xs lg:text-sm">Advanced</TabsTrigger>
            <TabsTrigger value="templates" className="text-slate-300 text-xs lg:text-sm">Templates</TabsTrigger>
            <TabsTrigger value="manager" className="text-slate-300 text-xs lg:text-sm">Template Manager</TabsTrigger>
            <TabsTrigger value="playground" className="text-slate-300 text-xs lg:text-sm">Playground</TabsTrigger>
            <TabsTrigger value="documents" className="text-slate-300 text-xs lg:text-sm">Documents</TabsTrigger>
            <TabsTrigger value="meetings" className="text-slate-300 text-xs lg:text-sm">Meetings</TabsTrigger>
            <TabsTrigger value="analytics" className="text-slate-300 text-xs lg:text-sm">Analytics</TabsTrigger>
            <TabsTrigger value="monitoring" className="text-slate-300 text-xs lg:text-sm">Monitor</TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-6">
            {/* Enhanced Workflow Builder */}
            <EnhancedWorkflowBuilder />
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            {/* Advanced Visual Workflow Builder */}
            <div className="animate-scale-in-3d">
              <AdvancedWorkflowBuilder />
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            {/* AI Templates and Prompt Management */}
            <div className="animate-scale-in-3d">
              <GeminiTemplateLibrary />
            </div>
          </TabsContent>

          <TabsContent value="manager" className="space-y-6">
            {/* Workflow Template Manager */}
            <div className="animate-scale-in-3d">
              <WorkflowTemplateManager />
            </div>
          </TabsContent>

          <TabsContent value="playground" className="space-y-6">
            {/* AI Testing and Experimentation */}
            <div className="animate-scale-in-3d">
              <GeminiPlayground />
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            {/* Document Processing & Analysis */}
            <div className="animate-scale-in-3d">
              <DocumentProcessor />
            </div>
          </TabsContent>

          <TabsContent value="meetings" className="space-y-6">
            {/* Meeting & Communication Automation */}
            <div className="animate-scale-in-3d">
              <MeetingAutomation />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Advanced Analytics & Monitoring */}
            <div className="animate-scale-in-3d">
              <AdvancedAnalytics />
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            {/* Usage Monitoring and Performance */}
            <div className="animate-scale-in-3d">
              <GeminiUsageMonitor />
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </TabsContent>
  );
};

export default WorkflowsTab;