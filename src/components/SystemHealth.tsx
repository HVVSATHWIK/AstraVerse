
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart3 } from 'lucide-react';

const SystemHealth = () => {
  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-lg flex items-center">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mr-3 shadow-lg">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-300">CPU Usage</span>
            <span className="text-white font-medium">67%</span>
          </div>
          <Progress value={67} className="h-3 bg-slate-700/50" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-300">Memory Usage</span>
            <span className="text-white font-medium">82%</span>
          </div>
          <Progress value={82} className="h-3 bg-slate-700/50" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-300">Storage</span>
            <span className="text-white font-medium">45%</span>
          </div>
          <Progress value={45} className="h-3 bg-slate-700/50" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-300">Network I/O</span>
            <span className="text-white font-medium">23%</span>
          </div>
          <Progress value={23} className="h-3 bg-slate-700/50" />
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealth;
