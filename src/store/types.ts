
import * as THREE from 'three';
import type { LoadedModel, SunlightSettings, AmbientLightSettings, EnvironmentSettings, BoxDimensions, ShadowQuality } from '../types/model';

// App State Types
export interface AppState {
  scene: THREE.Scene | null;
  isInitialized: boolean;
}

export interface SceneState {
  loadedModels: LoadedModel[];
  currentModel: LoadedModel | null;
  dimensions: BoxDimensions;
  boxColor: string;
  objectName: string;
  sunlight: SunlightSettings;
  ambientLight: AmbientLightSettings;
  shadowQuality: ShadowQuality;
  environment: EnvironmentSettings;
  isUploading: boolean;
  uploadError: string | null;
}

export interface UIState {
  showControlPanel: boolean;
  showMeasurePanel: boolean;
  activeControlTab: string;
  activeTool: 'select' | 'point' | 'measure' | 'move';
  isOrthographic: boolean;
}

// Action Types
export type AppAction = 
  | { type: 'SET_SCENE'; payload: THREE.Scene | null }
  | { type: 'SET_INITIALIZED'; payload: boolean };

export type SceneAction =
  | { type: 'SET_LOADED_MODELS'; payload: LoadedModel[] }
  | { type: 'SET_CURRENT_MODEL'; payload: LoadedModel | null }
  | { type: 'SET_DIMENSIONS'; payload: BoxDimensions }
  | { type: 'SET_BOX_COLOR'; payload: string }
  | { type: 'SET_OBJECT_NAME'; payload: string }
  | { type: 'SET_SUNLIGHT'; payload: SunlightSettings }
  | { type: 'SET_AMBIENT_LIGHT'; payload: AmbientLightSettings }
  | { type: 'SET_SHADOW_QUALITY'; payload: ShadowQuality }
  | { type: 'SET_ENVIRONMENT'; payload: EnvironmentSettings }
  | { type: 'SET_UPLOADING'; payload: boolean }
  | { type: 'SET_UPLOAD_ERROR'; payload: string | null };

export type UIAction =
  | { type: 'SET_CONTROL_PANEL'; payload: boolean }
  | { type: 'SET_MEASURE_PANEL'; payload: boolean }
  | { type: 'SET_ACTIVE_CONTROL_TAB'; payload: string }
  | { type: 'SET_ACTIVE_TOOL'; payload: 'select' | 'point' | 'measure' | 'move' }
  | { type: 'SET_ORTHOGRAPHIC'; payload: boolean };
