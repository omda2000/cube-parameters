#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🏗️  Building 3D Model Viewer package...');

try {
  // Clean previous builds
  console.log('🧹 Cleaning previous builds...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Build the library
  console.log('📦 Building library...');
  execSync('npx vite build --config vite.config.lib.ts', { stdio: 'inherit' });

  // Generate TypeScript declarations
  console.log('📝 Generating TypeScript declarations...');
  execSync('npx tsc --project tsconfig.lib.json', { stdio: 'inherit' });

  // Copy package.json for library
  console.log('📋 Copying package configuration...');
  fs.copyFileSync('package-lib.json', 'dist/package.json');

  // Copy README
  console.log('📖 Copying documentation...');
  if (fs.existsSync('README-package.md')) {
    fs.copyFileSync('README-package.md', 'dist/README.md');
  } else {
    fs.copyFileSync('README.md', 'dist/README.md');
  }

  // Create npmignore
  console.log('📝 Creating .npmignore...');
  const npmignoreContent = `*.log
.DS_Store
node_modules/
src/
tsconfig*.json
vite.config*.ts
*.sh
*.js
`;
  fs.writeFileSync('dist/.npmignore', npmignoreContent);

  console.log('✅ Package build complete!');
  console.log('📁 Output directory: ./dist');
  console.log('🚀 Ready for publishing!');

  // Show package size
  try {
    const stats = fs.statSync('dist');
    console.log('📊 Package built successfully');
  } catch (err) {
    // Size calculation not critical
  }

  console.log('');
  console.log('To test locally:');
  console.log('  cd dist && npm pack');
  console.log('');
  console.log('To publish:');
  console.log('  cd dist && npm publish');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}