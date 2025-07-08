
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Box, Globe, Eye, Settings, Wrench } from 'lucide-react';

interface ControlPanelTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isPanelOpen: boolean;
}

const ControlPanelTabs = ({ activeTab, onTabChange, isPanelOpen }: ControlPanelTabsProps) => {
  const tabs = [
    { id: 'scene', label: 'Scene Objects', icon: Box },
    { id: 'properties', label: 'Properties & Materials', icon: Wrench },
    { id: 'lighting', label: 'Lighting & Environment', icon: Globe },
    { id: 'view', label: 'View Settings', icon: Eye },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
  };

  return (
    <TooltipProvider>
      <div className="fixed left-4 top-16 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-2 z-50 shadow-lg">
        <div className="flex flex-col gap-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id && isPanelOpen;
            
            return (
              <Tooltip key={tab.id}>
                <TooltipTrigger asChild>
                  <Button
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
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="text-sm">{tab.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ControlPanelTabs;
