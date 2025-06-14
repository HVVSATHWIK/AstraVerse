
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// Custom SVG Icons
const HealthIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M7 10l2 2 4-4M7 14l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="18" cy="8" r="2" fill="currentColor" className="animate-pulse" />
  </svg>
);

const GrowthIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M3 17l6-6 4 4 8-8M21 9v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AlertIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M12 9v4M12 17h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SystemHealth = () => {
  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-lg flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mr-3 shadow-lg">
              <HealthIcon className="w-5 h-5 text-white" />
            </div>
            System Health
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
            <CheckIcon className="w-3 h-3 mr-1" />
            Optimal
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
            <div className="text-emerald-400 text-sm font-medium">Uptime</div>
            <div className="text-white text-lg font-bold">99.9%</div>
          </div>
          <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
            <div className="text-blue-400 text-sm font-medium">Requests/min</div>
            <div className="text-white text-lg font-bold flex items-center">
              2.4K
              <GrowthIcon className="w-3 h-3 ml-1 text-emerald-400" />
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-300">CPU Usage</span>
            <span className="text-white font-medium">67%</span>
          </div>
          <Progress value={67} className="h-3 bg-slate-700/50" />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>8 cores</span>
            <span>Normal load</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-300">Memory Usage</span>
            <div className="flex items-center">
              <AlertIcon className="w-3 h-3 text-yellow-400 mr-1" />
              <span className="text-white font-medium">82%</span>
            </div>
          </div>
          <Progress value={82} className="h-3 bg-slate-700/50" />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>32GB total</span>
            <span>6GB available</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-300">Storage</span>
            <span className="text-white font-medium">45%</span>
          </div>
          <Progress value={45} className="h-3 bg-slate-700/50" />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>2TB SSD</span>
            <span>1.1TB free</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-300">Network I/O</span>
            <span className="text-white font-medium">23%</span>
          </div>
          <Progress value={23} className="h-3 bg-slate-700/50" />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>10 Gbps</span>
            <span>Low traffic</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealth;
