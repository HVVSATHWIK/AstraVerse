
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import AstraLogo from '@/components/AstraLogo';

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
              "bg-white/80 border-slate-200 hover:bg-slate-50 transition-all duration-200",
              "shadow-sm hover:shadow-md"
            )}
          >
            <Menu className="w-4 h-4" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="left" 
          className={cn(
            "bg-white/95 backdrop-blur-sm border-white/20 w-80"
          )}
        >
          <div className="flex items-center space-x-3 mb-8">
            <AstraLogo size="md" />
            <h2 className="text-slate-800 text-xl font-bold">
              AstraAI
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
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' 
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-transparent',
                  "rounded-xl"
                )}
                onClick={() => handleTabClick(tab.value)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="text-lg mr-3 group-hover:scale-110 transition-transform duration-200">
                  {tab.icon}
                </span>
                <span className="font-medium relative z-10">{tab.label}</span>
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
