
import React, { memo } from 'react';
import ThreeViewer from '../ThreeViewer';
import type { 
  LoadedModel, 
  SunlightSettings, 
  AmbientLightSettings, 
  EnvironmentSettings, 
  ShadowQuality 
} from '../../types/model';
import * as THREE from 'three';

interface ModelViewerContainerProps {
  sunlight: SunlightSettings;
  ambientLight: AmbientLightSettings;
  shadowQuality: ShadowQuality;
  environment: EnvironmentSettings;
  loadedModels: LoadedModel[];
  currentModel: LoadedModel | null;
  onFileUpload: (file: File) => void;
  onModelsChange: (models: LoadedModel[], current: LoadedModel | null) => void;
  onSceneReady?: (scene: THREE.Scene) => void;
  activeTool?: 'select' | 'point' | 'measure';
  onPointCreate?: (point: { x: number; y: number; z: number }) => void;
  onMeasureCreate?: (start: THREE.Vector3, end: THREE.Vector3) => void;
}

const ModelViewerContainer = memo(({
  sunlight,
  ambientLight,
  shadowQuality,
  environment,
  loadedModels,
  currentModel,
  onFileUpload,
  onModelsChange,
  onSceneReady,
  activeTool,
  onPointCreate,
  onMeasureCreate
}: ModelViewerContainerProps) => {
  return (
    <div className="w-full h-full">
      <ThreeViewer 
        sunlight={sunlight}
        ambientLight={ambientLight}
        shadowQuality={shadowQuality}
        environment={environment}
        onFileUpload={onFileUpload}
        onModelsChange={onModelsChange}
        loadedModels={loadedModels}
        currentModel={currentModel}
        onSceneReady={onSceneReady}
        activeTool={activeTool}
        onPointCreate={onPointCreate}
        onMeasureCreate={onMeasureCreate}
      />
    </div>
  );
});

ModelViewerContainer.displayName = 'ModelViewerContainer';

export default ModelViewerContainer;
