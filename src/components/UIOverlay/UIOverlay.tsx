import React from 'react';
import AidToolsBar from '../AidToolsBar/AidToolsBar';
import ControlPanelTabs from '../ControlPanelTabs/ControlPanelTabs';
import FixedControlPanel from '../FixedControlPanel/FixedControlPanel';
import TabsControlPanel from '../TabsControlPanel/TabsControlPanel';
import MeasureToolsPanel from '../MeasureToolsPanel/MeasureToolsPanel';
import BottomFloatingBar from '../BottomFloatingBar/BottomFloatingBar';
import NotificationBell from '../NotificationBell/NotificationBell';
import { useResponsiveMode } from '../../hooks/useResponsiveMode';
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
  const { isMobile, isTablet } = useResponsiveMode();

  return (
    <>
      {/* Notification bell - top right corner */}
      <div className="fixed top-4 right-4 z-50">
        <NotificationBell />
      </div>

      {/* Aid Tools Bar - responsive positioning */}
      <div className={`fixed z-50 ${isMobile ? 'top-4 left-4 right-16' : 'top-4 left-4'}`}>
        <AidToolsBar
          onToolSelect={onToolSelect}
          activeTool={activeTool}
        />
      </div>

      {/* Control Panel Tabs - always visible but responsive */}
      <div className={`${isMobile ? 'fixed top-16 left-4 z-50' : ''}`}>
        <ControlPanelTabs
          activeTab={activeControlTab}
          onTabChange={onTabChange}
          isPanelOpen={showControlPanel}
        />
      </div>

      {/* Fixed Control Panel - now draggable, no need for responsive positioning classes */}
      <FixedControlPanel
        title="Control Panel"
        isOpen={showControlPanel}
        onClose={onCloseControlPanel}
        className={`${
          isMobile 
            ? 'w-full max-w-none h-[60vh] max-h-none' 
            : isTablet 
              ? 'w-80 h-96'
              : 'w-96 h-[32rem]'
        }`}
      >
        <TabsControlPanel {...controlsPanelProps} />
      </FixedControlPanel>

      {/* Measure Tools Panel - responsive positioning */}
      <div className={`fixed z-40 ${
        isMobile 
          ? 'left-4 right-4 bottom-32'
          : isTablet
            ? 'left-4 bottom-24'
            : 'left-4 bottom-28'
      }`}>
        <MeasureToolsPanel
          measurements={measurements}
          onClearAll={onClearAllMeasurements}
          onRemoveMeasurement={onRemoveMeasurement}
          visible={showMeasurePanel}
          onClose={onCloseMeasurePanel}
          className={isMobile ? 'w-full' : ''}
        />
      </div>

      {/* Bottom Floating Bar - hidden on mobile, responsive on tablet/desktop */}
      {!isMobile && (
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
          className={isTablet ? 'scale-90' : ''}
        />
      )}
    </>
  );
};

export default UIOverlay;
