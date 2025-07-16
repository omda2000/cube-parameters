# Model Viewer 3D

A powerful, feature-rich 3D model viewer component for React applications. Built with Three.js and designed for easy integration into any React project.

## Features

🎯 **Easy Integration** - Drop into any React app with minimal setup
🎨 **Themeable** - Light/dark themes with customizable styling
📐 **Measurement Tools** - Built-in measurement and annotation capabilities
🔧 **Advanced Tools** - Selection, point placement, and interactive controls
📱 **Responsive** - Mobile and desktop optimized
⚡ **Performance** - Optimized Three.js rendering with efficient memory management
🔌 **Extensible** - Hook-based architecture for customization
📁 **Multi-Format** - Support for GLTF, GLB, and FBX files

## Installation

```bash
npm install @yourcompany/model-viewer-3d
```

## Quick Start

```tsx
import React from 'react';
import { ModelViewer3D } from '@yourcompany/model-viewer-3d';
import '@yourcompany/model-viewer-3d/dist/style.css';

function App() {
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ModelViewer3D 
        onModelLoad={(model) => console.log('Model loaded:', model.name)}
        onMeasurement={(data) => console.log('Measurement:', data)}
      />
    </div>
  );
}

export default App;
```

## Advanced Usage

```tsx
import React from 'react';
import { ModelViewer3D } from '@yourcompany/model-viewer-3d';
import '@yourcompany/model-viewer-3d/dist/style.css';

function AdvancedViewer() {
  const handleModelLoad = (model) => {
    console.log('Loaded model:', model);
  };

  const handleMeasurement = (measurement) => {
    // Save measurement to database
    saveMeasurement(measurement);
  };

  return (
    <ModelViewer3D
      width="100%"
      height="800px"
      theme="dark"
      showToolbar={true}
      showControlPanel={true}
      
      // Lighting configuration
      lightingConfig={{
        sunlight: { 
          intensity: 1.2, 
          azimuth: 45, 
          elevation: 30 
        },
        ambientLight: { 
          intensity: 0.4 
        },
        environment: {
          backgroundType: 'color',
          backgroundColor: '#1a1a1a'
        }
      }}
      
      // Camera settings
      cameraConfig={{
        defaultDistance: 10,
        enableOrthographic: true,
        fov: 75
      }}
      
      // Tools configuration
      toolsConfig={{
        enableMeasurement: true,
        enablePointTool: true,
        showGrid: true,
        showGroundPlane: false
      }}
      
      // Event callbacks
      onModelLoad={handleModelLoad}
      onMeasurement={handleMeasurement}
      onPointCreate={(point) => console.log('Point created:', point)}
      onToolChange={(tool) => console.log('Tool changed:', tool)}
      onViewChange={(view) => console.log('View changed:', view)}
    />
  );
}

export default AdvancedViewer;
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `string \| number` | `'100%'` | Container width |
| `height` | `string \| number` | `'600px'` | Container height |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'dark'` | UI theme |
| `showToolbar` | `boolean` | `true` | Show main toolbar |
| `showControlPanel` | `boolean` | `true` | Show control panel |
| `initialModel` | `File \| string` | - | Initial model to load (File or URL) |
| `lightingConfig` | `LightingConfiguration` | - | Lighting settings |
| `cameraConfig` | `CameraConfiguration` | - | Camera settings |
| `toolsConfig` | `ToolsConfiguration` | - | Tools configuration |

### Events

| Event | Type | Description |
|-------|------|-------------|
| `onModelLoad` | `(model: LoadedModel) => void` | Called when a model loads |
| `onModelError` | `(error: Error) => void` | Called on model load error |
| `onMeasurement` | `(data: MeasureData) => void` | Called when measurement is created |
| `onPointCreate` | `(point: {x,y,z}) => void` | Called when point is placed |
| `onSceneReady` | `(scene: THREE.Scene) => void` | Called when 3D scene is ready |
| `onToolChange` | `(tool: string) => void` | Called when active tool changes |

### Configuration Objects

#### LightingConfiguration
```typescript
interface LightingConfiguration {
  sunlight?: {
    intensity?: number;
    azimuth?: number;
    elevation?: number;
  };
  ambientLight?: {
    intensity?: number;
    color?: string;
  };
  environment?: {
    backgroundType?: 'color' | 'environment' | 'skybox';
    backgroundColor?: string;
  };
}
```

#### CameraConfiguration
```typescript
interface CameraConfiguration {
  defaultDistance?: number;
  enableOrthographic?: boolean;
  fov?: number;
  near?: number;
  far?: number;
}
```

#### ToolsConfiguration
```typescript
interface ToolsConfiguration {
  enableMeasurement?: boolean;
  enablePointTool?: boolean;
  enableSelection?: boolean;
  showGrid?: boolean;
  showGroundPlane?: boolean;
}
```

## Styling

The component includes default styling that can be customized:

```css
/* Override default styles */
.model-viewer-3d {
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Customize toolbar */
.model-viewer-3d .toolbar {
  background: rgba(0, 0, 0, 0.8);
}
```

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

Requires WebGL 2.0 support for optimal performance.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build library
npm run build:package

# Run tests
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.

## Support

- 📧 Email: support@yourcompany.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourcompany/model-viewer-3d/issues)
- 📖 Docs: [Documentation](https://docs.yourcompany.com/model-viewer-3d)

---

Made with ❤️ by [Your Company](https://yourcompany.com)