
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Box, Globe, Palette, Eye, Settings } from 'lucide-react';

interface ControlPanelTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isPanelOpen: boolean;
}

const ControlPanelTabs = ({ activeTab, onTabChange, isPanelOpen }: ControlPanelTabsProps) => {
  const tabs = [
    { id: 'scene', label: 'Scene Objects', icon: Box },
    { id: 'properties', label: 'Properties', icon: Settings },
    { id: 'lighting', label: 'Lighting & Environment', icon: Globe },
    { id: 'materials', label: 'Materials', icon: Palette },
    { id: 'environment', label: 'View Settings', icon: Eye },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
  };

  return (
    <TooltipProvider>
      <div className="fixed right-1 top-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg z-50">
        <div className="flex flex-col">
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
                    className={`h-6 w-6 p-0 transition-all duration-150 hover:scale-105 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <IconComponent className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p className="text-xs">{tab.label}</p>
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
