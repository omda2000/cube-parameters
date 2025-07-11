
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
  // Core setup with enhanced error handling
  const {
    mountRef,
    scene,
    camera,
    renderer,
    controls,
    currentModel,
    boxRef,
    isLoading,
    error,
    loadFBXModel,
    switchToModel,
    removeModel,
    performanceMetrics,
    isOrthographic,
    switchCamera,
    isFullyInitialized
  } = useModelViewerSetup({
    dimensions: props.dimensions,
    boxColor: props.boxColor,
    objectName: props.objectName,
    sunlight: props.sunlight,
    ambientLight: props.ambientLight,
    shadowQuality: props.shadowQuality,
    environment: props.environment,
    onModelsChange: props.onModelsChange,
    onSceneReady: props.onSceneReady,
    showPrimitives: props.showPrimitives
  });

  // Renderer optimization
  useOptimizedRenderer(renderer);

  // Mobile-optimized mouse interaction - only when fully initialized
  const {
    objectData,
    mousePosition,
    isHovering,
    isMobile
  } = useMobileMouseInteraction(
    isFullyInitialized ? renderer : null,
    isFullyInitialized ? camera : null,
    isFullyInitialized && currentModel ? currentModel.object : (isFullyInitialized ? boxRef.current : null),
    isFullyInitialized ? scene : null,
    undefined,
    props.activeTool,
    isFullyInitialized ? controls : null,
    props.onPointCreate,
    props.onMeasureCreate
  );

  // Effects and interactions - only when fully initialized
  const {
    selectedObjects
  } = useModelViewerEffects({
    renderer: isFullyInitialized ? renderer : null,
    camera: isFullyInitialized ? camera : null,
    scene: isFullyInitialized ? scene : null,
    controls: isFullyInitialized ? controls : null,
    currentModel,
    boxRef,
    activeTool: props.activeTool,
    onPointCreate: props.onPointCreate,
    onMeasureCreate: props.onMeasureCreate,
    loadedModels: currentModel ? [currentModel] : [],
    loadFBXModel,
    switchToModel,
    removeModel,
    onModelsChange: props.onModelsChange,
    switchCamera: isFullyInitialized ? switchCamera : null
  });

  // Debug performance in development
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('ThreeViewer Performance Metrics:', performanceMetrics);
      console.log('Mobile Device:', isMobile);
      console.log('Initialization Status:', {
        scene: !!scene,
        camera: !!camera,
        renderer: !!renderer,
        controls: !!controls,
        switchCamera: !!switchCamera,
        isFullyInitialized
      });
    }
  }, [performanceMetrics, isMobile, scene, camera, renderer, controls, switchCamera, isFullyInitialized]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-500">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Model Viewer Error</h2>
          <p className="mb-2">{error}</p>
          <p className="text-sm text-gray-600 mb-4">
            Debug info: Scene={!!scene}, Camera={!!camera}, Renderer={!!renderer}
          </p>
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

  // Show enhanced loading state with detailed progress
  if (!isFullyInitialized) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold mb-2">Initializing 3D Scene...</p>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Scene: {scene ? '✓ Ready' : '⏳ Loading...'}</p>
            <p>Camera: {camera ? '✓ Ready' : '⏳ Loading...'}</p>
            <p>Renderer: {renderer ? '✓ Ready' : '⏳ Loading...'}</p>
            <p>Controls: {controls ? '✓ Ready' : '⏳ Loading...'}</p>
          </div>
          {isLoading && (
            <p className="text-sm text-blue-600 mt-2">Loading 3D model...</p>
          )}
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
