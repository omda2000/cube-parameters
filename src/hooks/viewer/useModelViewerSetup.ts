
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThreeScene } from '../useThreeScene';
import { useLighting } from '../useLighting';
import { useEnvironment } from '../useEnvironment';
import { useFBXLoader } from '../useFBXLoader';
import { useGLTFLoader } from '../useGLTFLoader';
import { useZoomControls } from '../useZoomControls';
import { useSelectionContext } from '../../contexts/SelectionContext';
import type { 
  SunlightSettings, 
  AmbientLightSettings, 
  EnvironmentSettings, 
  LoadedModel,
  ShadowQuality
} from '../../types/model';

interface UseModelViewerSetupProps {
  sunlight: SunlightSettings;
  ambientLight: AmbientLightSettings;
  shadowQuality: ShadowQuality;
  environment: EnvironmentSettings;
  onModelsChange?: (models: LoadedModel[], current: LoadedModel | null) => void;
  onSceneReady?: (scene: THREE.Scene) => void;
}

export const useModelViewerSetup = ({
  sunlight,
  ambientLight,
  shadowQuality,
  environment,
  onModelsChange,
  onSceneReady
}: UseModelViewerSetupProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { selectedObject } = useSelectionContext();

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

  // FBX model loading
  const {
    loadedModels: fbxModels,
    currentModel: fbxCurrentModel,
    isLoading: fbxLoading,
    error: fbxError,
    loadFBXModel,
    switchToModel: fbxSwitchToModel,
    removeModel: fbxRemoveModel
  } = useFBXLoader(sceneRef.current);

  // GLTF model loading
  const {
    loadedModels: gltfModels,
    currentModel: gltfCurrentModel,
    isLoading: gltfLoading,
    error: gltfError,
    loadGLTFModel,
    switchToModel: gltfSwitchToModel,
    removeModel: gltfRemoveModel
  } = useGLTFLoader(sceneRef.current);

  // Combine models from both loaders
  const loadedModels = [...fbxModels, ...gltfModels];
  const currentModel = fbxCurrentModel || gltfCurrentModel;
  const isLoading = fbxLoading || gltfLoading;
  const error = fbxError || gltfError;

  // Unified model switching
  const switchToModel = (modelId: string) => {
    const fbxModel = fbxModels.find(m => m.id === modelId);
    const gltfModel = gltfModels.find(m => m.id === modelId);
    
    if (fbxModel) {
      fbxSwitchToModel(modelId);
    } else if (gltfModel) {
      gltfSwitchToModel(modelId);
    }
  };

  // Unified model removal
  const removeModel = (modelId: string) => {
    const fbxModel = fbxModels.find(m => m.id === modelId);
    const gltfModel = gltfModels.find(m => m.id === modelId);
    
    if (fbxModel) {
      fbxRemoveModel(modelId);
    } else if (gltfModel) {
      gltfRemoveModel(modelId);
    }
  };

  // Zoom controls integration
  const zoomControls = useZoomControls(
    sceneRef,
    perspectiveCameraRef,
    controlsRef,
    selectedObject,
    rendererRef
  );

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
  };
};
