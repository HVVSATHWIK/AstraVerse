
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
    <Card className="bg-white border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-gray-900 text-lg flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-3">
              <Skeleton className="w-2 h-2 rounded-full" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))
        ) : (
          <>
            <div className="flex items-center space-x-3 p-3 border border-gray-100 rounded hover:bg-gray-50">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 text-sm flex-1">Zoom meeting transcribed</span>
              <span className="text-gray-500 text-xs">2m ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 border border-gray-100 rounded hover:bg-gray-50">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 text-sm flex-1">Slack alert triggered</span>
              <span className="text-gray-500 text-xs">5m ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 border border-gray-100 rounded hover:bg-gray-50">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700 text-sm flex-1">Jira ticket created</span>
              <span className="text-gray-500 text-xs">12m ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 border border-gray-100 rounded hover:bg-gray-50">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-gray-700 text-sm flex-1">Weekly report generated</span>
              <span className="text-gray-500 text-xs">1h ago</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
