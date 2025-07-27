# Publishing to NPM

This document explains how to publish the 3D Model Viewer package to NPM.

## Automatic Publishing (Recommended)

The repository is configured with GitHub Actions for automatic publishing:

1. **Make your changes** and commit them to the repository
2. **Create a version tag** (this triggers the publishing workflow):
   ```bash
   # Update version and create tag
   git tag v1.0.0
   git push origin v1.0.0
   ```
3. **GitHub Actions will automatically**:
   - Build the package using `npm run build:package`
   - Publish to NPM registry
   - Make it available as `@omda2000/3d-model-viewer`

## Manual Publishing

If you need to publish manually:

1. **Build the package**:
   ```bash
   npm run build:package
   ```

2. **Navigate to dist folder and publish**:
   ```bash
   cd dist
   npm publish
   ```

## Version Management

- Use semantic versioning (1.0.0, 1.1.0, 2.0.0)
- Update version in `package-lib.json` before tagging
- Tags should follow the format `v1.0.0`

## Installation for Developers

Once published, developers can install your package:

```bash
npm install @omda2000/3d-model-viewer
```

## Package Contents

The published package includes:
- ✅ Built JavaScript (ES modules, CommonJS, UMD)
- ✅ TypeScript declarations (.d.ts files)
- ✅ Bundled CSS styles
- ✅ Complete documentation
- ✅ All plugin variants (minimal, compact, headless, professional, embedded)

## Next Steps

1. **Tag a version** to trigger the first publish
2. **Test installation** in a separate project
3. **Share the package** with your team or community