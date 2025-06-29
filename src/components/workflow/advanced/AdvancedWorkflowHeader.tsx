import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GitBranch, Save, Play, Info } from 'lucide-react';

interface AdvancedWorkflowHeaderProps {
  workflowName: string;
  workflowDescription: string;
  onWorkflowNameChange: (name: string) => void;
  onWorkflowDescriptionChange: (description: string) => void;
  onSaveWorkflow: () => void;
  onExecuteWorkflow: () => void;
}

const AdvancedWorkflowHeader = ({
  workflowName,
  workflowDescription,
  onWorkflowNameChange,
  onWorkflowDescriptionChange,
  onSaveWorkflow,
  onExecuteWorkflow
}: AdvancedWorkflowHeaderProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center space-x-2">
            <GitBranch className="w-5 h-5 text-blue-400" />
            <span>Advanced Workflow Builder</span>
            <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/50 ml-2">
              Visual Editor
            </Badge>
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              onClick={onSaveWorkflow}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Workflow
            </Button>
            <Button
              onClick={onExecuteWorkflow}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Execute
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Workflow Name</Label>
            <Input
              value={workflowName}
              onChange={(e) => onWorkflowNameChange(e.target.value)}
              placeholder="Enter workflow name..."
              className="bg-slate-700/50 border-slate-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Description</Label>
            <Input
              value={workflowDescription}
              onChange={(e) => onWorkflowDescriptionChange(e.target.value)}
              placeholder="Describe what this workflow does..."
              className="bg-slate-700/50 border-slate-600 text-white"
            />
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-300 text-sm">
              <span className="font-semibold">Pro Tip:</span> Build your workflow by adding nodes from the palette on the left. Connect nodes by dragging from one node to another.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedWorkflowHeader;