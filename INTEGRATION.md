# Integration Guide

## Installation

```bash
npm install @yourcompany/model-viewer-3d
```

## Framework Integrations

### React (Create React App)

```tsx
// App.tsx
import React from 'react';
import { ModelViewer3D } from '@yourcompany/model-viewer-3d';
import '@yourcompany/model-viewer-3d/dist/style.css';

function App() {
  return (
    <div className="App">
      <h1>My 3D App</h1>
      <div style={{ width: '100%', height: '600px' }}>
        <ModelViewer3D 
          theme="dark"
          showToolbar={true}
          onModelLoad={(model) => console.log('Loaded:', model)}
        />
      </div>
    </div>
  );
}

export default App;
```

### Next.js

```tsx
// pages/viewer.tsx
'use client';
import dynamic from 'next/dynamic';

const ModelViewer3D = dynamic(
  () => import('@yourcompany/model-viewer-3d').then(mod => mod.ModelViewer3D),
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

### Vite + React

```tsx
// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ModelViewer3D } from '@yourcompany/model-viewer-3d';
import '@yourcompany/model-viewer-3d/dist/style.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ModelViewer3D width="100vw" height="100vh" />
  </React.StrictMode>
);
```

## Advanced Configuration

### Custom Theme Integration

```tsx
import React from 'react';
import { ModelViewer3D, ThemeProvider } from '@yourcompany/model-viewer-3d';

function CustomThemedViewer() {
  return (
    <ThemeProvider defaultTheme="dark">
      <ModelViewer3D 
        lightingConfig={{
          sunlight: { intensity: 1.5, azimuth: 60 },
          ambientLight: { intensity: 0.3 }
        }}
      />
    </ThemeProvider>
  );
}
```

### Event Handling

```tsx
import React, { useState } from 'react';
import { ModelViewer3D } from '@yourcompany/model-viewer-3d';

function EventHandlingExample() {
  const [modelInfo, setModelInfo] = useState(null);
  const [measurements, setMeasurements] = useState([]);

  return (
    <div>
      <div>Model: {modelInfo?.name || 'None loaded'}</div>
      <div>Measurements: {measurements.length}</div>
      
      <ModelViewer3D 
        onModelLoad={setModelInfo}
        onMeasurement={(data) => setMeasurements(prev => [...prev, data])}
        onPointCreate={(point) => console.log('Point:', point)}
      />
    </div>
  );
}
```

### File Upload Integration

```tsx
import React, { useState } from 'react';
import { ModelViewer3D } from '@yourcompany/model-viewer-3d';

function FileUploadExample() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  return (
    <div>
      <input 
        type="file" 
        accept=".glb,.gltf,.fbx"
        onChange={handleFileChange}
      />
      
      <ModelViewer3D 
        initialModel={selectedFile}
        onModelLoad={(model) => console.log('Loaded:', model.name)}
        onModelError={(error) => console.error('Error:', error)}
      />
    </div>
  );
}
```

## CSS Customization

### Override Default Styles

```css
/* styles.css */
.model-viewer-3d {
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 2px solid #333;
}

.model-viewer-3d .toolbar {
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(10px);
}

.model-viewer-3d .control-panel {
  background: rgba(30, 30, 30, 0.9);
}
```

### Custom Theme Variables

```css
/* theme.css */
:root {
  /* Override package theme variables */
  --mv3d-primary: #your-brand-color;
  --mv3d-background: #your-bg-color;
  --mv3d-surface: #your-surface-color;
}

.model-viewer-3d {
  --primary: var(--mv3d-primary);
  --background: var(--mv3d-background);
  --card: var(--mv3d-surface);
}
```

## Performance Optimization

### Lazy Loading

```tsx
import React, { Suspense, lazy } from 'react';

const ModelViewer3D = lazy(() => 
  import('@yourcompany/model-viewer-3d').then(mod => ({ 
    default: mod.ModelViewer3D 
  }))
);

function LazyViewer() {
  return (
    <Suspense fallback={<div>Loading 3D Viewer...</div>}>
      <ModelViewer3D />
    </Suspense>
  );
}
```

### Memory Management

```tsx
import React, { useEffect, useRef } from 'react';
import { ModelViewer3D } from '@yourcompany/model-viewer-3d';

function ManagedViewer() {
  const viewerRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup will be handled automatically by the component
      console.log('Viewer unmounted - resources cleaned up');
    };
  }, []);

  return (
    <ModelViewer3D 
      ref={viewerRef}
      onSceneReady={(scene) => {
        // Store scene reference if needed for external manipulation
        window.currentScene = scene;
      }}
    />
  );
}
```

## TypeScript Support

### Type Definitions

```tsx
import type { 
  LoadedModel, 
  MeasureData,
  ModelViewer3DProps 
} from '@yourcompany/model-viewer-3d';

interface MyAppProps {
  initialModel?: File;
  onModelChange?: (model: LoadedModel) => void;
}

function TypedViewer({ initialModel, onModelChange }: MyAppProps) {
  const handleMeasurement = (data: MeasureData) => {
    // Type-safe measurement handling
    console.log(`Distance: ${data.distance.toFixed(2)} units`);
  };

  const viewerConfig: Partial<ModelViewer3DProps> = {
    theme: 'dark',
    showToolbar: true,
    lightingConfig: {
      sunlight: { intensity: 1.2, azimuth: 45, elevation: 30 }
    }
  };

  return (
    <ModelViewer3D 
      {...viewerConfig}
      initialModel={initialModel}
      onModelLoad={onModelChange}
      onMeasurement={handleMeasurement}
    />
  );
}
```

## Troubleshooting

### Common Issues

1. **WebGL Context Lost**
   ```tsx
   <ModelViewer3D 
     onModelError={(error) => {
       if (error.message.includes('WebGL')) {
         console.warn('WebGL context lost - reloading page');
         window.location.reload();
       }
     }}
   />
   ```

2. **File Loading Errors**
   ```tsx
   const handleFileError = (error) => {
     if (error.message.includes('CORS')) {
       console.error('CORS error - check server configuration');
     } else if (error.message.includes('format')) {
       console.error('Unsupported file format');
     }
   };
   ```

3. **Performance Issues**
   ```tsx
   <ModelViewer3D 
     toolsConfig={{
       // Disable heavy features for better performance
       enableMeasurement: false,
       showGrid: false
     }}
     lightingConfig={{
       // Reduce lighting complexity
       sunlight: { intensity: 1.0 }
     }}
   />
   ```

## Browser Compatibility

| Browser | Version | Notes |
|---------|---------|-------|
| Chrome | 88+ | Full support |
| Firefox | 85+ | Full support |
| Safari | 14+ | Full support |
| Edge | 88+ | Full support |
| Mobile Safari | 14+ | Limited performance |
| Chrome Mobile | 88+ | Good performance |

### Feature Detection

```tsx
function BrowserCompatCheck() {
  const isWebGLSupported = () => {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
               canvas.getContext('webgl'));
    } catch (e) {
      return false;
    }
  };

  if (!isWebGLSupported()) {
    return <div>WebGL not supported - 3D viewer unavailable</div>;
  }

  return <ModelViewer3D />;
}
```