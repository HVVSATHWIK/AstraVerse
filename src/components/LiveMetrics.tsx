
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Users,
  Server,
  Gauge
} from 'lucide-react';

const LiveMetrics = () => {
  const metrics = [
    {
      title: 'Revenue',
      value: '$24,567',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-emerald-400'
    },
    {
      title: 'Active Users',
      value: '1,247',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-400'
    },
    {
      title: 'API Calls',
      value: '89.2K',
      change: '-2.1%',
      trend: 'down',
      icon: Server,
      color: 'text-purple-400'
    },
    {
      title: 'Performance',
      value: '98.7%',
      change: '+0.3%',
      trend: 'up',
      icon: Gauge,
      color: 'text-orange-400'
    }
  ];

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-lg flex items-center">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg mr-3 shadow-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          Live Metrics
          <Badge className="ml-auto bg-green-500/20 text-green-400 border-green-500/50 animate-pulse">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:bg-slate-700/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
                <div className={`flex items-center text-xs ${
                  metric.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {metric.change}
                </div>
              </div>
              <div className="text-white text-lg font-bold">{metric.value}</div>
              <div className="text-slate-400 text-xs">{metric.title}</div>
            </div>
          ))}
        </div>
        
        <div className="pt-3 border-t border-slate-700/50">
          <div className="text-slate-300 text-sm mb-2 font-medium">System Load</div>
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-pulse" style={{ width: '67%' }}></div>
            </div>
            <span className="text-slate-400 text-xs">67%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveMetrics;
