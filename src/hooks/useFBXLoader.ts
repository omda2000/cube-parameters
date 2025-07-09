import { useRef, useCallback, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { LoadedModel } from '../types/model';

export const useFBXLoader = (scene: THREE.Scene | null) => {
  const loaderRef = useRef<FBXLoader | null>(null);
  const gltfLoaderRef = useRef<GLTFLoader | null>(null);
  const [loadedModels, setLoadedModels] = useState<LoadedModel[]>([]);
  const [currentModel, setCurrentModel] = useState<LoadedModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFBXModel = useCallback(async (file: File) => {
    console.log('FBXLoader: Starting model load for:', file.name);
    
    if (!scene) {
      console.error('FBXLoader: Scene not available');
      setError('3D scene not ready. Please try again.');
      return;
    }

    // Set loading state and clear errors
    setIsLoading(true);
    setError(null);
    console.log('FBXLoader: Loading state activated');

    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      let object: THREE.Group | null = null;

      if (ext === 'fbx') {
        if (!loaderRef.current) {
          loaderRef.current = new FBXLoader();
        }
        const arrayBuffer = await file.arrayBuffer();
        object = loaderRef.current.parse(arrayBuffer, '');
      } else if (ext === 'gltf' || ext === 'glb') {
        if (!gltfLoaderRef.current) {
          gltfLoaderRef.current = new GLTFLoader();
        }
        const url = URL.createObjectURL(file);
        const gltf = await gltfLoaderRef.current.loadAsync(url);
        URL.revokeObjectURL(url);
        object = gltf.scene;
      } else {
        throw new Error('Unsupported file format. Please use FBX, GLTF, or GLB files.');
      }
      
      if (!object) {
        throw new Error('Failed to load model object');
      }

      console.log('FBXLoader: Processing loaded object...');
      
      // Batch all scene modifications to prevent multiple rebuilds
      const batchSceneUpdate = () => {
        // Remove previous model if exists
        if (currentModel) {
          console.log('FBXLoader: Removing previous model');
          scene.remove(currentModel.object);
        }

        // Process the new model
        const processedModel = processModelBatch(object!, file.name);
        
        // Add to scene
        console.log('FBXLoader: Adding new model to scene');
        scene.add(processedModel.object);
        
        // Update state in a single batch
        setLoadedModels(prev => {
          const newModels = [...prev, processedModel];
          console.log('FBXLoader: Updated models count:', newModels.length);
          return newModels;
        });
        setCurrentModel(processedModel);
        
        console.log('FBXLoader: Model loading completed successfully');
      };

      // Execute batch update synchronously
      batchSceneUpdate();
      
    } catch (err) {
      console.error('FBXLoader: Failed to load model:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load model. Please check the file format.';
      setError(errorMessage);
    } finally {
      // Add small delay to ensure scene tree can process the changes
      setTimeout(() => {
        console.log('FBXLoader: Clearing loading state');
        setIsLoading(false);
      }, 100);
    }
  }, [scene, currentModel]);

  const processModelBatch = (object: THREE.Group, fileName: string): LoadedModel => {
    console.log('FBXLoader: Processing model batch for:', fileName);
    
    // Fix Z-axis orientation
    object.rotateX(-Math.PI / 2);

    // Calculate bounding box and center
    const boundingBox = new THREE.Box3().setFromObject(object);
    const center = boundingBox.getCenter(new THREE.Vector3());
    const size = boundingBox.getSize(new THREE.Vector3());

    // Center and scale model
    object.position.sub(center);
    const maxDimension = Math.max(size.x, size.y, size.z);
    const scale = maxDimension > 4 ? 4 / maxDimension : 1;
    object.scale.setScalar(scale);

    // Process all meshes in batch
    const meshes: THREE.Mesh[] = [];
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        meshes.push(child);
      }
    });

    meshes.forEach(mesh => {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      
      if (mesh.material instanceof THREE.MeshBasicMaterial) {
        const newMaterial = new THREE.MeshPhongMaterial({
          color: mesh.material.color,
          map: mesh.material.map
        });
        mesh.material = newMaterial;
      }
    });

    console.log('FBXLoader: Processed', meshes.length, 'meshes');

    return {
      id: Date.now().toString(),
      name: fileName.replace(/\.(fbx|gltf|glb)$/i, ''),
      object,
      boundingBox: new THREE.Box3().setFromObject(object),
      size: 0
    };
  };

  const switchToModel = useCallback((modelId: string) => {
    if (!scene) return;

    const model = loadedModels.find(m => m.id === modelId);
    if (!model) return;

    console.log('FBXLoader: Switching to model:', model.name);

    if (currentModel) {
      scene.remove(currentModel.object);
    }

    scene.add(model.object);
    setCurrentModel(model);
  }, [scene, loadedModels, currentModel]);

  const removeModel = useCallback((modelId: string) => {
    if (!scene) return;

    const model = loadedModels.find(m => m.id === modelId);
    if (!model) return;

    console.log('FBXLoader: Removing model:', model.name);

    if (currentModel?.id === modelId) {
      scene.remove(model.object);
      setCurrentModel(null);
    }

    setLoadedModels(prev => prev.filter(m => m.id !== modelId));
  }, [scene, loadedModels, currentModel]);

  return {
    loadedModels,
    currentModel,
    isLoading,
    error,
    loadFBXModel,
    switchToModel,
    removeModel
  };
};
