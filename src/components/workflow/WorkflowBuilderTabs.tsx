
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GitBranch, 
  MessageSquare, 
  FileText,
  Sparkles,
  Store,
  Lightbulb,
  BarChart3,
  Workflow
} from 'lucide-react';

interface WorkflowBuilderTabsProps {
  defaultValue: string;
  children: React.ReactNode;
}

const WorkflowBuilderTabs = ({ defaultValue, children }: WorkflowBuilderTabsProps) => {
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 bg-slate-800/50 gap-1">
        <TabsTrigger value="builder" className="text-slate-300 flex items-center space-x-1 text-xs lg:text-sm">
          <GitBranch className="w-3 h-3 lg:w-4 lg:h-4" />
          <span>Builder</span>
        </TabsTrigger>
        <TabsTrigger value="chat" className="text-slate-300 flex items-center space-x-1 text-xs lg:text-sm">
          <MessageSquare className="w-3 h-3 lg:w-4 lg:h-4" />
          <span>AI Chat</span>
        </TabsTrigger>
        <TabsTrigger value="documents" className="text-slate-300 flex items-center space-x-1 text-xs lg:text-sm">
          <FileText className="w-3 h-3 lg:w-4 lg:h-4" />
          <span>Documents</span>
        </TabsTrigger>
        <TabsTrigger value="meetings" className="text-slate-300 flex items-center space-x-1 text-xs lg:text-sm">
          <Workflow className="w-3 h-3 lg:w-4 lg:h-4" />
          <span>Meetings</span>
        </TabsTrigger>
        <TabsTrigger value="marketplace" className="text-slate-300 flex items-center space-x-1 text-xs lg:text-sm">
          <Store className="w-3 h-3 lg:w-4 lg:h-4" />
          <span>Market</span>
        </TabsTrigger>
        <TabsTrigger value="recommendations" className="text-slate-300 flex items-center space-x-1 text-xs lg:text-sm">
          <Lightbulb className="w-3 h-3 lg:w-4 lg:h-4" />
          <span>Smart</span>
        </TabsTrigger>
        <TabsTrigger value="analytics" className="text-slate-300 flex items-center space-x-1 text-xs lg:text-sm">
          <BarChart3 className="w-3 h-3 lg:w-4 lg:h-4" />
          <span>Analytics</span>
        </TabsTrigger>
        <TabsTrigger value="ai-actions" className="text-slate-300 flex items-center space-x-1 text-xs lg:text-sm">
          <Sparkles className="w-3 h-3 lg:w-4 lg:h-4" />
          <span>AI Actions</span>
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};

export default WorkflowBuilderTabs;
