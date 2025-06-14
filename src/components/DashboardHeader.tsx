
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Wifi, WifiOff } from 'lucide-react';
import AstraLogo from '@/components/AstraLogo';
import MobileNav from '@/components/MobileNav';
import { useRealtime } from '@/contexts/RealtimeContext';

interface DashboardHeaderProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const DashboardHeader = ({ activeTab, onTabChange }: DashboardHeaderProps) => {
  const { isConnected, toggleRealtime, isRealtimeEnabled } = useRealtime();

  return (
    <div className="flex items-center justify-between bg-white rounded-lg p-6 shadow-sm border">
      <div className="flex items-center space-x-4">
        <AstraLogo size="md" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AstraAI Platform</h1>
          <p className="text-gray-600">Enterprise AI Management Dashboard</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleRealtime}
          className="border-gray-200"
        >
          {isConnected && isRealtimeEnabled ? <Wifi className="w-4 h-4 mr-2 text-green-600" /> : <WifiOff className="w-4 h-4 mr-2 text-gray-400" />}
          {isRealtimeEnabled ? 'Live' : 'Paused'}
        </Button>
        <Button variant="outline" size="sm" className="border-gray-200">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
        <MobileNav activeTab={activeTab} onTabChange={onTabChange} />
      </div>
    </div>
  );
};

export default DashboardHeader;
