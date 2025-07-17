# Installing from GitHub

## Installation Methods

### 1. Direct from GitHub Repository
```bash
npm install git+https://github.com/omda2000/3d-model-viewer.git
```

### 2. From Specific Branch or Tag
```bash
# Install from specific branch
npm install git+https://github.com/omda2000/3d-model-viewer.git#main

# Install from specific tag/version
npm install git+https://github.com/omda2000/3d-model-viewer.git#v1.0.0
```

### 3. From GitHub Packages (if published)
```bash
# Configure npm to use GitHub registry
npm config set @omda2000:registry https://npm.pkg.github.com

# Install package
npm install @omda2000/3d-model-viewer
```

## Usage in Your React App

```tsx
import React from 'react';
import { ModelViewer3D } from '@omda2000/3d-model-viewer';
import '@omda2000/3d-model-viewer/styles';

function App() {
  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file.name);
  };

  const handleMeasurement = (start: any, end: any) => {
    console.log('Measurement created:', { start, end });
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ModelViewer3D 
        onFileUpload={handleFileUpload}
        onMeasureCreate={handleMeasurement}
        defaultTheme="system"
        showControlsInitially={true}
      />
    </div>
  );
}

export default App;
```

## Props Interface

```tsx
interface ModelViewer3DProps {
  /** Custom class name for the container */
  className?: string;
  /** Container style overrides */
  style?: React.CSSProperties;
  /** Callback when files are uploaded */
  onFileUpload?: (file: File) => void;
  /** Callback when models change */
  onModelsChange?: (models: LoadedModel[], current: LoadedModel | null) => void;
  /** Callback when a point is created in the 3D scene */
  onPointCreate?: (point: { x: number; y: number; z: number }) => void;
  /** Callback when a measurement is created */
  onMeasureCreate?: (start: THREE.Vector3, end: THREE.Vector3) => void;
  /** Initial theme mode */
  defaultTheme?: 'light' | 'dark' | 'system';
  /** Whether to show debug information */
  debug?: boolean;
  /** Custom query client instance */
  queryClient?: QueryClient;
  /** Whether to disable keyboard shortcuts */
  disableKeyboardShortcuts?: boolean;
  /** Whether to show the control panels by default */
  showControlsInitially?: boolean;
}
```

## Peer Dependencies

Make sure your project has these installed:

```bash
npm install react@^18.3.1 react-dom@^18.3.1
```

## Troubleshooting

### Installation Issues
1. **Authentication required**: For private repos, you may need to authenticate with GitHub
2. **Build failures**: Ensure Node.js 18+ is installed
3. **Missing peer dependencies**: Install React and React-DOM in your project

### Runtime Issues
1. **Styling conflicts**: Import the styles CSS file
2. **Context errors**: Ensure you're not wrapping with duplicate providers
3. **Performance**: Use React 18+ for optimal performance

## Development

To contribute or modify the package:

```bash
# Clone the repository
git clone https://github.com/omda2000/3d-model-viewer.git
cd 3d-model-viewer

# Install dependencies
npm install

# Start development server
npm run dev

# Build the package
npm run build:package

# Test the package locally
cd dist && npm pack
```