# Installation Guide - @omda2000/3d-model-viewer

## Quick Installation

```bash
npm install @omda2000/3d-model-viewer
```

That's it! **All dependencies are bundled** including React, React-DOM, Three.js, and all UI components. No need to install anything else separately.

## Package Managers

### NPM
```bash
npm install @omda2000/3d-model-viewer
```

### Yarn
```bash
yarn add @omda2000/3d-model-viewer
```

### PNPM
```bash
pnpm add @omda2000/3d-model-viewer
```

### Bun
```bash
bun add @omda2000/3d-model-viewer
```

## Framework-Specific Setup

### React (Create React App)

1. **Install the package:**
```bash
npm install @omda2000/3d-model-viewer
```

2. **Import and use in your component:**
```tsx
import React from 'react';
import { ModelViewer3D } from '@omda2000/3d-model-viewer';
import '@omda2000/3d-model-viewer/styles';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ModelViewer3D
        onFileUpload={(file) => console.log('File uploaded:', file.name)}
        onPointCreate={(point) => console.log('Point created:', point)}
      />
    </div>
  );
}

export default App;
```

### Next.js

1. **Install the package:**
```bash
npm install @omda2000/3d-model-viewer
```

2. **Create a client component (Next.js 13+ App Router):**
```tsx
'use client';

import React from 'react';
import { ModelViewer3D } from '@omda2000/3d-model-viewer';
import '@omda2000/3d-model-viewer/styles';

export default function ModelViewerPage() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ModelViewer3D
        onFileUpload={(file) => console.log('File uploaded:', file.name)}
        onPointCreate={(point) => console.log('Point created:', point)}
      />
    </div>
  );
}
```

3. **For Next.js 12 or Pages Router:**
```tsx
import dynamic from 'next/dynamic';

const ModelViewer3D = dynamic(
  () => import('@omda2000/3d-model-viewer').then(mod => mod.ModelViewer3D),
  { ssr: false }
);

export default function ModelViewerPage() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ModelViewer3D
        onFileUpload={(file) => console.log('File uploaded:', file.name)}
      />
    </div>
  );
}
```

### Vite

1. **Install the package:**
```bash
npm install @omda2000/3d-model-viewer
```

2. **Import and use:**
```tsx
import React from 'react';
import { ModelViewer3D } from '@omda2000/3d-model-viewer';
import '@omda2000/3d-model-viewer/styles';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ModelViewer3D />
    </div>
  );
}

export default App;
```

### Remix

1. **Install the package:**
```bash
npm install @omda2000/3d-model-viewer
```

2. **Create a client-only component:**
```tsx
import { ClientOnly } from 'remix-utils';
import { ModelViewer3D } from '@omda2000/3d-model-viewer';
import '@omda2000/3d-model-viewer/styles';

export default function ModelViewerRoute() {
  return (
    <ClientOnly fallback={<div>Loading 3D Viewer...</div>}>
      {() => (
        <div style={{ width: '100vw', height: '100vh' }}>
          <ModelViewer3D />
        </div>
      )}
    </ClientOnly>
  );
}
```

## Viewer Variants

The package includes several pre-configured variants for different use cases:

### Minimal Viewer
```tsx
import { MinimalViewer } from '@omda2000/3d-model-viewer';

<MinimalViewer
  onFileUpload={(file) => console.log('File:', file.name)}
  width="800px"
  height="600px"
/>
```

### Professional Viewer
```tsx
import { ProfessionalViewer } from '@omda2000/3d-model-viewer';

<ProfessionalViewer
  onMeasurementCreate={(measurement) => console.log('Measurement:', measurement)}
  enableAdvancedTools={true}
  showPropertyPanel={true}
/>
```

### Headless Viewer (API Only)
```tsx
import { HeadlessViewer, useViewerAPI } from '@omda2000/3d-model-viewer';

function CustomViewer() {
  const { loadModel, createMeasurement, getScene } = useViewerAPI();
  
  return (
    <div>
      <HeadlessViewer ref={viewerRef} />
      <button onClick={() => loadModel('/path/to/model.glb')}>
        Load Model
      </button>
    </div>
  );
}
```

## CSS Styling

### Import Default Styles
```tsx
import '@omda2000/3d-model-viewer/styles';
```

### Custom Styling with CSS Variables
```css
:root {
  --mv-primary-color: #3b82f6;
  --mv-background-color: #ffffff;
  --mv-panel-background: #f8fafc;
  --mv-border-color: #e2e8f0;
  --mv-text-color: #1e293b;
}

.dark {
  --mv-background-color: #0f172a;
  --mv-panel-background: #1e293b;
  --mv-border-color: #334155;
  --mv-text-color: #f1f5f9;
}
```

### Tailwind CSS Integration
```tsx
import { ModelViewer3D } from '@omda2000/3d-model-viewer';

<ModelViewer3D
  className="border rounded-lg shadow-lg"
  style={{ width: '100%', height: '500px' }}
/>
```

## TypeScript Support

The package includes full TypeScript support with type definitions:

```tsx
import { 
  ModelViewer3D, 
  ModelViewer3DProps,
  LoadedModel,
  MeasurementPoint,
  SceneObject 
} from '@omda2000/3d-model-viewer';

interface CustomProps {
  models: LoadedModel[];
  onMeasurement: (point: MeasurementPoint) => void;
}

const CustomModelViewer: React.FC<CustomProps> = ({ models, onMeasurement }) => {
  return (
    <ModelViewer3D
      onPointCreate={onMeasurement}
      onModelLoad={(model: LoadedModel) => console.log('Loaded:', model.name)}
    />
  );
};
```

## Environment Requirements

### Browser Support
- **Chrome**: 80+
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+

### WebGL Support
- WebGL 1.0 (required)
- WebGL 2.0 (recommended for better performance)

### Mobile Support
- iOS Safari 13+
- Chrome Mobile 80+
- Samsung Internet 12+

## Troubleshooting

### Common Issues

#### 1. "Module not found" Error
```bash
# Make sure you've installed the package
npm install @omda2000/3d-model-viewer

# Clear cache and reinstall if needed
rm -rf node_modules package-lock.json
npm install
```

#### 2. CSS Styles Not Applied
```tsx
// Make sure to import the styles
import '@omda2000/3d-model-viewer/styles';
```

#### 3. WebGL Context Lost
```tsx
<ModelViewer3D
  onError={(error) => console.error('Viewer error:', error)}
  fallback={<div>WebGL not supported</div>}
/>
```

#### 4. Next.js SSR Issues
```tsx
// Use dynamic import with ssr: false
import dynamic from 'next/dynamic';

const ModelViewer = dynamic(
  () => import('@omda2000/3d-model-viewer').then(mod => mod.ModelViewer3D),
  { ssr: false }
);
```

#### 5. Bundle Size Information
The package is self-contained (~3-5MB) and includes all dependencies:
- ✅ React & React-DOM
- ✅ Three.js with all required plugins
- ✅ All Radix UI components 
- ✅ Complete TypeScript support
- ✅ Optimized with code splitting

For smaller bundles, use specific variants:
```tsx
// Minimal variant (smaller footprint)
import { MinimalViewer } from '@omda2000/3d-model-viewer';

// Headless variant (API only, no UI)
import { HeadlessViewer } from '@omda2000/3d-model-viewer';
```

## Performance Optimization

### Lazy Loading
```tsx
import { lazy, Suspense } from 'react';

const ModelViewer3D = lazy(() => 
  import('@omda2000/3d-model-viewer').then(mod => ({ default: mod.ModelViewer3D }))
);

function App() {
  return (
    <Suspense fallback={<div>Loading 3D Viewer...</div>}>
      <ModelViewer3D />
    </Suspense>
  );
}
```

### Memory Management
```tsx
<ModelViewer3D
  performanceMode="medium" // 'low' | 'medium' | 'high'
  maxTextureSize={1024}
  enableInstancing={true}
  onMemoryWarning={(usage) => console.warn('Memory usage:', usage)}
/>
```

## Getting Help

- 📖 **Documentation**: [View full API docs](./API.md)
- 🐛 **Issues**: Report bugs on GitHub
- 💬 **Community**: Join our Discord
- 📧 **Support**: contact@omda2000.com

## License

MIT License - see LICENSE file for details.