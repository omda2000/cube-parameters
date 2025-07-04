# 3D Model Viewer Application

A sophisticated 3D model viewer built with React, TypeScript, and Three.js, featuring advanced visualization tools, measurement capabilities, and comprehensive lighting controls.

## 🏗️ Architecture Overview

### Component Hierarchy

```
App
├── Index (Main Page)
│   ├── ModelViewerContainer
│   │   └── BoxViewer
│   │       └── ThreeViewer (Core 3D Component)
│   ├── AidToolsBar (Tool Selection)
│   ├── FloatingZoomControls
│   ├── FloatingPanel
│   │   └── TabsControlPanel
│   │       ├── SceneTab
│   │       ├── PropertiesTab
│   │       ├── MaterialsTab
│   │       ├── ViewTab
│   │       └── LightingTab (Environment)
│   ├── MeasureToolsPanel
│   └── SettingsPanel
```

### Data Flow Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Input    │───▶│   State Hooks    │───▶│  Three.js Scene │
│  (UI Controls)  │    │  (Custom Hooks)  │    │   (3D Objects)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │  Context Layers  │
                       │ (SelectionContext)│
                       └──────────────────┘
```

## 🔧 Core Components

### ThreeViewer
The central 3D rendering component that orchestrates:
- Scene setup and management
- Camera controls and positioning
- Object loading (FBX models, primitives)
- Lighting and environment
- Mouse interactions and tool handling

### State Management Hooks

#### `useModelState`
Manages 3D model state including:
- Loaded models collection
- Current active model
- Primitive objects (box, sphere, etc.)
- Upload status and error handling

#### `useLightingState`
Controls lighting configuration:
- Sunlight settings (intensity, azimuth, elevation)
- Ambient light configuration
- Shadow quality settings

#### `useEnvironmentState`
Manages scene environment:
- Grid visibility and styling
- Ground plane configuration
- Sky/background settings

#### `useMouseInteraction`
Handles all 3D viewport interactions:
- Object selection and hover effects
- Tool-specific cursors and behaviors
- Point placement and measurement tools
- Visual feedback systems

### Context Providers

#### `SelectionContext`
Provides centralized selection state management:
```typescript
interface SelectionContext {
  selectedObject: SceneObject | null;
  selectObject: (object: SceneObject) => void;
  clearSelection: () => void;
}
```

## 🛠️ Tool System

### Available Tools
1. **Select Tool** - Object selection and inspection
2. **Point Tool** - Place 3D point markers
3. **Measure Tool** - Distance measurement between points
4. **Move Tool** - Translate selected objects directly in the scene

### Tool Implementation
Each tool modifies the behavior of `useMouseInteraction`:
- Changes cursor appearance
- Modifies click handlers
- Provides tool-specific visual feedback

## 📊 Measurement System

### Features
- Click-to-place point markers
- Real-time distance calculation
- Visual line connections between points
- Measurement history and management
- Preview lines during measurement

### Data Structure
```typescript
interface MeasureData {
  id: string;
  startPoint: { x: number; y: number; z: number };
  endPoint: { x: number; y: number; z: number };
  distance: number;
  label: string;
}
```

## 🎨 UI Component System

### Floating Panels
Draggable, collapsible panels with consistent styling:
- **FloatingPanel**: Base panel component
- **TabsControlPanel**: Main controls with tabbed interface
- **MeasureToolsPanel**: Measurement management
- **SettingsPanel**: Application configuration

### Panel Features
- Drag-to-reposition functionality
- Click-to-collapse/expand
- Consistent backdrop blur styling
- Responsive sizing and positioning

## 🔌 Integration Guide

### Adding to Existing Applications

1. **Install Dependencies**
```bash
npm install three @types/three react react-dom
```

2. **Import Core Components**
```typescript
import { ModelViewerContainer } from './components/ModelViewerContainer/ModelViewerContainer';
import { SelectionProvider } from './contexts/SelectionContext';
```

3. **Basic Integration**
```typescript
function MyApp() {
  return (
    <SelectionProvider>
      <ModelViewerContainer
        dimensions={{ length: 10, width: 10, height: 10 }}
        boxColor="#00ff00"
        objectName="MyObject"
        // ... other props
      />
    </SelectionProvider>
  );
}
```

### Customization Options

#### Theme Customization
The app uses Tailwind CSS with a dark theme. Key color variables:
- Background: `slate-900`, `purple-900`
- Panels: `slate-800/90` with backdrop blur
- Text: `white`, `slate-300`, `slate-400`
- Accent: `green-500`, `blue-500`

#### Adding New Tools
1. Extend the tool type definition:
```typescript
type Tool = 'select' | 'point' | 'measure' | 'move' | 'your-tool';
```

2. Add tool logic to `useMouseInteraction`
3. Update `AidToolsBar` with new tool button

#### Custom 3D Objects
Add new primitive types by extending the model system:
```typescript
// In useModelState or similar
const createCustomPrimitive = (type: string) => {
  // Custom Three.js geometry creation
};
```

## 🏃‍♂️ Performance Considerations

### Optimization Strategies
- **React.memo** for expensive components
- Proper cleanup of Three.js objects and event listeners
- Efficient re-rendering with dependency arrays
- Selective updates for frequently changing data

### Memory Management
- Dispose of geometries and materials when removing objects
- Clean up event listeners on component unmount
- Use object pooling for frequently created/destroyed objects

## 📁 File Structure

```
src/
├── components/
│   ├── BoxViewer.tsx
│   ├── ThreeViewer.tsx
│   ├── ModelViewerContainer/
│   ├── FloatingPanel/
│   ├── TabsControlPanel/
│   └── ...
├── hooks/
│   ├── useMouseInteraction.ts
│   ├── useModelState.ts
│   ├── useLightingState.ts
│   └── ...
├── contexts/
│   └── SelectionContext.tsx
├── types/
│   └── model.ts
└── pages/
    └── Index.tsx
```

## 🚀 Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🔮 Extension Points

### Planned Features
- Advanced material editing
- Animation timeline
- Model comparison tools
- Export capabilities
- Collaborative features

### API Integration
The architecture supports easy integration with external APIs:
- Model loading from URLs
- Cloud storage for scenes
- Real-time collaboration
- Analytics and usage tracking

## 📖 Usage Examples

### Basic Model Loading
```typescript
const handleFileUpload = async (file: File) => {
  // File processing logic
  const model = await loadModel(file);
  setCurrentModel(model);
};
```

### Custom Lighting Presets
```typescript
const daylightPreset = {
  sunlight: { intensity: 1.0, azimuth: 45, elevation: 60 },
  ambientLight: { intensity: 0.4, color: "#ffffff" }
};
```

### Measurement Tool Usage
```typescript
const handleMeasureCreate = (start: Vector3, end: Vector3) => {
  const distance = start.distanceTo(end);
  addMeasurement({ start, end, distance });
};
```

## 🤝 Contributing

### Code Style
- TypeScript strict mode enabled
- ESLint configuration for consistency
- Prettier for code formatting
- Component-first architecture

### Adding Features
1. Create focused, single-responsibility components
2. Use custom hooks for complex logic
3. Maintain consistent naming conventions
4. Add proper TypeScript types
5. Include cleanup logic for resources

## 📄 License

This project is built with modern web technologies and is designed for integration into larger applications. The modular architecture allows for easy customization and extension while maintaining performance and code quality.
