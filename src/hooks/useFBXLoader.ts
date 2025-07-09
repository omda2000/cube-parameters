
import { useRef, useCallback, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import type { LoadedModel } from '../types/model';

export const useFBXLoader = (scene: THREE.Scene | null) => {
  const loaderRef = useRef<FBXLoader | null>(null);
  const [loadedModels, setLoadedModels] = useState<LoadedModel[]>([]);
  const [currentModel, setCurrentModel] = useState<LoadedModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFBXModel = useCallback(async (file: File) => {
    console.log('Starting FBX load process:', file.name);
    
    if (!scene) {
      console.error('Scene not available for FBX loading');
      setError('3D scene not ready. Please try again.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!loaderRef.current) {
        loaderRef.current = new FBXLoader();
        console.log('FBX loader initialized');
      }

      console.log('Reading file as array buffer...');
      const arrayBuffer = await file.arrayBuffer();
      
      console.log('Parsing FBX data...');
      const object = loaderRef.current.parse(arrayBuffer, '');
      console.log('FBX parsed successfully:', object);
      
      // Fix Z-axis orientation - most FBX files are Y-up, convert to Z-up
      object.rotateX(-Math.PI / 2);

      // Calculate bounding box after rotation
      const boundingBox = new THREE.Box3().setFromObject(object);
      const center = boundingBox.getCenter(new THREE.Vector3());
      const size = boundingBox.getSize(new THREE.Vector3());

      // Center the model at origin
      object.position.sub(center);

      // Scale model to fit in view (max size of 4 units to give more room)
      const maxDimension = Math.max(size.x, size.y, size.z);
      const scale = maxDimension > 4 ? 4 / maxDimension : 1;
      object.scale.setScalar(scale);

      // Process objects synchronously to prevent UI instability
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

      const modelData: LoadedModel = {
        id: Date.now().toString(),
        name: file.name.replace('.fbx', ''),
        object,
        boundingBox: new THREE.Box3().setFromObject(object),
        size: file.size
      };

      // Remove previous model if exists
      if (currentModel) {
        console.log('Removing previous model from scene');
        scene.remove(currentModel.object);
      }

      console.log('Adding new model to scene');
      scene.add(object);
      
      // Update state synchronously
      setLoadedModels(prev => [...prev, modelData]);
      setCurrentModel(modelData);
      
    } catch (err) {
      console.error('Failed to load FBX model:', err);
      setError('Failed to load model. Please check the file format.');
    } finally {
      setIsLoading(false);
    }
  }, [scene, currentModel]);

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
