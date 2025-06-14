
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
    connected: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    disconnected: 'bg-red-50 text-red-700 border-red-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200'
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl p-2 bg-white/60 rounded-xl shadow-sm">{icon}</div>
            <div>
              <CardTitle className="text-slate-800 text-lg font-semibold">{name}</CardTitle>
            </div>
          </div>
          <Badge variant="outline" className={cn("font-medium", statusColors[status])}>
            {status}
          </Badge>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed mt-2">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(metrics).map(([key, value]) => (
            <div key={key} className="text-center p-3 bg-white/60 rounded-lg shadow-sm">
              <div className="text-xl font-bold text-slate-800">{value}</div>
              <div className="text-xs text-slate-500 capitalize font-medium">{key}</div>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="flex-1 bg-white/60 text-slate-700 border-slate-200 hover:bg-slate-50 transition-all duration-200">
            <Settings className="w-3 h-3 mr-2" />
            Configure
          </Button>
          <Button size="sm" variant="outline" className="flex-1 bg-white/60 text-slate-700 border-slate-200 hover:bg-slate-50 transition-all duration-200">
            <Activity className="w-3 h-3 mr-2" />
            Monitor
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationCard;
