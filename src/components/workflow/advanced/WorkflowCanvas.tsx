
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitBranch } from 'lucide-react';
import { WorkflowNode as WorkflowNodeType } from '@/types/workflow';
import WorkflowNode from './WorkflowNode';

interface WorkflowCanvasProps {
  nodes: WorkflowNodeType[];
  selectedNode: WorkflowNodeType | null;
  onSelectNode: (node: WorkflowNodeType) => void;
  onRemoveNode: (nodeId: string) => void;
  onDragStart: (nodeId: string) => void;
  onDragEnd: () => void;
}

const WorkflowCanvas = ({
  nodes,
  selectedNode,
  onSelectNode,
  onRemoveNode,
  onDragStart,
  onDragEnd
}: WorkflowCanvasProps) => {
  return (
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
            nodes.map(node => (
              <WorkflowNode
                key={node.id}
                node={node}
                isSelected={selectedNode?.id === node.id}
                onSelect={() => onSelectNode(node)}
                onRemove={() => onRemoveNode(node.id)}
                onDragStart={() => onDragStart(node.id)}
                onDragEnd={onDragEnd}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowCanvas;
