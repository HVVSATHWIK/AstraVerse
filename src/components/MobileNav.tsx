import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LayoutDashboard, GitBranch, Plug, BarChart, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import AstraLogo from '@/components/AstraLogo';

interface MobileNavProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const MobileNav = ({ activeTab, onTabChange }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { value: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { value: 'workflows', label: 'Workflows', icon: <GitBranch className="w-4 h-4" /> },
    { value: 'integrations', label: 'Integrations', icon: <Plug className="w-4 h-4" /> },
    { value: 'analytics', label: 'Analytics', icon: <BarChart className="w-4 h-4" /> },
    { value: 'pilot', label: 'Pilot Mode', icon: <Rocket className="w-4 h-4" /> },
  ];

  const handleTabClick = (value: string) => {
    onTabChange(value);
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50 backdrop-blur-sm shadow-lg"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="left" 
          className="bg-slate-900/95 backdrop-blur-xl border-slate-700/50 w-80"
        >
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg">
              <AstraLogo size="md" />
            </div>
            <h2 className="text-white text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              AstraAI
            </h2>
          </div>
          
          <div className="space-y-2">
            {tabs.map((tab) => (
              <Button
                key={tab.value}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-12 text-left transition-all duration-200",
                  activeTab === tab.value 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50',
                  "rounded-xl"
                )}
                onClick={() => handleTabClick(tab.value)}
              >
                <span className="mr-3">
                  {tab.icon}
                </span>
                <span className="font-medium">{tab.label}</span>
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;