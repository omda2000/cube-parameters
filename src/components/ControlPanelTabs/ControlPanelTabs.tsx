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
    { id: 'scene', label: 'Scene', icon: Box },
    { id: 'properties', label: 'Properties', icon: Settings },
    { id: 'lighting', label: 'Environment', icon: Globe },
    { id: 'materials', label: 'Material', icon: Palette },
    { id: 'environment', label: 'View', icon: Eye },
  ];

  const handleTabClick = (tabId: string) => {
    // If clicking the same active tab and panel is open, close panel
    // Otherwise, switch to that tab and ensure panel is open
    onTabChange(tabId);
  };

  return (
    <TooltipProvider>
      <div className="fixed right-2 top-20 bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-lg p-1 z-50">
        <div className="flex flex-col gap-0.5">
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
                    className={`h-9 w-9 p-0 transition-all duration-200 hover:scale-105 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-300 hover:bg-slate-600/60 hover:text-white'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{tab.label}</p>
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
