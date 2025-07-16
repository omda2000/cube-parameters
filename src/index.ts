// Main package exports
export { default as ModelViewer3D } from './ModelViewer3D';

// Core types and interfaces
export type { 
  LoadedModel,
  SunlightSettings,
  AmbientLightSettings,
  EnvironmentSettings,
  ShadowQuality,
  MeasureData
} from './types/model';

export type { 
  ModelViewer3DProps,
  LightingConfiguration,
  CameraConfiguration,
  ToolsConfiguration,
  ThemeConfiguration
} from './types/package';

// Context providers for advanced usage
export { ThemeProvider } from './contexts/ThemeContext';
export { UnitsProvider } from './contexts/UnitsContext';
export { NotificationProvider } from './contexts/NotificationContext';

// Utility hooks for external integration
export { useAppStore } from './store/useAppStore';

// Version
export const VERSION = '1.0.1';