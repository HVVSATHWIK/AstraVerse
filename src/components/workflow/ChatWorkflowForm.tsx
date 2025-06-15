
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ChatWorkflowFormProps {
  newWorkflow: {
    name: string;
    description: string;
    context: string;
  };
  onNewWorkflowChange: (field: string, value: string) => void;
  onCreateWorkflow: () => void;
  onCancel: () => void;
}

const ChatWorkflowForm = ({ 
  newWorkflow, 
  onNewWorkflowChange, 
  onCreateWorkflow, 
  onCancel 
}: ChatWorkflowFormProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg">Create Chat Workflow</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-slate-300">Name</Label>
          <Input
            value={newWorkflow.name}
            onChange={(e) => onNewWorkflowChange('name', e.target.value)}
            placeholder="Enter workflow name..."
            className="bg-slate-700/50 border-slate-600 text-white"
          />
        </div>
        <div>
          <Label className="text-slate-300">Description</Label>
          <Input
            value={newWorkflow.description}
            onChange={(e) => onNewWorkflowChange('description', e.target.value)}
            placeholder="Brief description..."
            className="bg-slate-700/50 border-slate-600 text-white"
          />
        </div>
        <div>
          <Label className="text-slate-300">AI Context</Label>
          <Textarea
            value={newWorkflow.context}
            onChange={(e) => onNewWorkflowChange('context', e.target.value)}
            placeholder="Define the AI's role and behavior..."
            className="bg-slate-700/50 border-slate-600 text-white"
            rows={3}
          />
        </div>
        <div className="flex space-x-2">
          <Button onClick={onCreateWorkflow} className="bg-purple-600 hover:bg-purple-700">
            Create
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="text-slate-300 border-slate-600"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatWorkflowForm;
