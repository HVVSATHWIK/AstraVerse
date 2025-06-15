
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Trash2, 
  Play, 
  Save, 
  GitBranch, 
  Sparkles, 
  Zap, 
  MessageSquare,
  Database,
  Mail,
  Code,
  ArrowDown,
  ArrowRight,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'gemini_ai';
  name: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  connections: string[];
}

interface WorkflowConnection {
  from: string;
  to: string;
  condition?: string;
}

const nodeTypes = {
  trigger: {
    icon: Zap,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/50',
    options: ['Schedule', 'Webhook', 'Email', 'File Upload', 'Database Change']
  },
  action: {
    icon: Play,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/50',
    options: ['Send Email', 'Update Database', 'Call API', 'Create File', 'Send Notification']
  },
  condition: {
    icon: GitBranch,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/50',
    options: ['If/Then', 'Compare Values', 'Check Status', 'Validate Data']
  },
  gemini_ai: {
    icon: Sparkles,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/50',
    options: ['Generate Content', 'Analyze Data', 'Classify Text', 'Extract Information', 'Summarize']
  }
};

const AdvancedWorkflowBuilder = () => {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [connections, setConnections] = useState<WorkflowConnection[]>([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [draggedNode, setDraggedNode] = useState<string | null>(null);

  const { toast } = useToast();

  const addNode = (type: keyof typeof nodeTypes) => {
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type,
      name: `New ${type}`,
      config: {},
      position: { x: 50 + Math.random() * 300, y: 50 + Math.random() * 200 },
      connections: []
    };
    setNodes(prev => [...prev, newNode]);
  };

  const removeNode = (nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setConnections(prev => prev.filter(c => c.from !== nodeId && c.to !== nodeId));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  };

  const updateNode = (nodeId: string, updates: Partial<WorkflowNode>) => {
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, ...updates } : n));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const connectNodes = (fromId: string, toId: string) => {
    const connection: WorkflowConnection = { from: fromId, to: toId };
    setConnections(prev => [...prev, connection]);
    
    // Update the from node's connections
    setNodes(prev => prev.map(n => 
      n.id === fromId 
        ? { ...n, connections: [...n.connections, toId] }
        : n
    ));
  };

  const saveWorkflow = () => {
    if (!workflowName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a workflow name.',
        variant: 'destructive',
      });
      return;
    }

    const workflow = {
      name: workflowName,
      description: workflowDescription,
      nodes,
      connections,
      createdAt: new Date().toISOString()
    };

    console.log('Saving workflow:', workflow);
    
    toast({
      title: 'Workflow Saved',
      description: `"${workflowName}" has been saved successfully.`,
    });
  };

  const executeWorkflow = () => {
    if (nodes.length === 0) {
      toast({
        title: 'No Workflow',
        description: 'Please add nodes to the workflow before executing.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Workflow Executed',
      description: `"${workflowName || 'Untitled Workflow'}" is now running.`,
    });
  };

  const renderNode = (node: WorkflowNode) => {
    const nodeType = nodeTypes[node.type];
    const IconComponent = nodeType.icon;

    return (
      <Card
        key={node.id}
        className={`absolute cursor-move border-2 ${nodeType.borderColor} ${nodeType.bgColor} backdrop-blur-sm min-w-48 ${
          selectedNode?.id === node.id ? 'ring-2 ring-white' : ''
        }`}
        style={{ left: node.position.x, top: node.position.y }}
        onClick={() => setSelectedNode(node)}
        draggable
        onDragStart={() => setDraggedNode(node.id)}
        onDragEnd={() => setDraggedNode(null)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <IconComponent className={`w-4 h-4 ${nodeType.color}`} />
              <span className="text-white text-sm font-medium">{node.name}</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                removeNode(node.id);
              }}
              className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Badge variant="outline" className={`${nodeType.bgColor} ${nodeType.color} ${nodeType.borderColor} text-xs`}>
            {node.type.replace('_', ' ').toUpperCase()}
          </Badge>
          {node.connections.length > 0 && (
            <div className="mt-2">
              <ArrowDown className="w-4 h-4 text-slate-400 mx-auto" />
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Workflow Header */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <GitBranch className="w-5 h-5 text-blue-400" />
            <span>Advanced Workflow Builder</span>
            <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/50">
              Visual Editor
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Workflow Name</Label>
              <Input
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="Enter workflow name..."
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Description</Label>
              <Input
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                placeholder="Describe what this workflow does..."
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={saveWorkflow}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Workflow
            </Button>
            <Button
              onClick={executeWorkflow}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Execute
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Node Palette */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-lg">Node Palette</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(nodeTypes).map(([type, config]) => {
              const IconComponent = config.icon;
              return (
                <Button
                  key={type}
                  onClick={() => addNode(type as keyof typeof nodeTypes)}
                  variant="outline"
                  className={`w-full justify-start ${config.bgColor} ${config.borderColor} text-white hover:bg-slate-700/50`}
                >
                  <IconComponent className={`w-4 h-4 mr-2 ${config.color}`} />
                  Add {type.replace('_', ' ').toUpperCase()}
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Canvas */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>Workflow Canvas</span>
                <Badge variant="outline" className="bg-slate-500/20 text-slate-400 border-slate-500/50">
                  {nodes.length} Nodes
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="relative bg-slate-900/50 border border-slate-600 rounded-lg min-h-96 overflow-hidden"
                style={{ height: '500px' }}
              >
                {nodes.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <GitBranch className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-400">Drag nodes from the palette to start building</p>
                    </div>
                  </div>
                ) : (
                  nodes.map(renderNode)
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Node Configuration */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-lg">
              {selectedNode ? 'Node Configuration' : 'Select a Node'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedNode ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Node Name</Label>
                  <Input
                    value={selectedNode.name}
                    onChange={(e) => updateNode(selectedNode.id, { name: e.target.value })}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Node Type</Label>
                  <Select
                    value={selectedNode.type}
                    onValueChange={(value) => updateNode(selectedNode.id, { type: value as any })}
                  >
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {Object.keys(nodeTypes).map(type => (
                        <SelectItem key={type} value={type} className="text-white hover:bg-slate-700">
                          {type.replace('_', ' ').toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedNode.type === 'gemini_ai' && (
                  <div className="space-y-2">
                    <Label className="text-slate-300">AI Prompt</Label>
                    <Textarea
                      value={selectedNode.config.prompt || ''}
                      onChange={(e) => updateNode(selectedNode.id, { 
                        config: { ...selectedNode.config, prompt: e.target.value }
                      })}
                      placeholder="Enter the prompt for Gemini AI..."
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-slate-300">Configuration</Label>
                  <Textarea
                    value={JSON.stringify(selectedNode.config, null, 2)}
                    onChange={(e) => {
                      try {
                        const config = JSON.parse(e.target.value);
                        updateNode(selectedNode.id, { config });
                      } catch (error) {
                        // Invalid JSON, ignore
                      }
                    }}
                    placeholder="Node configuration (JSON)"
                    className="bg-slate-700/50 border-slate-600 text-white font-mono text-xs"
                    rows={6}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Settings className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">Click on a node to configure it</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedWorkflowBuilder;
