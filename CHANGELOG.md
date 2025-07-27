# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-27

### Added
- 🎉 Initial release of the 3D Model Viewer package
- ✨ Interactive 3D model viewing with Three.js integration
- 📁 Support for FBX and GLTF/GLB file formats
- 📏 Advanced measurement tools with real-time distance calculations
- 💡 Dynamic lighting controls (ambient, directional, environment)
- 🌳 Hierarchical scene tree with object management
- 📱 Responsive design for desktop and mobile devices
- 🔧 Complete TypeScript support with type definitions
- 🎨 Tailwind CSS integration with theme support
- ⌨️ Comprehensive keyboard shortcuts
- 🔌 Plugin system with multiple viewer variants:
  - MinimalViewer - Essential controls only
  - CompactViewer - Space-efficient with collapsible panels
  - ProfessionalViewer - Full-featured with all tools
  - HeadlessViewer - Programmatic control without UI
  - EmbeddedViewer - Optimized for iframe integration

### Features
- **Performance Optimized**: WebGL acceleration with configurable quality presets
- **Touch Gestures**: Pan, zoom, and rotate support for mobile devices
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Error Handling**: Comprehensive error boundaries and debugging tools
- **State Management**: Zustand-based state management with persistence
- **Animation Support**: Playback controls for animated models
- **Camera Controls**: Smooth orbit controls with standard view presets
- **Selection System**: Object picking with visual feedback
- **Material Editor**: Real-time material property adjustments
- **Export Functions**: Save measurements and scene data
- **Extensible API**: Plugin system for custom functionality

### Developer Experience
- 📖 Comprehensive documentation with examples
- 🛠️ TypeScript definitions for all components and hooks
- 🎯 Zero-configuration setup with sensible defaults
- 🔧 Customizable styling with CSS variables
- 📦 Tree-shakeable exports for optimal bundle size
- 🧪 Built-in debugging and development tools

### Browser Support
- Chrome 91+
- Firefox 90+
- Safari 15+
- Edge 91+
- Mobile Safari (iOS 15+)
- Chrome Mobile (Android)

### Dependencies
- React ^18.3.1
- React DOM ^18.3.1
- Three.js ^0.170.0
- Various Radix UI components for accessibility
- Tailwind CSS for styling
- Zustand for state management

### Breaking Changes
- None (initial release)

### Migration Guide
- This is the initial release, no migration needed

---

## [Unreleased]

### Planned Features
- 🔮 WebXR/VR support
- 🎮 Gamepad controls
- 🌐 i18n internationalization
- 📊 Advanced analytics and telemetry
- 🎨 Material library and presets
- 🔄 Real-time collaboration features
- 📤 Cloud storage integration
- 🎬 Animation timeline editor