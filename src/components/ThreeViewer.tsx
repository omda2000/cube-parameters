
import React, { memo } from 'react';
import { useModelViewerCore } from '../hooks/useModelViewerCore';
import ModelViewerOverlays from './ModelViewer/ModelViewerOverlays';
import type { 
  SunlightSettings, 
  AmbientLightSettings, 
  EnvironmentSettings, 
  LoadedModel,
  BoxDimensions,
  ShadowQuality
} from '../types/model';

interface ThreeViewerProps {
  dimensions: BoxDimensions;
  boxColor: string;
  objectName: string;
  sunlight: SunlightSettings;
  ambientLight: AmbientLightSettings;
  shadowQuality: ShadowQuality;
  environment: EnvironmentSettings;
  onFileUpload?: (file: File) => void;
  onModelsChange?: (models: LoadedModel[], current: LoadedModel | null) => void;
  onSceneReady?: (scene: THREE.Scene) => void;
  showPrimitives?: boolean;
  activeTool?: 'select' | 'point' | 'measure' | 'move';
  onPointCreate?: (point: { x: number; y: number; z: number }) => void;
  onMeasureCreate?: (start: THREE.Vector3, end: THREE.Vector3) => void;
}

const ThreeViewer = memo((props: ThreeViewerProps) => {
  const {
    mountRef,
    objectData,
    mousePosition,
    isHovering,
    selectedObjects,
    isLoading,
    error
  } = useModelViewerCore(props);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-500">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Model Viewer Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="w-full h-full" />
      <ModelViewerOverlays
        objectData={objectData}
        mousePosition={mousePosition}
        isHovering={isHovering}
        selectedObjects={selectedObjects}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white">Loading 3D model...</div>
        </div>
      )}
    </div>
  );
});

ThreeViewer.displayName = 'ThreeViewer';

export default ThreeViewer;
