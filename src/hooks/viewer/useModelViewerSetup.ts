import { useRef, useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ResourceManager } from '../utils/ResourceManager';
import { useThreeScene } from '../useThreeScene';
import type { 
  SunlightSettings, 
  AmbientLightSettings, 
  EnvironmentSettings, 
  LoadedModel,
  BoxDimensions,
  ShadowQuality
} from '../../types/model';

interface UseModelViewerSetupOptions {
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
  showPrimitives
}: UseModelViewerSetupOptions) => {
  const [loadedModels, setLoadedModels] = useState<LoadedModel[]>([]);
  const [currentModel, setCurrentModel] = useState<LoadedModel | null>(null);
  const boxRef = useRef<THREE.Mesh | null>(null);
  const [loadingState, setLoadingState] = useState({ isLoading: false, error: null });

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
    mountCallback,
    isFullyInitialized
  } = useThreeScene();

  const updateLighting = useCallback(() => {
    if (!sceneRef.current) return;

    // Remove existing lights
    const lightsToRemove = sceneRef.current.children.filter(child => child.type === 'DirectionalLight' || child.type === 'AmbientLight');
    lightsToRemove.forEach(light => sceneRef.current?.remove(light));

    // Sunlight
    if (sunlight.enabled) {
      const directionalLight = new THREE.DirectionalLight(sunlight.color, sunlight.intensity);
      directionalLight.position.set(sunlight.x, sunlight.y, sunlight.z);
      directionalLight.castShadow = true;

      // Adjust shadow properties based on quality
      switch (shadowQuality) {
        case 'low':
          directionalLight.shadow.mapSize.width = 512;
          directionalLight.shadow.mapSize.height = 512;
          break;
        case 'medium':
          directionalLight.shadow.mapSize.width = 1024;
          directionalLight.shadow.mapSize.height = 1024;
          break;
        case 'high':
          directionalLight.shadow.mapSize.width = 2048;
          directionalLight.shadow.mapSize.height = 2048;
          break;
      }

      directionalLight.shadow.camera.near = 0.1;
      directionalLight.shadow.camera.far = 100;
      directionalLight.shadow.camera.left = -5;
      directionalLight.shadow.camera.bottom = -5;
      directionalLight.shadow.camera.right = 5;
      directionalLight.shadow.camera.top = 5;
      sceneRef.current.add(directionalLight);
    }

    // Ambient light
    if (ambientLight.enabled) {
      const ambientLightInstance = new THREE.AmbientLight(ambientLight.color, ambientLight.intensity);
      sceneRef.current.add(ambientLightInstance);
    }
  }, [sceneRef, sunlight, ambientLight, shadowQuality]);

  const updateEnvironment = useCallback(() => {
    if (!sceneRef.current || !rendererRef.current) return;

    if (environment.enabled && environment.texture) {
      new THREE.TextureLoader().load(environment.texture, (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.colorSpace = THREE.SRGBColorSpace;
        sceneRef.current!.environment = texture;
        sceneRef.current!.background = texture;
      }, undefined, (error) => {
        console.error('Failed to load environment texture:', error);
      });
    } else {
      sceneRef.current.environment = null;
      sceneRef.current.background = null;
    }
  }, [sceneRef, rendererRef, environment]);

  const createBox = useCallback(() => {
    if (!sceneRef.current) return;

    // Remove existing box if it exists
    if (boxRef.current) {
      sceneRef.current.remove(boxRef.current);
      boxRef.current = null;
    }

    const geometry = new THREE.BoxGeometry(dimensions.length, dimensions.height, dimensions.width);
    const material = new THREE.MeshStandardMaterial({ color: boxColor, metalness: 0.1, roughness: 0.7 });
    const box = new THREE.Mesh(geometry, material);
    box.castShadow = true;
    box.receiveShadow = true;
    box.name = objectName;
    sceneRef.current.add(box);
    boxRef.current = box;

    // Initial model setup
    setLoadedModels([{ name: objectName, object: box }]);
    setCurrentModel({ name: objectName, object: box });
  }, [sceneRef, dimensions, boxColor, objectName]);

  const loadFBXModel = useCallback((file: File) => {
    if (!sceneRef.current || !rendererRef.current) return;

    setLoadingState({ isLoading: true, error: null });

    const fileURL = URL.createObjectURL(file);
    const fbxLoader = new FBXLoader();

    fbxLoader.load(
      fileURL,
      (object) => {
        object.name = file.name;
        object.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        sceneRef.current?.add(object);
        const newModel: LoadedModel = { name: file.name, object };

        setLoadedModels(prevModels => {
          const updatedModels = [...prevModels, newModel];
          onModelsChange?.(updatedModels, newModel);
          return updatedModels;
        });
        setCurrentModel(newModel);
        setLoadingState({ isLoading: false, error: null });
      },
      (xhr) => {
        //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (error) => {
        console.error('An error happened', error);
        setLoadingState({ isLoading: false, error: 'Failed to load model.' });
      }
    );
  }, [sceneRef, rendererRef, onModelsChange]);

  const switchToModel = useCallback((modelName: string) => {
    const model = loadedModels.find(model => model.name === modelName);
    if (model) {
      setCurrentModel(model);
    }
  }, [loadedModels]);

  const removeModel = useCallback((modelName: string) => {
    if (!sceneRef.current) return;

    const modelToRemove = loadedModels.find(model => model.name === modelName);
    if (modelToRemove && modelToRemove.object) {
      sceneRef.current.remove(modelToRemove.object);
      setLoadedModels(prevModels => {
        const updatedModels = prevModels.filter(model => model.name !== modelName);
        onModelsChange?.(updatedModels, updatedModels.length > 0 ? updatedModels[0] : null);
        return updatedModels;
      });
      setCurrentModel(null);
    }
  }, [sceneRef, loadedModels, onModelsChange]);

  useEffect(() => {
    if (isFullyInitialized) {
      console.log('Model Viewer Setup: Scene is now fully initialized. Performing initial setup.');
      createBox();
      updateLighting();
      updateEnvironment();
      onSceneReady?.(sceneRef.current!);
    }
  }, [isFullyInitialized, createBox, updateLighting, updateEnvironment, onSceneReady, sceneRef]);

  return {
    mountRef: { current: null },
    mountCallback,
    scene: sceneRef.current,
    camera: cameraRef.current,
    renderer: rendererRef.current,
    controls: controlsRef.current,
    currentModel,
    boxRef,
    isLoading: loadingState.isLoading,
    error: loadingState.error,
    loadFBXModel,
    switchToModel,
    removeModel,
    performanceMetrics,
    isOrthographic,
    switchCamera,
    isFullyInitialized
  };
};
