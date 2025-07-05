
import { useState } from 'react';
import type { LoadedModel, BoxDimensions, TransformMode } from '../types/model';

export const useModelState = () => {
  const [dimensions, setDimensions] = useState<BoxDimensions>({
    length: 1,
    width: 1,
    height: 1
  });
  const [boxColor, setBoxColor] = useState('#4F46E5');
  const [objectName, setObjectName] = useState('My Box');
  const [transformMode, setTransformMode] = useState<TransformMode>('translate');
  const [loadedModels, setLoadedModels] = useState<LoadedModel[]>([]);
  const [currentModel, setCurrentModel] = useState<LoadedModel | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  return {
    dimensions,
    setDimensions,
    boxColor,
    setBoxColor,
    objectName,
    setObjectName,
    transformMode,
    setTransformMode,
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
