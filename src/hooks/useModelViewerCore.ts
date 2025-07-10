
import { useRef } from 'react';
import { useModelViewerSetup } from './viewer/useModelViewerSetup';
import { useModelViewerEffects } from './viewer/useModelViewerEffects';
import { useOptimizedRenderer } from './viewer/useOptimizedRenderer';
import * as THREE from 'three';
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

export const useModelViewerCore = (props: UseModelViewerCoreProps) => {
  // Core Three.js setup with direct FBX loading
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
    switchCamera
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

  console.log('useModelViewerCore: Setup returned:', {
    camera: camera ? 'Available' : 'Null',
    controls: controls ? 'Available' : 'Null',
    scene: scene ? 'Available' : 'Null'
  });

  // Renderer optimization
  useOptimizedRenderer(renderer);

  // Effects and interactions with direct model handler access
  const {
    objectData,
    mousePosition,
    isHovering,
    selectedObjects
  } = useModelViewerEffects({
    renderer,
    camera,
    scene,
    controls,
    currentModel,
    boxRef,
    activeTool: props.activeTool,
    onPointCreate: props.onPointCreate,
    onMeasureCreate: props.onMeasureCreate,
    loadedModels: currentModel ? [currentModel] : [],
    loadFBXModel, // Direct access to FBX loader
    switchToModel,
    removeModel,
    onModelsChange: props.onModelsChange,
    switchCamera
  });

  return {
    mountRef,
    objectData,
    mousePosition,
    isHovering,
    selectedObjects,
    isLoading,
    error,
    performanceMetrics,
    // Expose camera and controls for TouchGestureHandler
    camera,
    controls,
    // Expose the FBX handlers directly for UI components
    loadFBXModel,
    switchToModel,
    removeModel
  };
};
