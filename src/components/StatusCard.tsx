
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
    healthy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    error: 'bg-red-50 text-red-700 border-red-200'
  };

  const iconColors = {
    healthy: 'text-emerald-600',
    warning: 'text-amber-600',
    error: 'text-red-600'
  };

  const cardGradients = {
    healthy: 'from-emerald-50 to-emerald-100/50',
    warning: 'from-amber-50 to-amber-100/50',
    error: 'from-red-50 to-red-100/50'
  };

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl",
      "bg-gradient-to-br border border-white/20 shadow-lg backdrop-blur-sm",
      cardGradients[status]
    )}>
      <CardContent className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "p-3 rounded-xl transition-all duration-300 group-hover:scale-110",
            "bg-white/60 backdrop-blur-sm shadow-sm"
          )}>
            <Icon className={cn("w-6 h-6 transition-colors duration-300", iconColors[status])} />
          </div>
          <Badge 
            variant="outline" 
            className={cn(
              "transition-all duration-300 group-hover:shadow-md capitalize font-medium",
              statusColors[status]
            )}
          >
            {status}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-800 group-hover:text-slate-900 transition-colors duration-300">
            {title}
          </h3>
          <div className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            {value}
          </div>
          <p className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors duration-300 leading-relaxed">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusCard;
