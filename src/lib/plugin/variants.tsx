import React from 'react';
import * as THREE from 'three';
import type { ModelViewer3DProps } from '../ModelViewer3D';
import { ModelViewer3D } from '../ModelViewer3D';
import { PluginProvider } from './PluginProvider';
import type { PluginConfig } from './types';

// Minimal Viewer - Essential features only
export interface MinimalViewerProps extends Omit<ModelViewer3DProps, 'showControlsInitially'> {
  /** Whether to show basic controls */
  showBasicControls?: boolean;
}

export const MinimalViewer: React.FC<MinimalViewerProps> = ({
  showBasicControls = false,
  ...props
}) => {
  const minimalConfig: PluginConfig = {
    id: 'minimal-viewer',
    name: 'Minimal 3D Viewer',
    version: '1.0.0',
    ui: {
      layout: 'minimal',
      showToolbar: showBasicControls,
      showControlPanel: false,
      showStatusBar: false,
      showMeasurePanel: false
    },
    features: {
      enableMeasurements: false,
      enablePointTools: false,
      enableSelection: true,
      enableKeyboardShortcuts: false,
      enableZoomControls: showBasicControls,
      enableCameraControls: true
    }
  };

  return (
    <PluginProvider>
      <ModelViewer3D 
        {...props}
        showControlsInitially={false}
        disableKeyboardShortcuts={!showBasicControls}
      />
    </PluginProvider>
  );
};

// Compact Viewer - Space-efficient layout
export interface CompactViewerProps extends ModelViewer3DProps {
  /** Position of controls */
  controlsPosition?: 'top' | 'bottom' | 'left' | 'right';
}

export const CompactViewer: React.FC<CompactViewerProps> = ({
  controlsPosition = 'bottom',
  ...props
}) => {
  const compactConfig: PluginConfig = {
    id: 'compact-viewer',
    name: 'Compact 3D Viewer',
    version: '1.0.0',
    ui: {
      layout: 'compact',
      position: controlsPosition,
      showToolbar: true,
      showControlPanel: true,
      showStatusBar: true,
      showMeasurePanel: true
    },
    features: {
      enableMeasurements: true,
      enablePointTools: true,
      enableSelection: true,
      enableKeyboardShortcuts: true,
      enableZoomControls: true,
      enableCameraControls: true
    }
  };

  return (
    <PluginProvider>
      <ModelViewer3D {...props} />
    </PluginProvider>
  );
};

// Headless Viewer - No UI, API only
export interface HeadlessViewerProps extends Omit<ModelViewer3DProps, 'className' | 'style'> {
  /** Ref to access the viewer API */
  viewerRef?: React.RefObject<HeadlessViewerAPI>;
}

export interface HeadlessViewerAPI {
  loadModel: (file: File) => Promise<void>;
  removeModel: (modelId: string) => void;
  switchToModel: (modelId: string) => void;
  setTool: (tool: 'select' | 'point' | 'measure') => void;
  setStandardView: (view: string) => void;
  switchCamera: (orthographic: boolean) => void;
  getScene: () => THREE.Scene | null;
  getCamera: () => THREE.Camera | null;
  getRenderer: () => THREE.WebGLRenderer | null;
}

export const HeadlessViewer: React.FC<HeadlessViewerProps> = ({
  viewerRef,
  ...props
}) => {
  const headlessConfig: PluginConfig = {
    id: 'headless-viewer',
    name: 'Headless 3D Viewer',
    version: '1.0.0',
    ui: {
      layout: 'custom',
      showToolbar: false,
      showControlPanel: false,
      showStatusBar: false,
      showMeasurePanel: false
    },
    features: {
      enableMeasurements: true,
      enablePointTools: true,
      enableSelection: true,
      enableKeyboardShortcuts: false,
      enableZoomControls: false,
      enableCameraControls: true
    }
  };

  // TODO: Implement API exposure through ref
  React.useImperativeHandle(viewerRef, () => ({
    loadModel: async (file: File) => {
      // Implementation would connect to plugin API
      console.log('HeadlessViewer: loadModel called', file.name);
    },
    removeModel: (modelId: string) => {
      console.log('HeadlessViewer: removeModel called', modelId);
    },
    switchToModel: (modelId: string) => {
      console.log('HeadlessViewer: switchToModel called', modelId);
    },
    setTool: (tool: string) => {
      console.log('HeadlessViewer: setTool called', tool);
    },
    setStandardView: (view: string) => {
      console.log('HeadlessViewer: setStandardView called', view);
    },
    switchCamera: (orthographic: boolean) => {
      console.log('HeadlessViewer: switchCamera called', orthographic);
    },
    getScene: () => null,
    getCamera: () => null,
    getRenderer: () => null
  }));

  return (
    <PluginProvider>
      <div className="w-full h-full">
        <ModelViewer3D 
          {...props}
          className="w-full h-full"
          showControlsInitially={false}
          disableKeyboardShortcuts={true}
        />
      </div>
    </PluginProvider>
  );
};

// Professional Viewer - Full featured with advanced options
export interface ProfessionalViewerProps extends ModelViewer3DProps {
  /** Enable advanced features */
  enableAdvancedFeatures?: boolean;
  /** Enable performance monitoring */
  enablePerformanceMonitoring?: boolean;
  /** Custom theme configuration */
  themeConfig?: Record<string, string>;
}

export const ProfessionalViewer: React.FC<ProfessionalViewerProps> = ({
  enableAdvancedFeatures = true,
  enablePerformanceMonitoring = false,
  themeConfig,
  ...props
}) => {
  const professionalConfig: PluginConfig = {
    id: 'professional-viewer',
    name: 'Professional 3D Viewer',
    version: '1.0.0',
    ui: {
      layout: 'default',
      showToolbar: true,
      showControlPanel: true,
      showStatusBar: true,
      showMeasurePanel: true,
      theme: {
        colors: themeConfig
      }
    },
    features: {
      enableMeasurements: true,
      enablePointTools: true,
      enableSelection: true,
      enableKeyboardShortcuts: true,
      enableZoomControls: true,
      enableCameraControls: true,
      enablePerformanceMonitoring,
      supportedFormats: enableAdvancedFeatures ? ['gltf', 'glb', 'fbx', 'obj', 'dae'] : ['gltf', 'glb', 'fbx'],
      maxFileSize: enableAdvancedFeatures ? 500 * 1024 * 1024 : 100 * 1024 * 1024, // 500MB vs 100MB
      enableLOD: enableAdvancedFeatures
    }
  };

  return (
    <PluginProvider>
      <ModelViewer3D {...props} />
    </PluginProvider>
  );
};

// Embedded Viewer - For integration in existing apps
export interface EmbeddedViewerProps extends ModelViewer3DProps {
  /** Host app theme to inherit */
  hostTheme?: 'light' | 'dark' | 'system';
  /** Whether to isolate CSS */
  isolateCSS?: boolean;
}

export const EmbeddedViewer: React.FC<EmbeddedViewerProps> = ({
  hostTheme = 'system',
  isolateCSS = true,
  ...props
}) => {
  const embeddedConfig: PluginConfig = {
    id: 'embedded-viewer',
    name: 'Embedded 3D Viewer',
    version: '1.0.0',
    ui: {
      layout: 'default'
    },
    features: {
      enableMeasurements: true,
      enablePointTools: true,
      enableSelection: true,
      enableKeyboardShortcuts: true,
      enableZoomControls: true,
      enableCameraControls: true
    },
    integration: {
      stateSync: true,
      persistState: false
    }
  };

  const containerStyle: React.CSSProperties = isolateCSS ? {
    isolation: 'isolate' as const,
    contain: 'layout style paint' as const
  } : {};

  return (
    <div style={containerStyle}>
      <PluginProvider>
        <ModelViewer3D 
          {...props}
          defaultTheme={hostTheme}
        />
      </PluginProvider>
    </div>
  );
};