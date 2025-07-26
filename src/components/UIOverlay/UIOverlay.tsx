
import React from 'react';
import AidToolsBar from '../AidToolsBar/AidToolsBar';
import OrganizedControlPanel from '../OrganizedControlPanel/OrganizedControlPanel';
import OrganizedMeasurePanel from '../OrganizedMeasurePanel/OrganizedMeasurePanel';
import EnhancedStatusBar from '../EnhancedStatusBar/EnhancedStatusBar';
import type { ShadeType } from '../ShadeTypeSelector/ShadeTypeSelector';

interface MeasureData {
  id: string;
  startPoint: { x: number; y: number; z: number };
  endPoint: { x: number; y: number; z: number };
  distance: number;
  label: string;
}

interface UIOverlayProps {
  activeTool: 'select' | 'point' | 'measure';
  onToolSelect: (tool: 'select' | 'point' | 'measure') => void;
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
  onViewFront: () => void;
  onViewBack: () => void;
  onViewLeft: () => void;
  onViewRight: () => void;
  onViewIsometric: () => void;
  onGridToggle?: () => void;
  gridEnabled?: boolean;
  groundPlaneEnabled?: boolean;
  onGroundPlaneToggle?: () => void;
  isOrthographic?: boolean;
  onCameraToggle?: () => void;
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
  onViewFront,
  onViewBack,
  onViewLeft,
  onViewRight,
  onViewIsometric,
  shadeType,
  onShadeTypeChange,
  modelCount,
  onGridToggle,
  gridEnabled = false,
  groundPlaneEnabled = false,
  onGroundPlaneToggle,
  isOrthographic = false,
  onCameraToggle
}: UIOverlayProps) => {
  return (
    <>
      {/* Aid Tools Bar with integrated panel controls */}
      <AidToolsBar
        onToolSelect={onToolSelect}
        activeTool={activeTool}
        onViewFront={onViewFront}
        onViewBack={onViewBack}
        onViewLeft={onViewLeft}
        onViewRight={onViewRight}
        onViewIsometric={onViewIsometric}
        isOrthographic={isOrthographic}
        onCameraToggle={onCameraToggle}
        onZoomAll={onZoomAll}
        onZoomToSelected={onZoomToSelected}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onResetView={onResetView}
        selectedObject={null}
        zoomLevel={100}
        activePanel={activeControlTab}
        onPanelChange={onTabChange}
        isPanelOpen={showControlPanel}
      />

      {/* Organized Control Panel - positioned with proper spacing to avoid ribbon clash */}
      <OrganizedControlPanel
        activeTab={activeControlTab}
        isOpen={showControlPanel}
        onClose={onCloseControlPanel}
        controlsPanelProps={controlsPanelProps}
      />

      {/* Organized Measure Panel - positioned to avoid status bar overlap */}
      <OrganizedMeasurePanel
        measurements={measurements}
        onClearAll={onClearAllMeasurements}
        onRemoveMeasurement={onRemoveMeasurement}
        visible={showMeasurePanel}
        onClose={onCloseMeasurePanel}
      />

      {/* Enhanced Status Bar - improved layout and information */}
      <EnhancedStatusBar
        objectCount={modelCount}
        gridEnabled={gridEnabled}
        gridSpacing="1m"
        units="m"
        cursorPosition={{ x: 0, y: 0 }}
        zoomLevel={100}
        shadeType={shadeType}
        onShadeTypeChange={onShadeTypeChange}
        onGridToggle={onGridToggle}
        groundPlaneEnabled={groundPlaneEnabled}
        onGroundPlaneToggle={onGroundPlaneToggle}
      />
    </>
  );
};

export default UIOverlay;
