import * as THREE from 'three';
import type { LoadedModel } from '@/types/model';

// Re-export types used in plugin interfaces
export type { LoadedModel };

// Plugin Configuration System
export interface PluginConfig {
  /** Plugin identification */
  id: string;
  name: string;
  version: string;
  
  /** UI Configuration */
  ui?: {
    /** Show/hide specific UI elements */
    showToolbar?: boolean;
    showControlPanel?: boolean;
    showStatusBar?: boolean;
    showMeasurePanel?: boolean;
    
    /** UI Layout preferences */
    layout?: 'default' | 'minimal' | 'compact' | 'custom';
    position?: 'top' | 'bottom' | 'left' | 'right' | 'floating';
    
    /** Theme customization */
    theme?: {
      colors?: Record<string, string>;
      fonts?: Record<string, string>;
      spacing?: Record<string, string>;
    };
  };
  
  /** Feature Configuration */
  features?: {
    /** Enable/disable core features */
    enableMeasurements?: boolean;
    enablePointTools?: boolean;
    enableSelection?: boolean;
    enableKeyboardShortcuts?: boolean;
    enableZoomControls?: boolean;
    enableCameraControls?: boolean;
    
    /** File format support */
    supportedFormats?: string[];
    maxFileSize?: number;
    
    /** Performance settings */
    enablePerformanceMonitoring?: boolean;
    maxPolygons?: number;
    enableLOD?: boolean;
  };
  
  /** Integration options */
  integration?: {
    /** Host app communication */
    eventBus?: PluginEventBus;
    stateSync?: boolean;
    persistState?: boolean;
    
    /** External services */
    analytics?: PluginAnalytics;
    logging?: PluginLogger;
  };
  
  /** Custom extensions */
  extensions?: PluginExtension[];
}

// Plugin Event System
export interface PluginEventBus {
  on(event: string, handler: (data: any) => void): void;
  off(event: string, handler: (data: any) => void): void;
  emit(event: string, data?: any): void;
  once(event: string, handler: (data: any) => void): void;
}

// Plugin Analytics
export interface PluginAnalytics {
  track(event: string, data?: Record<string, any>): void;
  identify(userId: string, traits?: Record<string, any>): void;
  page(name: string, properties?: Record<string, any>): void;
}

// Plugin Logger
export interface PluginLogger {
  info(message: string, data?: any): void;
  warn(message: string, data?: any): void;
  error(message: string, data?: any): void;
  debug(message: string, data?: any): void;
}

// Plugin Extensions
export interface PluginExtension {
  id: string;
  name: string;
  type: 'tool' | 'panel' | 'overlay' | 'hook' | 'filter';
  component?: React.ComponentType<any>;
  hooks?: Record<string, Function>;
  filters?: Record<string, Function>;
}

// Plugin API
export interface PluginAPI {
  /** Model Management */
  models: {
    load: (file: File) => Promise<LoadedModel>;
    remove: (modelId: string) => void;
    switch: (modelId: string) => void;
    getAll: () => LoadedModel[];
    getCurrent: () => LoadedModel | null;
  };
  
  /** Scene Control */
  scene: {
    getScene: () => THREE.Scene | null;
    getCamera: () => THREE.Camera | null;
    getRenderer: () => THREE.WebGLRenderer | null;
    setStandardView: (view: string) => void;
    switchCamera: (orthographic: boolean) => void;
  };
  
  /** Tools */
  tools: {
    setActiveTool: (tool: 'select' | 'point' | 'measure') => void;
    getActiveTool: () => string;
    createPoint: (position: { x: number; y: number; z: number }) => void;
    createMeasurement: (start: THREE.Vector3, end: THREE.Vector3) => void;
  };
  
  /** UI Control */
  ui: {
    showPanel: (panelId: string) => void;
    hidePanel: (panelId: string) => void;
    togglePanel: (panelId: string) => void;
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    showNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  };
  
  /** State Management */
  state: {
    get: (key: string) => any;
    set: (key: string, value: any) => void;
    subscribe: (key: string, callback: (value: any) => void) => () => void;
  };
  
  /** Events */
  events: PluginEventBus;
}

// Plugin Instance
export interface PluginInstance {
  config: PluginConfig;
  api: PluginAPI;
  initialize: () => Promise<void>;
  destroy: () => Promise<void>;
  getState: () => Record<string, any>;
  setState: (state: Record<string, any>) => void;
}

// Plugin Manager
export interface PluginManager {
  register: (plugin: PluginInstance) => void;
  unregister: (pluginId: string) => void;
  get: (pluginId: string) => PluginInstance | null;
  getAll: () => PluginInstance[];
  initialize: () => Promise<void>;
  destroy: () => Promise<void>;
}

// Plugin Events
export type PluginEvents = {
  'model:loaded': { model: LoadedModel };
  'model:removed': { modelId: string };
  'model:switched': { modelId: string };
  'tool:changed': { tool: string };
  'point:created': { point: { x: number; y: number; z: number } };
  'measurement:created': { start: THREE.Vector3; end: THREE.Vector3 };
  'selection:changed': { objects: THREE.Object3D[] };
  'camera:changed': { camera: THREE.Camera };
  'scene:ready': { scene: THREE.Scene };
  'ui:panel:toggled': { panelId: string; visible: boolean };
  'theme:changed': { theme: string };
  'error': { error: Error; context: string };
};

// Plugin State
export interface PluginState {
  initialized: boolean;
  active: boolean;
  config: PluginConfig;
  data: Record<string, any>;
  errors: Error[];
}