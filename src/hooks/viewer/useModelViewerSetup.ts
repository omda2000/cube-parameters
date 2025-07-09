
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThreeScene } from '../useThreeScene';
import { useBoxMesh } from '../useBoxMesh';
import { useLighting } from '../useLighting';
import { useEnvironment } from '../useEnvironment';
import { useFBXLoader } from '../useFBXLoader';
import { useDefaultMaterials } from '../useDefaultMaterials';
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

  // Ensure box is properly marked as primitive with a stable effect
  useEffect(() => {
    if (boxRef.current) {
      console.log('ModelViewerSetup: Marking box as primitive');
      boxRef.current.userData.isPrimitive = true;
      boxRef.current.name = objectName || 'Box';
    }
  }, [boxRef, objectName]);

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

  // Apply default materials using the centralized hook
  useDefaultMaterials(sceneRef.current, loadedModels);

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

  // Expose scene to parent when ready
  useEffect(() => {
    if (sceneRef.current && onSceneReady) {
      console.log('ModelViewerSetup: Scene ready, notifying parent');
      onSceneReady(sceneRef.current);
    }
  }, [onSceneReady]);

  // Expose models to parent with stable change detection
  useEffect(() => {
    if (onModelsChange) {
      // Use a small delay to batch updates and prevent rapid firing during model loading
      const timeoutId = setTimeout(() => {
        console.log('ModelViewerSetup: Notifying parent of model changes -', {
          modelsCount: loadedModels.length,
          currentModelId: currentModel?.id || 'none'
        });
        onModelsChange(loadedModels, currentModel);
      }, 100); // Small delay to batch updates

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
