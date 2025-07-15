
import React from 'react';
import AidToolsBar from '../AidToolsBar/AidToolsBar';
import LeftSidebar from '../LeftSidebar/LeftSidebar';
import OrganizedControlPanel from '../OrganizedControlPanel/OrganizedControlPanel';
import OrganizedMeasurePanel from '../OrganizedMeasurePanel/OrganizedMeasurePanel';
import EnhancedStatusBar from '../EnhancedStatusBar/EnhancedStatusBar';
import AppHeader from '../AppHeader/AppHeader';
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
  onViewIsometric: () => void;
  onGridToggle?: () => void;
  gridEnabled?: boolean;
  isOrthographic?: boolean;
  onCameraToggle?: (orthographic: boolean) => void;
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
  onViewIsometric,
  shadeType,
  onShadeTypeChange,
  modelCount,
  onGridToggle,
  gridEnabled = false,
  isOrthographic = false,
  onCameraToggle
}: UIOverlayProps) => {
  return (
    <>
      {/* App Header with camera toggle */}
      <AppHeader
        isMobile={false}
        mobileSheetOpen={false}
        setMobileSheetOpen={() => {}}
        isOrthographic={isOrthographic}
        onCameraToggle={onCameraToggle}
      >
        <div />
      </AppHeader>

      {/* Aid Tools Bar - centered at top with proper spacing */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40">
        <AidToolsBar
          onToolSelect={onToolSelect}
          activeTool={activeTool}
          onViewFront={onViewFront}
          onViewBack={onViewBack}
          onToggle3DRotate={() => {
            // Toggle between perspective and orthographic camera for 3D rotation mode
            // This can be enhanced based on your specific 3D rotation requirements
            onViewIsometric();
          }}
        />
      </div>

      {/* Left Sidebar - properly positioned to avoid overlaps */}
      <LeftSidebar
        activeTab={activeControlTab}
        onTabChange={onTabChange}
        isPanelOpen={showControlPanel}
      />

      {/* Organized Control Panel - positioned with proper spacing */}
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
        onZoomAll={onZoomAll}
        onZoomToSelected={onZoomToSelected}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onResetView={onResetView}
        onGridToggle={onGridToggle}
      />
    </>
  );
};

export default UIOverlay;
