
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  DollarSign, 
  Clock, 
  Zap, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle 
} from 'lucide-react';

interface UsageStats {
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  avgResponseTime: number;
  successRate: number;
  dailyLimit: number;
  monthlyLimit: number;
  quotaUsed: number;
}

const GeminiUsageMonitor = () => {
  // Mock data - in real implementation this would come from API
  const usageStats: UsageStats = {
    totalRequests: 1247,
    totalTokens: 458392,
    totalCost: 23.67,
    avgResponseTime: 680,
    successRate: 97.8,
    dailyLimit: 10000,
    monthlyLimit: 100000,
    quotaUsed: 45.8
  };

  const dailyUsage = 4580; // tokens used today
  const monthlyUsage = 45800; // tokens used this month

  const getDailyProgress = () => (dailyUsage / usageStats.dailyLimit) * 100;
  const getMonthlyProgress = () => (monthlyUsage / usageStats.monthlyLimit) * 100;

  const getProgressColor = (percentage: number) => {
    if (percentage < 70) return 'bg-green-500';
    if (percentage < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusColor = (rate: number) => {
    if (rate >= 95) return 'text-green-400';
    if (rate >= 90) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Requests</p>
                <p className="text-2xl font-bold text-white">{usageStats.totalRequests.toLocaleString()}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-400" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400">+12% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Tokens</p>
                <p className="text-2xl font-bold text-white">{usageStats.totalTokens.toLocaleString()}</p>
              </div>
              <Zap className="w-8 h-8 text-purple-400" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400">+8% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Cost</p>
                <p className="text-2xl font-bold text-white">${usageStats.totalCost}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingDown className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400">-3% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Avg Response Time</p>
                <p className="text-2xl font-bold text-white">{usageStats.avgResponseTime}ms</p>
              </div>
              <Clock className="w-8 h-8 text-orange-400" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingDown className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400">-120ms from last week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Quotas */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <span>Usage Quotas</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Daily Quota */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-slate-300">Daily Usage</Label>
              <div className="flex items-center space-x-2">
                <span className="text-slate-300 text-sm">
                  {dailyUsage.toLocaleString()} / {usageStats.dailyLimit.toLocaleString()} tokens
                </span>
                {getDailyProgress() > 90 && (
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                )}
              </div>
            </div>
            <Progress 
              value={getDailyProgress()} 
              className="h-2"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>{getDailyProgress().toFixed(1)}% used</span>
              <span>Resets in 14h 32m</span>
            </div>
          </div>

          {/* Monthly Quota */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-slate-300">Monthly Usage</Label>
              <div className="flex items-center space-x-2">
                <span className="text-slate-300 text-sm">
                  {monthlyUsage.toLocaleString()} / {usageStats.monthlyLimit.toLocaleString()} tokens
                </span>
                {getMonthlyProgress() > 90 && (
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                )}
              </div>
            </div>
            <Progress 
              value={getMonthlyProgress()} 
              className="h-2"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>{getMonthlyProgress().toFixed(1)}% used</span>
              <span>Resets in 18 days</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getStatusColor(usageStats.successRate)}`}>
                {usageStats.successRate}%
              </div>
              <p className="text-slate-400 text-sm">Success Rate</p>
              <Badge 
                variant="outline" 
                className={`mt-2 ${
                  usageStats.successRate >= 95 
                    ? 'bg-green-500/20 text-green-400 border-green-500/50'
                    : usageStats.successRate >= 90
                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                    : 'bg-red-500/20 text-red-400 border-red-500/50'
                }`}
              >
                {usageStats.successRate >= 95 ? 'Excellent' : usageStats.successRate >= 90 ? 'Good' : 'Needs Attention'}
              </Badge>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">
                {(usageStats.totalCost / usageStats.totalRequests * 1000).toFixed(2)}¢
              </div>
              <p className="text-slate-400 text-sm">Cost per 1K Tokens</p>
              <Badge variant="outline" className="mt-2 bg-blue-500/20 text-blue-400 border-blue-500/50">
                Optimized
              </Badge>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">
                {(usageStats.totalTokens / usageStats.totalRequests).toFixed(0)}
              </div>
              <p className="text-slate-400 text-sm">Avg Tokens per Request</p>
              <Badge variant="outline" className="mt-2 bg-purple-500/20 text-purple-400 border-purple-500/50">
                Efficient
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeminiUsageMonitor;
