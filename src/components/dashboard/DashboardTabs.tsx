
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  return (
    <div className="hidden md:block animate-scale-in-3d stagger-1">
      <TabsList className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 p-1 shadow-xl rounded-4xl glass-dark hover-lift-3d transform-3d">
        <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-slate-300 font-medium rounded-3xl btn-3d transition-all duration-300">
          Overview
        </TabsTrigger>
        <TabsTrigger value="workflows" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-slate-300 font-medium rounded-3xl btn-3d transition-all duration-300">
          Workflows
        </TabsTrigger>
        <TabsTrigger value="agents" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-slate-300 font-medium rounded-3xl btn-3d transition-all duration-300">
          Agents
        </TabsTrigger>
        <TabsTrigger value="integrations" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-slate-300 font-medium rounded-3xl btn-3d transition-all duration-300">
          Integrations
        </TabsTrigger>
        <TabsTrigger value="model-viewer" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-slate-300 font-medium rounded-3xl btn-3d transition-all duration-300">
          3D Model Viewer
        </TabsTrigger>
        <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-slate-300 font-medium rounded-3xl btn-3d transition-all duration-300">
          Analytics
        </TabsTrigger>
        <TabsTrigger value="pilot" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-slate-300 font-medium rounded-3xl btn-3d transition-all duration-300">
          Pilot Mode
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default DashboardTabs;
