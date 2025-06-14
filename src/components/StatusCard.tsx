
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
    healthy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-emerald-500/20',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-amber-500/20',
    error: 'bg-red-500/20 text-red-400 border-red-500/50 shadow-red-500/20'
  };

  const iconColors = {
    healthy: 'text-emerald-400',
    warning: 'text-amber-400',
    error: 'text-red-400'
  };

  const cardGradients = {
    healthy: 'from-emerald-500/10 to-emerald-600/5',
    warning: 'from-amber-500/10 to-amber-600/5',
    error: 'from-red-500/10 to-red-600/5'
  };

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl",
      "bg-gradient-to-br backdrop-blur-sm border-slate-700/50",
      cardGradients[status],
      "hover:border-slate-600/50"
    )}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardContent className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "p-3 rounded-xl transition-all duration-300 group-hover:scale-110",
            "bg-slate-800/50 backdrop-blur-sm"
          )}>
            <Icon className={cn("w-6 h-6 transition-colors duration-300", iconColors[status])} />
          </div>
          <Badge 
            variant="outline" 
            className={cn(
              "transition-all duration-300 group-hover:shadow-lg capitalize font-medium",
              statusColors[status]
            )}
          >
            {status}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white/90 group-hover:text-white transition-colors duration-300">
            {title}
          </h3>
          <div className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            {value}
          </div>
          <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Subtle animated border */}
        <div className="absolute inset-0 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </CardContent>
    </Card>
  );
};

export default StatusCard;
