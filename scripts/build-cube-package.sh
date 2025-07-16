#!/bin/bash

echo "🔨 Building Cube Parameters NPM Package..."

# Clean dist directory
echo "🧹 Cleaning build directory..."
rm -rf dist/

# Build the library using Vite
echo "🏗️  Building library..."
npx vite build --config vite.config.cube-lib.ts

# Generate TypeScript declarations
echo "📝 Generating TypeScript declarations..."
npx tsc --project tsconfig.cube-lib.json

# Rename CSS file to match package name
if [ -f "dist/style.css" ]; then
  echo "🎨 Renaming CSS file..."
  mv dist/style.css dist/cube-parameters.css
fi

# Copy package files
echo "📋 Copying package files..."
cp README.md dist/ 2>/dev/null || echo "README.md not found, creating one..."
if [ ! -f "dist/README.md" ]; then
  echo "# Cube Parameters

A React component library for 3D cube parameters visualization and manipulation.

## Installation

\`\`\`bash
npm install @omda2000/cube-parameters
\`\`\`

## Usage

\`\`\`tsx
import { CubeParameters } from '@omda2000/cube-parameters';
import '@omda2000/cube-parameters/style.css';

function App() {
  return <CubeParameters />;
}
\`\`\`
" > dist/README.md
fi

cp package-cube-parameters.json dist/package.json

# Create LICENSE if it doesn't exist
if [ ! -f "LICENSE" ]; then
  echo "📄 Creating LICENSE file..."
  cat > LICENSE << EOF
MIT License

Copyright (c) 2025 Omar Dahdah

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF
fi

cp LICENSE dist/

echo "✅ Build complete!"
echo ""
echo "📦 Package contents:"
ls -la dist/
echo ""
echo "🚀 To publish, run:"
echo "   cd dist && npm publish"
echo ""
echo "📋 Package info:"
echo "   Name: @omda2000/cube-parameters"
echo "   Entry Points:"
echo "     - ES Module: ./dist/cube-parameters.es.js"
echo "     - UMD: ./dist/cube-parameters.umd.js"
echo "     - Types: ./dist/index.d.ts"
echo "     - Styles: ./dist/cube-parameters.css"