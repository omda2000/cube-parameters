
import { useRef } from 'react';
import * as THREE from 'three';
import { useModelViewerSetup } from './viewer/useModelViewerSetup';
import { useModelViewerEffects } from './viewer/useModelViewerEffects';
import type { 
  SunlightSettings, 
  AmbientLightSettings, 
  EnvironmentSettings, 
  LoadedModel,
  BoxDimensions,
  ShadowQuality
} from '../types/model';

interface UseModelViewerCoreProps {
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

export const useModelViewerCore = ({ 
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
}: UseModelViewerCoreProps) => {
  // Setup phase - initialize Three.js scene and core components
  const setupData = useModelViewerSetup({
    dimensions,
    boxColor,
    objectName,
    showPrimitives,
    onModelsChange,
    onPointCreate,
    onMeasureCreate
  });

  const {
    mountRef,
    boxRef,
    sceneRef,
    perspectiveCameraRef,
    rendererRef,
    labelRendererRef,
    controlsRef,
    gridHelperRef,
    performanceMetrics,
    isOrthographic,
    switchCamera,
    loadedModels,
    currentModel,
    isLoading,
    error,
    selectedObjects,
    handleObjectSelect,
    handlePointCreate,
    handleMeasureCreate
  } = setupData;

  // Effects phase - apply lighting, environment, selection, and mouse interaction
  const { objectData, mousePosition, isHovering } = useModelViewerEffects({
    sceneRef,
    rendererRef,
    perspectiveCameraRef,
    controlsRef,
    gridHelperRef,
    boxRef,
    currentModel,
    selectedObjects,
    sunlight,
    ambientLight,
    shadowQuality,
    environment,
    performanceMetrics,
    activeTool,
    handleObjectSelect,
    handlePointCreate,
    handleMeasureCreate,
    onSceneReady
  });

  return {
    mountRef,
    objectData,
    mousePosition,
    isHovering,
    selectedObjects,
    isLoading,
    error
  };
};
