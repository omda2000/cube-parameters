# API Reference

## ModelViewer3D Component

The main component that provides a complete 3D model viewing experience.

### Props

```tsx
interface ModelViewer3DProps {
  // Styling
  className?: string;
  style?: React.CSSProperties;
  
  // File handling
  onFileUpload?: (file: File) => void;
  onModelsChange?: (models: LoadedModel[]) => void;
  
  // Interaction callbacks
  onPointCreate?: (point: { x: number; y: number; z: number }) => void;
  onMeasureCreate?: (start: THREE.Vector3, end: THREE.Vector3) => void;
  onObjectSelect?: (object: SceneObject | null) => void;
  onCameraChange?: (position: THREE.Vector3, target: THREE.Vector3) => void;
  onToolChange?: (tool: 'select' | 'point' | 'measure' | 'move') => void;
  
  // Scene lifecycle
  onSceneReady?: (scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer) => void;
  onError?: (error: Error, context: string) => void;
  
  // Configuration
  defaultTheme?: 'light' | 'dark' | 'auto';
  debug?: boolean;
  initialCamera?: { position: THREE.Vector3; target: THREE.Vector3 };
  enableVR?: boolean;
  performance?: 'low' | 'medium' | 'high';
}
```

## Viewer Variants

### MinimalViewer

Stripped-down version with essential viewing controls only.

```tsx
interface MinimalViewerProps {
  onFileUpload?: (file: File) => void;
  className?: string;
  style?: React.CSSProperties;
}
```

### CompactViewer

Space-efficient variant with collapsible panels.

```tsx
interface CompactViewerProps extends ModelViewer3DProps {
  compactMode?: boolean;
  showMeasurements?: boolean;
  collapsiblePanels?: boolean;
}
```

### ProfessionalViewer

Full-featured variant with all available tools and panels.

```tsx
interface ProfessionalViewerProps extends ModelViewer3DProps {
  enableAdvancedLighting?: boolean;
  showAnalytics?: boolean;
  showPerformanceMetrics?: boolean;
  enableMaterialEditor?: boolean;
}
```

### HeadlessViewer

Programmatic control without UI components.

```tsx
interface HeadlessViewerProps {
  onReady?: (api: HeadlessViewerAPI) => void;
  onError?: (error: Error) => void;
  debug?: boolean;
}

interface HeadlessViewerAPI {
  // Scene management
  loadModel: (url: string | File) => Promise<LoadedModel>;
  removeModel: (modelId: string) => void;
  getModels: () => LoadedModel[];
  
  // Camera control
  camera: {
    setPosition: (x: number, y: number, z: number) => void;
    setTarget: (x: number, y: number, z: number) => void;
    zoomToFit: () => void;
    zoomToObject: (objectId: string) => void;
  };
  
  // Lighting control
  lighting: {
    setAmbientIntensity: (intensity: number) => void;
    setDirectionalIntensity: (intensity: number) => void;
    setEnvironment: (environment: string) => void;
  };
  
  // Measurement tools
  measurements: {
    createPoint: (x: number, y: number, z: number) => string;
    measureDistance: (point1Id: string, point2Id: string) => number;
    getAllMeasurements: () => Measurement[];
  };
  
  // Selection
  selection: {
    selectObject: (objectId: string) => void;
    getSelected: () => SceneObject | null;
    clearSelection: () => void;
  };
  
  // Scene access
  getScene: () => THREE.Scene;
  getCamera: () => THREE.Camera;
  getRenderer: () => THREE.WebGLRenderer;
}
```

### EmbeddedViewer

Optimized for iframe embedding and third-party integration.

```tsx
interface EmbeddedViewerProps extends ModelViewer3DProps {
  modelUrl?: string;
  embedMode?: boolean;
  allowFullscreen?: boolean;
  crossOrigin?: 'anonymous' | 'use-credentials';
  sandbox?: string[];
}
```

## Plugin System

### PluginConfig

Configuration object for customizing viewer behavior.

```tsx
interface PluginConfig {
  ui?: {
    showMeasurements?: boolean;
    showLighting?: boolean;
    showSceneTree?: boolean;
    showToolbar?: boolean;
    theme?: 'minimal' | 'compact' | 'professional';
    customCSS?: string;
  };
  
  features?: {
    enableKeyboardShortcuts?: boolean;
    enableTouchGestures?: boolean;
    enableVR?: boolean;
    enableExport?: boolean;
    enableImport?: boolean;
  };
  
  performance?: {
    renderMode?: 'realtime' | 'ondemand';
    maxFPS?: number;
    antialiasing?: boolean;
    shadows?: 'off' | 'basic' | 'soft';
    postProcessing?: boolean;
  };
  
  integration?: {
    apiEndpoint?: string;
    authToken?: string;
    corsProxy?: string;
    analytics?: PluginAnalytics;
    logger?: PluginLogger;
  };
  
  extensions?: PluginExtension[];
}
```

### PluginProvider

Wrapper component that provides plugin configuration context.

```tsx
function PluginProvider({ config, children }: {
  config: PluginConfig;
  children: React.ReactNode;
}) {
  // Implementation
}
```

## Data Types

### LoadedModel

Represents a loaded 3D model with metadata.

```tsx
interface LoadedModel {
  id: string;
  name: string;
  url: string;
  object: THREE.Object3D;
  boundingBox: THREE.Box3;
  materials: THREE.Material[];
  animations: THREE.AnimationClip[];
  metadata: {
    triangles: number;
    vertices: number;
    fileSize: number;
    loadTime: number;
    format: 'fbx' | 'gltf' | 'glb';
  };
}
```

### SceneObject

Represents an object in the 3D scene hierarchy.

```tsx
interface SceneObject {
  id: string;
  name: string;
  type: 'mesh' | 'group' | 'light' | 'camera' | 'helper';
  object: THREE.Object3D;
  parent?: SceneObject;
  children: SceneObject[];
  visible: boolean;
  selected: boolean;
  material?: THREE.Material;
  boundingBox?: THREE.Box3;
  userData: Record<string, any>;
}
```

### MeasurementPoint

Represents a measurement point in 3D space.

```tsx
interface MeasurementPoint {
  id: string;
  position: THREE.Vector3;
  worldPosition: THREE.Vector3;
  objectId?: string;
  label?: string;
  timestamp: number;
  metadata?: {
    surfaceNormal?: THREE.Vector3;
    accuracy?: number;
    snapType?: 'vertex' | 'edge' | 'face' | 'free';
  };
}
```

### Measurement

Represents a distance measurement between two points.

```tsx
interface Measurement {
  id: string;
  startPoint: MeasurementPoint;
  endPoint: MeasurementPoint;
  distance: number;
  units: 'mm' | 'cm' | 'm' | 'in' | 'ft';
  label?: string;
  timestamp: number;
  color?: string;
  visible: boolean;
}
```

## Hooks

### useAppStore

Access to the global application state.

```tsx
interface AppState {
  // Models
  models: LoadedModel[];
  selectedModel: LoadedModel | null;
  
  // Scene
  selectedObject: SceneObject | null;
  sceneObjects: SceneObject[];
  
  // Tools
  activeTool: 'select' | 'point' | 'measure' | 'move';
  measurements: Measurement[];
  measurementPoints: MeasurementPoint[];
  
  // UI
  showMeasurePanel: boolean;
  showLightingPanel: boolean;
  showSceneTree: boolean;
  theme: 'light' | 'dark';
  
  // Camera
  cameraPosition: THREE.Vector3;
  cameraTarget: THREE.Vector3;
  
  // Performance
  renderStats: {
    fps: number;
    triangles: number;
    drawCalls: number;
    memoryUsage: number;
  };
}

const store = useAppStore();
```

### useMeasurements

Hook for managing measurements.

```tsx
function useMeasurements() {
  return {
    measurements: Measurement[];
    addMeasurement: (start: THREE.Vector3, end: THREE.Vector3) => Measurement;
    removeMeasurement: (id: string) => void;
    clearMeasurements: () => void;
    exportMeasurements: () => string; // JSON format
    importMeasurements: (data: string) => void;
  };
}
```

### useThreeScene

Hook for accessing Three.js scene objects.

```tsx
function useThreeScene() {
  return {
    scene: THREE.Scene | null;
    camera: THREE.Camera | null;
    renderer: THREE.WebGLRenderer | null;
    controls: OrbitControls | null;
    isReady: boolean;
  };
}
```

### useKeyboardShortcuts

Hook for managing keyboard shortcuts.

```tsx
function useKeyboardShortcuts(config: {
  onEscape?: () => void;
  onZoomAll?: () => void;
  onZoomSelected?: () => void;
  onToggleTool?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
}) {
  // Automatically handles keyboard events
}
```

## Events

### PluginEvents

Events emitted by the plugin system.

```tsx
interface PluginEvents {
  'model:loaded': LoadedModel;
  'model:unloaded': string; // model ID
  'object:selected': SceneObject | null;
  'measurement:created': Measurement;
  'measurement:deleted': string; // measurement ID
  'camera:changed': { position: THREE.Vector3; target: THREE.Vector3 };
  'tool:changed': 'select' | 'point' | 'measure' | 'move';
  'scene:ready': { scene: THREE.Scene; camera: THREE.Camera; renderer: THREE.WebGLRenderer };
  'error': { error: Error; context: string };
  'performance:stats': {
    fps: number;
    triangles: number;
    drawCalls: number;
    memoryUsage: number;
  };
}
```

## Utilities

### cn (Class Names)

Utility function for conditional class name concatenation.

```tsx
import { cn } from '@omda2000/3d-model-viewer';

const className = cn(
  'base-class',
  condition && 'conditional-class',
  { 'object-class': condition }
);
```

## Error Handling

### Error Types

```tsx
type ViewerError = 
  | 'MODEL_LOAD_ERROR'
  | 'WEBGL_NOT_SUPPORTED' 
  | 'FILE_FORMAT_UNSUPPORTED'
  | 'MEMORY_LIMIT_EXCEEDED'
  | 'NETWORK_ERROR'
  | 'SHADER_COMPILATION_ERROR'
  | 'TEXTURE_LOAD_ERROR';

interface ViewerErrorDetails {
  type: ViewerError;
  message: string;
  originalError?: Error;
  context?: string;
  recoverable: boolean;
  suggestions?: string[];
}
```

### Error Boundary

Built-in error boundary component for graceful error handling.

```tsx
import { ErrorBoundary } from '@omda2000/3d-model-viewer';

<ErrorBoundary
  fallback={(error, retry) => (
    <div>
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={retry}>Try Again</button>
    </div>
  )}
>
  <ModelViewer3D />
</ErrorBoundary>
```