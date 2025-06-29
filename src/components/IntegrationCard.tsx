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
  icon: React.ReactNode;
  metrics: Record<string, string | number>;
}

const IntegrationCard = ({ name, description, status, icon, metrics }: IntegrationCardProps) => {
  const statusColors = {
    connected: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    disconnected: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200'
  };

  return (
    <Card className="bg-gray-50 border border-gray-300 hover-lift-3d card-3d interactive-card rounded-4xl animate-bounce-in-3d transform-3d perspective-container">
      <CardHeader className="pb-3 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-lg text-gray-100 animate-float-3d btn-3d">
              {icon}
            </div>
            <div>
              <CardTitle className="text-gray-950 text-lg font-semibold text-3d">{name}</CardTitle>
            </div>
          </div>
          <Badge variant="outline" className={cn("font-medium capitalize rounded-full animate-pulse-3d", statusColors[status])}>
            {status}
          </Badge>
        </div>
        <p className="text-gray-700 text-sm mt-2">{description}</p>
        
        {/* 3D floating background element */}
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-cyan-400/10 to-purple-400/10 rounded-full blur-2xl animate-background-float opacity-60"></div>
      </CardHeader>
      <CardContent className="space-y-4 relative">
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(metrics).map(([key, value], index) => (
            <div key={key} className={`text-center p-3 bg-gray-100 rounded-3xl border border-gray-200 hover-lift-3d animate-scale-in-3d stagger-${index + 1}`}>
              <div className="text-lg font-bold text-gray-950 text-3d">{value}</div>
              <div className="text-xs text-gray-700 capitalize font-medium">{key}</div>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="flex-1 bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200 rounded-2xl btn-3d">
            <Settings className="w-3 h-3 mr-2 animate-wiggle-3d" />
            Configure
          </Button>
          <Button size="sm" variant="outline" className="flex-1 bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200 rounded-2xl btn-3d">
            <Activity className="w-3 h-3 mr-2 animate-pulse-3d" />
            Monitor
          </Button>
        </div>

        {/* 3D decorative elements */}
        <div className="absolute bottom-2 left-2 w-8 h-8 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-lg animate-float-3d opacity-40"></div>
        <div className="absolute top-1/2 right-2 w-6 h-6 bg-gradient-to-br from-orange-400/20 to-pink-400/20 rounded-full blur-md animate-pulse-3d opacity-30"></div>
      </CardContent>
    </Card>
  );
};

export default IntegrationCard;