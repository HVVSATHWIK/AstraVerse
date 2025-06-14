
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Plus, 
  Settings, 
  GitBranch, 
  MessageSquare, 
  Calendar,
  AlertTriangle,
  FileText,
  Zap
} from 'lucide-react';

const workflows = [
  {
    id: 1,
    name: 'Meeting Optimization',
    description: 'Automated transcription, analysis, and action item generation',
    status: 'active',
    triggers: ['Zoom Meeting Start', 'Calendar Event'],
    actions: ['Transcribe Audio', 'Generate Summary', 'Create Action Items', 'Send Slack Notification'],
    runs: 156,
    successRate: 94
  },
  {
    id: 2,
    name: 'Churn Alert Handler',
    description: 'Customer sentiment analysis and proactive outreach',
    status: 'active',
    triggers: ['Support Ticket', 'Customer Survey', 'Usage Analytics'],
    actions: ['Sentiment Analysis', 'Risk Scoring', 'Alert Sales Team', 'Schedule Follow-up'],
    runs: 43,
    successRate: 87
  },
  {
    id: 3,
    name: 'Autonomous Scheduling',
    description: 'AI-powered meeting scheduling and coordination',
    status: 'paused',
    triggers: ['Email Request', 'Slack Command'],
    actions: ['Check Availability', 'Propose Times', 'Send Invites', 'Add to Calendar'],
    runs: 89,
    successRate: 91
  }
];

const WorkflowBuilder = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState(workflows[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Workflow List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Active Workflows</h3>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
        </div>
        
        {workflows.map((workflow) => (
          <Card 
            key={workflow.id}
            className={`bg-slate-800/50 border-slate-700 backdrop-blur-sm cursor-pointer transition-all duration-200 ${
              selectedWorkflow.id === workflow.id ? 'ring-2 ring-purple-500' : 'hover:bg-slate-800/70'
            }`}
            onClick={() => setSelectedWorkflow(workflow)}
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
                <span className="text-slate-300">{workflow.runs} runs</span>
                <span className="text-green-400">{workflow.successRate}% success</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workflow Details */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">{selectedWorkflow.name}</CardTitle>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                  {selectedWorkflow.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Triggers */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                Triggers
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedWorkflow.triggers.map((trigger, index) => (
                  <div key={index} className="bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-slate-300">{trigger}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                <GitBranch className="w-5 h-5 mr-2 text-blue-400" />
                Actions
              </h4>
              <div className="space-y-3">
                {selectedWorkflow.actions.map((action, index) => (
                  <div key={index} className="flex items-center space-x-4 bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="text-slate-300 flex-1">{action}</span>
                    <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
                      Active
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 text-center">
                <div className="text-2xl font-bold text-white">{selectedWorkflow.runs}</div>
                <div className="text-slate-400 text-sm">Total Runs</div>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 text-center">
                <div className="text-2xl font-bold text-green-400">{selectedWorkflow.successRate}%</div>
                <div className="text-slate-400 text-sm">Success Rate</div>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 text-center">
                <div className="text-2xl font-bold text-blue-400">2.3s</div>
                <div className="text-slate-400 text-sm">Avg Duration</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
