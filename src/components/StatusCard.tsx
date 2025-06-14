
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusCardProps {
  title: string;
  value: string;
  status: 'healthy' | 'warning' | 'error';
  icon: LucideIcon;
  description: string;
}

const StatusCard = ({ title, value, status, icon: Icon, description }: StatusCardProps) => {
  const statusColors = {
    healthy: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    error: 'bg-red-50 text-red-700 border-red-200'
  };

  const iconColors = {
    healthy: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  };

  return (
    <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Icon className={cn("w-8 h-8", iconColors[status])} />
          <Badge 
            variant="outline" 
            className={cn("font-medium capitalize", statusColors[status])}
          >
            {status === 'healthy' ? 'Active' : status}
          </Badge>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-800">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusCard;
