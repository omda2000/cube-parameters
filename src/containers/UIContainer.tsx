
import React from 'react';
import UIOverlay from '../components/UIOverlay/UIOverlay';
import { useAppState } from '../hooks/store/useAppState';
import { useSceneState } from '../hooks/store/useSceneState';
import { useUIState } from '../hooks/store/useUIState';
import { useShadeType } from '../hooks/useShadeType';
import { useMeasurements } from '../hooks/useMeasurements';
import { useToolHandlers } from '../hooks/useToolHandlers';
import { useFileHandlers } from '../hooks/useFileHandlers';
import { useZoomHandlers } from '../hooks/useZoomHandlers';
import { useControlHandlers } from '../hooks/useControlHandlers';

const UIContainer = () => {
  console.log('UIContainer: Starting render...');
  
  try {
    const { scene, camera, controls } = useAppState();
    const sceneState = useSceneState();
    const uiState = useUIState();
    
    console.log('UIContainer: Basic state loaded');
    
    const { shadeType, setShadeType } = useShadeType({ current: scene });
    const { measurements, addMeasurement, removeMeasurement, clearAllMeasurements } = useMeasurements();

    const { handleToolSelect, handlePointCreate, handleMeasureCreate } = useToolHandlers(
      uiState.setActiveTool,
      uiState.setShowMeasurePanel,
      addMeasurement
    );

    const { 
      handleFileUpload, 
      handleModelsChange, 
      handleModelSelect, 
      handleModelRemove, 
      handlePrimitiveSelect 
    } = useFileHandlers();

    const { 
      handleZoomAll, 
      handleZoomToSelected, 
      handleZoomIn, 
      handleZoomOut, 
      handleResetView 
    } = useZoomHandlers();

    const { handleTabChange, handleCameraToggle } = useControlHandlers();

    console.log('UIContainer: All hooks loaded, preparing props...');

    const controlsPanelProps = {
      loadedModels: sceneState.loadedModels,
      currentModel: sceneState.currentModel,
      isUploading: sceneState.isUploading,
      uploadError: sceneState.uploadError,
      onFileUpload: handleFileUpload,
      onModelSelect: handleModelSelect,
      onModelRemove: handleModelRemove,
      onPrimitiveSelect: handlePrimitiveSelect,
      scene: scene,
      activeTab: uiState.activeControlTab,
      isOrthographic: uiState.isOrthographic,
      onCameraToggle: handleCameraToggle,
      camera: camera,
      controls: controls,
      ...sceneState
    };

    console.log('UIContainer: About to render UIOverlay...');

    return (
      <UIOverlay
        activeTool={uiState.activeTool}
        onToolSelect={handleToolSelect}
        activeControlTab={uiState.activeControlTab}
        showControlPanel={uiState.showControlPanel}
        onTabChange={handleTabChange}
        onCloseControlPanel={() => uiState.setShowControlPanel(false)}
        controlsPanelProps={controlsPanelProps}
        showMeasurePanel={uiState.showMeasurePanel}
        onCloseMeasurePanel={() => uiState.setShowMeasurePanel(false)}
        measurements={measurements}
        onClearAllMeasurements={clearAllMeasurements}
        onRemoveMeasurement={removeMeasurement}
        onZoomAll={handleZoomAll}
        onZoomToSelected={handleZoomToSelected}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        shadeType={shadeType}
        onShadeTypeChange={setShadeType}
        modelCount={sceneState.loadedModels.length + 1}
      />
    );
  } catch (error) {
    console.error('UIContainer error:', error);
    return (
      <div className="fixed top-4 left-4 bg-red-500 text-white p-4 rounded z-50">
        <h3>UI Container Error</h3>
        <p>{error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
};

export default UIContainer;
