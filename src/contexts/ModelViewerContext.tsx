import React, { createContext, useContext, useCallback } from 'react';
import type { LoadedModel } from '../types/model';

interface ModelViewerContextType {
  onFileUpload?: (file: File) => void;
  onModelsChange?: (models: LoadedModel[], current: LoadedModel | null) => void;
  onModelSelect?: (modelId: string) => void;
  onModelRemove?: (modelId: string) => void;
  switchCamera?: (orthographic: boolean) => void;
  setStandardView?: (view: string) => void;
}

const ModelViewerContext = createContext<ModelViewerContextType>({});

export const useModelViewerContext = () => {
  return useContext(ModelViewerContext);
};

interface ModelViewerProviderProps {
  children: React.ReactNode;
  value: ModelViewerContextType;
}

export const ModelViewerProvider: React.FC<ModelViewerProviderProps> = ({ 
  children, 
  value 
}) => {
  return (
    <ModelViewerContext.Provider value={value}>
      {children}
    </ModelViewerContext.Provider>
  );
};