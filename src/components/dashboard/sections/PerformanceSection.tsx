
import React from 'react';
import SystemHealth from '@/components/SystemHealth';
import MetricsChart from '@/components/MetricsChart';

const PerformanceSection = () => {
  return (
    <section className="space-y-6 animate-slide-up-3d stagger-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white text-3d">Performance & Health</h2>
        <div className="h-px bg-gradient-to-r from-orange-500/50 to-transparent flex-1 ml-6"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="animate-scale-in-3d stagger-6">
          <SystemHealth />
        </div>
        <div className="animate-bounce-in-3d stagger-6">
          <MetricsChart />
        </div>
      </div>
    </section>
  );
};

export default PerformanceSection;
