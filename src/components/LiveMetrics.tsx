
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Custom SVG Icons
const PulseIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M3 12h4l3-8 4 16 3-8h4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="1" fill="currentColor" className="animate-pulse" />
  </svg>
);

const TrendUpIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M17 7l-10 10M17 7h-6M17 7v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TrendDownIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M17 17l-10-10M17 17h-6M17 17v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CurrencyIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8M12 18V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PeopleIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="18" cy="7" r="2" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2M16 11a3 3 0 0 1 3 3v7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ServerIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="3" width="20" height="4" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="2" y="10" width="20" height="4" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="2" y="17" width="20" height="4" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="6" cy="5" r="1" fill="currentColor" />
    <circle cx="6" cy="12" r="1" fill="currentColor" />
    <circle cx="6" cy="19" r="1" fill="currentColor" />
  </svg>
);

const SpeedIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
);

const LiveMetrics = () => {
  const metrics = [
    {
      title: 'Revenue',
      value: '$24,567',
      change: '+12.5%',
      trend: 'up',
      icon: CurrencyIcon,
      color: 'text-emerald-400'
    },
    {
      title: 'Active Users',
      value: '1,247',
      change: '+8.2%',
      trend: 'up',
      icon: PeopleIcon,
      color: 'text-blue-400'
    },
    {
      title: 'API Calls',
      value: '89.2K',
      change: '-2.1%',
      trend: 'down',
      icon: ServerIcon,
      color: 'text-purple-400'
    },
    {
      title: 'Performance',
      value: '98.7%',
      change: '+0.3%',
      trend: 'up',
      icon: SpeedIcon,
      color: 'text-orange-400'
    }
  ];

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-lg flex items-center">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg mr-3 shadow-lg">
            <PulseIcon className="w-5 h-5 text-white" />
          </div>
          Live Metrics
          <Badge className="ml-auto bg-green-500/20 text-green-400 border-green-500/50 animate-pulse">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:bg-slate-700/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
                <div className={`flex items-center text-xs ${
                  metric.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {metric.trend === 'up' ? (
                    <TrendUpIcon className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendDownIcon className="w-3 h-3 mr-1" />
                  )}
                  {metric.change}
                </div>
              </div>
              <div className="text-white text-lg font-bold">{metric.value}</div>
              <div className="text-slate-400 text-xs">{metric.title}</div>
            </div>
          ))}
        </div>
        
        <div className="pt-3 border-t border-slate-700/50">
          <div className="text-slate-300 text-sm mb-2 font-medium">System Load</div>
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-pulse" style={{ width: '67%' }}></div>
            </div>
            <span className="text-slate-400 text-xs">67%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveMetrics;
