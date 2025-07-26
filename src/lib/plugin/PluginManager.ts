import type { 
  PluginManager as IPluginManager, 
  PluginInstance, 
  PluginConfig,
  PluginEventBus as IPluginEventBus,
  PluginEvents
} from './types';

export class PluginEventBus implements IPluginEventBus {
  private listeners: Map<string, Set<Function>> = new Map();

  on(event: string, handler: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }

  off(event: string, handler: (data: any) => void): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  emit(event: string, data?: any): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  once(event: string, handler: (data: any) => void): void {
    const onceHandler = (data: any) => {
      handler(data);
      this.off(event, onceHandler);
    };
    this.on(event, onceHandler);
  }

  clear(): void {
    this.listeners.clear();
  }
}

export class PluginManager implements IPluginManager {
  private plugins: Map<string, PluginInstance> = new Map();
  private eventBus: PluginEventBus = new PluginEventBus();
  private globalState: Map<string, any> = new Map();
  private stateSubscriptions: Map<string, Set<Function>> = new Map();

  constructor() {
    // Global error handling
    this.eventBus.on('error', (error) => {
      console.error('Plugin Error:', error);
    });
  }

  register(plugin: PluginInstance): void {
    const { id } = plugin.config;
    
    if (this.plugins.has(id)) {
      throw new Error(`Plugin with id "${id}" is already registered`);
    }

    // Validate plugin configuration
    this.validatePluginConfig(plugin.config);

    // Set up plugin event bus connection
    this.connectPluginEvents(plugin);

    this.plugins.set(id, plugin);
    
    console.log(`Plugin "${plugin.config.name}" (${id}) registered successfully`);
    this.eventBus.emit('plugin:registered', { plugin });
  }

  unregister(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      console.warn(`Plugin "${pluginId}" not found`);
      return;
    }

    // Cleanup plugin
    plugin.destroy().catch(error => {
      console.error(`Error destroying plugin "${pluginId}":`, error);
    });

    this.plugins.delete(pluginId);
    
    console.log(`Plugin "${pluginId}" unregistered successfully`);
    this.eventBus.emit('plugin:unregistered', { pluginId });
  }

  get(pluginId: string): PluginInstance | null {
    return this.plugins.get(pluginId) || null;
  }

  getAll(): PluginInstance[] {
    return Array.from(this.plugins.values());
  }

  async initialize(): Promise<void> {
    console.log('Initializing Plugin Manager...');
    
    const initPromises = Array.from(this.plugins.values()).map(async (plugin) => {
      try {
        await plugin.initialize();
        console.log(`Plugin "${plugin.config.id}" initialized successfully`);
      } catch (error) {
        console.error(`Failed to initialize plugin "${plugin.config.id}":`, error);
        this.eventBus.emit('error', { error, context: `plugin:${plugin.config.id}:initialization` });
      }
    });

    await Promise.allSettled(initPromises);
    
    this.eventBus.emit('plugin-manager:initialized');
    console.log('Plugin Manager initialized successfully');
  }

  async destroy(): Promise<void> {
    console.log('Destroying Plugin Manager...');
    
    const destroyPromises = Array.from(this.plugins.values()).map(async (plugin) => {
      try {
        await plugin.destroy();
        console.log(`Plugin "${plugin.config.id}" destroyed successfully`);
      } catch (error) {
        console.error(`Failed to destroy plugin "${plugin.config.id}":`, error);
      }
    });

    await Promise.allSettled(destroyPromises);
    
    this.plugins.clear();
    this.eventBus.clear();
    this.globalState.clear();
    this.stateSubscriptions.clear();
    
    console.log('Plugin Manager destroyed successfully');
  }

  // Global state management
  getGlobalState(key: string): any {
    return this.globalState.get(key);
  }

  setGlobalState(key: string, value: any): void {
    this.globalState.set(key, value);
    
    // Notify subscribers
    const subscribers = this.stateSubscriptions.get(key);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(value);
        } catch (error) {
          console.error(`Error in state subscription for key "${key}":`, error);
        }
      });
    }
    
    this.eventBus.emit('global-state:changed', { key, value });
  }

  subscribeToGlobalState(key: string, callback: (value: any) => void): () => void {
    if (!this.stateSubscriptions.has(key)) {
      this.stateSubscriptions.set(key, new Set());
    }
    
    this.stateSubscriptions.get(key)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      const subscribers = this.stateSubscriptions.get(key);
      if (subscribers) {
        subscribers.delete(callback);
        if (subscribers.size === 0) {
          this.stateSubscriptions.delete(key);
        }
      }
    };
  }

  // Event bus access
  getEventBus(): PluginEventBus {
    return this.eventBus;
  }

  // Plugin communication
  sendMessageToPlugin(pluginId: string, message: string, data?: any): void {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      plugin.api.events.emit(`message:${message}`, data);
    } else {
      console.warn(`Plugin "${pluginId}" not found for message: ${message}`);
    }
  }

  broadcastMessage(message: string, data?: any, excludePluginId?: string): void {
    this.plugins.forEach((plugin, pluginId) => {
      if (pluginId !== excludePluginId) {
        plugin.api.events.emit(`broadcast:${message}`, data);
      }
    });
  }

  private validatePluginConfig(config: PluginConfig): void {
    if (!config.id || typeof config.id !== 'string') {
      throw new Error('Plugin must have a valid string id');
    }
    
    if (!config.name || typeof config.name !== 'string') {
      throw new Error('Plugin must have a valid string name');
    }
    
    if (!config.version || typeof config.version !== 'string') {
      throw new Error('Plugin must have a valid string version');
    }
  }

  private connectPluginEvents(plugin: PluginInstance): void {
    // Forward plugin events to global event bus
    const pluginEventBus = plugin.api.events;
    
    // Listen to all plugin events and forward them with plugin context
    const originalEmit = pluginEventBus.emit.bind(pluginEventBus);
    pluginEventBus.emit = (event: string, data?: any) => {
      // Emit to plugin's local event bus
      originalEmit(event, data);
      
      // Forward to global event bus with plugin context
      this.eventBus.emit(`plugin:${plugin.config.id}:${event}`, { 
        pluginId: plugin.config.id, 
        event, 
        data 
      });
    };
  }
}

// Singleton instance
export const pluginManager = new PluginManager();