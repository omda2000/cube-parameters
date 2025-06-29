
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { SceneState, SceneAction } from './types';

const initialSceneState: SceneState = {
  loadedModels: [],
  currentModel: null,
  dimensions: { length: 1, width: 1, height: 1 },
  boxColor: '#4F46E5',
  objectName: 'My Box',
  sunlight: {
    intensity: 1,
    azimuth: 45,
    elevation: 45,
    color: '#ffffff',
    castShadow: true
  },
  ambientLight: {
    intensity: 0.4,
    color: '#ffffff'
  },
  shadowQuality: 'medium' as const,
  environment: {
    showGrid: true,
    groundColor: '#ffffff',
    skyColor: '#87CEEB',
    showGround: true,
    preset: 'default'
  },
  isUploading: false,
  uploadError: null
};

const sceneStateReducer = (state: SceneState, action: SceneAction): SceneState => {
  switch (action.type) {
    case 'SET_LOADED_MODELS':
      return { ...state, loadedModels: action.payload };
    case 'SET_CURRENT_MODEL':
      return { ...state, currentModel: action.payload };
    case 'SET_DIMENSIONS':
      return { ...state, dimensions: action.payload };
    case 'SET_BOX_COLOR':
      return { ...state, boxColor: action.payload };
    case 'SET_OBJECT_NAME':
      return { ...state, objectName: action.payload };
    case 'SET_SUNLIGHT':
      return { ...state, sunlight: action.payload };
    case 'SET_AMBIENT_LIGHT':
      return { ...state, ambientLight: action.payload };
    case 'SET_SHADOW_QUALITY':
      return { ...state, shadowQuality: action.payload };
    case 'SET_ENVIRONMENT':
      return { ...state, environment: action.payload };
    case 'SET_UPLOADING':
      return { ...state, isUploading: action.payload };
    case 'SET_UPLOAD_ERROR':
      return { ...state, uploadError: action.payload };
    default:
      return state;
  }
};

const SceneStateContext = createContext<{
  state: SceneState;
  dispatch: React.Dispatch<SceneAction>;
} | null>(null);

export const SceneStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(sceneStateReducer, initialSceneState);

  return (
    <SceneStateContext.Provider value={{ state, dispatch }}>
      {children}
    </SceneStateContext.Provider>
  );
};

export const useSceneStateContext = () => {
  const context = useContext(SceneStateContext);
  if (!context) {
    throw new Error('useSceneStateContext must be used within a SceneStateProvider');
  }
  return context;
};
