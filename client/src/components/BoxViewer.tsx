
import React, { Suspense, lazy, memo } from 'react';

const ThreeViewer = lazy(() => import('./ThreeViewer'));
import type { 
  SunlightSettings, 
  AmbientLightSettings, 
  EnvironmentSettings, 
  LoadedModel 
} from '../types/model';
import * as THREE from 'three';

interface BoxViewerProps {
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  boxColor: string;
  objectName: string;
  sunlight: SunlightSettings;
  ambientLight: AmbientLightSettings;
  shadowQuality: 'low' | 'medium' | 'high';
  environment: EnvironmentSettings;
  onFileUpload?: (file: File) => void;
  onModelsChange?: (models: LoadedModel[], current: LoadedModel | null) => void;
  loadedModels?: LoadedModel[];
  currentModel?: LoadedModel | null;
  showPrimitives?: boolean;
  onSceneReady?: (scene: THREE.Scene) => void;
  activeTool?: 'select' | 'point' | 'measure' | 'move';
  onPointCreate?: (point: { x: number; y: number; z: number }) => void;
  onMeasureCreate?: (start: THREE.Vector3, end: THREE.Vector3) => void;
}

const BoxViewer = memo(({
  dimensions,
  boxColor,
  objectName,
  sunlight,
  ambientLight,
  shadowQuality,
  environment,
  onFileUpload,
  onModelsChange,
  loadedModels,
  currentModel,
  showPrimitives,
  onSceneReady,
  activeTool,
  onPointCreate,
  onMeasureCreate
}: BoxViewerProps) => {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <ThreeViewer
        dimensions={dimensions}
        boxColor={boxColor}
        objectName={objectName}
        sunlight={sunlight}
        ambientLight={ambientLight}
        shadowQuality={shadowQuality}
        environment={environment}
        onFileUpload={onFileUpload}
        onModelsChange={onModelsChange}
        showPrimitives={showPrimitives}
        onSceneReady={onSceneReady}
        activeTool={activeTool}
        onPointCreate={onPointCreate}
        onMeasureCreate={onMeasureCreate}
      />
    </Suspense>
  );
});

BoxViewer.displayName = 'BoxViewer';

export default BoxViewer;
