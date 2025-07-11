
import { useState } from 'react';
import type { LoadedModel } from '../types/model';

export const useModelState = () => {
  const [loadedModels, setLoadedModels] = useState<LoadedModel[]>([]);
  const [currentModel, setCurrentModel] = useState<LoadedModel | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  return {
    loadedModels,
    setLoadedModels,
    currentModel,
    setCurrentModel,
    isUploading,
    setIsUploading,
    uploadError,
    setUploadError
  };
};
