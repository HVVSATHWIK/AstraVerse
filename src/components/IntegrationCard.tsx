
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
    connected: 'bg-green-50 text-green-700 border-green-200',
    disconnected: 'bg-red-50 text-red-700 border-red-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200'
  };

  return (
    <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl p-2 bg-gray-50 rounded-lg border border-gray-200">{icon}</div>
            <div>
              <CardTitle className="text-gray-900 text-lg font-semibold">{name}</CardTitle>
            </div>
          </div>
          <Badge variant="outline" className={cn("font-medium capitalize", statusColors[status])}>
            {status}
          </Badge>
        </div>
        <p className="text-gray-600 text-sm mt-2">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(metrics).map(([key, value]) => (
            <div key={key} className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-lg font-bold text-gray-900">{value}</div>
              <div className="text-xs text-gray-500 capitalize font-medium">{key}</div>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50">
            <Settings className="w-3 h-3 mr-2" />
            Configure
          </Button>
          <Button size="sm" variant="outline" className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50">
            <Activity className="w-3 h-3 mr-2" />
            Monitor
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationCard;
