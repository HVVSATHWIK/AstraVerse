
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity } from 'lucide-react';

interface RecentActivityProps {
  activityLogs: any;
  isLoading: boolean;
}

const RecentActivity = ({ activityLogs, isLoading }: RecentActivityProps) => {
  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-lg flex items-center">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg mr-3 shadow-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-3">
              <Skeleton className="w-3 h-3 rounded-full bg-slate-700" />
              <Skeleton className="h-4 flex-1 bg-slate-700" />
              <Skeleton className="h-3 w-12 bg-slate-700" />
            </div>
          ))
        ) : (
          <>
            <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors border border-slate-600/30">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full shadow-lg"></div>
              <span className="text-slate-200 text-sm flex-1 font-medium">Zoom meeting transcribed</span>
              <span className="text-slate-400 text-xs">2m ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors border border-slate-600/30">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full shadow-lg"></div>
              <span className="text-slate-200 text-sm flex-1 font-medium">Slack alert triggered</span>
              <span className="text-slate-400 text-xs">5m ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors border border-slate-600/30">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full shadow-lg"></div>
              <span className="text-slate-200 text-sm flex-1 font-medium">Jira ticket created</span>
              <span className="text-slate-400 text-xs">12m ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors border border-slate-600/30">
              <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full shadow-lg"></div>
              <span className="text-slate-200 text-sm flex-1 font-medium">Weekly report generated</span>
              <span className="text-slate-400 text-xs">1h ago</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
