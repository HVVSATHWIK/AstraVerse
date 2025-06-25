import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import SystemStatusCards from '@/components/SystemStatusCards';
import OverviewMetrics from '@/components/OverviewMetrics';

interface SystemOverviewSectionProps {
  kpis: any;
  kpisLoading: boolean;
}

const SystemOverviewSection = ({ kpis, kpisLoading }: SystemOverviewSectionProps) => {
  return (
    <section className="space-y-6 animate-slide-up-3d stagger-3">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white text-3d">System Overview</h2>
        <div className="h-px bg-gradient-to-r from-blue-500/50 to-transparent flex-1 ml-6"></div>
      </div>
      <ErrorBoundary>
        <div className="animate-bounce-in-3d stagger-4">
          <OverviewMetrics />
        </div>
        <div className="mt-6 animate-bounce-in-3d stagger-4">
          <SystemStatusCards kpis={kpis} isLoading={kpisLoading} />
        </div>
      </ErrorBoundary>
    </section>
  );
};

export default SystemOverviewSection;