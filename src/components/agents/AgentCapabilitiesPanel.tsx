import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  CheckCircle, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { Agent } from '@/types/agents';

interface AgentCapabilitiesPanelProps {
  agent: Agent;
}

const AgentCapabilitiesPanel = ({ agent }: AgentCapabilitiesPanelProps) => {
  // Define capability descriptions based on capability name
  const capabilityDescriptions: Record<string, string> = {
    'transcription': 'Convert audio to text with high accuracy',
    'sentiment-analysis': 'Analyze emotional tone in text content',
    'summarization': 'Create concise summaries of longer content',
    'action-items': 'Extract actionable tasks from conversations',
    'data-analysis': 'Analyze data sets to extract insights',
    'pattern-recognition': 'Identify patterns in complex data',
    'reporting': 'Generate structured reports from data',
    'ml-inference': 'Run machine learning models for predictions',
    'workflow-execution': 'Execute predefined workflow sequences',
    'api-integration': 'Connect with external APIs and services',
    'task-automation': 'Automate repetitive tasks',
    'scheduling': 'Manage and optimize schedules',
    'system-monitoring': 'Monitor system health and performance',
    'alerting': 'Generate alerts based on defined conditions',
    'health-checks': 'Perform system health verification',
    'diagnostics': 'Diagnose issues in systems and processes',
  };

  // Get description for a capability, or return a default message
  const getCapabilityDescription = (capability: string) => {
    return capabilityDescriptions[capability] || 'Custom agent capability';
  };

  // Determine if a capability is core or advanced
  const isAdvancedCapability = (capability: string) => {
    const advancedCapabilities = [
      'ml-inference', 
      'pattern-recognition', 
      'sentiment-analysis',
      'diagnostics'
    ];
    return advancedCapabilities.includes(capability);
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          <span>Agent Capabilities</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {agent.capabilities && agent.capabilities.length > 0 ? (
          <div className="space-y-4">
            {agent.capabilities.map((capability: string, index: number) => (
              <div key={index} className="bg-slate-700/50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    {isAdvancedCapability(capability) ? (
                      <Zap className="w-4 h-4 text-purple-400" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                    <h4 className="text-white font-medium capitalize">{capability.replace('-', ' ')}</h4>
                  </div>
                  <Badge variant="outline" className={
                    isAdvancedCapability(capability)
                      ? 'bg-purple-500/20 text-purple-400 border-purple-500/50'
                      : 'bg-green-500/20 text-green-400 border-green-500/50'
                  }>
                    {isAdvancedCapability(capability) ? 'Advanced' : 'Core'}
                  </Badge>
                </div>
                <p className="text-slate-300 text-sm">{getCapabilityDescription(capability)}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">No capabilities defined for this agent</p>
            <p className="text-slate-500 text-sm mt-2">
              Add capabilities to define what this agent can do
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AgentCapabilitiesPanel;