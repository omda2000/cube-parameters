
import React, { useRef, useEffect, memo } from 'react';
import * as THREE from 'three';
import { useThreeScene } from '../../hooks/useThreeScene';
import { useBoxMesh } from '../../hooks/useBoxMesh';
import { useMouseInteraction } from '../../hooks/useMouseInteraction';
import { useLighting } from '../../hooks/useLighting';
import { useEnvironment } from '../../hooks/useEnvironment';
import { useFBXLoader } from '../../hooks/useFBXLoader';
import { useSelectionEffects } from '../../hooks/useSelectionEffects';
import { useObjectSelection } from '../../hooks/useObjectSelection';
import { useCameraExposure } from '../../hooks/useCameraExposure';
import { useModelsExposure } from '../../hooks/useModelsExposure';
import { useToolHandlersViewer } from '../../hooks/useToolHandlersViewer';
import type { 
  SunlightSettings, 
  AmbientLightSettings, 
  EnvironmentSettings, 
  LoadedModel,
  BoxDimensions,
  ShadowQuality
} from '../../types/model';

interface ModelViewerCoreProps {
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

const ModelViewerCore = memo(({ 
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
}: ModelViewerCoreProps) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Custom hooks for organized functionality
  const { selectedObjects, clearSelection, handleObjectSelect } = useObjectSelection();

  const {
    sceneRef,
    perspectiveCameraRef,
    rendererRef,
    labelRendererRef,
    controlsRef,
    gridHelperRef,
    performanceMetrics,
    isOrthographic,
    switchCamera
  } = useThreeScene(mountRef);

  // Expose camera switching
  useCameraExposure(switchCamera);

  // Expose scene to parent components
  useEffect(() => {
    if (sceneRef.current && onSceneReady) {
      onSceneReady(sceneRef.current);
    }
  }, [onSceneReady]);

  const { boxRef } = useBoxMesh(
    sceneRef.current,
    dimensions,
    boxColor,
    objectName,
    showPrimitives
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

  // Expose models and FBX handlers
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
  useSelectionEffects(selectedObjects);

  // Mouse interaction and hover effects
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

  return {
    mountRef,
    objectData,
    mousePosition,
    isHovering,
    selectedObjects,
    isLoading,
    error
  };
});

ModelViewerCore.displayName = 'ModelViewerCore';

export default ModelViewerCore;
