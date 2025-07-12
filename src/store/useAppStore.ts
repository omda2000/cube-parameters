import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import * as THREE from 'three';
import type { 
  LoadedModel, 
  SunlightSettings, 
  AmbientLightSettings, 
  EnvironmentSettings, 
  ShadowQuality 
} from '../types/model';

// App State Slice
interface AppStateSlice {
  scene: THREE.Scene | null;
  isInitialized: boolean;
  setScene: (scene: THREE.Scene | null) => void;
  setInitialized: (initialized: boolean) => void;
}

// UI State Slice
interface UIStateSlice {
  showControlPanel: boolean;
  showMeasurePanel: boolean;
  activeControlTab: string;
  activeTool: 'select' | 'point' | 'measure';
  isOrthographic: boolean;
  showBestPlayer: boolean;
  setShowControlPanel: (show: boolean) => void;
  setShowMeasurePanel: (show: boolean) => void;
  setActiveControlTab: (tab: string) => void;
  setActiveTool: (tool: 'select' | 'point' | 'measure') => void;
  setIsOrthographic: (orthographic: boolean) => void;
  setShowBestPlayer: (show: boolean) => void;
}

// Scene State Slice
interface SceneStateSlice {
  loadedModels: LoadedModel[];
  currentModel: LoadedModel | null;
  sunlight: SunlightSettings;
  ambientLight: AmbientLightSettings;
  shadowQuality: ShadowQuality;
  environment: EnvironmentSettings;
  isUploading: boolean;
  uploadError: string | null;
  setLoadedModels: (models: LoadedModel[]) => void;
  setCurrentModel: (model: LoadedModel | null) => void;
  setSunlight: (sunlight: SunlightSettings) => void;
  setAmbientLight: (ambientLight: AmbientLightSettings) => void;
  setShadowQuality: (quality: ShadowQuality) => void;
  setEnvironment: (environment: EnvironmentSettings) => void;
  setUploading: (uploading: boolean) => void;
  setUploadError: (error: string | null) => void;
}

// Combined Store Type
type AppStore = AppStateSlice & UIStateSlice & SceneStateSlice;

export const useAppStore = create<AppStore>()(
  devtools(
    (set) => ({
      // App State
      scene: null,
      isInitialized: false,
      setScene: (scene) => set({ scene }, false, 'setScene'),
      setInitialized: (isInitialized) => set({ isInitialized }, false, 'setInitialized'),

      // UI State
      showControlPanel: false,
      showMeasurePanel: false,
      activeControlTab: 'scene',
      activeTool: 'select',
      isOrthographic: false,
      showBestPlayer: false,
      setShowControlPanel: (showControlPanel) => set({ showControlPanel }, false, 'setShowControlPanel'),
      setShowMeasurePanel: (showMeasurePanel) => set({ showMeasurePanel }, false, 'setShowMeasurePanel'),
      setActiveControlTab: (activeControlTab) => set({ activeControlTab }, false, 'setActiveControlTab'),
      setActiveTool: (activeTool) => set({ activeTool }, false, 'setActiveTool'),
      setIsOrthographic: (isOrthographic) => set({ isOrthographic }, false, 'setIsOrthographic'),
      setShowBestPlayer: (showBestPlayer) => set({ showBestPlayer }, false, 'setShowBestPlayer'),

      // Scene State
      loadedModels: [],
      currentModel: null,
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
      uploadError: null,
      setLoadedModels: (loadedModels) => set({ loadedModels }, false, 'setLoadedModels'),
      setCurrentModel: (currentModel) => set({ currentModel }, false, 'setCurrentModel'),
      setSunlight: (sunlight) => set({ sunlight }, false, 'setSunlight'),
      setAmbientLight: (ambientLight) => set({ ambientLight }, false, 'setAmbientLight'),
      setShadowQuality: (shadowQuality) => set({ shadowQuality }, false, 'setShadowQuality'),
      setEnvironment: (environment) => set({ environment }, false, 'setEnvironment'),
      setUploading: (isUploading) => set({ isUploading }, false, 'setUploading'),
      setUploadError: (uploadError) => set({ uploadError }, false, 'setUploadError'),
    }),
    {
      name: 'app-store',
    }
  )
);

// Fixed selector hooks using useShallow to prevent infinite loops
export const useAppState = () => useAppStore(
  useShallow((state) => ({
    scene: state.scene,
    isInitialized: state.isInitialized,
    setScene: state.setScene,
    setInitialized: state.setInitialized,
  }))
);

export const useUIState = () => useAppStore(
  useShallow((state) => ({
    showControlPanel: state.showControlPanel,
    showMeasurePanel: state.showMeasurePanel,
    activeControlTab: state.activeControlTab,
    activeTool: state.activeTool,
    isOrthographic: state.isOrthographic,
    showBestPlayer: state.showBestPlayer,
    setShowControlPanel: state.setShowControlPanel,
    setShowMeasurePanel: state.setShowMeasurePanel,
    setActiveControlTab: state.setActiveControlTab,
    setActiveTool: state.setActiveTool,
    setIsOrthographic: state.setIsOrthographic,
    setShowBestPlayer: state.setShowBestPlayer,
  }))
);

export const useSceneState = () => useAppStore(
  useShallow((state) => ({
    loadedModels: state.loadedModels,
    currentModel: state.currentModel,
    sunlight: state.sunlight,
    ambientLight: state.ambientLight,
    shadowQuality: state.shadowQuality,
    environment: state.environment,
    isUploading: state.isUploading,
    uploadError: state.uploadError,
    setLoadedModels: state.setLoadedModels,
    setCurrentModel: state.setCurrentModel,
    setSunlight: state.setSunlight,
    setAmbientLight: state.setAmbientLight,
    setShadowQuality: state.setShadowQuality,
    setEnvironment: state.setEnvironment,
    setUploading: state.setUploading,
    setUploadError: state.setUploadError,
  }))
);
