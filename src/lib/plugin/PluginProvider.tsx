import React, { createContext, useContext, useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { 
  PluginConfig, 
  PluginAPI, 
  PluginManager as IPluginManager,
  PluginInstance 
} from './types';
import { PluginManager, PluginEventBus } from './PluginManager';
import { createPluginAPI } from './createPluginAPI';

interface PluginContextType {
  pluginManager: IPluginManager;
  registerPlugin: (config: PluginConfig) => PluginInstance;
  unregisterPlugin: (pluginId: string) => void;
  getPlugin: (pluginId: string) => PluginInstance | null;
  getAllPlugins: () => PluginInstance[];
}

const PluginContext = createContext<PluginContextType | null>(null);

export const usePluginSystem = () => {
  const context = useContext(PluginContext);
  if (!context) {
    throw new Error('usePluginSystem must be used within a PluginProvider');
  }
  return context;
};

interface PluginProviderProps {
  children: React.ReactNode;
  apiContext?: {
    scene?: THREE.Scene;
    camera?: THREE.Camera;
    renderer?: THREE.WebGLRenderer;
    loadedModels?: any[];
    currentModel?: any;
    onFileUpload?: (file: File) => void;
    onModelsChange?: (models: any[], current: any) => void;
    onPointCreate?: (point: { x: number; y: number; z: number }) => void;
    onMeasureCreate?: (start: any, end: any) => void;
    onToolChange?: (tool: string) => void;
    onStandardView?: (view: string) => void;
    onCameraSwitch?: (orthographic: boolean) => void;
  };
}

export const PluginProvider: React.FC<PluginProviderProps> = ({ 
  children, 
  apiContext = {} 
}) => {
  const pluginManagerRef = useRef<PluginManager | null>(null);
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  // Initialize plugin manager
  useEffect(() => {
    if (!pluginManagerRef.current) {
      pluginManagerRef.current = new PluginManager();
      
      // Initialize the plugin manager
      pluginManagerRef.current.initialize().then(() => {
        console.log('Plugin system initialized');
      });
    }

    return () => {
      if (pluginManagerRef.current) {
        pluginManagerRef.current.destroy();
        pluginManagerRef.current = null;
      }
    };
  }, []);

  const registerPlugin = React.useCallback((config: PluginConfig): PluginInstance => {
    if (!pluginManagerRef.current) {
      throw new Error('Plugin manager not initialized');
    }

    // Create event bus for this plugin
    const eventBus = new PluginEventBus();

    // Create plugin API
    const api = createPluginAPI({
      ...apiContext,
      eventBus,
      getState: (key: string) => pluginManagerRef.current?.getGlobalState(key),
      setState: (key: string, value: any) => pluginManagerRef.current?.setGlobalState(key, value),
      subscribeToState: (key: string, callback: (value: any) => void) => 
        pluginManagerRef.current?.subscribeToGlobalState(key, callback) || (() => {})
    });

    // Create plugin instance
    const pluginInstance: PluginInstance = {
      config,
      api,
      
      async initialize(): Promise<void> {
        console.log(`Initializing plugin: ${config.name} (${config.id})`);
        
        // Apply plugin configuration
        if (config.ui?.theme) {
          api.events.emit('plugin:theme-config', config.ui.theme);
        }
        
        // Initialize extensions
        if (config.extensions) {
          for (const extension of config.extensions) {
            api.events.emit('plugin:extension-loaded', extension);
          }
        }
        
        // Set up feature flags
        if (config.features) {
          api.state.set('plugin:features', config.features);
        }
        
        api.events.emit('plugin:initialized', { pluginId: config.id });
      },
      
      async destroy(): Promise<void> {
        console.log(`Destroying plugin: ${config.name} (${config.id})`);
        
        // Clean up extensions
        if (config.extensions) {
          for (const extension of config.extensions) {
            api.events.emit('plugin:extension-unloaded', extension);
          }
        }
        
        // Clear plugin state
        api.events.emit('plugin:destroyed', { pluginId: config.id });
      },
      
      getState(): Record<string, any> {
        return api.state.get(`plugin:${config.id}:state`) || {};
      },
      
      setState(state: Record<string, any>): void {
        api.state.set(`plugin:${config.id}:state`, state);
      }
    };

    // Register with plugin manager
    pluginManagerRef.current.register(pluginInstance);
    
    // Force re-render to update consumers
    forceUpdate();
    
    return pluginInstance;
  }, [apiContext]);

  const unregisterPlugin = React.useCallback((pluginId: string) => {
    if (pluginManagerRef.current) {
      pluginManagerRef.current.unregister(pluginId);
      forceUpdate();
    }
  }, []);

  const getPlugin = React.useCallback((pluginId: string) => {
    return pluginManagerRef.current?.get(pluginId) || null;
  }, []);

  const getAllPlugins = React.useCallback(() => {
    return pluginManagerRef.current?.getAll() || [];
  }, []);

  const contextValue: PluginContextType = {
    pluginManager: pluginManagerRef.current!,
    registerPlugin,
    unregisterPlugin,
    getPlugin,
    getAllPlugins
  };

  return (
    <PluginContext.Provider value={contextValue}>
      {children}
    </PluginContext.Provider>
  );
};

// Plugin HOC for easy integration
export function withPluginSystem<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P & { pluginConfig?: PluginConfig }> {
  return function PluginEnhancedComponent({ pluginConfig, ...props }: P & { pluginConfig?: PluginConfig }) {
    return (
      <PluginProvider>
        <Component {...props as P} />
        {pluginConfig && <PluginRegistration config={pluginConfig} />}
      </PluginProvider>
    );
  };
}

// Helper component to register a plugin
const PluginRegistration: React.FC<{ config: PluginConfig }> = ({ config }) => {
  const { registerPlugin, unregisterPlugin } = usePluginSystem();
  
  useEffect(() => {
    const plugin = registerPlugin(config);
    
    return () => {
      unregisterPlugin(config.id);
    };
  }, [config, registerPlugin, unregisterPlugin]);
  
  return null;
};