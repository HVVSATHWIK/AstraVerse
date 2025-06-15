
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Activity, AlertTriangle } from 'lucide-react';

interface UsageQuotasProps {
  dailyUsage: number;
  monthlyUsage: number;
  dailyLimit: number;
  monthlyLimit: number;
}

const GeminiUsageQuotas: React.FC<UsageQuotasProps> = ({ 
  dailyUsage, 
  monthlyUsage, 
  dailyLimit, 
  monthlyLimit 
}) => {
  const getDailyProgress = () => (dailyUsage / dailyLimit) * 100;
  const getMonthlyProgress = () => (monthlyUsage / monthlyLimit) * 100;

  return (
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
                {dailyUsage.toLocaleString()} / {dailyLimit.toLocaleString()} tokens
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
                {monthlyUsage.toLocaleString()} / {monthlyLimit.toLocaleString()} tokens
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
  );
};

export default GeminiUsageQuotas;
