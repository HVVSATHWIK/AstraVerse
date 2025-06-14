
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Custom SVG Icons
const AIIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M12 1v6m0 8v6M4.22 4.22l4.24 4.24m8.48 8.48l4.24 4.24M1 12h6m8 0h6M4.22 19.78l4.24-4.24m8.48-8.48l4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="12" r="1" fill="currentColor" className="animate-pulse" />
  </svg>
);

const WorkflowIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="6" height="6" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="15" y="3" width="6" height="6" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="9" y="15" width="6" height="6" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M9 6h6M12 9v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="6" cy="6" r="1" fill="currentColor" />
    <circle cx="18" cy="6" r="1" fill="currentColor" />
    <circle cx="12" cy="18" r="1" fill="currentColor" />
  </svg>
);

const DataIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="12" cy="12" r="1" fill="currentColor" className="animate-pulse" />
  </svg>
);

const TimeIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <path d="M18.364 5.636L19.778 4.222" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <path d="M5.636 5.636L4.222 4.222" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

interface SystemStatusCardsProps {
  kpis: any;
  isLoading: boolean;
}

const SystemStatusCards = ({ kpis, isLoading }: SystemStatusCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
            <CardContent className="p-6">
              <Skeleton className="h-4 w-20 mb-2 bg-slate-700" />
              <Skeleton className="h-8 w-16 mb-2 bg-slate-700" />
              <Skeleton className="h-3 w-24 bg-slate-700" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl hover:shadow-2xl hover:bg-slate-800/70 transition-all duration-300 transform hover:-translate-y-1">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <AIIcon className="w-6 h-6 text-white" />
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-lg">Active</Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-300">AI Engines</p>
            <p className="text-2xl font-bold text-white">{kpis?.activeEngines || 4}/4</p>
            <p className="text-xs text-slate-400">All systems operational</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl hover:shadow-2xl hover:bg-slate-800/70 transition-all duration-300 transform hover:-translate-y-1">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
              <WorkflowIcon className="w-6 h-6 text-white" />
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-lg">Running</Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-300">Active Workflows</p>
            <p className="text-2xl font-bold text-white">{kpis?.activeWorkflows?.toString() || "23"}</p>
            <p className="text-xs text-slate-400">Real-time processing</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl hover:shadow-2xl hover:bg-slate-800/70 transition-all duration-300 transform hover:-translate-y-1">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
              <DataIcon className="w-6 h-6 text-white" />
            </div>
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 shadow-lg">High</Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-300">Data Throughput</p>
            <p className="text-2xl font-bold text-white">{kpis?.throughput || "1.2TB/h"}</p>
            <p className="text-xs text-slate-400">95% capacity</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl hover:shadow-2xl hover:bg-slate-800/70 transition-all duration-300 transform hover:-translate-y-1">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
              <TimeIcon className="w-6 h-6 text-white" />
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-lg">Optimal</Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-300">Response Time</p>
            <p className="text-2xl font-bold text-white">{kpis?.avgResponseTime || 147}ms</p>
            <p className="text-xs text-slate-400">Average latency</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemStatusCards;
