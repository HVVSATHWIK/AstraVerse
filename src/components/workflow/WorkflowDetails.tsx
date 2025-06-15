
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Settings } from 'lucide-react';
import WorkflowTriggers from './WorkflowTriggers';
import WorkflowActions from './WorkflowActions';
import WorkflowStats from './WorkflowStats';

interface WorkflowDetailsProps {
  workflow: any;
  onExecuteWorkflow: (id: string) => void;
  isExecuting: boolean;
}

const WorkflowDetails = ({ workflow, onExecuteWorkflow, isExecuting }: WorkflowDetailsProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">{workflow.name}</CardTitle>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="text-slate-300 border-slate-600"
              onClick={() => onExecuteWorkflow(workflow.id)}
              disabled={isExecuting}
            >
              <Play className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <WorkflowTriggers workflow={workflow} />
        <WorkflowActions workflow={workflow} />
        <WorkflowStats workflow={workflow} />
      </CardContent>
    </Card>
  );
};

export default WorkflowDetails;
