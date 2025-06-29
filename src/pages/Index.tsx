
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { useModelState } from '../hooks/useModelState';
import { useLightingState } from '../hooks/useLightingState';
import { useEnvironmentState } from '../hooks/useEnvironmentState';
import { useShadeType } from '../hooks/useShadeType';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useMeasurements } from '../hooks/useMeasurements';
import { useAppState } from '../hooks/useAppState';
import { useToolHandlers } from '../hooks/useToolHandlers';
import { useFileHandlers } from '../hooks/useFileHandlers';
import { useZoomHandlers } from '../hooks/useZoomHandlers';
import { useControlHandlers } from '../hooks/useControlHandlers';
import ModelViewerContainer from '../components/ModelViewerContainer/ModelViewerContainer';
import MainLayout from '../components/MainLayout/MainLayout';
import UIOverlay from '../components/UIOverlay/UIOverlay';

const Index = () => {
  const { toast } = useToast();
  const modelState = useModelState();
  const lightingState = useLightingState();
  const environmentState = useEnvironmentState();
  const { measurements, addMeasurement, removeMeasurement, clearAllMeasurements } = useMeasurements();
  
  const {
    scene,
    setScene,
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

  const { shadeType, setShadeType } = useShadeType({ current: scene });

  const { handleToolSelect, handlePointCreate, handleMeasureCreate } = useToolHandlers(
    setActiveTool,
    setShowMeasurePanel,
    addMeasurement
  );

  const { 
    handleFileUpload, 
    handleModelsChange, 
    handleModelSelect, 
    handleModelRemove, 
    handlePrimitiveSelect 
  } = useFileHandlers(modelState);

  const { 
    handleZoomAll, 
    handleZoomToSelected, 
    handleZoomIn, 
    handleZoomOut, 
    handleResetView 
  } = useZoomHandlers();

  const { handleTabChange, handleCameraToggle } = useControlHandlers(
    activeControlTab,
    showControlPanel,
    setActiveControlTab,
    setShowControlPanel,
    setIsOrthographic
  );

  useKeyboardShortcuts({
    onToggleControlPanel: () => setShowControlPanel(!showControlPanel),
    onZoomAll: handleZoomAll,
    onZoomToSelected: handleZoomToSelected,
    onResetView: handleResetView
  });

  const controlsPanelProps = {
    loadedModels: modelState.loadedModels,
    currentModel: modelState.currentModel,
    isUploading: modelState.isUploading,
    uploadError: modelState.uploadError,
    onFileUpload: handleFileUpload,
    onModelSelect: handleModelSelect,
    onModelRemove: handleModelRemove,
    onPrimitiveSelect: handlePrimitiveSelect,
    scene: scene,
    activeTab: activeControlTab,
    isOrthographic,
    onCameraToggle: handleCameraToggle,
    ...lightingState,
    ...modelState,
    ...environmentState
  };

  return (
    <MainLayout>
      {/* Full-screen canvas */}
      <div className="absolute inset-0">
        <ModelViewerContainer
          dimensions={modelState.dimensions}
          boxColor={modelState.boxColor}
          objectName={modelState.objectName}
          sunlight={lightingState.sunlight}
          ambientLight={lightingState.ambientLight}
          shadowQuality={lightingState.shadowQuality}
          environment={environmentState.environment}
          loadedModels={modelState.loadedModels}
          currentModel={modelState.currentModel}
          onFileUpload={handleFileUpload}
          onModelsChange={handleModelsChange}
          onSceneReady={setScene}
          activeTool={activeTool}
          onPointCreate={handlePointCreate}
          onMeasureCreate={handleMeasureCreate}
        />
      </div>

      {/* UI Overlay */}
      <UIOverlay
        activeTool={activeTool}
        onToolSelect={handleToolSelect}
        activeControlTab={activeControlTab}
        showControlPanel={showControlPanel}
        onTabChange={handleTabChange}
        onCloseControlPanel={() => setShowControlPanel(false)}
        controlsPanelProps={controlsPanelProps}
        showMeasurePanel={showMeasurePanel}
        onCloseMeasurePanel={() => setShowMeasurePanel(false)}
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
        modelCount={modelState.loadedModels.length + 1}
      />
    </MainLayout>
  );
};

export default Index;
