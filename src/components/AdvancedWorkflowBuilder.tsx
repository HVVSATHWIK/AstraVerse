import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WorkflowNode, WorkflowConnection } from '@/types/workflow';
import { nodeTypes } from '@/constants/nodeTypes';
import AdvancedWorkflowHeader from './workflow/advanced/AdvancedWorkflowHeader';
import NodePalette from './workflow/advanced/NodePalette';
import WorkflowCanvas from './workflow/advanced/WorkflowCanvas';
import NodeConfiguration from './workflow/advanced/NodeConfiguration';

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
      type: type as 'trigger' | 'action' | 'condition' | 'gemini_ai',
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

  const handleDragStart = (nodeId: string) => {
    setDraggedNode(nodeId);
  };

  const handleDragEnd = () => {
    setDraggedNode(null);
  };

  return (
    <div className="space-y-6">
      <AdvancedWorkflowHeader
        workflowName={workflowName}
        workflowDescription={workflowDescription}
        onWorkflowNameChange={setWorkflowName}
        onWorkflowDescriptionChange={setWorkflowDescription}
        onSaveWorkflow={saveWorkflow}
        onExecuteWorkflow={executeWorkflow}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <NodePalette onAddNode={addNode} />

        <div className="lg:col-span-2">
          <WorkflowCanvas
            nodes={nodes}
            selectedNode={selectedNode}
            onSelectNode={setSelectedNode}
            onRemoveNode={removeNode}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        </div>

        <NodeConfiguration
          selectedNode={selectedNode}
          onUpdateNode={updateNode}
        />
      </div>
    </div>
  );
};

export default AdvancedWorkflowBuilder;
