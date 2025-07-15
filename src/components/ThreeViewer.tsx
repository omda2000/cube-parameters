
import React, { memo } from 'react';
import { useModelViewerSetup } from '../hooks/viewer/useModelViewerSetup';
import { useModelViewerEffects } from '../hooks/viewer/useModelViewerEffects';
import { useOptimizedRenderer } from '../hooks/viewer/useOptimizedRenderer';
import { useMobileMouseInteraction } from '../hooks/mouse/useMobileMouseInteraction';
import ModelViewerOverlays from './ModelViewer/ModelViewerOverlays';
import * as THREE from 'three';
import type { 
  SunlightSettings, 
  AmbientLightSettings, 
  EnvironmentSettings, 
  LoadedModel,
  ShadowQuality
} from '../types/model';

interface ThreeViewerProps {
  sunlight: SunlightSettings;
  ambientLight: AmbientLightSettings;
  shadowQuality: ShadowQuality;
  environment: EnvironmentSettings;
  loadedModels: LoadedModel[];
  currentModel: LoadedModel | null;
  onFileUpload?: (file: File) => void;
  onModelsChange?: (models: LoadedModel[], current: LoadedModel | null) => void;
  onSceneReady?: (scene: THREE.Scene) => void;
  activeTool?: 'select' | 'point' | 'measure';
  onPointCreate?: (point: { x: number; y: number; z: number }) => void;
  onMeasureCreate?: (start: THREE.Vector3, end: THREE.Vector3) => void;
}

const ThreeViewer = memo((props: ThreeViewerProps) => {
  // Core setup
  const {
    mountRef,
    scene,
    camera,
    renderer,
    controls,
    currentModel,
    isLoading,
    error,
    loadFBXModel,
    loadGLTFModel,
    switchToModel,
    removeModel,
    performanceMetrics,
    isOrthographic,
    switchCamera
  } = useModelViewerSetup({
    sunlight: props.sunlight,
    ambientLight: props.ambientLight,
    shadowQuality: props.shadowQuality,
    environment: props.environment,
    onModelsChange: props.onModelsChange,
    onSceneReady: props.onSceneReady
  });

  // Renderer optimization
  useOptimizedRenderer(renderer);

  // Mobile-optimized mouse interaction
  const {
    objectData,
    mousePosition,
    isHovering,
    isMobile
  } = useMobileMouseInteraction(
    renderer,
    camera,
    currentModel ? currentModel.object : null,
    scene,
    undefined, // onObjectSelect handled in effects
    props.activeTool,
    controls,
    props.onPointCreate,
    props.onMeasureCreate
  );

  // Effects and interactions
  const {
    selectedObjects
  } = useModelViewerEffects({
    renderer,
    camera,
    scene,
    controls,
    currentModel,
    activeTool: props.activeTool,
    onPointCreate: props.onPointCreate,
    onMeasureCreate: props.onMeasureCreate,
    loadedModels: props.loadedModels,
    loadFBXModel,
    loadGLTFModel,
    switchToModel,
    removeModel,
    onModelsChange: props.onModelsChange,
    switchCamera
  });

  // Debug performance in development
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('ThreeViewer Performance Metrics:', performanceMetrics);
      console.log('Mobile Device:', isMobile);
    }
  }, [performanceMetrics, isMobile]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-500">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Model Viewer Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 min-h-[44px] min-w-[44px]"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mountRef} 
        className="w-full h-full"
        style={{
          touchAction: 'none',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none'
        }}
      />
      <ModelViewerOverlays
        objectData={objectData}
        mousePosition={mousePosition}
        isHovering={isHovering}
        selectedObjects={selectedObjects}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white flex items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            Loading 3D model...
          </div>
        </div>
      )}
      {isMobile && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded pointer-events-none">
          Touch: Rotate • Pinch: Zoom • Double-tap: Fit • 3-finger: Reset
        </div>
      )}
    </div>
  );
});

ThreeViewer.displayName = 'ThreeViewer';

export default ThreeViewer;
