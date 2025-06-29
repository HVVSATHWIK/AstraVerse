import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, Bell, User, LogOut, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import UserProfileModal from '@/components/profile/UserProfileModal';
import MobileNav from '@/components/MobileNav';
import { useIsMobile } from '@/hooks/use-mobile';
import SearchOverlay from '@/components/SearchOverlay';
import SettingsDialog from '@/components/SettingsDialog';
import { useWorkflows } from '@/services/dataService';
import { useAgents } from '@/hooks/useAgents';
import { useIntegrations } from '@/services/dataService';

interface DashboardHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardHeader = ({ activeTab, onTabChange }: DashboardHeaderProps) => {
  const { user, profile, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Fetch data for search
  const { data: workflows } = useWorkflows();
  const { data: agents } = useAgents();
  const { data: integrations } = useIntegrations();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleSearchResult = (result: any) => {
    // Navigate to the appropriate section based on the result type
    switch (result.type) {
      case 'workflow':
        onTabChange('workflows');
        // Additional logic to select the specific workflow could be added here
        break;
      case 'agent':
        onTabChange('agents');
        // Additional logic to select the specific agent could be added here
        break;
      case 'integration':
        onTabChange('integrations');
        // Additional logic to select the specific integration could be added here
        break;
      case 'setting':
        setIsSettingsOpen(true);
        break;
      default:
        break;
    }
  };

  if (isMobile) {
    return <MobileNav activeTab={activeTab} onTabChange={onTabChange} />;
  }

  return (
    <>
      <div className="flex items-center justify-between p-6 bg-slate-800/30 backdrop-blur-sm rounded-4xl border border-slate-700/50 shadow-2xl glass-dark mb-6">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl transform-3d">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                AstraAI Dashboard
              </h1>
              <p className="text-slate-400 text-sm">Intelligent Automation Platform</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30 shadow-lg">
              System Online
            </Badge>
            <Badge className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30 shadow-lg">
              12 Active Workflows
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-2xl"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="w-4 h-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-2xl relative"
          >
            <Bell className="w-4 h-4" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-2xl"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="w-4 h-4" />
          </Button>

          <div className="flex items-center space-x-3 pl-4 border-l border-slate-700">
            <UserProfileModal
              trigger={
                <Button variant="ghost" className="flex items-center space-x-3 p-2 hover:bg-slate-700/50 rounded-2xl">
                  <Avatar className="w-8 h-8 border-2 border-purple-500/30">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm">
                      {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="text-white text-sm font-medium">
                      {profile?.full_name || 'User'}
                    </div>
                    <div className="text-slate-400 text-xs">
                      {user?.email}
                    </div>
                  </div>
                </Button>
              }
            />
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-2xl"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      <SearchOverlay 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        workflows={workflows}
        agents={agents}
        integrations={integrations}
        onSelectResult={handleSearchResult}
      />

      {/* Settings Dialog */}
      <SettingsDialog isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};

export default DashboardHeader;