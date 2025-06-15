
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Edit } from 'lucide-react';

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

interface ChatWorkflowSettingsProps {
  workflow: ChatWorkflow;
}

const ChatWorkflowSettings = ({ workflow }: ChatWorkflowSettingsProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Workflow Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-slate-300">Name</Label>
          <Input
            value={workflow.name}
            className="bg-slate-700/50 border-slate-600 text-white"
            readOnly
          />
        </div>
        <div>
          <Label className="text-slate-300">Description</Label>
          <Input
            value={workflow.description}
            className="bg-slate-700/50 border-slate-600 text-white"
            readOnly
          />
        </div>
        <div>
          <Label className="text-slate-300">AI Context</Label>
          <Textarea
            value={workflow.context}
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
  );
};

export default ChatWorkflowSettings;
