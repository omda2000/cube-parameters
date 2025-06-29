
import React from 'react';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useMeasurements } from '../hooks/useMeasurements';
import { useAppState } from '../hooks/useAppState';
import { useToolHandlers } from '../hooks/useToolHandlers';
import { useZoomHandlers } from '../hooks/useZoomHandlers';
import ModelViewerContainer from '../components/ModelViewerContainer/ModelViewerContainer';
import UIOverlay from '../components/UIOverlay/UIOverlay';
import MainLayout from '../components/MainLayout/MainLayout';

const Index = () => {
  const { 
    showControlPanel, 
    setShowControlPanel,
    showMeasurePanel,
    setShowMeasurePanel,
    activeControlTab,
    setActiveControlTab,
    activeTool,
    setActiveTool,
    isOrthographic,
    setIsOrthographic
  } = useAppState();

  const { measurements, addMeasurement, removeMeasurement, clearAllMeasurements } = useMeasurements();
  
  const { 
    handleZoomAll, 
    handleZoomToSelected, 
    handleResetView 
  } = useZoomHandlers();

  const { handlePointCreate, handleMeasureCreate } = useToolHandlers(
    setActiveTool,
    setShowMeasurePanel,
    addMeasurement
  );

  useKeyboardShortcuts({
    onToggleControlPanel: () => setShowControlPanel(true),
    onZoomAll: handleZoomAll,
    onZoomToSelected: handleZoomToSelected,
    onResetView: handleResetView
  });

  return (
    <MainLayout>
      {/* Full-screen canvas */}
      <div className="absolute inset-0">
        <ModelViewerContainer
          activeTool={activeTool}
          onPointCreate={handlePointCreate}
          onMeasureCreate={handleMeasureCreate}
        />
      </div>

      {/* UI Overlay */}
      <UIOverlay
        activeTool={activeTool}
        onToolSelect={setActiveTool}
        activeControlTab={activeControlTab}
        showControlPanel={showControlPanel}
        onTabChange={setActiveControlTab}
        onCloseControlPanel={() => setShowControlPanel(false)}
        showMeasurePanel={showMeasurePanel}
        onCloseMeasurePanel={() => setShowMeasurePanel(false)}
        measurements={measurements}
        onClearAllMeasurements={clearAllMeasurements}
        onRemoveMeasurement={removeMeasurement}
        onZoomAll={handleZoomAll}
        onZoomToSelected={handleZoomToSelected}
        onZoomIn={() => {}}
        onZoomOut={() => {}}
        onResetView={handleResetView}
        shadeType="solid"
        onShadeTypeChange={() => {}}
        modelCount={1}
        controlsPanelProps={{
          loadedModels: [],
          currentModel: null,
          isUploading: false,
          uploadError: null,
          onFileUpload: () => {},
          onModelSelect: () => {},
          onModelRemove: () => {},
          onPrimitiveSelect: () => {},
          scene: null,
          activeTab: activeControlTab,
          isOrthographic: isOrthographic,
          onCameraToggle: () => setIsOrthographic(!isOrthographic),
          dimensions: { length: 2, width: 2, height: 2 },
          boxColor: '#00ff00',
          objectName: 'Box',
          sunlight: { intensity: 1, color: '#ffffff', position: { x: 1, y: 1, z: 1 } },
          ambientLight: { intensity: 0.5, color: '#ffffff' },
          shadowQuality: 'medium' as const,
          environment: { preset: 'sunset', showGrid: true, backgroundColor: '#87CEEB' },
          loadedModels: [],
          currentModel: null,
          isUploading: false,
          uploadError: null,
          setDimensions: () => {},
          setBoxColor: () => {},
          setObjectName: () => {},
          setSunlight: () => {},
          setAmbientLight: () => {},
          setShadowQuality: () => {},
          setEnvironment: () => {},
          setLoadedModels: () => {},
          setCurrentModel: () => {},
          setUploading: () => {},
          setUploadError: () => {}
        }}
      />
    </MainLayout>
  );
};

export default Index;
