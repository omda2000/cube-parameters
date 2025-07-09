
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
    console.log('FBXLoader: Starting model load process for:', file.name);
    
    if (!scene) {
      console.error('FBXLoader: Scene not available for model loading');
      setError('3D scene not ready. Please try again.');
      return;
    }

    // Set loading state immediately and clear any errors
    setIsLoading(true);
    setError(null);
    console.log('FBXLoader: Loading state set to true');

    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      let object: THREE.Group | null = null;

      if (ext === 'fbx') {
        if (!loaderRef.current) {
          loaderRef.current = new FBXLoader();
          console.log('FBXLoader: FBX loader initialized');
        }

        console.log('FBXLoader: Reading FBX file as array buffer...');
        const arrayBuffer = await file.arrayBuffer();

        console.log('FBXLoader: Parsing FBX data...');
        object = loaderRef.current.parse(arrayBuffer, '');
        console.log('FBXLoader: FBX parsed successfully');
      } else if (ext === 'gltf' || ext === 'glb') {
        if (!gltfLoaderRef.current) {
          gltfLoaderRef.current = new GLTFLoader();
          console.log('FBXLoader: GLTF loader initialized');
        }

        console.log('FBXLoader: Loading GLTF model...');
        const url = URL.createObjectURL(file);
        const gltf = await gltfLoaderRef.current.loadAsync(url);
        URL.revokeObjectURL(url);
        object = gltf.scene;
        console.log('FBXLoader: GLTF loaded successfully');
      } else {
        throw new Error('Unsupported file format. Please use FBX, GLTF, or GLB files.');
      }
      
      if (!object) {
        throw new Error('Failed to load model object');
      }

      console.log('FBXLoader: Processing loaded object...');
      
      // Process the object in a single batch to prevent multiple re-renders
      const processedModel = processModelBatch(object, file.name);
      
      // Remove previous model if exists (single operation)
      if (currentModel) {
        console.log('FBXLoader: Removing previous model from scene');
        scene.remove(currentModel.object);
      }

      console.log('FBXLoader: Adding new model to scene');
      scene.add(processedModel.object);
      
      // Update all state in a single batch at the end
      console.log('FBXLoader: Model loading completed successfully');
      
      // Use functional updates to ensure consistency
      setLoadedModels(prev => {
        const newModels = [...prev, processedModel];
        console.log('FBXLoader: Updated loaded models count:', newModels.length);
        return newModels;
      });
      
      setCurrentModel(processedModel);
      console.log('FBXLoader: Set current model:', processedModel.name);
      
    } catch (err) {
      console.error('FBXLoader: Failed to load model:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load model. Please check the file format.';
      setError(errorMessage);
    } finally {
      // Always clear loading state
      console.log('FBXLoader: Setting loading state to false');
      setIsLoading(false);
    }
  }, [scene, currentModel]);

  // Helper function to process the model object in a single batch
  const processModelBatch = (object: THREE.Group, fileName: string): LoadedModel => {
    console.log('FBXLoader: Processing model batch for:', fileName);
    
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

    // Process all children in one go - avoid individual traverse calls
    const meshes: THREE.Mesh[] = [];
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        meshes.push(child);
      }
    });

    // Batch process all meshes
    meshes.forEach(mesh => {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      
      // Improve material if it's basic
      if (mesh.material instanceof THREE.MeshBasicMaterial) {
        const newMaterial = new THREE.MeshPhongMaterial({
          color: mesh.material.color,
          map: mesh.material.map
        });
        mesh.material = newMaterial;
      }
    });

    console.log('FBXLoader: Processed', meshes.length, 'meshes in model');

    const processedModel: LoadedModel = {
      id: Date.now().toString(),
      name: fileName.replace(/\.(fbx|gltf|glb)$/i, ''),
      object,
      boundingBox: new THREE.Box3().setFromObject(object),
      size: 0 // We don't need the file size for counting
    };

    console.log('FBXLoader: Created processed model:', processedModel.name);
    return processedModel;
  };

  const switchToModel = useCallback((modelId: string) => {
    if (!scene) return;

    const model = loadedModels.find(m => m.id === modelId);
    if (!model) return;

    console.log('FBXLoader: Switching to model:', model.name);

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
