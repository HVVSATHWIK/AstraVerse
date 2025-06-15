
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const AgentTimelineLoading = () => {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <Skeleton className="h-6 w-48 bg-slate-700" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-4 w-4 rounded-full bg-slate-700" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4 bg-slate-700" />
                <Skeleton className="h-3 w-1/2 bg-slate-700" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentTimelineLoading;
