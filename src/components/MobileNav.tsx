
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
            className="border-gray-200 hover:bg-gray-50"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="left" 
          className="bg-white border-gray-200 w-80"
        >
          <div className="flex items-center space-x-3 mb-8">
            <AstraLogo size="md" />
            <h2 className="text-gray-900 text-xl font-bold">
              AstraAI
            </h2>
          </div>
          
          <div className="space-y-2">
            {tabs.map((tab) => (
              <Button
                key={tab.value}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-12 text-left transition-colors",
                  activeTab === tab.value 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100',
                  "rounded-lg"
                )}
                onClick={() => handleTabClick(tab.value)}
              >
                <span className="text-lg mr-3">
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
