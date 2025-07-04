
import React from 'react';
import AidToolsBar from '../AidToolsBar/AidToolsBar';
import FixedControlPanel from '../FixedControlPanel/FixedControlPanel';
import TabsControlPanel from '../TabsControlPanel/TabsControlPanel';
import MeasureToolsPanel from '../MeasureToolsPanel/MeasureToolsPanel';
import BottomFloatingBar from '../BottomFloatingBar/BottomFloatingBar';
import NotificationBell from '../NotificationBell/NotificationBell';
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
      {/* Notification bell - top right corner */}
      <div className="fixed top-4 right-4 z-50">
        <NotificationBell />
      </div>

      {/* Aid Tools Bar - centered at top */}
      <AidToolsBar
        onToolSelect={onToolSelect}
        activeTool={activeTool}
      />

      {/* Control Panel with integrated tabs */}
      <FixedControlPanel
        isOpen={showControlPanel}
        onClose={onCloseControlPanel}
        activeTab={activeControlTab}
        onTabChange={onTabChange}
      >
        <TabsControlPanel {...controlsPanelProps} activeTab={activeControlTab} />
      </FixedControlPanel>

      {/* Measure Tools Panel - positioned on the bottom left to avoid overlap */}
      <div className="fixed left-4 bottom-28 z-40">
        <MeasureToolsPanel
          measurements={measurements}
          onClearAll={onClearAllMeasurements}
          onRemoveMeasurement={onRemoveMeasurement}
          visible={showMeasurePanel}
          onClose={onCloseMeasurePanel}
        />
      </div>

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
