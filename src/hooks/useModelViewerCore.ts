
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
  ShadowQuality
} from '../types/model';

interface UseModelViewerCoreProps {
  sunlight: SunlightSettings;
  ambientLight: AmbientLightSettings;
  shadowQuality: ShadowQuality;
  environment: EnvironmentSettings;
  onFileUpload?: (file: File) => void;
  onModelsChange?: (models: LoadedModel[], current: LoadedModel | null) => void;
  onSceneReady?: (scene: THREE.Scene) => void;
  activeTool?: 'select' | 'point' | 'measure';
  onPointCreate?: (point: { x: number; y: number; z: number }) => void;
  onMeasureCreate?: (start: THREE.Vector3, end: THREE.Vector3) => void;
}

export const useModelViewerCore = (props: UseModelViewerCoreProps) => {
  // Core Three.js setup
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
    switchCamera,
    zoomControls
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

  // Effects and interactions
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
    activeTool: props.activeTool,
    onPointCreate: props.onPointCreate,
    onMeasureCreate: props.onMeasureCreate,
    loadedModels: currentModel ? [currentModel] : [],
    loadFBXModel,
    loadGLTFModel,
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
    zoomControls
  };
};
