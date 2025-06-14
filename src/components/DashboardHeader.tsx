
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Wifi, WifiOff, Play } from 'lucide-react';
import AstraLogo from '@/components/AstraLogo';
import MobileNav from '@/components/MobileNav';
import SettingsDialog from '@/components/SettingsDialog';
import { useRealtime } from '@/contexts/RealtimeContext';

interface DashboardHeaderProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const DashboardHeader = ({ activeTab, onTabChange }: DashboardHeaderProps) => {
  const { isConnected, toggleRealtime, isRealtimeEnabled } = useRealtime();

  return (
    <div className="flex items-center justify-between bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-slate-700/50 hover:bg-slate-800/90 transition-all duration-300">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg">
          <AstraLogo size="md" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            AstraAI Platform
          </h1>
          <p className="text-slate-300">AI Workflow Orchestration • Meeting Intelligence • Automation Hub</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleRealtime}
          className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50 backdrop-blur-sm shadow-lg rounded-2xl"
        >
          {isConnected && isRealtimeEnabled ? 
            <Wifi className="w-4 h-4 mr-2 text-green-400" /> : 
            <WifiOff className="w-4 h-4 mr-2 text-slate-400" />
          }
          {isRealtimeEnabled ? 'Live' : 'Paused'}
        </Button>
        <SettingsDialog>
          <Button variant="outline" size="sm" className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50 backdrop-blur-sm shadow-lg rounded-2xl">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </SettingsDialog>
        <MobileNav activeTab={activeTab} onTabChange={onTabChange} />
      </div>
    </div>
  );
};

export default DashboardHeader;
