import React from 'react';
import AidToolsBar from '../AidToolsBar/AidToolsBar';
import ControlPanelTabs from '../ControlPanelTabs/ControlPanelTabs';
import FixedControlPanel from '../FixedControlPanel/FixedControlPanel';
import TabsControlPanel from '../TabsControlPanel/TabsControlPanel';
import MeasureToolsPanel from '../MeasureToolsPanel/MeasureToolsPanel';
import BottomFloatingBar from '../BottomFloatingBar/BottomFloatingBar';
import type { ShadeType } from '../ShadeTypeSelector/ShadeTypeSelector';

interface MeasureData {
  id: string;
  startPoint: { x: number; y: number; z: number };
  endPoint: { x: number; y: number; z: number };
  distance: number;
  label: string;
}

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
  measurements: MeasureData[];
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
  showMeasurePanel,
  onCloseMeasurePanel,
  measurements,
  onClearAllMeasurements,
  onRemoveMeasurement,
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
      {/* Aid Tools Bar - positioned at 1/3 screen */}
      <div className="fixed left-1/3 top-4 z-40">
        <AidToolsBar
          onToolSelect={onToolSelect}
          activeTool={activeTool}
        />
      </div>

      {/* Control Panel Tabs - repositioned to prevent collision */}
      <ControlPanelTabs
        activeTab={activeControlTab}
        onTabChange={onTabChange}
        isPanelOpen={showControlPanel}
      />

      {/* Fixed Control Panel - adjusted position to prevent collision */}
      <FixedControlPanel
        isOpen={showControlPanel}
        onClose={onCloseControlPanel}
      >
        <TabsControlPanel {...controlsPanelProps} />
      </FixedControlPanel>

      {/* Measure Tools Panel */}
      <MeasureToolsPanel
        measurements={measurements}
        onClearAll={onClearAllMeasurements}
        onRemoveMeasurement={onRemoveMeasurement}
        visible={showMeasurePanel}
        onClose={onCloseMeasurePanel}
      />

      {/* Enhanced Bottom Floating Bar with zoom and snap controls */}
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
