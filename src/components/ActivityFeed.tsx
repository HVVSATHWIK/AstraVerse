
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity } from 'lucide-react';
import { ActivityLog } from '@/types';

interface ActivityFeedProps {
  activities?: ActivityLog[];
  isLoading: boolean;
}

const ActivityFeed = ({ activities, isLoading }: ActivityFeedProps) => {
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'transcription':
        return 'bg-emerald-500';
      case 'alert':
        return 'bg-blue-500';
      case 'automation':
        return 'bg-purple-500';
      case 'report':
        return 'bg-amber-500';
      default:
        return 'bg-slate-500';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-slate-800 flex items-center text-lg">
          <Activity className="w-5 h-5 mr-3 text-indigo-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-2">
              <Skeleton className="w-3 h-3 rounded-full" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))
        ) : activities && activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50/50 transition-colors">
              <div className={`w-3 h-3 ${getActivityColor(activity.type)} rounded-full shadow-sm`}></div>
              <span className="text-slate-700 text-sm flex-1 font-medium">{activity.message}</span>
              <span className="text-slate-500 text-xs font-medium">{formatTimestamp(activity.timestamp)}</span>
            </div>
          ))
        ) : (
          <>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50/50 transition-colors">
              <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-sm"></div>
              <span className="text-slate-700 text-sm flex-1 font-medium">Zoom meeting transcribed and analyzed</span>
              <span className="text-slate-500 text-xs font-medium">2m ago</span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50/50 transition-colors">
              <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
              <span className="text-slate-700 text-sm flex-1 font-medium">Slack alert triggered for customer churn</span>
              <span className="text-slate-500 text-xs font-medium">5m ago</span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50/50 transition-colors">
              <div className="w-3 h-3 bg-purple-500 rounded-full shadow-sm"></div>
              <span className="text-slate-700 text-sm flex-1 font-medium">Jira ticket auto-created from analysis</span>
              <span className="text-slate-500 text-xs font-medium">12m ago</span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50/50 transition-colors">
              <div className="w-3 h-3 bg-amber-500 rounded-full shadow-sm"></div>
              <span className="text-slate-700 text-sm flex-1 font-medium">Weekly report generated</span>
              <span className="text-slate-500 text-xs font-medium">1h ago</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
