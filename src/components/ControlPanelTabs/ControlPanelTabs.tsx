
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { 
  Box, 
  Palette, 
  Lightbulb, 
  Eye, 
  Settings,
  Layers
} from 'lucide-react';

interface ControlPanelTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isPanelOpen: boolean;
}

const tabs = [
  { id: 'scene', label: 'Scene', icon: Layers },
  { id: 'properties', label: 'Properties', icon: Box },
  { id: 'materials', label: 'Materials', icon: Palette },
  { id: 'lighting', label: 'Lighting', icon: Lightbulb },
  { id: 'view', label: 'View', icon: Eye },
  { id: 'settings', label: 'Settings', icon: Settings }
];

const ControlPanelTabs = ({ activeTab, onTabChange, isPanelOpen }: ControlPanelTabsProps) => {
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-1 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-2 shadow-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Tooltip key={tab.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={`w-10 h-10 p-0 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                  }`}
                  onClick={() => onTabChange(tab.id)}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-slate-800 border-slate-700">
                <p className="text-slate-200">{tab.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default ControlPanelTabs;
