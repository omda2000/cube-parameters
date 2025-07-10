
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
  const { scene } = useAppState();
  const sceneState = useSceneState();
  const uiState = useUIState();
  
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
    ...sceneState
  };

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
};

export default UIContainer;
