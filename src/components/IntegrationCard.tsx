
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
    connected: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    disconnected: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200'
  };

  return (
    <Card className="bg-gray-50 border border-gray-300 hover:shadow-md transition-shadow rounded-3xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg text-gray-100">{icon}</div>
            <div>
              <CardTitle className="text-gray-950 text-lg font-semibold">{name}</CardTitle>
            </div>
          </div>
          <Badge variant="outline" className={cn("font-medium capitalize rounded-full", statusColors[status])}>
            {status}
          </Badge>
        </div>
        <p className="text-gray-700 text-sm mt-2">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(metrics).map(([key, value]) => (
            <div key={key} className="text-center p-3 bg-gray-100 rounded-2xl border border-gray-200">
              <div className="text-lg font-bold text-gray-950">{value}</div>
              <div className="text-xs text-gray-700 capitalize font-medium">{key}</div>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="flex-1 bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200 rounded-xl">
            <Settings className="w-3 h-3 mr-2" />
            Configure
          </Button>
          <Button size="sm" variant="outline" className="flex-1 bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200 rounded-xl">
            <Activity className="w-3 h-3 mr-2" />
            Monitor
          </Button>
          </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationCard;
