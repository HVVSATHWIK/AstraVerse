
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PerformanceMetricsProps {
  successRate: number;
  totalCost: number;
  totalRequests: number;
  totalTokens: number;
}

const GeminiPerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  successRate,
  totalCost,
  totalRequests,
  totalTokens
}) => {
  const getStatusColor = (rate: number) => {
    if (rate >= 95) return 'text-green-400';
    if (rate >= 90) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className={`text-3xl font-bold ${getStatusColor(successRate)}`}>
              {successRate}%
            </div>
            <p className="text-slate-400 text-sm">Success Rate</p>
            <Badge 
              variant="outline" 
              className={`mt-2 ${
                successRate >= 95 
                  ? 'bg-green-500/20 text-green-400 border-green-500/50'
                  : successRate >= 90
                  ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                  : 'bg-red-500/20 text-red-400 border-red-500/50'
              }`}
            >
              {successRate >= 95 ? 'Excellent' : successRate >= 90 ? 'Good' : 'Needs Attention'}
            </Badge>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">
              {(totalCost / totalRequests * 1000).toFixed(2)}¢
            </div>
            <p className="text-slate-400 text-sm">Cost per 1K Tokens</p>
            <Badge variant="outline" className="mt-2 bg-blue-500/20 text-blue-400 border-blue-500/50">
              Optimized
            </Badge>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">
              {(totalTokens / totalRequests).toFixed(0)}
            </div>
            <p className="text-slate-400 text-sm">Avg Tokens per Request</p>
            <Badge variant="outline" className="mt-2 bg-purple-500/20 text-purple-400 border-purple-500/50">
              Efficient
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeminiPerformanceMetrics;
