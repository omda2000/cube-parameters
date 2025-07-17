// Main component export
export { default as ModelViewer3D } from './ModelViewer3D';
export type { ModelViewer3DProps } from './ModelViewer3D';

// Type exports
export type { 
  LoadedModel,
  SunlightSettings,
  AmbientLightSettings,
  EnvironmentSettings,
  ShadowQuality
} from '@/types/model';

// Context exports for advanced usage
export { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
export { UnitsProvider, useUnits } from '@/contexts/UnitsContext';
export { NotificationProvider, useNotifications } from '@/contexts/NotificationContext';

// Store exports for state management
export { useAppStore } from '@/store/useAppStore';
export type { AppState } from '@/store/types';

// Hook exports for custom implementations
export { useMeasurements } from '@/hooks/useMeasurements';
export { useZoomHandlers } from '@/hooks/useZoomHandlers';
export { useToolHandlers } from '@/hooks/useToolHandlers';
export { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
export { useThreeScene } from '@/hooks/useThreeScene';
export { useFBXLoader } from '@/hooks/useFBXLoader';
export { useGLTFLoader } from '@/hooks/useGLTFLoader';

// Component exports for advanced customization
export { default as ThreeViewer } from '@/components/ThreeViewer';
export { default as UIContainer } from '@/containers/UIContainer';
export { default as ModelViewerContainer } from '@/containers/ModelViewerContainer';

// Utility exports
export { cn } from '@/lib/utils';