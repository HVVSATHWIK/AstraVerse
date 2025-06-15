
import React from 'react';
import QuickStartGuide from '@/components/QuickStartGuide';
import QuickActions from '@/components/QuickActions';

const QuickStartSection = () => {
  return (
    <section className="space-y-6 animate-fade-in-3d stagger-2">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white text-3d">Getting Started</h2>
        <div className="h-px bg-gradient-to-r from-purple-500/50 to-transparent flex-1 ml-6"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 animate-scale-in-3d stagger-3">
          <QuickStartGuide />
        </div>
        <div className="lg:col-span-1 animate-scale-in-3d stagger-4">
          <QuickActions />
        </div>
      </div>
    </section>
  );
};

export default QuickStartSection;
