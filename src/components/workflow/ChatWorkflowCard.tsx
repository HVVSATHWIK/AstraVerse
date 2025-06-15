
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Play, Pause, Trash2 } from 'lucide-react';

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

interface ChatWorkflowCardProps {
  workflow: ChatWorkflow;
  isSelected: boolean;
  onSelect: (workflow: ChatWorkflow) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

const ChatWorkflowCard = ({ 
  workflow, 
  isSelected, 
  onSelect, 
  onToggleStatus, 
  onDelete 
}: ChatWorkflowCardProps) => {
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
    <Card
      className={`bg-slate-800/50 border-slate-700 backdrop-blur-sm cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-2 ring-purple-500' : 'hover:bg-slate-800/70'
      }`}
      onClick={() => onSelect(workflow)}
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
              onToggleStatus(workflow.id);
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
              onDelete(workflow.id);
            }}
            className="text-red-400 border-slate-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatWorkflowCard;
