# Setup Instructions for NPM Package

## Quick Setup

1. **Update your main package.json** (you'll need to edit this manually since it's read-only):

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
    "README.md",
    "src/lib",
    "src/components",
    "src/hooks",
    "src/contexts",
    "src/store",
    "src/types",
    "src/containers",
    "src/index.css"
  ],
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:lib": "vite build --config vite.config.lib.ts",
    "build:types": "tsc --project tsconfig.lib.json",
    "build:package": "node scripts/package-build.js",
    "prepublishOnly": "npm run build:package",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

2. **Remove the `"private": true` line** from package.json

3. **Move React to peerDependencies** in package.json:

```json
{
  "peerDependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

## Build the Package

```bash
# Build the package
npm run build:package

# Test locally
cd dist && npm pack

# Install in another project
npm install /path/to/your-package.tgz
```

## GitHub Installation

Once your repo is public, users can install directly from GitHub:

```bash
npm install git+https://github.com/omda2000/your-repo.git
```

## Usage Example

```tsx
import React from 'react';
import { ModelViewer3D } from '@omda2000/3d-model-viewer';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ModelViewer3D
        onFileUpload={(file) => console.log('File uploaded:', file.name)}
        onPointCreate={(point) => console.log('Point created:', point)}
        debug={true}
      />
    </div>
  );
}

export default App;
```

## What's Been Created

1. **`src/lib/ModelViewer3D.tsx`** - Main component wrapper with all providers
2. **`src/lib/index.ts`** - Main exports file
3. **`vite.config.lib.ts`** - Vite config for library build
4. **`tsconfig.lib.json`** - TypeScript config for library
5. **`package-lib.json`** - NPM package configuration
6. **`scripts/package-build.js`** - Build script
7. **`README-package.md`** - Package documentation

## Key Features

- ✅ Preserves all current functionality
- ✅ No routing dependencies (removed React Router)
- ✅ All context providers included
- ✅ TypeScript declarations generated
- ✅ CSS bundled properly
- ✅ Tree-shakeable exports
- ✅ GitHub installable
- ✅ Same window behavior as original app