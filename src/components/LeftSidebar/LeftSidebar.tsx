
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Box, Settings, Eye, HelpCircle, Lightbulb } from 'lucide-react';

interface LeftSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isPanelOpen: boolean;
}

const LeftSidebar = ({ activeTab, onTabChange, isPanelOpen }: LeftSidebarProps) => {
  const tabs = [
    { id: 'scene', label: 'Scene Objects', icon: Box, description: 'Manage 3D objects and hierarchy' },
    { id: 'properties', label: 'Object Properties', icon: Settings, description: 'Edit object properties and materials' },
    { id: 'lighting', label: 'Lighting & Environment', icon: Lightbulb, description: 'Control lighting and environment settings' },
    { id: 'environment', label: 'View Settings', icon: Eye, description: 'Camera and rendering options' },
    { id: 'help', label: 'User Guide', icon: HelpCircle, description: 'Touch and desktop controls guide' },
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
  };

  return (
    <TooltipProvider>
      <div className="fixed left-4 top-20 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-2 z-50 shadow-lg">
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
                    <IconComponent className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-48">
                  <div className="text-xs">
                    <p className="font-medium">{tab.label}</p>
                    <p className="text-muted-foreground mt-1">{tab.description}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default LeftSidebar;
