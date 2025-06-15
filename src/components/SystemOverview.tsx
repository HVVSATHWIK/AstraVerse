
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp,
  CheckCircle,
  Clock,
  Cpu,
  Users
} from 'lucide-react';
import { AgentStats } from '@/types/agents';
import { Skeleton } from '@/components/ui/skeleton';

interface SystemOverviewProps {
  stats: AgentStats | undefined;
  isLoading: boolean;
}

const SystemOverview = ({ stats, isLoading }: SystemOverviewProps) => {
  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <Skeleton className="h-6 w-48 bg-slate-700" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 bg-slate-700" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <span>System Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-slate-300 text-sm">Total Agents</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats?.totalAgents}</p>
            <p className="text-xs text-green-400">{stats?.activeAgents} active</p>
          </div>
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-slate-300 text-sm">Completed Tasks</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats?.completedTasks}</p>
            <p className="text-xs text-slate-400">of {stats?.totalTasks} total</p>
          </div>
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-slate-300 text-sm">Avg Response</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats?.averageResponseTime}s</p>
            <p className="text-xs text-slate-400">response time</p>
          </div>
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Cpu className="w-5 h-5 text-yellow-400" />
              <span className="text-slate-300 text-sm">System Load</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats?.systemLoad}%</p>
            <p className="text-xs text-slate-400">current load</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemOverview;
