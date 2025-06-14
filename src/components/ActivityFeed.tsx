
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
        return 'bg-green-400';
      case 'alert':
        return 'bg-blue-400';
      case 'automation':
        return 'bg-purple-400';
      case 'report':
        return 'bg-yellow-400';
      default:
        return 'bg-gray-400';
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
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-400" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="w-2 h-2 rounded-full" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))
        ) : activities && activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3">
              <div className={`w-2 h-2 ${getActivityColor(activity.type)} rounded-full`}></div>
              <span className="text-slate-300 text-sm flex-1">{activity.message}</span>
              <span className="text-slate-500 text-xs">{formatTimestamp(activity.timestamp)}</span>
            </div>
          ))
        ) : (
          // Fallback activities when no data is available
          <>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-slate-300 text-sm">Zoom meeting transcribed and analyzed</span>
              <span className="text-slate-500 text-xs">2m ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-slate-300 text-sm">Slack alert triggered for customer churn</span>
              <span className="text-slate-500 text-xs">5m ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-slate-300 text-sm">Jira ticket auto-created from analysis</span>
              <span className="text-slate-500 text-xs">12m ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-slate-300 text-sm">Weekly report generated</span>
              <span className="text-slate-500 text-xs">1h ago</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
