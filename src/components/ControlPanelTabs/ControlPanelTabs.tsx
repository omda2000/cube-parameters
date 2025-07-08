
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
      <div className="fixed left-2 top-12 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-1.5 z-50 shadow-xl">
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
                    className={`h-7 w-7 p-0 transition-all duration-200 hover:scale-105 rounded-lg ${
                      isActive
                        ? 'bg-slate-600 text-slate-100 shadow-lg scale-105'
                        : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                    }`}
                  >
                    <IconComponent className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">
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
