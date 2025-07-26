import * as THREE from 'three';
import type { 
  PluginAPI, 
  PluginEventBus,
  LoadedModel 
} from './types';
import { useAppStore } from '@/store/useAppStore';
import { useNotifications } from '@/contexts/NotificationContext';

interface PluginAPIContext {
  scene?: THREE.Scene;
  camera?: THREE.Camera;
  renderer?: THREE.WebGLRenderer;
  loadedModels?: LoadedModel[];
  currentModel?: LoadedModel | null;
  eventBus: PluginEventBus;
  
  // State management
  getState?: (key: string) => any;
  setState?: (key: string, value: any) => void;
  subscribeToState?: (key: string, callback: (value: any) => void) => () => void;
  
  // Callback functions
  onFileUpload?: (file: File) => void;
  onModelsChange?: (models: LoadedModel[], current: LoadedModel | null) => void;
  onPointCreate?: (point: { x: number; y: number; z: number }) => void;
  onMeasureCreate?: (start: THREE.Vector3, end: THREE.Vector3) => void;
  onToolChange?: (tool: 'select' | 'point' | 'measure') => void;
  onStandardView?: (view: string) => void;
  onCameraSwitch?: (orthographic: boolean) => void;
}

export function createPluginAPI(context: PluginAPIContext): PluginAPI {
  const {
    scene,
    camera,
    renderer,
    loadedModels = [],
    currentModel = null,
    eventBus,
    getState,
    setState,
    subscribeToState,
    onFileUpload,
    onModelsChange,
    onPointCreate,
    onMeasureCreate,
    onToolChange,
    onStandardView,
    onCameraSwitch
  } = context;

  return {
    // Model Management
    models: {
      async load(file: File): Promise<LoadedModel> {
        if (!onFileUpload) {
          throw new Error('File upload not available in this context');
        }
        
        return new Promise((resolve, reject) => {
          const handleModelsChange = (models: LoadedModel[], current: LoadedModel | null) => {
            // Find the newly added model
            const newModel = models.find(m => 
              !loadedModels.some(existing => existing.id === m.id)
            );
            
            if (newModel) {
              resolve(newModel);
            }
          };
          
          // Temporarily listen for model changes
          const originalHandler = onModelsChange;
          context.onModelsChange = (models, current) => {
            handleModelsChange(models, current);
            // Restore original handler
            context.onModelsChange = originalHandler;
            if (originalHandler) {
              originalHandler(models, current);
            }
          };
          
          // Start the upload
          onFileUpload(file);
          
          // Set a timeout to reject if loading takes too long
          setTimeout(() => {
            context.onModelsChange = originalHandler;
            reject(new Error('Model loading timeout'));
          }, 30000);
        });
      },

      remove(modelId: string): void {
        const updatedModels = loadedModels.filter(m => m.id !== modelId);
        const newCurrent = currentModel?.id === modelId ? null : currentModel;
        
        if (onModelsChange) {
          onModelsChange(updatedModels, newCurrent);
        }
        
        eventBus.emit('model:removed', { modelId });
      },

      switch(modelId: string): void {
        const model = loadedModels.find(m => m.id === modelId);
        if (!model) {
          throw new Error(`Model with id "${modelId}" not found`);
        }
        
        if (onModelsChange) {
          onModelsChange(loadedModels, model);
        }
        
        eventBus.emit('model:switched', { modelId });
      },

      getAll(): LoadedModel[] {
        return [...loadedModels];
      },

      getCurrent(): LoadedModel | null {
        return currentModel;
      }
    },

    // Scene Control
    scene: {
      getScene(): THREE.Scene | null {
        return scene || null;
      },

      getCamera(): THREE.Camera | null {
        return camera || null;
      },

      getRenderer(): THREE.WebGLRenderer | null {
        return renderer || null;
      },

      setStandardView(view: string): void {
        if (onStandardView) {
          onStandardView(view);
          eventBus.emit('camera:standard-view', { view });
        }
      },

      switchCamera(orthographic: boolean): void {
        if (onCameraSwitch) {
          onCameraSwitch(orthographic);
          eventBus.emit('camera:switched', { orthographic });
        }
      }
    },

    // Tools
    tools: {
      setActiveTool(tool: 'select' | 'point' | 'measure'): void {
        if (onToolChange) {
          onToolChange(tool);
          eventBus.emit('tool:changed', { tool });
        }
      },

      getActiveTool(): string {
        // Get from global state if available
        return getState?.('activeTool') || 'select';
      },

      createPoint(position: { x: number; y: number; z: number }): void {
        if (onPointCreate) {
          onPointCreate(position);
          eventBus.emit('point:created', { point: position });
        }
      },

      createMeasurement(start: THREE.Vector3, end: THREE.Vector3): void {
        if (onMeasureCreate) {
          onMeasureCreate(start, end);
          eventBus.emit('measurement:created', { start, end });
        }
      }
    },

    // UI Control
    ui: {
      showPanel(panelId: string): void {
        setState?.(`panel:${panelId}:visible`, true);
        eventBus.emit('ui:panel:toggled', { panelId, visible: true });
      },

      hidePanel(panelId: string): void {
        setState?.(`panel:${panelId}:visible`, false);
        eventBus.emit('ui:panel:toggled', { panelId, visible: false });
      },

      togglePanel(panelId: string): void {
        const currentState = getState?.(`panel:${panelId}:visible`) || false;
        const newState = !currentState;
        setState?.(`panel:${panelId}:visible`, newState);
        eventBus.emit('ui:panel:toggled', { panelId, visible: newState });
      },

      setTheme(theme: 'light' | 'dark' | 'system'): void {
        setState?.('theme', theme);
        eventBus.emit('theme:changed', { theme });
      },

      showNotification(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info'): void {
        // This would integrate with the notification system
        console.log(`[${type.toUpperCase()}] ${message}`);
        eventBus.emit('notification:shown', { message, type });
      }
    },

    // State Management
    state: {
      get(key: string): any {
        return getState?.(key);
      },

      set(key: string, value: any): void {
        setState?.(key, value);
        eventBus.emit('state:changed', { key, value });
      },

      subscribe(key: string, callback: (value: any) => void): () => void {
        if (subscribeToState) {
          return subscribeToState(key, callback);
        }
        
        // Fallback: use event bus for state subscriptions
        const handler = (data: { key: string; value: any }) => {
          if (data.key === key) {
            callback(data.value);
          }
        };
        
        eventBus.on('state:changed', handler);
        
        return () => {
          eventBus.off('state:changed', handler);
        };
      }
    },

    // Events
    events: eventBus
  };
}