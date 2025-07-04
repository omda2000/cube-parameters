
import { useEffect } from 'react';
import type { LoadedModel } from '../types/model';

export const useModelsExposure = (
  loadedModels: LoadedModel[],
  currentModel: LoadedModel | null,
  loadFBXModel: (file: File) => Promise<void>,
  switchToModel: (modelId: string) => void,
  removeModel: (modelId: string) => void,
  onModelsChange?: (models: LoadedModel[], current: LoadedModel | null) => void
) => {
  // Expose models to parent component
  useEffect(() => {
    if (onModelsChange) {
      onModelsChange(loadedModels, currentModel);
    }
  }, [loadedModels, currentModel, onModelsChange]);

  // Expose FBX handlers globally for parent components to access
  useEffect(() => {
    (window as any).__fbxUploadHandler = loadFBXModel;
    (window as any).__fbxSwitchHandler = switchToModel;
    (window as any).__fbxRemoveHandler = removeModel;

    return () => {
      delete (window as any).__fbxUploadHandler;
      delete (window as any).__fbxSwitchHandler;
      delete (window as any).__fbxRemoveHandler;
    };
  }, [loadFBXModel, switchToModel, removeModel]);
};
