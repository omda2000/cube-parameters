#!/bin/bash

# Build package for NPM distribution
echo "🏗️  Building 3D Model Viewer package..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf node_modules/.vite/

# Build the library
echo "📦 Building library..."
npx vite build --config vite.config.lib.ts

# Generate TypeScript declarations
echo "📝 Generating TypeScript declarations..."
npx tsc --project tsconfig.lib.json

# Copy package.json for library
echo "📋 Copying package configuration..."
cp package-lib.json dist/package.json

# Copy README
echo "📖 Copying documentation..."
cp README-package.md dist/README.md

# Create npmignore
echo "📝 Creating .npmignore..."
cat > dist/.npmignore << EOF
*.log
.DS_Store
node_modules/
src/
tsconfig*.json
vite.config*.ts
*.sh
EOF

echo "✅ Package build complete!"
echo "📁 Output directory: ./dist"
echo "🚀 Ready for publishing!"

# Optional: Show package size
if command -v du &> /dev/null; then
    echo "📊 Package size:"
    du -sh dist/
fi

echo ""
echo "To test locally:"
echo "  cd dist && npm pack"
echo ""
echo "To publish to GitHub Packages:"
echo "  cd dist && npm publish"
echo ""
echo "To install from GitHub:"
echo "  npm install git+https://github.com/omda2000/3d-model-viewer.git"