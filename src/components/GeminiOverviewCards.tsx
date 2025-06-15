
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Activity, 
  DollarSign, 
  Clock, 
  Zap, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';

interface UsageStats {
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  avgResponseTime: number;
}

interface GeminiOverviewCardsProps {
  usageStats: UsageStats;
}

const GeminiOverviewCards: React.FC<GeminiOverviewCardsProps> = ({ usageStats }) => {
  return (
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
  );
};

export default GeminiOverviewCards;
