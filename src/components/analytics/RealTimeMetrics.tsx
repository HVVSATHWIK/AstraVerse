
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, TrendingUp, Zap, Users, Cpu, Clock, Wifi, WifiOff } from 'lucide-react';
import { useRealtime } from '@/contexts/RealtimeContext';

interface MetricData {
  timestamp: string;
  value: number;
  label: string;
}

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  icon: React.ReactNode;
  color: string;
}

const RealTimeMetrics = () => {
  const { isConnected, lastUpdate, toggleRealtime, isRealtimeEnabled } = useRealtime();
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    {
      id: 'cpu',
      name: 'CPU Usage',
      value: 45,
      unit: '%',
      trend: 'stable',
      change: 0.2,
      icon: <Cpu className="w-5 h-5" />,
      color: 'text-blue-400'
    },
    {
      id: 'workflows',
      name: 'Active Workflows',
      value: 12,
      unit: '',
      trend: 'up',
      change: 2,
      icon: <Zap className="w-5 h-5" />,
      color: 'text-yellow-400'
    },
    {
      id: 'users',
      name: 'Active Users',
      value: 847,
      unit: '',
      trend: 'up',
      change: 23,
      icon: <Users className="w-5 h-5" />,
      color: 'text-green-400'
    },
    {
      id: 'response',
      name: 'Avg Response Time',
      value: 120,
      unit: 'ms',
      trend: 'down',
      change: -15,
      icon: <Clock className="w-5 h-5" />,
      color: 'text-purple-400'
    }
  ]);

  const [chartData, setChartData] = useState<MetricData[]>([]);

  useEffect(() => {
    // Generate initial chart data
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      timestamp: new Date(Date.now() - (19 - i) * 60000).toLocaleTimeString(),
      value: Math.floor(Math.random() * 100) + 20,
      label: `Point ${i + 1}`
    }));
    setChartData(initialData);

    // Simulate real-time updates
    if (isRealtimeEnabled) {
      const interval = setInterval(() => {
        setChartData(prev => {
          const newData = [...prev.slice(1)];
          newData.push({
            timestamp: new Date().toLocaleTimeString(),
            value: Math.floor(Math.random() * 100) + 20,
            label: `Real-time ${Date.now()}`
          });
          return newData;
        });

        // Update metrics
        setMetrics(prev => prev.map(metric => ({
          ...metric,
          value: Math.max(0, metric.value + (Math.random() - 0.5) * 10),
          change: (Math.random() - 0.5) * 5,
          trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.3 ? 'down' : 'stable'
        })));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isRealtimeEnabled]);

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-xl font-bold text-white">Real-Time System Metrics</h3>
          <Badge 
            variant="outline" 
            className={`${isConnected ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50'}`}
          >
            {isConnected ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
          {lastUpdate && (
            <span className="text-slate-400 text-sm">
              Last update: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleRealtime}
          className="border-slate-600 text-slate-300"
        >
          {isRealtimeEnabled ? 'Disable' : 'Enable'} Real-time
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.id} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={metric.color}>
                  {metric.icon}
                </div>
                <Badge 
                  variant="outline" 
                  className={`${getTrendColor(metric.trend)} border-current`}
                >
                  {getTrendIcon(metric.trend)} {Math.abs(metric.change).toFixed(1)}
                </Badge>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-white">
                  {metric.value.toFixed(0)}{metric.unit}
                </div>
                <div className="text-sm text-slate-400">{metric.name}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Real-time Chart */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Live Performance Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8B5CF6"
                  fill="url(#colorGradient)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Performance Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              System Health Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Overall Health</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-slate-600 rounded-full overflow-hidden">
                    <div className="w-4/5 h-full bg-gradient-to-r from-green-500 to-emerald-400"></div>
                  </div>
                  <span className="text-white font-semibold">85%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">API Response</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-slate-600 rounded-full overflow-hidden">
                    <div className="w-5/6 h-full bg-gradient-to-r from-blue-500 to-cyan-400"></div>
                  </div>
                  <span className="text-white font-semibold">92%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Database</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-slate-600 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-gradient-to-r from-purple-500 to-pink-400"></div>
                  </div>
                  <span className="text-white font-semibold">78%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-2 bg-slate-700/30 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-slate-300 text-sm">Workflow #1247 completed successfully</span>
                <span className="text-slate-500 text-xs ml-auto">2m ago</span>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-slate-700/30 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-slate-300 text-sm">New user registration detected</span>
                <span className="text-slate-500 text-xs ml-auto">5m ago</span>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-slate-700/30 rounded-lg">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-slate-300 text-sm">CPU usage spike detected</span>
                <span className="text-slate-500 text-xs ml-auto">8m ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeMetrics;
