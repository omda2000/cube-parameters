
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThreeScene } from '../useThreeScene';
import { useBoxMesh } from '../useBoxMesh';
import { useLighting } from '../useLighting';
import { useEnvironment } from '../useEnvironment';
import { useFBXLoader } from '../useFBXLoader';
import type { 
  SunlightSettings, 
  AmbientLightSettings, 
  EnvironmentSettings, 
  LoadedModel,
  BoxDimensions,
  ShadowQuality
} from '../../types/model';

interface UseModelViewerSetupProps {
  dimensions: BoxDimensions;
  boxColor: string;
  objectName: string;
  sunlight: SunlightSettings;
  ambientLight: AmbientLightSettings;
  shadowQuality: ShadowQuality;
  environment: EnvironmentSettings;
  onModelsChange?: (models: LoadedModel[], current: LoadedModel | null) => void;
  onSceneReady?: (scene: THREE.Scene) => void;
  showPrimitives?: boolean;
}

export const useModelViewerSetup = ({
  dimensions,
  boxColor,
  objectName,
  sunlight,
  ambientLight,
  shadowQuality,
  environment,
  onModelsChange,
  onSceneReady,
  showPrimitives = true
}: UseModelViewerSetupProps) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Core Three.js setup
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

  // Box mesh setup
  const { boxRef } = useBoxMesh(
    sceneRef.current,
    dimensions,
    boxColor,
    objectName,
    showPrimitives
  );

  // Mark box as primitive
  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.userData.isPrimitive = true;
    }
  }, [boxRef]);

  // FBX model loading
  const {
    loadedModels,
    currentModel,
    isLoading,
    error,
    loadFBXModel,
    switchToModel,
    removeModel
  } = useFBXLoader(sceneRef.current);

  // Lighting setup
  useLighting(
    sceneRef.current,
    sunlight,
    ambientLight,
    shadowQuality
  );

  // Environment setup
  useEnvironment(
    sceneRef.current,
    environment,
    gridHelperRef.current
  );

  // Expose scene to parent
  useEffect(() => {
    if (sceneRef.current && onSceneReady) {
      onSceneReady(sceneRef.current);
    }
  }, [onSceneReady]);

  // Expose models to parent with proper change detection
  useEffect(() => {
    if (onModelsChange) {
      // Use a timeout to batch updates and prevent rapid firing
      const timeoutId = setTimeout(() => {
        onModelsChange(loadedModels, currentModel);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [loadedModels.length, currentModel?.id, onModelsChange]);

  return {
    mountRef,
    scene: sceneRef.current,
    camera: perspectiveCameraRef.current,
    renderer: rendererRef.current,
    controls: controlsRef.current,
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
  };
};
