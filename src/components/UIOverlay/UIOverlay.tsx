
import React from 'react';
import AidToolsBar from '../AidToolsBar/AidToolsBar';
import ControlPanelTabs from '../ControlPanelTabs/ControlPanelTabs';
import FixedControlPanel from '../FixedControlPanel/FixedControlPanel';
import TabsControlPanel from '../TabsControlPanel/TabsControlPanel';
import BottomFloatingBar from '../BottomFloatingBar/BottomFloatingBar';
import NotificationBell from '../NotificationBell/NotificationBell';
import type { ShadeType } from '../ShadeTypeSelector/ShadeTypeSelector';

interface UIOverlayProps {
  activeTool: 'select' | 'point' | 'measure' | 'move';
  onToolSelect: (tool: 'select' | 'point' | 'measure' | 'move') => void;
  activeControlTab: string;
  showControlPanel: boolean;
  onTabChange: (tab: string) => void;
  onCloseControlPanel: () => void;
  controlsPanelProps: any;
  showMeasurePanel: boolean;
  onCloseMeasurePanel: () => void;
  measurements: any[];
  onClearAllMeasurements: () => void;
  onRemoveMeasurement: (id: string) => void;
  onZoomAll: () => void;
  onZoomToSelected: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  shadeType: ShadeType;
  onShadeTypeChange: (type: ShadeType) => void;
  modelCount: number;
}

const UIOverlay = ({
  activeTool,
  onToolSelect,
  activeControlTab,
  showControlPanel,
  onTabChange,
  onCloseControlPanel,
  controlsPanelProps,
  onZoomAll,
  onZoomToSelected,
  onZoomIn,
  onZoomOut,
  onResetView,
  shadeType,
  onShadeTypeChange,
  modelCount
}: UIOverlayProps) => {
  return (
    <>
      {/* Notification bell - top right corner */}
      <div className="fixed top-4 right-4 z-50">
        <NotificationBell />
      </div>

      {/* Aid Tools Bar - centered at top */}
      <AidToolsBar
        onToolSelect={onToolSelect}
        activeTool={activeTool}
      />

      {/* Control Panel Tabs - left side, positioned to avoid overlap */}
      <ControlPanelTabs
        activeTab={activeControlTab}
        onTabChange={onTabChange}
        isPanelOpen={showControlPanel}
      />

      {/* Fixed Control Panel - positioned next to tabs with proper spacing */}
      <FixedControlPanel
        isOpen={showControlPanel}
        onClose={onCloseControlPanel}
      >
        <TabsControlPanel {...controlsPanelProps} />
      </FixedControlPanel>

      {/* Bottom Floating Bar - stays at bottom */}
      <BottomFloatingBar
        objectCount={modelCount}
        gridEnabled={true}
        gridSpacing="1m"
        units="m"
        cursorPosition={{ x: 0, y: 0 }}
        zoomLevel={100}
        shadeType={shadeType}
        onShadeTypeChange={onShadeTypeChange}
        onZoomAll={onZoomAll}
        onZoomToSelected={onZoomToSelected}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onResetView={onResetView}
        snapToGrid={false}
        onSnapToGridChange={() => {}}
        gridSize={1}
        onGridSizeChange={() => {}}
      />
    </>
  );
};

export default UIOverlay;
