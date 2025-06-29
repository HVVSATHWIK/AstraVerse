import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, ArrowDown, Settings } from 'lucide-react';
import { WorkflowNode as WorkflowNodeType } from '@/types/workflow';
import { nodeTypes } from '@/constants/nodeTypes';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface WorkflowNodeProps {
  node: WorkflowNodeType;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onDragStart: (e: React.DragEvent) => void;
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
    <TooltipProvider>
      <Card
        className={`absolute cursor-move border-2 ${nodeType.borderColor} ${nodeType.bgColor} backdrop-blur-sm min-w-48 shadow-md transition-all duration-200 ${
          isSelected ? 'ring-2 ring-white shadow-lg' : 'hover:shadow-lg'
        }`}
        style={{ 
          left: node.position.x, 
          top: node.position.y,
          width: '180px',
          zIndex: isSelected ? 10 : 1
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <CardHeader className="pb-2 pt-3 px-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <IconComponent className={`w-4 h-4 ${nodeType.color}`} />
              <div className="text-white font-medium text-sm truncate max-w-[100px]" title={node.name}>
                {node.name}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove();
                    }}
                    className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remove node</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-3 px-3">
          <Badge variant="outline" className={`${nodeType.bgColor} ${nodeType.color} ${nodeType.borderColor} text-xs mb-2`}>
            {node.type.replace('_', ' ').toUpperCase()}
          </Badge>
          
          {Object.keys(node.config).length > 0 && (
            <div className="mt-2 bg-slate-800/50 p-1.5 rounded text-xs text-slate-300 truncate">
              {Object.entries(node.config).map(([key, value]) => (
                <div key={key} className="truncate">
                  <span className="text-slate-400">{key}:</span> {typeof value === 'string' ? value : JSON.stringify(value)}
                </div>
              )).slice(0, 2)}
              {Object.keys(node.config).length > 2 && (
                <div className="text-slate-400 text-xs">+{Object.keys(node.config).length - 2} more...</div>
              )}
            </div>
          )}
          
          {node.connections.length > 0 && (
            <div className="mt-2 flex justify-center">
              <ArrowDown className="w-4 h-4 text-slate-400" />
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default WorkflowNode;