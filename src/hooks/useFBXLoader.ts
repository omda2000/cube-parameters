
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
    console.log('Starting model load process:', file.name);
    
    if (!scene) {
      console.error('Scene not available for model loading');
      setError('3D scene not ready. Please try again.');
      return;
    }

    // Set loading state immediately and clear any errors
    setIsLoading(true);
    setError(null);

    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      let object: THREE.Group | null = null;

      if (ext === 'fbx') {
        if (!loaderRef.current) {
          loaderRef.current = new FBXLoader();
          console.log('FBX loader initialized');
        }

        console.log('Reading FBX file as array buffer...');
        const arrayBuffer = await file.arrayBuffer();

        console.log('Parsing FBX data...');
        object = loaderRef.current.parse(arrayBuffer, '');
        console.log('FBX parsed successfully:', object);
      } else if (ext === 'gltf' || ext === 'glb') {
        if (!gltfLoaderRef.current) {
          gltfLoaderRef.current = new GLTFLoader();
          console.log('GLTF loader initialized');
        }

        console.log('Loading GLTF model...');
        const url = URL.createObjectURL(file);
        const gltf = await gltfLoaderRef.current.loadAsync(url);
        URL.revokeObjectURL(url);
        object = gltf.scene;
        console.log('GLTF loaded successfully:', object);
      } else {
        throw new Error('Unsupported file format');
      }
      
      // Process the object in a single batch to prevent multiple re-renders
      const processedObject = processObjectBatch(object, file.name);
      
      // Remove previous model if exists (do this before adding new one)
      if (currentModel) {
        console.log('Removing previous model from scene');
        scene.remove(currentModel.object);
      }

      console.log('Adding new model to scene');
      scene.add(processedObject.object);
      
      // Update all state in a single batch at the end
      console.log('Model loading completed successfully');
      setLoadedModels(prev => [...prev, processedObject]);
      setCurrentModel(processedObject);
      
    } catch (err) {
      console.error('Failed to load model:', err);
      setError('Failed to load model. Please check the file format.');
    } finally {
      // Always clear loading state
      setIsLoading(false);
    }
  }, [scene, currentModel]);

  // Helper function to process the object in a single batch
  const processObjectBatch = (object: THREE.Group, fileName: string): LoadedModel => {
    // Fix Z-axis orientation - most FBX files are Y-up, convert to Z-up
    object.rotateX(-Math.PI / 2);

    // Calculate bounding box after rotation
    const boundingBox = new THREE.Box3().setFromObject(object);
    const center = boundingBox.getCenter(new THREE.Vector3());
    const size = boundingBox.getSize(new THREE.Vector3());

    // Center the model at origin
    object.position.sub(center);

    // Scale model to fit in view (max size of 4 units)
    const maxDimension = Math.max(size.x, size.y, size.z);
    const scale = maxDimension > 4 ? 4 / maxDimension : 1;
    object.scale.setScalar(scale);

    // Process all children in one go
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Improve material if it's basic
        if (child.material instanceof THREE.MeshBasicMaterial) {
          const newMaterial = new THREE.MeshPhongMaterial({
            color: child.material.color,
            map: child.material.map
          });
          child.material = newMaterial;
        }
      }
    });

    return {
      id: Date.now().toString(),
      name: fileName.replace(/\.(fbx|gltf|glb)$/i, ''),
      object,
      boundingBox: new THREE.Box3().setFromObject(object),
      size: 0 // We don't need the file size for counting
    };
  };

  const switchToModel = useCallback((modelId: string) => {
    if (!scene) return;

    const model = loadedModels.find(m => m.id === modelId);
    if (!model) return;

    // Remove current model
    if (currentModel) {
      scene.remove(currentModel.object);
    }

    // Add selected model
    scene.add(model.object);
    setCurrentModel(model);
  }, [scene, loadedModels, currentModel]);

  const removeModel = useCallback((modelId: string) => {
    if (!scene) return;

    const model = loadedModels.find(m => m.id === modelId);
    if (!model) return;

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
