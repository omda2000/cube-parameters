
import React from 'react';
import { 
  RibbonContainer,
  RibbonTabList,
  RibbonTabTrigger,
  RibbonTabContent,
  HomeTab,
  ViewTab,
  ToolsTab,
  SettingsTab
} from '@/components/Ribbon';

interface AidToolsBarProps {
  activeTool: 'select' | 'point' | 'measure' | 'move';
  onToolSelect: (tool: 'select' | 'point' | 'measure' | 'move') => void;
  onViewChange: (view: string) => void;
  onZoomAll: () => void;
  onZoomToSelected: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onCameraToggle: () => void;
  isOrthographic: boolean;
  selectedObject?: any;
}

const AidToolsBar: React.FC<AidToolsBarProps> = ({
  activeTool,
  onToolSelect,
  onViewChange,
  onZoomAll,
  onZoomToSelected,
  onZoomIn,
  onZoomOut,
  onResetView,
  onCameraToggle,
  isOrthographic,
  selectedObject
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 shadow-sm">
      <RibbonContainer defaultTab="home">
        <RibbonTabList>
          <RibbonTabTrigger value="home">Home</RibbonTabTrigger>
          <RibbonTabTrigger value="view">View</RibbonTabTrigger>
          <RibbonTabTrigger value="tools">Tools</RibbonTabTrigger>
          <RibbonTabTrigger value="settings">Settings</RibbonTabTrigger>
        </RibbonTabList>

        <RibbonTabContent value="home">
          <HomeTab
            activeTool={activeTool}
            onToolSelect={onToolSelect}
          />
        </RibbonTabContent>

        <RibbonTabContent value="view">
          <ViewTab
            isOrthographic={isOrthographic}
            onCameraToggle={onCameraToggle}
            onViewChange={onViewChange}
            onZoomAll={onZoomAll}
            onZoomToSelected={onZoomToSelected}
            onZoomIn={onZoomIn}
            onZoomOut={onZoomOut}
            onResetView={onResetView}
          />
        </RibbonTabContent>

        <RibbonTabContent value="tools">
          <ToolsTab
            activeTool={activeTool}
            onToolSelect={onToolSelect}
          />
        </RibbonTabContent>

        <RibbonTabContent value="settings">
          <SettingsTab />
        </RibbonTabContent>
      </RibbonContainer>
    </div>
  );
};

export default AidToolsBar;
