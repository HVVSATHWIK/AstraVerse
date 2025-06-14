
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const MobileNav = ({ activeTab, onTabChange }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { value: 'overview', label: 'Overview', icon: '📊' },
    { value: 'workflows', label: 'Workflows', icon: '⚙️' },
    { value: 'integrations', label: 'Integrations', icon: '🔗' },
    { value: 'analytics', label: 'Analytics', icon: '📈' },
    { value: 'pilot', label: 'Pilot Mode', icon: '🚀' },
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
            className={cn(
              "text-white border-slate-600/50 bg-slate-800/50 backdrop-blur-sm",
              "hover:bg-slate-700/70 hover:border-slate-500/70 transition-all duration-200",
              "shadow-lg hover:shadow-xl"
            )}
          >
            <Menu className="w-4 h-4" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="left" 
          className={cn(
            "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
            "border-slate-700/50 w-80 backdrop-blur-xl"
          )}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-white text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Navigation
            </h2>
          </div>
          
          <div className="space-y-3">
            {tabs.map((tab, index) => (
              <Button
                key={tab.value}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-12 text-left transition-all duration-200 group relative overflow-hidden",
                  activeTab === tab.value 
                    ? 'bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white shadow-lg border border-purple-500/30' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent',
                  "rounded-xl backdrop-blur-sm"
                )}
                onClick={() => handleTabClick(tab.value)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Animated background for active state */}
                {activeTab === tab.value && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 animate-pulse" />
                )}
                
                <span className="text-lg mr-3 group-hover:scale-110 transition-transform duration-200">
                  {tab.icon}
                </span>
                <span className="font-medium relative z-10">{tab.label}</span>
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl" />
              </Button>
            ))}
          </div>

          {/* Decorative gradient at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-600/10 to-transparent pointer-events-none" />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
