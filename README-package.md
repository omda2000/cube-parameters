# 3D Model Viewer

A comprehensive React component for viewing and interacting with 3D models. Built with Three.js, TypeScript, and modern React patterns.

## Features

- 🎯 **Interactive 3D Viewer** - Zoom, rotate, and navigate 3D models
- 📏 **Measurement Tools** - Create point and distance measurements
- 💡 **Lighting Controls** - Adjust ambient and directional lighting
- 🎨 **Material Management** - Modify model materials and shading
- 🏗️ **Scene Tree** - Hierarchical view of scene objects
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🎮 **Tool System** - Select, point, and measure tools
- ⚙️ **Settings Panel** - Comprehensive configuration options
- 🌓 **Theme Support** - Light and dark mode support
- ⌨️ **Keyboard Shortcuts** - Efficient navigation and control

## Installation

### From GitHub Packages

First, configure npm to use GitHub Packages for the `@omda2000` scope:

```bash
# Configure npm to use GitHub Packages
npm config set @omda2000:registry https://npm.pkg.github.com

# If you need authentication (for private packages), create a .npmrc file:
echo "@omda2000:registry=https://npm.pkg.github.com" >> .npmrc
```

Then install the package:

```bash
npm install @omda2000/3d-model-viewer
```

### From GitHub (Direct)

```bash
npm install git+https://github.com/omda2000/3d-model-viewer.git
```

## Basic Usage

```tsx
import React from 'react';
import { ModelViewer3D } from '@omda2000/3d-model-viewer';
import '@omda2000/3d-model-viewer/styles'; // Import styles

function App() {
  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file.name);
  };

  const handlePointCreate = (point: { x: number; y: number; z: number }) => {
    console.log('Point created:', point);
  };

  const handleMeasureCreate = (start: THREE.Vector3, end: THREE.Vector3) => {
    console.log('Measurement created:', { start, end });
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ModelViewer3D
        onFileUpload={handleFileUpload}
        onPointCreate={handlePointCreate}
        onMeasureCreate={handleMeasureCreate}
        defaultTheme="dark"
        showControlsInitially={true}
      />
    </div>
  );
}

export default App;
```

## Advanced Usage

### With Custom Styling

```tsx
import { ModelViewer3D } from '@omda2000/3d-model-viewer';

function CustomViewer() {
  return (
    <ModelViewer3D
      className="border-2 border-gray-300 rounded-lg"
      style={{ 
        width: '800px', 
        height: '600px',
        margin: '20px auto'
      }}
      defaultTheme="light"
    />
  );
}
```

### With State Management

```tsx
import React, { useState } from 'react';
import { ModelViewer3D, LoadedModel } from '@omda2000/3d-model-viewer';

function StatefulViewer() {
  const [models, setModels] = useState<LoadedModel[]>([]);
  const [currentModel, setCurrentModel] = useState<LoadedModel | null>(null);

  const handleModelsChange = (newModels: LoadedModel[], current: LoadedModel | null) => {
    setModels(newModels);
    setCurrentModel(current);
    console.log(`Loaded ${newModels.length} models, current: ${current?.name || 'none'}`);
  };

  return (
    <div>
      <div className="mb-4">
        <h2>Loaded Models: {models.length}</h2>
        <p>Current: {currentModel?.name || 'None'}</p>
      </div>
      
      <ModelViewer3D
        onModelsChange={handleModelsChange}
        debug={true}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Additional CSS classes for the container |
| `style` | `React.CSSProperties` | `undefined` | Inline styles for the container |
| `onFileUpload` | `(file: File) => void` | `undefined` | Callback when files are uploaded |
| `onModelsChange` | `(models: LoadedModel[], current: LoadedModel \| null) => void` | `undefined` | Callback when models change |
| `onPointCreate` | `(point: { x: number; y: number; z: number }) => void` | `undefined` | Callback when points are created |
| `onMeasureCreate` | `(start: THREE.Vector3, end: THREE.Vector3) => void` | `undefined` | Callback when measurements are created |
| `defaultTheme` | `'light' \| 'dark' \| 'system'` | `'system'` | Initial theme mode |
| `debug` | `boolean` | `false` | Enable debug logging |
| `queryClient` | `QueryClient` | Auto-generated | Custom React Query client |
| `disableKeyboardShortcuts` | `boolean` | `false` | Disable keyboard shortcuts |
| `showControlsInitially` | `boolean` | `true` | Show control panels on mount |

## Supported File Formats

- **FBX** - Autodesk FBX format
- **GLTF/GLB** - GL Transmission Format

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Space` | Toggle control panel |
| `F` | Zoom to fit all |
| `S` | Zoom to selected |
| `R` | Reset view |
| `Escape` | Clear selection |

## Styling

The component uses Tailwind CSS for styling. To customize the appearance:

1. Import the CSS file:
```tsx
import '@omda2000/3d-model-viewer/styles';
```

2. Override CSS variables in your global styles:
```css
:root {
  --primary: 210 40% 50%;
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... other variables */
}
```

## Peer Dependencies

Make sure you have these installed in your project:

- `react` ^18.3.1
- `react-dom` ^18.3.1

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © [omda2000](https://github.com/omda2000)