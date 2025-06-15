
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Sparkles } from 'lucide-react';

interface WorkflowListProps {
  workflows: any[];
  selectedWorkflow: any;
  onSelectWorkflow: (workflow: any) => void;
  onToggleGeminiAction: () => void;
}

const WorkflowList = ({ 
  workflows, 
  selectedWorkflow, 
  onSelectWorkflow, 
  onToggleGeminiAction 
}: WorkflowListProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Active Workflows</h3>
        <div className="flex space-x-2">
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-purple-400 border-purple-500/50"
            onClick={onToggleGeminiAction}
          >
            <Sparkles className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {workflows.map((workflow) => (
        <Card 
          key={workflow.id}
          className={`bg-slate-800/50 border-slate-700 backdrop-blur-sm cursor-pointer transition-all duration-200 ${
            selectedWorkflow?.id === workflow.id ? 'ring-2 ring-purple-500' : 'hover:bg-slate-800/70'
          }`}
          onClick={() => onSelectWorkflow(workflow)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-lg">{workflow.name}</CardTitle>
              <Badge 
                variant="outline" 
                className={workflow.status === 'active' 
                  ? 'bg-green-500/20 text-green-400 border-green-500/50'
                  : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                }
              >
                {workflow.status}
              </Badge>
            </div>
            <p className="text-slate-400 text-sm">{workflow.description}</p>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">{workflow.executions || 0} runs</span>
              <span className="text-green-400">{workflow.successRate || 0}% success</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WorkflowList;
