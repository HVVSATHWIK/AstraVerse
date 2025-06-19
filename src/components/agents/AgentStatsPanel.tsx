import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Cpu, 
  HardDrive, 
  Clock, 
  Activity,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Agent } from '@/types/agents';

interface AgentStatsPanelProps {
  agent: Agent;
}

const AgentStatsPanel = ({ agent }: AgentStatsPanelProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Activity className="w-5 h-5 text-blue-400" />
          <span>Agent Metrics</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <h4 className="text-white font-medium">CPU Usage</h4>
            </div>
            <Progress value={agent.metrics?.cpuUsage || 0} className="h-2 mb-2" />
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Current</span>
              <span className="text-white">{agent.metrics?.cpuUsage || 0}%</span>
            </div>
          </div>

          <div className="bg-slate-700/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <HardDrive className="w-4 h-4 text-green-400" />
              <h4 className="text-white font-medium">Memory Usage</h4>
            </div>
            <Progress value={agent.metrics?.memoryUsage || 0} className="h-2 mb-2" />
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Current</span>
              <span className="text-white">{agent.metrics?.memoryUsage || 0}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <h4 className="text-white font-medium">Success Rate</h4>
            </div>
            <Progress value={agent.performance?.successRate || 0} className="h-2 mb-2" />
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Overall</span>
              <span className="text-green-400">{agent.performance?.successRate || 0}%</span>
            </div>
          </div>

          <div className="bg-slate-700/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              <h4 className="text-white font-medium">Response Time</h4>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Average</span>
              <span className="text-white">{agent.performance?.averageResponseTime || 0}s</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-700/50 p-4 rounded-lg">
          <h4 className="text-white font-medium mb-2">Performance Summary</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-white">{agent.performance?.tasksCompleted || 0}</div>
              <div className="text-xs text-slate-400">Tasks Completed</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">{agent.metrics?.taskQueue || 0}</div>
              <div className="text-xs text-slate-400">Tasks Queued</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">{agent.performance?.uptime || 0}%</div>
              <div className="text-xs text-slate-400">Uptime</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentStatsPanel;