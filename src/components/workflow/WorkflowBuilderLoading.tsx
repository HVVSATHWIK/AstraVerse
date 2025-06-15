
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const WorkflowBuilderLoading = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Active Workflows</h3>
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-slate-800/50 border-slate-700 p-4 rounded-lg">
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-full mb-4" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
      <div className="lg:col-span-2">
        <div className="bg-slate-800/50 border-slate-700 p-6 rounded-lg">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilderLoading;
