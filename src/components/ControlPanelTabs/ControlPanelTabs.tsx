
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Box, Globe, Palette, Eye, Settings } from 'lucide-react';

interface ControlPanelTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ControlPanelTabs = ({ activeTab, onTabChange }: ControlPanelTabsProps) => {
  const tabs = [
    { id: 'scene', label: 'Scene', icon: Box },
    { id: 'properties', label: 'Properties', icon: Settings },
    { id: 'lighting', label: 'Environment', icon: Globe },
    { id: 'materials', label: 'Material', icon: Palette },
    { id: 'environment', label: 'View', icon: Eye },
  ];

  return (
    <TooltipProvider>
      <div className="fixed right-4 top-1/2 -translate-y-1/2 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-lg p-1 z-40">
        <div className="flex flex-col gap-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <Tooltip key={tab.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onTabChange(tab.id)}
                    className={`h-10 w-10 p-0 transition-all duration-200 hover:scale-105 ${
                      activeTab === tab.id
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-300 hover:bg-slate-600/50 hover:text-white'
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
