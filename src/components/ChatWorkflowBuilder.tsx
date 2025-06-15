
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, MessageSquare } from 'lucide-react';
import AIChatWorkflow from './AIChatWorkflow';
import ChatWorkflowForm from './workflow/ChatWorkflowForm';
import ChatWorkflowCard from './workflow/ChatWorkflowCard';
import ChatWorkflowAnalytics from './workflow/ChatWorkflowAnalytics';
import ChatWorkflowSettings from './workflow/ChatWorkflowSettings';
import { useToast } from '@/hooks/use-toast';

interface ChatWorkflow {
  id: string;
  name: string;
  description: string;
  context: string;
  status: 'active' | 'paused' | 'draft';
  createdAt: string;
  stats: {
    totalChats: number;
    totalMessages: number;
    avgResponseTime: number;
    satisfaction: number;
  };
}

const ChatWorkflowBuilder = () => {
  const [workflows, setWorkflows] = useState<ChatWorkflow[]>([
    {
      id: 'workflow-1',
      name: 'Customer Support Agent',
      description: 'AI assistant for handling customer inquiries and support tickets',
      context: 'You are a helpful customer support agent. Be polite, professional, and try to resolve customer issues efficiently.',
      status: 'active',
      createdAt: new Date().toISOString(),
      stats: {
        totalChats: 45,
        totalMessages: 234,
        avgResponseTime: 1200,
        satisfaction: 4.7,
      },
    },
    {
      id: 'workflow-2',
      name: 'Sales Assistant',
      description: 'AI agent for lead qualification and sales support',
      context: 'You are a knowledgeable sales assistant. Help prospects understand our products and guide them through the sales process.',
      status: 'active',
      createdAt: new Date().toISOString(),
      stats: {
        totalChats: 28,
        totalMessages: 156,
        avgResponseTime: 980,
        satisfaction: 4.5,
      },
    },
  ]);

  const [selectedWorkflow, setSelectedWorkflow] = useState<ChatWorkflow | null>(workflows[0]);
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    context: '',
  });

  const { toast } = useToast();

  const handleNewWorkflowChange = (field: string, value: string) => {
    setNewWorkflow(prev => ({ ...prev, [field]: value }));
  };

  const createWorkflow = () => {
    if (!newWorkflow.name.trim()) {
      toast({
        title: 'Error',
        description: 'Workflow name is required.',
        variant: 'destructive',
      });
      return;
    }

    const workflow: ChatWorkflow = {
      id: `workflow-${Date.now()}`,
      name: newWorkflow.name,
      description: newWorkflow.description,
      context: newWorkflow.context || 'You are a helpful AI assistant.',
      status: 'draft',
      createdAt: new Date().toISOString(),
      stats: {
        totalChats: 0,
        totalMessages: 0,
        avgResponseTime: 0,
        satisfaction: 0,
      },
    };

    setWorkflows(prev => [...prev, workflow]);
    setSelectedWorkflow(workflow);
    setIsCreating(false);
    setNewWorkflow({ name: '', description: '', context: '' });

    toast({
      title: 'Workflow Created',
      description: `${workflow.name} has been created successfully.`,
    });
  };

  const toggleWorkflowStatus = (id: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === id 
        ? { ...w, status: w.status === 'active' ? 'paused' : 'active' as 'active' | 'paused' }
        : w
    ));
  };

  const deleteWorkflow = (id: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== id));
    if (selectedWorkflow?.id === id) {
      setSelectedWorkflow(workflows.find(w => w.id !== id) || null);
    }
    toast({
      title: 'Workflow Deleted',
      description: 'Chat workflow has been removed.',
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Workflow List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Chat Workflows</h3>
          <Button 
            size="sm" 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => setIsCreating(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
        </div>

        {/* Create New Workflow Form */}
        {isCreating && (
          <ChatWorkflowForm
            newWorkflow={newWorkflow}
            onNewWorkflowChange={handleNewWorkflowChange}
            onCreateWorkflow={createWorkflow}
            onCancel={() => setIsCreating(false)}
          />
        )}

        {/* Workflow Cards */}
        {workflows.map((workflow) => (
          <ChatWorkflowCard
            key={workflow.id}
            workflow={workflow}
            isSelected={selectedWorkflow?.id === workflow.id}
            onSelect={setSelectedWorkflow}
            onToggleStatus={toggleWorkflowStatus}
            onDelete={deleteWorkflow}
          />
        ))}
      </div>

      {/* Chat Interface and Analytics */}
      <div className="lg:col-span-2 space-y-6">
        {selectedWorkflow ? (
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
              <TabsTrigger value="chat" className="text-slate-300">Chat Interface</TabsTrigger>
              <TabsTrigger value="analytics" className="text-slate-300">Analytics</TabsTrigger>
              <TabsTrigger value="settings" className="text-slate-300">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="space-y-4">
              <AIChatWorkflow workflowId={selectedWorkflow.id} />
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-4">
              <ChatWorkflowAnalytics workflow={selectedWorkflow} />
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <ChatWorkflowSettings workflow={selectedWorkflow} />
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-500" />
              <h3 className="text-xl font-semibold text-white mb-2">Select a Chat Workflow</h3>
              <p className="text-slate-400">Choose a workflow from the list to start chatting or view analytics.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ChatWorkflowBuilder;
