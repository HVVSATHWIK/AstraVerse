
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
    connected: 'bg-green-500/20 text-green-400 border-green-500/50',
    disconnected: 'bg-red-500/20 text-red-400 border-red-500/50',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{icon}</div>
            <div>
              <CardTitle className="text-white text-lg">{name}</CardTitle>
            </div>
          </div>
          <Badge variant="outline" className={statusColors[status]}>
            {status}
          </Badge>
        </div>
        <p className="text-slate-400 text-sm">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(metrics).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-xl font-bold text-white">{value}</div>
              <div className="text-xs text-slate-400 capitalize">{key}</div>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="flex-1 text-slate-300 border-slate-600 hover:bg-slate-700">
            <Settings className="w-3 h-3 mr-1" />
            Configure
          </Button>
          <Button size="sm" variant="outline" className="flex-1 text-slate-300 border-slate-600 hover:bg-slate-700">
            <Activity className="w-3 h-3 mr-1" />
            Monitor
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationCard;
