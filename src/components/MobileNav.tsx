
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MobileNavProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const MobileNav = ({ activeTab, onTabChange }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'workflows', label: 'Workflows' },
    { value: 'integrations', label: 'Integrations' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'pilot', label: 'Pilot Mode' },
  ];

  const handleTabClick = (value: string) => {
    onTabChange(value);
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="text-white border-slate-600">
            <Menu className="w-4 h-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-slate-900 border-slate-700 w-80">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-lg font-semibold">Navigation</h2>
          </div>
          <div className="space-y-2">
            {tabs.map((tab) => (
              <Button
                key={tab.value}
                variant={activeTab === tab.value ? "default" : "ghost"}
                className={`w-full justify-start ${
                  activeTab === tab.value 
                    ? 'bg-purple-600 text-white' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                onClick={() => handleTabClick(tab.value)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
