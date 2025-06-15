
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  MessageSquare, 
  Settings, 
  Play, 
  Pause,
  Edit,
  Trash2,
  Bot,
  Users,
  Calendar,
  BarChart3
} from 'lucide-react';
import AIChatWorkflow from './AIChatWorkflow';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'draft':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
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
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg">Create Chat Workflow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-300">Name</Label>
                <Input
                  value={newWorkflow.name}
                  onChange={(e) => setNewWorkflow(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter workflow name..."
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300">Description</Label>
                <Input
                  value={newWorkflow.description}
                  onChange={(e) => setNewWorkflow(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description..."
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300">AI Context</Label>
                <Textarea
                  value={newWorkflow.context}
                  onChange={(e) => setNewWorkflow(prev => ({ ...prev, context: e.target.value }))}
                  placeholder="Define the AI's role and behavior..."
                  className="bg-slate-700/50 border-slate-600 text-white"
                  rows={3}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={createWorkflow} className="bg-purple-600 hover:bg-purple-700">
                  Create
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreating(false)}
                  className="text-slate-300 border-slate-600"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Workflow Cards */}
        {workflows.map((workflow) => (
          <Card
            key={workflow.id}
            className={`bg-slate-800/50 border-slate-700 backdrop-blur-sm cursor-pointer transition-all duration-200 ${
              selectedWorkflow?.id === workflow.id ? 'ring-2 ring-purple-500' : 'hover:bg-slate-800/70'
            }`}
            onClick={() => setSelectedWorkflow(workflow)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  <span>{workflow.name}</span>
                </CardTitle>
                <Badge variant="outline" className={getStatusColor(workflow.status)}>
                  {workflow.status}
                </Badge>
              </div>
              <p className="text-slate-400 text-sm">{workflow.description}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Chats:</span>
                  <span className="text-white ml-2">{workflow.stats.totalChats}</span>
                </div>
                <div>
                  <span className="text-slate-400">Messages:</span>
                  <span className="text-white ml-2">{workflow.stats.totalMessages}</span>
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWorkflowStatus(workflow.id);
                  }}
                  className="text-white border-slate-600"
                >
                  {workflow.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteWorkflow(workflow.id);
                  }}
                  className="text-red-400 border-slate-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6 text-center">
                    <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                    <div className="text-2xl font-bold text-white">{selectedWorkflow.stats.totalChats}</div>
                    <div className="text-slate-400 text-sm">Total Conversations</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-green-400" />
                    <div className="text-2xl font-bold text-white">{selectedWorkflow.stats.totalMessages}</div>
                    <div className="text-slate-400 text-sm">Total Messages</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6 text-center">
                    <BarChart3 className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                    <div className="text-2xl font-bold text-white">{selectedWorkflow.stats.avgResponseTime}ms</div>
                    <div className="text-slate-400 text-sm">Avg Response Time</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6 text-center">
                    <Bot className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                    <div className="text-2xl font-bold text-white">{selectedWorkflow.stats.satisfaction}/5</div>
                    <div className="text-slate-400 text-sm">Satisfaction Score</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Workflow Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-slate-300">Name</Label>
                    <Input
                      value={selectedWorkflow.name}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      readOnly
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Description</Label>
                    <Input
                      value={selectedWorkflow.description}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      readOnly
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">AI Context</Label>
                    <Textarea
                      value={selectedWorkflow.context}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      rows={4}
                      readOnly
                    />
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Configuration
                  </Button>
                </CardContent>
              </Card>
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
