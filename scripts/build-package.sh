#!/bin/bash

# Build script for NPM package distribution
echo "🚀 Building Model Viewer 3D package..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist/

# Build the library using Vite
echo "📦 Building library bundle..."
npx vite build --config vite.config.lib.ts

# Generate TypeScript declarations
echo "📝 Generating TypeScript declarations..."
npx tsc --project tsconfig.lib.json

# Copy package files
echo "📄 Copying package files..."
cp README.md dist/
cp package-lib.json dist/package.json

# Create LICENSE file if it doesn't exist
if [ ! -f "LICENSE" ]; then
  echo "📃 Creating LICENSE file..."
  cat > LICENSE << EOF
MIT License

Copyright (c) $(date +%Y) Your Company

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
  cp LICENSE dist/
fi

# List generated files
echo "✅ Package build complete! Generated files:"
ls -la dist/

echo ""
echo "📋 Next steps:"
echo "1. cd dist/"
echo "2. npm publish (or npm publish --tag beta for beta release)"
echo ""
echo "🔍 Package info:"
echo "- Main entry: dist/model-viewer-3d.umd.js"
echo "- Module entry: dist/model-viewer-3d.es.js"
echo "- Types: dist/index.d.ts"
echo "- Styles: dist/model-viewer-3d.css"