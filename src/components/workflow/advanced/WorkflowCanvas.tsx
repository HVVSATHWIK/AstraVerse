import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Handle node drag start
  const handleNodeDragStart = (nodeId: string, e: React.DragEvent) => {
    setIsDragging(true);
    setDraggedNodeId(nodeId);
    onDragStart(nodeId);
    
    // Calculate drag offset
    const node = nodes.find(n => n.id === nodeId);
    if (node && canvasRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      setDragOffset({ x: offsetX, y: offsetY });
    }
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDragging || !draggedNodeId || !canvasRef.current) return;
    
    // Get canvas position
    const canvasRect = canvasRef.current.getBoundingClientRect();
    
    // Calculate new position
    const x = e.clientX - canvasRect.left - dragOffset.x;
    const y = e.clientY - canvasRect.top - dragOffset.y;
    
    // Update node position
    const updatedNodes = nodes.map(node => {
      if (node.id === draggedNodeId) {
        return { ...node, position: { x, y } };
      }
      return node;
    });
    
    // This would normally update the nodes state, but we're just simulating for now
    // setNodes(updatedNodes);
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setDraggedNodeId(null);
    onDragEnd();
  };

  // Draw connections between nodes
  const renderConnections = () => {
    return nodes.flatMap(node => 
      node.connections.map(targetId => {
        const target = nodes.find(n => n.id === targetId);
        if (!target) return null;
        
        // Calculate start and end points
        const startX = node.position.x + 75; // Assuming node width is 150px
        const startY = node.position.y + 50; // Assuming node height is 100px
        const endX = target.position.x;
        const endY = target.position.y + 25;
        
        // Generate path
        const path = `M${startX},${startY} C${startX + 50},${startY} ${endX - 50},${endY} ${endX},${endY}`;
        
        return (
          <svg key={`${node.id}-${targetId}`} className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <path
              d={path}
              stroke="#6366f1"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
            />
          </svg>
        );
      })
    ).filter(Boolean);
  };

  return (
    <div 
      className="relative bg-slate-900/50 border border-slate-600 rounded-lg overflow-hidden"
      style={{ height: '500px' }}
      ref={canvasRef}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* SVG Definitions for arrows */}
      <svg width="0" height="0">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
          </marker>
        </defs>
      </svg>
      
      {/* Render connections between nodes */}
      {renderConnections()}
      
      {/* Render nodes */}
      {nodes.map(node => (
        <WorkflowNode
          key={node.id}
          node={node}
          isSelected={selectedNode?.id === node.id}
          onSelect={() => onSelectNode(node)}
          onRemove={() => onRemoveNode(node.id)}
          onDragStart={(e) => handleNodeDragStart(node.id, e)}
          onDragEnd={onDragEnd}
        />
      ))}
      
      {/* Empty state */}
      {nodes.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-8 border-2 border-dashed border-slate-600 rounded-lg max-w-md">
            <GitBranch className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-medium mb-2">Start Building Your Workflow</h3>
            <p className="text-slate-400 mb-4">Drag nodes from the palette on the left to create your workflow</p>
            <Badge variant="outline" className="bg-slate-700/50 text-slate-300 mx-auto">
              Drag and drop enabled
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowCanvas;