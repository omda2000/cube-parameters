# 3D Model Viewer

[![npm version](https://badge.fury.io/js/%40omda2000%2F3d-model-viewer.svg)](https://badge.fury.io/js/%40omda2000%2F3d-model-viewer)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive, production-ready React component for viewing and interacting with 3D models. Built with Three.js, TypeScript, and modern React patterns for maximum performance and developer experience.

## ✨ Features

- 🎯 **Interactive 3D Viewing**: Smooth navigation with mouse, touch, and keyboard controls
- 📁 **Multi-Format Support**: FBX, GLTF/GLB model loading with optimized parsing
- 📏 **Advanced Measurement Tools**: Distance measurements with real-time calculations and units
- 💡 **Dynamic Lighting**: Adjustable ambient, directional, and environment lighting
- 🌳 **Scene Tree Management**: Hierarchical object management with selection and visibility controls
- 📱 **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- 🔧 **TypeScript Support**: Full type safety, IntelliSense, and comprehensive type definitions
- 🔌 **Plugin Architecture**: Extensible system with 5+ pre-built viewer variants
- ⚡ **Performance Optimized**: WebGL acceleration, efficient rendering, and memory management
- 🎨 **Customizable UI**: Tailwind CSS integration with theme support and CSS variables
- ♿ **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## 📦 Installation

### Single Command Install

```bash
npm install @omda2000/3d-model-viewer
```

**That's it!** ✅ All dependencies are bundled including React, React-DOM, Three.js, and all UI components. No additional peer dependencies required.

### Alternative Package Managers

```bash
# Using yarn
yarn add @omda2000/3d-model-viewer

# Using pnpm
pnpm add @omda2000/3d-model-viewer

# Using bun
bun add @omda2000/3d-model-viewer
```

## 🚀 Quick Start

```tsx
import React from 'react';
import { ModelViewer3D } from '@omda2000/3d-model-viewer';
import '@omda2000/3d-model-viewer/styles'; // Import CSS styles

function App() {
  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file.name);
  };

  const handlePointCreate = (point: { x: number; y: number; z: number }) => {
    console.log('Point created at:', point);
  };

  const handleMeasureCreate = (start: Vector3, end: Vector3) => {
    console.log('Measurement created:', { start, end });
  };

  const handleModelsChange = (models: LoadedModel[]) => {
    console.log('Models updated:', models.length);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ModelViewer3D
        onFileUpload={handleFileUpload}
        onPointCreate={handlePointCreate}
        onMeasureCreate={handleMeasureCreate}
        onModelsChange={handleModelsChange}
        defaultTheme="dark"
        className="custom-viewer"
        debug={process.env.NODE_ENV === 'development'}
      />
    </div>
  );
}

export default App;
```

## 🎨 Viewer Variants

Choose from multiple pre-configured viewer variants:

### MinimalViewer
Perfect for simple model viewing with essential controls only.

```tsx
import { MinimalViewer } from '@omda2000/3d-model-viewer';

<MinimalViewer onFileUpload={handleFileUpload} />
```

### CompactViewer
Space-efficient variant with collapsible panels.

```tsx
import { CompactViewer } from '@omda2000/3d-model-viewer';

<CompactViewer 
  onFileUpload={handleFileUpload}
  showMeasurements={true}
  compactMode={true}
/>
```

### ProfessionalViewer
Full-featured variant with all tools and panels.

```tsx
import { ProfessionalViewer } from '@omda2000/3d-model-viewer';

<ProfessionalViewer
  onFileUpload={handleFileUpload}
  enableAdvancedLighting={true}
  showAnalytics={true}
/>
```

### HeadlessViewer
Programmatic control without UI - perfect for custom implementations.

```tsx
import { HeadlessViewer, useHeadlessAPI } from '@omda2000/3d-model-viewer';

function CustomViewer() {
  const { loadModel, measureDistance, getScene } = useHeadlessAPI();
  
  return (
    <HeadlessViewer
      onReady={(api) => {
        // Access full programmatic API
        api.camera.setPosition(0, 5, 10);
        api.lighting.setIntensity(0.8);
      }}
    />
  );
}
```

### EmbeddedViewer
Optimized for iframe embedding and third-party integration.

```tsx
import { EmbeddedViewer } from '@omda2000/3d-model-viewer';

<EmbeddedViewer
  modelUrl="https://example.com/model.glb"
  embedMode={true}
  allowFullscreen={true}
/>
```

## 🔧 Advanced Usage

### Custom Styling with CSS Variables

```tsx
import { ModelViewer3D } from '@omda2000/3d-model-viewer';
import '@omda2000/3d-model-viewer/styles';

function ThemedViewer() {
  return (
    <div 
      className="custom-viewer-container"
      style={{
        '--primary': '220 70% 50%',      // HSL values
        '--background': '220 15% 8%',    // Dark theme
        '--foreground': '220 15% 95%',   // Light text
        '--border-radius': '8px',        // Custom border radius
      }}
    >
      <ModelViewer3D
        onFileUpload={(file) => console.log(file)}
        defaultTheme="custom"
      />
    </div>
  );
}
```

### State Management Integration

```tsx
import React, { useState, useCallback } from 'react';
import { ModelViewer3D, LoadedModel, useAppStore } from '@omda2000/3d-model-viewer';

function StatefulViewer() {
  const [models, setModels] = useState<LoadedModel[]>([]);
  const [selectedObject, setSelectedObject] = useState(null);
  
  const handleModelLoad = useCallback((newModels: LoadedModel[]) => {
    setModels(newModels);
    // Save to localStorage, state management, etc.
    localStorage.setItem('loadedModels', JSON.stringify(newModels));
  }, []);

  return (
    <ModelViewer3D
      onModelsChange={handleModelLoad}
      onObjectSelect={setSelectedObject}
      onFileUpload={(file) => console.log('Loading:', file.name)}
      className="h-screen w-full"
    />
  );
}
```

### Plugin System Integration

```tsx
import { 
  ModelViewer3D, 
  PluginProvider, 
  createPluginAPI,
  type PluginConfig 
} from '@omda2000/3d-model-viewer';

const customPluginConfig: PluginConfig = {
  ui: {
    showMeasurements: true,
    showLighting: true,
    showSceneTree: true,
    theme: 'professional'
  },
  features: {
    enableKeyboardShortcuts: true,
    enableTouchGestures: true,
    enableVR: false
  },
  analytics: {
    trackInteractions: true,
    customLogger: (event, data) => {
      // Send to your analytics service
      console.log('Analytics:', event, data);
    }
  }
};

function PluginEnabledViewer() {
  return (
    <PluginProvider config={customPluginConfig}>
      <ModelViewer3D onFileUpload={handleFileUpload} />
    </PluginProvider>
  );
}
```

## 📋 API Reference

### ModelViewer3D Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | CSS class for custom styling |
| `style` | `React.CSSProperties` | `{}` | Inline styles and CSS variables |
| `onFileUpload` | `(file: File) => void` | `undefined` | Callback when file is uploaded |
| `onModelsChange` | `(models: LoadedModel[]) => void` | `undefined` | Callback when models array changes |
| `onPointCreate` | `(point: {x: number, y: number, z: number}) => void` | `undefined` | Callback when measurement point is created |
| `onMeasureCreate` | `(start: Vector3, end: Vector3) => void` | `undefined` | Callback when measurement is completed |
| `onObjectSelect` | `(object: SceneObject \| null) => void` | `undefined` | Callback when 3D object is selected |
| `onCameraChange` | `(position: Vector3, target: Vector3) => void` | `undefined` | Callback when camera position changes |
| `onSceneReady` | `(scene: Scene, camera: Camera, renderer: WebGLRenderer) => void` | `undefined` | Callback when Three.js scene is ready |
| `onToolChange` | `(tool: 'select' \| 'point' \| 'measure' \| 'move') => void` | `undefined` | Callback when active tool changes |
| `onError` | `(error: Error, context: string) => void` | `undefined` | Callback for error handling |
| `defaultTheme` | `"light" \| "dark" \| "auto"` | `"dark"` | Default theme preference |
| `debug` | `boolean` | `false` | Enable debug mode with console logging |
| `initialCamera` | `{position: Vector3, target: Vector3}` | `undefined` | Initial camera position and target |
| `enableVR` | `boolean` | `false` | Enable WebXR VR support |
| `performance` | `"low" \| "medium" \| "high"` | `"medium"` | Performance/quality preset |

### TypeScript Interfaces

```tsx
interface LoadedModel {
  id: string;
  name: string;
  url: string;
  object: THREE.Object3D;
  boundingBox: THREE.Box3;
  materials: THREE.Material[];
  animations: THREE.AnimationClip[];
  metadata: {
    triangles: number;
    vertices: number;
    fileSize: number;
    loadTime: number;
  };
}

interface SceneObject {
  id: string;
  name: string;
  type: 'mesh' | 'group' | 'light' | 'camera';
  object: THREE.Object3D;
  parent?: SceneObject;
  children: SceneObject[];
  visible: boolean;
  selected: boolean;
  material?: THREE.Material;
}

interface MeasurementPoint {
  id: string;
  position: THREE.Vector3;
  worldPosition: THREE.Vector3;
  objectId?: string;
  label?: string;
  timestamp: number;
}
```

## ⚡ Performance & Optimization

### Performance Presets

```tsx
// Low performance - mobile/low-end devices
<ModelViewer3D performance="low" />

// Medium performance - balanced (default)
<ModelViewer3D performance="medium" />

// High performance - desktop/high-end devices  
<ModelViewer3D performance="high" />
```

### Custom Performance Tuning

```tsx
import { ModelViewer3D, useAppStore } from '@omda2000/3d-model-viewer';

function OptimizedViewer() {
  const { setRenderSettings } = useAppStore();
  
  useEffect(() => {
    setRenderSettings({
      antialias: false,        // Disable for better performance
      shadows: 'basic',        // 'off' | 'basic' | 'soft'
      postProcessing: false,   // Disable bloom, SSAO etc.
      pixelRatio: 1,          // Limit pixel ratio
      maxLights: 3            // Limit concurrent lights
    });
  }, []);

  return <ModelViewer3D onFileUpload={handleFileUpload} />;
}
```

## 📝 Supported File Formats

| Format | Extension | Features | Recommended Use |
|--------|-----------|----------|-----------------|
| **GLTF 2.0** | `.gltf`, `.glb` | ✅ Materials, ✅ Animations, ✅ PBR, ✅ Compression | **Recommended** - Modern standard |
| **FBX** | `.fbx` | ✅ Materials, ✅ Animations, ⚠️ Large files | Legacy CAD files |

### Loading External Models

```tsx
import { ModelViewer3D } from '@omda2000/3d-model-viewer';

function ExternalModelViewer() {
  const modelUrl = "https://example.com/models/car.glb";
  
  return (
    <ModelViewer3D
      onSceneReady={async (scene, camera, renderer) => {
        // Load model programmatically
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(modelUrl);
        scene.add(gltf.scene);
      }}
    />
  );
}
```

## ⌨️ Keyboard Shortcuts

| Key | Action | Context |
|-----|--------|---------|
| `Esc` | Clear selection | Always |
| `A` | Zoom to fit all | Always |
| `F` | Focus selected object | When object selected |
| `1` | Front view | Always |
| `2` | Back view | Always |
| `3` | Right view | Always |
| `4` | Left view | Always |
| `5` | Top view | Always |
| `6` | Bottom view | Always |
| `Space` | Toggle measurement tool | Always |
| `Delete` | Delete selected | When object selected |
| `Ctrl+Z` | Undo last action | Always |
| `Ctrl+Y` | Redo last action | Always |

## 🎨 Theming & Customization

### CSS Variables

```css
:root {
  /* Primary colors (HSL values) */
  --primary: 220 70% 50%;
  --primary-foreground: 220 15% 95%;
  
  /* Background colors */
  --background: 220 15% 8%;
  --foreground: 220 15% 95%;
  --muted: 220 15% 15%;
  --muted-foreground: 220 15% 65%;
  
  /* UI colors */
  --border: 220 15% 20%;
  --input: 220 15% 15%;
  --ring: 220 70% 50%;
  
  /* Semantic colors */
  --destructive: 0 70% 50%;
  --success: 120 70% 50%;
  --warning: 45 90% 55%;
  
  /* Layout */
  --radius: 0.5rem;
  --font-family: 'Inter', sans-serif;
}
```

### Tailwind Integration

```tsx
// tailwind.config.js
module.exports = {
  content: [
    "./node_modules/@omda2000/3d-model-viewer/dist/**/*.{js,ts,jsx,tsx}",
    // ... your other content paths
  ],
  // ... rest of config
}
```

## 🌍 Internationalization

```tsx
import { ModelViewer3D } from '@omda2000/3d-model-viewer';

const translations = {
  'en': {
    'measurement.distance': 'Distance',
    'file.upload': 'Upload Model',
    // ... more translations
  },
  'es': {
    'measurement.distance': 'Distancia',
    'file.upload': 'Subir Modelo',
  }
};

<ModelViewer3D 
  locale="es"
  translations={translations}
  onFileUpload={handleFileUpload} 
/>
```

## 🔧 Development

### Building from Source

```bash
git clone https://github.com/omda2000/3d-model-viewer.git
cd 3d-model-viewer
npm install
npm run build:package
```

### Running Examples

```bash
npm run dev  # Start development server
npm run preview  # Preview production build
```

## 📊 Browser Support

| Browser | Version | WebGL | WebGL 2 | Notes |
|---------|---------|-------|---------|-------|
| Chrome | 91+ | ✅ | ✅ | Full support |
| Firefox | 90+ | ✅ | ✅ | Full support |
| Safari | 15+ | ✅ | ✅ | iOS 15+ |
| Edge | 91+ | ✅ | ✅ | Full support |

### Mobile Support
- ✅ Touch gestures (pan, zoom, rotate)
- ✅ Responsive UI adaptation
- ✅ Performance optimization for mobile GPUs
- ✅ iOS Safari and Android Chrome

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/omda2000/3d-model-viewer/blob/main/CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/omda2000/3d-model-viewer.git
cd 3d-model-viewer
npm install
npm run dev
```

## 📄 License

MIT License - see [LICENSE](https://github.com/omda2000/3d-model-viewer/blob/main/LICENSE) file for details.

## 🆘 Support

- 📖 [Documentation](https://github.com/omda2000/3d-model-viewer#readme)
- 🐛 [Issue Tracker](https://github.com/omda2000/3d-model-viewer/issues)
- 💬 [Discussions](https://github.com/omda2000/3d-model-viewer/discussions)
- ⭐ [Star on GitHub](https://github.com/omda2000/3d-model-viewer)

---

Made with ❤️ by [omda2000](https://github.com/omda2000)