
import React from 'react';
import ModelViewerContainer from '../components/ModelViewerContainer/ModelViewerContainer';
import { useAppState } from '../hooks/store/useAppState';
import { useSceneState } from '../hooks/store/useSceneState';
import { useUIState } from '../hooks/store/useUIState';
import { useToolHandlers } from '../hooks/useToolHandlers';
import { useFileHandlers } from '../hooks/useFileHandlers';
import * as THREE from 'three';

interface ModelViewerContainerWrapperProps {
  onPointCreate?: (point: { x: number; y: number; z: number }) => void;
  onMeasureCreate?: (start: THREE.Vector3, end: THREE.Vector3) => void;
}

const ModelViewerContainerWrapper = ({ 
  onPointCreate, 
  onMeasureCreate 
}: ModelViewerContainerWrapperProps) => {
  const { setScene } = useAppState();
  const sceneState = useSceneState();
  const { activeTool } = useUIState();

  const { handleFileUpload, handleModelsChange } = useFileHandlers({
    setLoadedModels: sceneState.setLoadedModels,
    setCurrentModel: sceneState.setCurrentModel,
    setUploading: sceneState.setUploading,
    setUploadError: sceneState.setUploadError,
    loadedModels: sceneState.loadedModels
  });

  return (
    <ModelViewerContainer
      dimensions={sceneState.dimensions}
      boxColor={sceneState.boxColor}
      objectName={sceneState.objectName}
      sunlight={sceneState.sunlight}
      ambientLight={sceneState.ambientLight}
      shadowQuality={sceneState.shadowQuality}
      environment={sceneState.environment}
      loadedModels={sceneState.loadedModels}
      currentModel={sceneState.currentModel}
      onFileUpload={handleFileUpload}
      onModelsChange={handleModelsChange}
      onSceneReady={setScene}
      activeTool={activeTool}
      onPointCreate={onPointCreate}
      onMeasureCreate={onMeasureCreate}
    />
  );
};

export default ModelViewerContainerWrapper;
