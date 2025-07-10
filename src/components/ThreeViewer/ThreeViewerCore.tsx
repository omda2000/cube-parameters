
import React from 'react';
import { useModelViewerCore } from '../../hooks/useModelViewerCore';
import TouchGestureHandler from '../TouchGestureHandler/TouchGestureHandler';
import * as THREE from 'three';
import type { 
  SunlightSettings, 
  AmbientLightSettings, 
  EnvironmentSettings, 
  LoadedModel,
  BoxDimensions,
  ShadowQuality
} from '../../types/model';

interface ThreeViewerCoreProps {
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
  onDoubleTap?: () => void;
  onPinchZoom?: (scale: number) => void;
  onThreeFingerTap?: () => void;
  camera: THREE.Camera | null;
  controls: any;
}

const ThreeViewerCore = (props: ThreeViewerCoreProps) => {
  const {
    mountRef,
    objectData,
    mousePosition,
    isHovering,
    selectedObjects,
    isLoading,
    error,
    performanceMetrics,
    camera: actualCamera,
    controls: actualControls
  } = useModelViewerCore(props);

  console.log('ThreeViewerCore: Camera and controls from useModelViewerCore:', {
    camera: actualCamera ? 'Available' : 'Null',
    controls: actualControls ? 'Available' : 'Null'
  });

  // Debug performance in development
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('ThreeViewer Performance Metrics:', performanceMetrics);
    }
  }, [performanceMetrics]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-500">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Model Viewer Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <TouchGestureHandler
        camera={actualCamera}
        controls={actualControls}
        onDoubleTap={props.onDoubleTap}
        onPinchZoom={props.onPinchZoom}
        onThreeFingerTap={props.onThreeFingerTap}
      >
        <div ref={mountRef} className="w-full h-full" />
      </TouchGestureHandler>
      
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white flex items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            Loading 3D model...
          </div>
        </div>
      )}
    </>
  );
};

export default ThreeViewerCore;
