
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Wifi, WifiOff, Play, User } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AstraLogo from '@/components/AstraLogo';
import MobileNav from '@/components/MobileNav';
import SettingsDialog from '@/components/SettingsDialog';
import UserProfile from '@/components/UserProfile';
import { useRealtime } from '@/contexts/RealtimeContext';
import { useAuth } from '@/hooks/useAuth';

interface DashboardHeaderProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const DashboardHeader = ({ activeTab, onTabChange }: DashboardHeaderProps) => {
  const { isConnected, toggleRealtime, isRealtimeEnabled } = useRealtime();
  const { user, profile } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="flex items-center justify-between bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-slate-700/50 glass-dark hover-lift-3d card-3d animate-slide-up-3d transform-3d perspective-container relative overflow-hidden">
      {/* 3D Background elements */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full blur-3xl animate-background-float opacity-50"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-cyan-600/20 to-purple-600/20 rounded-full blur-3xl animate-float-3d opacity-40"></div>
      
      <div className="flex items-center space-x-4 relative z-10">
        <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg animate-float-3d btn-3d">
          <AstraLogo size="md" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent text-3d animate-scale-in-3d">
            AstraAI Platform
          </h1>
          <p className="text-slate-300 animate-fade-in-3d stagger-1">
            Welcome, {profile?.full_name || user?.email} • AI Workflow Orchestration
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3 relative z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleRealtime}
          className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50 backdrop-blur-sm shadow-lg rounded-2xl btn-3d animate-scale-in-3d stagger-2"
        >
          {isConnected && isRealtimeEnabled ? 
            <Wifi className="w-4 h-4 mr-2 text-green-400 animate-pulse-3d" /> : 
            <WifiOff className="w-4 h-4 mr-2 text-slate-400 animate-wiggle-3d" />
          }
          {isRealtimeEnabled ? 'Live' : 'Paused'}
        </Button>
        
        <SettingsDialog>
          <Button variant="outline" size="sm" className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50 backdrop-blur-sm shadow-lg rounded-2xl btn-3d animate-scale-in-3d stagger-3">
            <Settings className="w-4 h-4 mr-2 animate-rotate-3d" />
            Settings
          </Button>
        </SettingsDialog>

        <Popover open={showUserMenu} onOpenChange={setShowUserMenu}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50 backdrop-blur-sm shadow-lg rounded-2xl btn-3d animate-scale-in-3d stagger-4">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 bg-slate-800/95 border-slate-700" align="end">
            <UserProfile />
          </PopoverContent>
        </Popover>
        
        <MobileNav activeTab={activeTab} onTabChange={onTabChange} />
      </div>

      {/* 3D floating decorative elements */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-full blur-2xl animate-pulse-3d opacity-30"></div>
    </div>
  );
};

export default DashboardHeader;
