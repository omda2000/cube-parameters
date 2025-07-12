
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
  // ALWAYS call all hooks in the same order - no conditional hooks
  
  // Core setup - always called first
  const setupResult = useModelViewerSetup({
    sunlight: props.sunlight,
    ambientLight: props.ambientLight,
    shadowQuality: props.shadowQuality,
    environment: props.environment,
    onModelsChange: props.onModelsChange,
    onSceneReady: props.onSceneReady
  });

  // Extract values from setup result with safe defaults
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
  } = setupResult || {};

  // Renderer optimization - always called
  useOptimizedRenderer(renderer);

  // Mobile mouse interaction - always called with safe defaults
  const mobileInteractionResult = useMobileMouseInteraction(
    renderer || null,
    camera || null,
    currentModel ? currentModel.object : null,
    scene || null,
    undefined, // onObjectSelect handled in effects
    props.activeTool || 'select',
    controls || null,
    props.onPointCreate,
    props.onMeasureCreate
  );

  // Extract values with safe defaults
  const {
    objectData,
    mousePosition,
    isHovering,
    isMobile
  } = mobileInteractionResult || {
    objectData: null,
    mousePosition: { x: 0, y: 0 },
    isHovering: false,
    isMobile: false
  };

  // Effects and interactions - always called with safe defaults
  const effectsResult = useModelViewerEffects({
    renderer: renderer || null,
    camera: camera || null,
    scene: scene || null,
    controls: controls || null,
    currentModel: currentModel || null,
    activeTool: props.activeTool || 'select',
    onPointCreate: props.onPointCreate,
    onMeasureCreate: props.onMeasureCreate,
    loadedModels: props.loadedModels || [],
    loadFBXModel: loadFBXModel || (() => Promise.resolve()),
    loadGLTFModel: loadGLTFModel || (() => Promise.resolve()),
    switchToModel: switchToModel || (() => {}),
    removeModel: removeModel || (() => {}),
    onModelsChange: props.onModelsChange,
    switchCamera: switchCamera || (() => {})
  });

  // Extract selected objects with safe default
  const { selectedObjects } = effectsResult || { selectedObjects: [] };

  // Debug performance in development - always called
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development' && performanceMetrics) {
      console.log('ThreeViewer Performance Metrics:', performanceMetrics);
      console.log('Mobile Device:', isMobile);
    }
  }, [performanceMetrics, isMobile]);

  // Early return after all hooks are called
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
