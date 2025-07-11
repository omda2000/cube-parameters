
import { useEffect } from 'react';
import * as THREE from 'three';
import { useGLTFLoaderSetup } from './gltf/useGLTFLoaderSetup';
import { useGLTFCleanup } from './gltf/useGLTFCleanup';
import { useGLTFModelOperations } from './gltf/useGLTFModelOperations';

export const useGLTFLoader = (scene: THREE.Scene | null) => {
  // Initialize loaders
  const { loaderRef, dracoLoaderRef } = useGLTFLoaderSetup();

  // Cleanup utilities
  const { disposeObject } = useGLTFCleanup();

  // Model operations
  const {
    loadedModels,
    currentModel,
    isLoading,
    error,
    loadGLTFModel,
    switchToModel,
    removeModel,
    activeLoadingRef
  } = useGLTFModelOperations({
    scene,
    loaderRef,
    disposeObject
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cancel any active loading
      if (activeLoadingRef.current) {
        activeLoadingRef.current.abort();
      }
      
      // Dispose DRACO loader
      if (dracoLoaderRef.current) {
        dracoLoaderRef.current.dispose();
      }
      
      // Dispose all loaded models
      loadedModels.forEach(model => {
        try {
          disposeObject(model.object);
        } catch (error) {
          console.warn('Error disposing model on cleanup:', error);
        }
      });
    };
  }, [loadedModels, disposeObject, activeLoadingRef, dracoLoaderRef]);

  return {
    loadedModels,
    currentModel,
    isLoading,
    error,
    loadGLTFModel,
    switchToModel,
    removeModel
  };
};
