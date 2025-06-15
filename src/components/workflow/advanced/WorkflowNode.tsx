
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, ArrowDown } from 'lucide-react';
import { WorkflowNode as WorkflowNodeType } from '@/types/workflow';
import { nodeTypes } from '@/constants/nodeTypes';

interface WorkflowNodeProps {
  node: WorkflowNodeType;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

const WorkflowNode = ({
  node,
  isSelected,
  onSelect,
  onRemove,
  onDragStart,
  onDragEnd
}: WorkflowNodeProps) => {
  const nodeType = nodeTypes[node.type];
  const IconComponent = nodeType.icon;

  return (
    <Card
      className={`absolute cursor-move border-2 ${nodeType.borderColor} ${nodeType.bgColor} backdrop-blur-sm min-w-48 ${
        isSelected ? 'ring-2 ring-white' : ''
      }`}
      style={{ left: node.position.x, top: node.position.y }}
      onClick={onSelect}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
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
              onRemove();
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

export default WorkflowNode;
