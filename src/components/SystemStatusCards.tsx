
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Brain, GitBranch, Database, Clock } from 'lucide-react';

interface SystemStatusCardsProps {
  kpis: any;
  isLoading: boolean;
}

const SystemStatusCards = ({ kpis, isLoading }: SystemStatusCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Brain className="w-8 h-8 text-blue-600" />
            <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600">AI Engines</p>
            <p className="text-2xl font-bold text-gray-900">{kpis?.activeEngines || 4}/4</p>
            <p className="text-xs text-gray-500">All systems operational</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <GitBranch className="w-8 h-8 text-purple-600" />
            <Badge className="bg-green-100 text-green-800 border-green-200">Running</Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600">Active Workflows</p>
            <p className="text-2xl font-bold text-gray-900">{kpis?.activeWorkflows?.toString() || "23"}</p>
            <p className="text-xs text-gray-500">Real-time processing</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Database className="w-8 h-8 text-orange-600" />
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">High</Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600">Data Throughput</p>
            <p className="text-2xl font-bold text-gray-900">{kpis?.throughput || "1.2TB/h"}</p>
            <p className="text-xs text-gray-500">95% capacity</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-green-600" />
            <Badge className="bg-green-100 text-green-800 border-green-200">Optimal</Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600">Response Time</p>
            <p className="text-2xl font-bold text-gray-900">{kpis?.avgResponseTime || 147}ms</p>
            <p className="text-xs text-gray-500">Average latency</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemStatusCards;
