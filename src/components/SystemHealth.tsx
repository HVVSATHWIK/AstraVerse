
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const SystemHealth = () => {
  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-lg flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mr-3 shadow-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            System Health
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
            <CheckCircle className="w-3 h-3 mr-1" />
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
              <TrendingUp className="w-3 h-3 ml-1 text-emerald-400" />
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
              <AlertTriangle className="w-3 h-3 text-yellow-400 mr-1" />
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
