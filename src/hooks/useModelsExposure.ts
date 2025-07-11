
import { useEffect, useRef } from 'react';
import type { LoadedModel } from '../types/model';

export const useModelsExposure = (
  loadedModels: LoadedModel[],
  currentModel: LoadedModel | null,
  loadFBXModel: (file: File) => Promise<void>,
  loadGLTFModel: (file: File) => Promise<void>,
  switchToModel: (modelId: string) => void,
  removeModel: (modelId: string) => void,
  onModelsChange?: (models: LoadedModel[], current: LoadedModel | null) => void
) => {
  // Use refs to track previous values and prevent unnecessary calls
  const prevModelsRef = useRef<LoadedModel[]>([]);
  const prevCurrentModelRef = useRef<LoadedModel | null>(null);

  // Expose models to parent component only when they actually change
  useEffect(() => {
    if (onModelsChange) {
      // Check if models or current model actually changed
      const modelsChanged = 
        loadedModels.length !== prevModelsRef.current.length ||
        loadedModels.some((model, index) => model.id !== prevModelsRef.current[index]?.id);
      
      const currentModelChanged = 
        currentModel?.id !== prevCurrentModelRef.current?.id;

      if (modelsChanged || currentModelChanged) {
        console.log('Models changed, notifying parent:', { 
          modelsCount: loadedModels.length, 
          currentModelId: currentModel?.id 
        });
        
        onModelsChange(loadedModels, currentModel);
        
        // Update refs
        prevModelsRef.current = [...loadedModels];
        prevCurrentModelRef.current = currentModel;
      }
    }
  }, [loadedModels, currentModel, onModelsChange]);

  // Expose handlers globally for parent components to access
  useEffect(() => {
    (window as any).__fbxUploadHandler = loadFBXModel;
    (window as any).__gltfUploadHandler = loadGLTFModel;
    (window as any).__fbxSwitchHandler = switchToModel;
    (window as any).__gltfSwitchHandler = switchToModel;
    (window as any).__fbxRemoveHandler = removeModel;
    (window as any).__gltfRemoveHandler = removeModel;

    return () => {
      delete (window as any).__fbxUploadHandler;
      delete (window as any).__gltfUploadHandler;
      delete (window as any).__fbxSwitchHandler;
      delete (window as any).__gltfSwitchHandler;
      delete (window as any).__fbxRemoveHandler;
      delete (window as any).__gltfRemoveHandler;
    };
  }, [loadFBXModel, loadGLTFModel, switchToModel, removeModel]);
};
