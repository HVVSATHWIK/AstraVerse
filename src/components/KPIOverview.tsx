
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useKPIs, useSystemMetrics } from '@/services/dataService';
import MetricsChart from './MetricsChart';

const KPIOverview = () => {
  const { data: kpis, isLoading: kpisLoading } = useKPIs();
  const { data: metrics, isLoading: metricsLoading } = useSystemMetrics();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">KPI Dashboard</CardTitle>
            <CardDescription className="text-slate-400">
              Real-time performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {kpisLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))
            ) : (
              <>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">Meeting Reduction</span>
                    <span className="text-green-400">{kpis?.meetingReduction || 23}%</span>
                  </div>
                  <Progress value={kpis?.meetingReduction || 23} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">Task Completion Rate</span>
                    <span className="text-blue-400">{kpis?.taskCompletionRate || 87}%</span>
                  </div>
                  <Progress value={kpis?.taskCompletionRate || 87} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">Response Latency</span>
                    <span className="text-purple-400">{kpis?.avgResponseTime || 147}ms</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Resource Utilization</CardTitle>
            <CardDescription className="text-slate-400">
              System performance overview
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {kpisLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))
            ) : (
              <>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">CPU Usage</span>
                    <span className="text-yellow-400">{kpis?.cpuUsage || 68}%</span>
                  </div>
                  <Progress value={kpis?.cpuUsage || 68} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">Memory Usage</span>
                    <span className="text-red-400">{kpis?.memoryUsage || 82}%</span>
                  </div>
                  <Progress value={kpis?.memoryUsage || 82} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">Storage</span>
                    <span className="text-blue-400">{kpis?.storageUsage || 45}%</span>
                  </div>
                  <Progress value={kpis?.storageUsage || 45} className="h-2" />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <MetricsChart />
    </div>
  );
};

export default KPIOverview;
