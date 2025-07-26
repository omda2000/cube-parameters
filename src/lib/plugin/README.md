# 3D Model Viewer Plugin System

A comprehensive plugin system for the 3D Model Viewer that allows easy integration into host applications with extensive customization options.

## Quick Start

### Basic Usage

```tsx
import { ModelViewer3D } from '@omda2000/3d-model-viewer';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ModelViewer3D
        onFileUpload={(file) => console.log('Uploaded:', file.name)}
        onPointCreate={(point) => console.log('Point:', point)}
      />
    </div>
  );
}
```

### Using Variants

```tsx
import { 
  MinimalViewer, 
  CompactViewer, 
  ProfessionalViewer,
  HeadlessViewer 
} from '@omda2000/3d-model-viewer';

// Minimal viewer with essential features only
<MinimalViewer showBasicControls />

// Compact viewer for space-constrained layouts
<CompactViewer controlsPosition="bottom" />

// Professional viewer with all features
<ProfessionalViewer 
  enableAdvancedFeatures 
  enablePerformanceMonitoring 
/>

// Headless viewer for programmatic control
<HeadlessViewer ref={viewerRef} />
```

### Custom Plugin Configuration

```tsx
import { ModelViewer3D } from '@omda2000/3d-model-viewer';

const customConfig = {
  id: 'my-custom-viewer',
  name: 'Custom 3D Viewer',
  version: '1.0.0',
  ui: {
    layout: 'compact',
    showToolbar: true,
    showControlPanel: false,
    theme: {
      colors: {
        primary: '#007bff',
        secondary: '#6c757d'
      }
    }
  },
  features: {
    enableMeasurements: false,
    enablePointTools: true,
    maxFileSize: 50 * 1024 * 1024 // 50MB
  }
};

<ModelViewer3D pluginConfig={customConfig} />
```

## Plugin System Features

### 1. Multiple Component Variants

- **MinimalViewer**: Essential features only
- **CompactViewer**: Space-efficient layout
- **HeadlessViewer**: No UI, API-only access
- **ProfessionalViewer**: Full-featured with advanced options
- **EmbeddedViewer**: Optimized for host app integration

### 2. Flexible Configuration

```tsx
interface PluginConfig {
  id: string;
  name: string;
  version: string;
  
  ui?: {
    showToolbar?: boolean;
    showControlPanel?: boolean;
    layout?: 'default' | 'minimal' | 'compact' | 'custom';
    theme?: Record<string, string>;
  };
  
  features?: {
    enableMeasurements?: boolean;
    enablePointTools?: boolean;
    enableSelection?: boolean;
    supportedFormats?: string[];
    maxFileSize?: number;
  };
  
  integration?: {
    eventBus?: PluginEventBus;
    stateSync?: boolean;
    analytics?: PluginAnalytics;
  };
}
```

### 3. Comprehensive API

```tsx
// Access the plugin API
const { registerPlugin } = usePluginSystem();

const plugin = registerPlugin(config);

// Control models
await plugin.api.models.load(file);
plugin.api.models.switch(modelId);

// Control scene
plugin.api.scene.setStandardView('front');
plugin.api.scene.switchCamera(true);

// Control tools
plugin.api.tools.setActiveTool('measure');
plugin.api.tools.createPoint({ x: 0, y: 0, z: 0 });

// Control UI
plugin.api.ui.showPanel('properties');
plugin.api.ui.setTheme('dark');

// State management
plugin.api.state.set('customData', value);
const data = plugin.api.state.get('customData');
```

### 4. Event System

```tsx
// Listen to events
plugin.api.events.on('model:loaded', (data) => {
  console.log('Model loaded:', data.model);
});

plugin.api.events.on('tool:changed', (data) => {
  console.log('Tool changed to:', data.tool);
});

// Emit custom events
plugin.api.events.emit('custom:event', { data: 'value' });
```

### 5. Plugin Extensions

```tsx
const customExtension = {
  id: 'custom-tool',
  name: 'Custom Tool',
  type: 'tool',
  component: CustomToolComponent,
  hooks: {
    onActivate: () => console.log('Custom tool activated'),
    onDeactivate: () => console.log('Custom tool deactivated')
  }
};

const pluginConfig = {
  id: 'extended-viewer',
  name: 'Extended Viewer',
  version: '1.0.0',
  extensions: [customExtension]
};
```

## Integration Examples

### React Integration

```tsx
import { ModelViewer3D, usePluginSystem } from '@omda2000/3d-model-viewer';

function MyApp() {
  const handleModelChange = (models, current) => {
    // Sync with your app state
    setAppModels(models);
    setCurrentModel(current);
  };

  return (
    <ModelViewer3D
      onModelsChange={handleModelChange}
      onPointCreate={(point) => addPointToDatabase(point)}
      pluginConfig={{
        id: 'my-app-viewer',
        name: 'My App 3D Viewer',
        version: '1.0.0',
        integration: {
          stateSync: true,
          analytics: {
            track: (event, data) => analytics.track(event, data)
          }
        }
      }}
    />
  );
}
```

### Next.js Integration

```tsx
// pages/viewer.tsx
import dynamic from 'next/dynamic';

const ModelViewer3D = dynamic(
  () => import('@omda2000/3d-model-viewer').then(mod => mod.ModelViewer3D),
  { ssr: false }
);

export default function ViewerPage() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ModelViewer3D />
    </div>
  );
}
```

### Embedded Integration

```tsx
import { EmbeddedViewer } from '@omda2000/3d-model-viewer';

function ProductViewer({ productId }) {
  return (
    <div className="product-viewer-container">
      <EmbeddedViewer
        hostTheme="light"
        isolateCSS={true}
        onFileUpload={(file) => uploadProductModel(productId, file)}
        style={{ 
          width: '600px', 
          height: '400px',
          border: '1px solid #ddd',
          borderRadius: '8px'
        }}
      />
    </div>
  );
}
```

## Advanced Features

### Custom Analytics

```tsx
const analyticsConfig = {
  track: (event, data) => {
    // Send to your analytics service
    gtag('event', event, data);
  },
  identify: (userId, traits) => {
    // Identify user
    gtag('config', 'GA_MEASUREMENT_ID', { user_id: userId });
  }
};

<ModelViewer3D
  pluginConfig={{
    id: 'analytics-viewer',
    name: 'Analytics Viewer',
    version: '1.0.0',
    integration: {
      analytics: analyticsConfig
    }
  }}
/>
```

### Custom Logger

```tsx
const loggerConfig = {
  info: (message, data) => console.log(`[INFO] ${message}`, data),
  warn: (message, data) => console.warn(`[WARN] ${message}`, data),
  error: (message, data) => console.error(`[ERROR] ${message}`, data),
  debug: (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, data);
    }
  }
};
```

### Performance Monitoring

```tsx
<ProfessionalViewer
  enablePerformanceMonitoring={true}
  pluginConfig={{
    id: 'performance-viewer',
    name: 'Performance Viewer',
    version: '1.0.0',
    features: {
      enablePerformanceMonitoring: true,
      maxPolygons: 1000000,
      enableLOD: true
    }
  }}
/>
```

## Best Practices

1. **Use Appropriate Variants**: Choose the right variant for your use case
2. **Configure Features**: Only enable features you need to optimize performance
3. **Handle Events**: Implement proper event handlers for your app's needs
4. **Error Handling**: Always implement error boundaries around the viewer
5. **Performance**: Monitor performance with large models and adjust settings accordingly
6. **State Management**: Use the plugin state system for persistence if needed

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Dependencies

The plugin system requires these peer dependencies:
- React 18+
- Three.js 0.170+

All other dependencies are bundled with the package.