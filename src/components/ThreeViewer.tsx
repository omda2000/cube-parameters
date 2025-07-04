
import React, { useRef, useEffect, memo, useState } from 'react';
import * as THREE from 'three';
import { useThreeScene } from '../hooks/useThreeScene';
import { useBoxMesh } from '../hooks/useBoxMesh';
import { useMouseInteraction } from '../hooks/useMouseInteraction';
import { useLighting } from '../hooks/useLighting';
import { useEnvironment } from '../hooks/useEnvironment';
import { useFBXLoader } from '../hooks/useFBXLoader';
import { useSelectionEffects } from '../hooks/useSelectionEffects';
import { useZoomControls } from '../hooks/useZoomControls';
import { useViewerKeyboardShortcuts } from '../hooks/useViewerKeyboardShortcuts';
import { useObjectSelection } from '../hooks/useObjectSelection';
import { useCameraExposure } from '../hooks/useCameraExposure';
import { useModelsExposure } from '../hooks/useModelsExposure';
import { useToolHandlersViewer } from '../hooks/useToolHandlersViewer';
import ObjectDataOverlay from './ObjectDataOverlay';
import SelectionOverlay from './SelectionOverlay/SelectionOverlay';
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

const ThreeViewer = memo(({ 
  dimensions, 
  boxColor, 
  objectName, 
  sunlight,
  ambientLight,
  shadowQuality,
  environment,
  onFileUpload,
  onModelsChange,
  onSceneReady,
  showPrimitives = true,
  activeTool = 'select',
  onPointCreate,
  onMeasureCreate
}: ThreeViewerProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [viewerError, setViewerError] = useState<string | null>(null);

  console.log('ThreeViewer: Rendering with props', { 
    dimensions, 
    boxColor, 
    objectName, 
    activeTool 
  });

  // Custom hooks for organized functionality
  const { selectedObject, clearSelection, handleObjectSelect } = useObjectSelection();

  const {
    sceneRef,
    cameraRef,
    perspectiveCameraRef,
    rendererRef,
    labelRendererRef,
    controlsRef,
    gridHelperRef,
    performanceMetrics,
    isOrthographic,
    switchCamera,
    isInitialized,
    initError
  } = useThreeScene(mountRef);

  // Show loading state while initializing
  if (!isInitialized && !initError) {
    return (
      <div className="relative w-full h-full">
        <div ref={mountRef} className="w-full h-full" />
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-white z-10">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p>Initializing 3D viewer...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if initialization failed
  if (initError) {
    return (
      <div className="relative w-full h-full">
        <div ref={mountRef} className="w-full h-full" />
        <div className="absolute inset-0 flex items-center justify-center bg-red-900 text-white z-10">
          <div className="text-center">
            <p className="text-xl mb-2">Failed to initialize 3D viewer</p>
            <p className="text-sm text-red-200">{initError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Error boundary for viewer-specific errors
  try {
    // Expose camera switching and other global handlers
    useCameraExposure(switchCamera);

    // Expose scene to parent components
    useEffect(() => {
      if (sceneRef.current && onSceneReady) {
        console.log('ThreeViewer: Scene ready, calling onSceneReady');
        onSceneReady(sceneRef.current);
      }
    }, [onSceneReady, sceneRef.current]);

    const { boxRef } = useBoxMesh(
      sceneRef.current,
      dimensions,
      boxColor,
      objectName,
      true // Always show the primitive box
    );

    // Mark box as primitive for scene tree
    useEffect(() => {
      if (boxRef.current) {
        boxRef.current.userData.isPrimitive = true;
      }
    }, [boxRef]);

    const {
      loadedModels,
      currentModel,
      isLoading,
      error,
      loadFBXModel,
      switchToModel,
      removeModel
    } = useFBXLoader(sceneRef.current);

    // Expose models and FBX handlers - fix parameter order
    useModelsExposure(
      loadedModels,
      currentModel,
      loadFBXModel,
      switchToModel,
      removeModel,
      onModelsChange
    );

    // Tool handlers
    const { handlePointCreate, handleMeasureCreate } = useToolHandlersViewer(
      onPointCreate,
      onMeasureCreate
    );

    // Use selection effects hook for visual feedback
    useSelectionEffects(selectedObject);

    // Mouse interaction and hover effects - use perspective camera for compatibility
    const { objectData, mousePosition, isHovering } = useMouseInteraction(
      rendererRef.current,
      perspectiveCameraRef.current,
      currentModel ? currentModel.object : boxRef.current,
      sceneRef.current,
      handleObjectSelect,
      activeTool,
      controlsRef.current,
      handlePointCreate,
      handleMeasureCreate
    );

    // Zoom controls hook - use perspective camera ref for compatibility
    const { zoomAll, zoomToSelected, resetView } = useZoomControls(
      sceneRef,
      perspectiveCameraRef,
      controlsRef,
      selectedObject
    );

    // Keyboard shortcuts - use perspective camera ref for compatibility
    useViewerKeyboardShortcuts({
      onClearSelection: clearSelection,
      onZoomAll: zoomAll,
      onZoomToSelected: zoomToSelected,
      selectedObject
    });

    useLighting(
      sceneRef.current,
      sunlight,
      ambientLight,
      shadowQuality
    );

    useEnvironment(
      sceneRef.current,
      environment,
      gridHelperRef.current
    );

    // Debug performance metrics in development
    useEffect(() => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Performance Metrics:', performanceMetrics);
      }
    }, [performanceMetrics]);

    return (
      <div className="relative w-full h-full">
        <div ref={mountRef} className="w-full h-full" />
        <ObjectDataOverlay 
          objectData={objectData}
          mousePosition={mousePosition}
          visible={isHovering}
        />
        <SelectionOverlay selectedObject={selectedObject} />
      </div>
    );

  } catch (error) {
    console.error('Error in ThreeViewer render:', error);
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-900 text-white">
        <div className="text-center">
          <p className="text-xl mb-2">3D Viewer Error</p>
          <p className="text-sm text-red-200">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
});

ThreeViewer.displayName = 'ThreeViewer';

export default ThreeViewer;
