
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Menu, Home, Workflow, Users, BarChart3, Settings, Bell, Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileOptimizedViewProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MobileOptimizedView = ({ children, activeTab, onTabChange }: MobileOptimizedViewProps) => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isMobile) {
    return <>{children}</>;
  }

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'workflows', label: 'Workflows', icon: Workflow },
    { id: 'agents', label: 'Agents', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'integrations', label: 'Integrations', icon: Settings },
  ];

  const quickActions = [
    { label: 'New Workflow', icon: Plus, action: () => console.log('New workflow') },
    { label: 'Run Agent', icon: Users, action: () => console.log('Run agent') },
    { label: 'View Analytics', icon: BarChart3, action: () => console.log('View analytics') },
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="text-white">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 bg-slate-800 border-slate-700 p-0">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">AstraAI</h2>
              <p className="text-slate-400 text-sm">Mobile Dashboard</p>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                {/* Navigation */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 mb-3">NAVIGATION</h3>
                  <div className="space-y-1">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Button
                          key={item.id}
                          variant={activeTab === item.id ? "default" : "ghost"}
                          className={`w-full justify-start ${
                            activeTab === item.id 
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                              : 'text-slate-300 hover:bg-slate-700/50'
                          }`}
                          onClick={() => {
                            onTabChange(item.id);
                            setIsMenuOpen(false);
                          }}
                        >
                          <Icon className="w-4 h-4 mr-3" />
                          {item.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 mb-3">QUICK ACTIONS</h3>
                  <div className="space-y-2">
                    {quickActions.map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start border-slate-600 text-slate-300"
                          onClick={action.action}
                        >
                          <Icon className="w-4 h-4 mr-3" />
                          {action.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Status Cards */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 mb-3">SYSTEM STATUS</h3>
                  <div className="space-y-3">
                    <Card className="bg-slate-700/50 border-slate-600">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 text-sm">Active Workflows</span>
                          <Badge className="bg-green-500/20 text-green-400">
                            12
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-slate-700/50 border-slate-600">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 text-sm">System Health</span>
                          <Badge className="bg-green-500/20 text-green-400">
                            98%
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-700/50 border-slate-600">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 text-sm">Active Users</span>
                          <Badge className="bg-blue-500/20 text-blue-400">
                            847
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        <h1 className="text-lg font-bold text-white">
          {navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
        </h1>

        <Button variant="ghost" size="sm" className="text-white">
          <Bell className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {children}
        </div>
      </ScrollArea>

      {/* Mobile Bottom Navigation */}
      <div className="bg-slate-800/80 backdrop-blur-sm border-t border-slate-700 p-2">
        <div className="grid grid-cols-5 gap-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center space-y-1 h-auto py-2 ${
                  activeTab === item.id 
                    ? 'text-purple-400' 
                    : 'text-slate-400'
                }`}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileOptimizedView;
