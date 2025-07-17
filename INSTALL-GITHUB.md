# GitHub Package Installation Guide

## Quick Start

Install the 3D Model Viewer package directly from GitHub:

```bash
npm install git+https://github.com/omda2000/3d-model-viewer.git
```

## Manual Package.json Setup Required

Since package.json is read-only in this environment, you'll need to manually update your main package.json with these changes:

### 1. Update package.json

```json
{
  "name": "@omda2000/3d-model-viewer",
  "version": "1.0.0",
  "description": "A comprehensive 3D model viewer with tools for measurements, lighting, and scene management",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./styles": "./dist/style.css"
  },
  "files": [
    "dist",
    "README.md"
  ],
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:lib": "vite build --config vite.config.lib.ts",
    "build:types": "tsc --project tsconfig.lib.json --declaration --emitDeclarationOnly --outDir dist",
    "build:package": "npm run build:lib && npm run build:types",
    "prepare": "npm run build:package",
    "prepublishOnly": "npm run build:package",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/omda2000/3d-model-viewer.git"
  },
  "publishConfig": {
    "@omda2000:registry": "https://npm.pkg.github.com"
  },
  "peerDependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

### 2. Remove `"private": true` from package.json

### 3. Move React dependencies to peerDependencies

Move these from `dependencies` to `peerDependencies`:
- react
- react-dom

## Installation Options

### Option 1: Direct GitHub Installation
```bash
npm install git+https://github.com/omda2000/3d-model-viewer.git
```

### Option 2: GitHub Packages Registry
```bash
npm config set @omda2000:registry https://npm.pkg.github.com
npm install @omda2000/3d-model-viewer
```

### Option 3: Specific Version/Branch
```bash
# Specific tag
npm install git+https://github.com/omda2000/3d-model-viewer.git#v1.0.0

# Specific branch
npm install git+https://github.com/omda2000/3d-model-viewer.git#main
```

## Usage Example

```tsx
import React from 'react';
import { ModelViewer3D } from '@omda2000/3d-model-viewer';
import '@omda2000/3d-model-viewer/styles';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ModelViewer3D 
        onFileUpload={(file) => console.log('Uploaded:', file.name)}
        onMeasureCreate={(start, end) => console.log('Measurement:', start, end)}
        showControlsInitially={true}
      />
    </div>
  );
}

export default App;
```

## Next Steps

1. **Update your package.json** with the changes above
2. **Commit the dist folder** to your repository (or ensure GitHub Actions builds it)
3. **Push to GitHub** to make it installable
4. **Create releases/tags** for version management
5. **Test installation** in a separate project

## Build Commands

```bash
# Build the package
npm run build:package

# Test locally
npm pack

# Publish to GitHub (if using GitHub Packages)
npm publish
```

The package will include all current functionality in a single, reusable component.