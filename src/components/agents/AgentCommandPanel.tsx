import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Zap,
  AlertTriangle,
  Power
} from 'lucide-react';
import { useAgentCommandMutation } from '@/hooks/useAgentService';
import { Agent } from '@/types/agents';

interface AgentCommandPanelProps {
  agent: Agent;
}

const AgentCommandPanel = ({ agent }: AgentCommandPanelProps) => {
  const commandMutation = useAgentCommandMutation();

  const handleCommand = (command: string) => {
    commandMutation.mutate({ agentId: agent.id, command });
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          <span>Agent Controls</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {agent.status === 'active' || agent.status === 'busy' ? (
              <Button
                onClick={() => handleCommand('pause')}
                disabled={commandMutation.isPending}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <Pause className="w-4 h-4 mr-2" />
                Pause Agent
              </Button>
            ) : (
              <Button
                onClick={() => handleCommand('start')}
                disabled={commandMutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Agent
              </Button>
            )}
            
            <Button
              onClick={() => handleCommand('restart')}
              disabled={commandMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="text-slate-300 border-slate-600"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
            
            <Button
              variant="outline"
              className="text-red-400 border-slate-600 hover:bg-red-900/20"
            >
              <Power className="w-4 h-4 mr-2" />
              Shutdown
            </Button>
          </div>
          
          {agent.status === 'error' && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 mt-2">
              <div className="flex items-center space-x-2 text-red-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">Agent Error</span>
              </div>
              <p className="text-slate-300 text-sm mt-1">
                The agent is in an error state. Try restarting it to resolve the issue.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentCommandPanel;