
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOpenAIConfigurationsQuery, useOpenAIUsageLogsQuery } from '@/hooks/api/useOpenAIApi';
import { Brain, Settings, TrendingUp, Zap } from 'lucide-react';

interface OpenAIIntegrationCardProps {
  onOpenPlayground?: () => void;
  onOpenSettings?: () => void;
}

const OpenAIIntegrationCard = ({ onOpenPlayground, onOpenSettings }: OpenAIIntegrationCardProps) => {
  const { data: configurations, isLoading: configsLoading } = useOpenAIConfigurationsQuery();
  const { data: usageLogs, isLoading: usageLoading } = useOpenAIUsageLogsQuery(10);

  const activeConfigs = configurations?.filter(config => config.is_active) || [];
  const totalUsage = usageLogs?.reduce((sum, log) => sum + log.total_tokens, 0) || 0;
  const totalCost = usageLogs?.reduce((sum, log) => sum + log.cost_usd, 0) || 0;

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-colors">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="w-6 h-6 mr-2 text-blue-500" />
            OpenAI Integration
          </div>
          <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 border-blue-500/30">
            GPT-4
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {configsLoading ? '...' : activeConfigs.length}
            </div>
            <div className="text-sm text-slate-400">Active Configs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {usageLoading ? '...' : totalUsage.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">Total Tokens</div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-lg font-semibold text-white">
            ${totalCost.toFixed(4)} USD
          </div>
          <div className="text-sm text-slate-400">Total Cost</div>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={onOpenPlayground}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <Zap className="w-4 h-4 mr-2" />
            Playground
          </Button>
          <Button
            onClick={onOpenSettings}
            variant="outline"
            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
            size="sm"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>

        <div className="text-xs text-slate-400 space-y-1">
          <div className="flex justify-between">
            <span>Models Available:</span>
            <span>GPT-4o, GPT-4o-mini, GPT-4.1</span>
          </div>
          <div className="flex justify-between">
            <span>Rate Limit:</span>
            <span>Based on API tier</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpenAIIntegrationCard;
