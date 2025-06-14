
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
    healthy: 'bg-green-500/20 text-green-400 border-green-500/50',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    error: 'bg-red-500/20 text-red-400 border-red-500/50'
  };

  const iconColors = {
    healthy: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400'
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Icon className={cn("w-8 h-8", iconColors[status])} />
          <Badge variant="outline" className={statusColors[status]}>
            {status}
          </Badge>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <div className="text-3xl font-bold text-white">{value}</div>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusCard;
