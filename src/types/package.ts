import type { LoadedModel, SunlightSettings, AmbientLightSettings, EnvironmentSettings, MeasureData } from './model';
import * as THREE from 'three';

export interface LightingConfiguration {
  sunlight?: Partial<SunlightSettings>;
  ambientLight?: Partial<AmbientLightSettings>;
  environment?: Partial<EnvironmentSettings>;
}

export interface CameraConfiguration {
  defaultDistance?: number;
  enableOrthographic?: boolean;
  fov?: number;
  near?: number;
  far?: number;
}

export interface ToolsConfiguration {
  enableMeasurement?: boolean;
  enablePointTool?: boolean;
  enableSelection?: boolean;
  showGrid?: boolean;
  showGroundPlane?: boolean;
}

export interface ThemeConfiguration {
  mode?: 'light' | 'dark' | 'auto';
  primaryColor?: string;
  customCSS?: string;
}

export interface ModelViewer3DProps {
  // Container styling
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
  
  // Initial configuration
  initialModel?: File | string; // File object or URL
  theme?: 'light' | 'dark' | 'auto';
  
  // UI configuration
  showToolbar?: boolean;
  showControlPanel?: boolean;
  showMeasurePanel?: boolean;
  
  // Feature configuration
  lightingConfig?: LightingConfiguration;
  cameraConfig?: CameraConfiguration;
  toolsConfig?: ToolsConfiguration;
  themeConfig?: ThemeConfiguration;
  
  // Event callbacks
  onModelLoad?: (model: LoadedModel) => void;
  onModelError?: (error: Error) => void;
  onMeasurement?: (measurement: MeasureData) => void;
  onPointCreate?: (point: { x: number; y: number; z: number }) => void;
  onMeasureCreate?: (start: THREE.Vector3, end: THREE.Vector3) => void;
  onSceneReady?: (scene: THREE.Scene) => void;
  
  // Advanced callbacks
  onToolChange?: (tool: 'select' | 'point' | 'measure') => void;
  onViewChange?: (view: string) => void;
  onZoom?: (zoomLevel: number) => void;
}