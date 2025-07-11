
import { useCallback, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import type { LoadedModel } from '../../types/model';

interface UseGLTFModelOperationsProps {
  scene: THREE.Scene | null;
  loaderRef: React.RefObject<GLTFLoader | null>;
  disposeObject: (object: THREE.Object3D) => void;
}

export const useGLTFModelOperations = ({
  scene,
  loaderRef,
  disposeObject
}: UseGLTFModelOperationsProps) => {
  const [loadedModels, setLoadedModels] = useState<LoadedModel[]>([]);
  const [currentModel, setCurrentModel] = useState<LoadedModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activeLoadingRef = useRef<AbortController | null>(null);

  const loadGLTFModel = useCallback(async (file: File) => {
    console.log('Starting GLTF load process:', file.name);
    
    if (!scene) {
      console.error('Scene not available for GLTF loading');
      setError('3D scene not ready. Please try again.');
      return;
    }

    // Cancel any existing loading operation
    if (activeLoadingRef.current) {
      activeLoadingRef.current.abort();
    }

    const abortController = new AbortController();
    activeLoadingRef.current = abortController;

    setIsLoading(true);
    setError(null);

    try {
      // Validate file
      const fileName = file.name.toLowerCase();
      if (!fileName.endsWith('.gltf') && !fileName.endsWith('.glb')) {
        throw new Error('Invalid file format. Please select a GLTF or GLB file.');
      }

      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        throw new Error('File too large. Please select a file smaller than 50MB.');
      }

      if (!loaderRef.current) {
        throw new Error('GLTF loader not initialized');
      }

      console.log('Reading file as array buffer...');
      const arrayBuffer = await file.arrayBuffer();
      
      // Check if operation was aborted
      if (abortController.signal.aborted) {
        console.log('GLTF loading aborted');
        return;
      }
      
      console.log('Parsing GLTF data...');
      
      // Use Promise-based parsing
      const gltf = await new Promise<any>((resolve, reject) => {
        loaderRef.current!.parse(
          arrayBuffer, 
          '', 
          (result) => resolve(result),
          (error) => reject(error)
        );
      });
      
      // Check if operation was aborted after parsing
      if (abortController.signal.aborted) {
        console.log('GLTF loading aborted after parsing');
        if (gltf.scene) {
          disposeObject(gltf.scene);
        }
        return;
      }
      
      console.log('GLTF parsed successfully:', gltf);
      
      const object = gltf.scene;

      // Calculate bounding box
      const boundingBox = new THREE.Box3().setFromObject(object);
      const center = boundingBox.getCenter(new THREE.Vector3());
      const size = boundingBox.getSize(new THREE.Vector3());

      // Center the model at origin
      object.position.sub(center);

      // Scale model to fit in view (max size of 4 units)
      const maxDimension = Math.max(size.x, size.y, size.z);
      const scale = maxDimension > 4 ? 4 / maxDimension : 1;
      object.scale.setScalar(scale);

      // Ensure shadows are enabled
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      // Create a Group to ensure proper typing
      const modelGroup = new THREE.Group();
      modelGroup.add(object);
      modelGroup.name = file.name.replace(/\.(gltf|glb)$/i, '');

      const modelData: LoadedModel = {
        id: Date.now().toString(),
        name: file.name.replace(/\.(gltf|glb)$/i, ''),
        object: modelGroup,
        boundingBox: new THREE.Box3().setFromObject(modelGroup),
        size: file.size
      };

      // Remove previous model if exists
      if (currentModel) {
        console.log('Removing previous model from scene');
        scene.remove(currentModel.object);
        disposeObject(currentModel.object);
      }

      console.log('Adding GLTF model to scene');
      scene.add(modelGroup);
      setLoadedModels(prev => [...prev, modelData]);
      setCurrentModel(modelData);
      
    } catch (err) {
      if (!abortController.signal.aborted) {
        console.error('Failed to load GLTF model:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load model. Please check the file format.';
        setError(errorMessage);
      }
    } finally {
      if (!abortController.signal.aborted) {
        setIsLoading(false);
      }
      activeLoadingRef.current = null;
    }
  }, [scene, currentModel, disposeObject, loaderRef]);

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

    // Dispose of the model to free memory
    disposeObject(model.object);
    setLoadedModels(prev => prev.filter(m => m.id !== modelId));
  }, [scene, loadedModels, currentModel, disposeObject]);

  return {
    loadedModels,
    currentModel,
    isLoading,
    error,
    loadGLTFModel,
    switchToModel,
    removeModel,
    activeLoadingRef
  };
};
