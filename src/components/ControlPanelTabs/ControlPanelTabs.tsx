
import React from 'react';
import { Button } from '@/components/ui/button';
import { Box, Globe, Eye, Settings, Wrench } from 'lucide-react';

interface ControlPanelTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isPanelOpen: boolean;
}

const ControlPanelTabs = ({ activeTab, onTabChange, isPanelOpen }: ControlPanelTabsProps) => {
  const tabs = [
    { id: 'scene', icon: Box },
    { id: 'properties', icon: Wrench },
    { id: 'lighting', icon: Globe },
    { id: 'view', icon: Eye },
    { id: 'settings', icon: Settings },
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
  };

  return (
    <div className="fixed left-4 top-16 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-2 z-50 shadow-lg">
      <div className="flex flex-col gap-1">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id && isPanelOpen;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => handleTabClick(tab.id)}
              className={`h-10 w-10 p-0 transition-all duration-150 hover:scale-105 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <IconComponent className="h-5 w-5" />
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default ControlPanelTabs;
