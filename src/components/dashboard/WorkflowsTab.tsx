
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

const WorkflowsTab = () => {
  const [activeSubTab, setActiveSubTab] = useState('builder');

  const handleGeminiResult = (result: any) => {
    console.log('Gemini AI result received in WorkflowsTab:', result);
  };

  return (
    <TabsContent value="workflows" className="space-y-8">
      <section className="space-y-6 animate-fade-in-3d">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white text-3d">Workflow Management</h2>
          <div className="h-px bg-gradient-to-r from-purple-500/50 to-transparent flex-1 ml-6"></div>
        </div>
        
        {/* Enhanced Workflow Tabs */}
        <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="builder" className="text-slate-300">Workflow Builder</TabsTrigger>
            <TabsTrigger value="advanced" className="text-slate-300">Advanced Builder</TabsTrigger>
            <TabsTrigger value="templates" className="text-slate-300">AI Templates</TabsTrigger>
            <TabsTrigger value="playground" className="text-slate-300">AI Playground</TabsTrigger>
            <TabsTrigger value="monitoring" className="text-slate-300">Usage Monitor</TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-6">
            {/* Featured Gemini Action Card */}
            <div className="animate-scale-in-3d">
              <GeminiActionCard 
                onResult={handleGeminiResult}
                className="mb-6"
                initialConfig={{
                  prompt: "Generate a workflow automation idea using AI",
                  options: { temperature: 0.8, maxTokens: 1024 }
                }}
              />
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="animate-scale-in-3d stagger-1">
                <WorkflowBuilder />
              </div>
              <div className="animate-scale-in-3d stagger-2">
                <WorkflowControls />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div className="animate-scale-in-3d">
              <AdvancedWorkflowBuilder />
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="animate-scale-in-3d">
              <GeminiTemplateLibrary />
            </div>
          </TabsContent>

          <TabsContent value="playground" className="space-y-6">
            <div className="animate-scale-in-3d">
              <GeminiPlayground />
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
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
