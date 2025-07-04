
import React from 'react';
import { X, Box, Globe, Palette, Eye, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FixedControlPanelProps {
  title?: string;
  children: React.ReactNode;
  isOpen: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onClose?: () => void;
}

const FixedControlPanel = ({
  title,
  children,
  isOpen,
  activeTab,
  onTabChange,
  onClose
}: FixedControlPanelProps) => {
  if (!isOpen) {
    return null;
  }

  const tabs = [
    { id: 'scene', label: 'Scene Objects', icon: Box },
    { id: 'properties', label: 'Properties', icon: Settings },
    { id: 'lighting', label: 'Lighting & Environment', icon: Globe },
    { id: 'materials', label: 'Materials', icon: Palette },
    { id: 'environment', label: 'View Settings', icon: Eye },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
  };

  return (
    <div
      className="fixed left-4 top-16 bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-2xl z-40"
      style={{
        width: 360,
        height: 500,
        maxHeight: '85vh'
      }}
    >
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between p-3 border-b border-border">
          <h3 className="text-sm font-medium text-card-foreground">{title}</h3>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}

      {/* Content with Tabs */}
      <div className="flex h-full">
        <div className="flex flex-col gap-1 p-2 border-r border-border">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                onClick={() => handleTabClick(tab.id)}
                className={`h-8 w-8 p-0 transition-all duration-150 hover:scale-105 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <IconComponent className="h-4 w-4" />
              </Button>
            );
          })}
        </div>
        <div className="flex-1 overflow-y-auto p-2">{children}</div>
      </div>
    </div>
  );
};

export default FixedControlPanel;
