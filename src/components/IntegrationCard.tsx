
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IntegrationCardProps {
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'warning';
  icon: string;
  metrics: Record<string, string | number>;
}

const IntegrationCard = ({ name, description, status, icon, metrics }: IntegrationCardProps) => {
  const statusColors = {
    connected: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
    disconnected: 'bg-red-500/20 text-red-400 border-red-500/50',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl hover:shadow-2xl hover:bg-slate-800/70 transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl p-3 bg-gradient-to-br from-slate-700 to-slate-600 rounded-xl border border-slate-600/50 shadow-lg">{icon}</div>
            <div>
              <CardTitle className="text-white text-lg font-semibold">{name}</CardTitle>
            </div>
          </div>
          <Badge variant="outline" className={cn("font-medium capitalize shadow-lg", statusColors[status])}>
            {status}
          </Badge>
        </div>
        <p className="text-slate-300 text-sm mt-2">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(metrics).map(([key, value]) => (
            <div key={key} className="text-center p-3 bg-slate-700/50 rounded-lg border border-slate-600/30 shadow-lg">
              <div className="text-lg font-bold text-white">{value}</div>
              <div className="text-xs text-slate-400 capitalize font-medium">{key}</div>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="flex-1 bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50 shadow-lg">
            <Settings className="w-3 h-3 mr-2" />
            Configure
          </Button>
          <Button size="sm" variant="outline" className="flex-1 bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50 shadow-lg">
            <Activity className="w-3 h-3 mr-2" />
            Monitor
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationCard;
