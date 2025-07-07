
import React, { memo } from 'react';
import { useModelViewerSetup } from '../hooks/viewer/useModelViewerSetup';
import { useOptimizedRenderer } from '../hooks/viewer/useOptimizedRenderer';
import ThreeViewerCore from './ThreeViewer/ThreeViewerCore';
import ThreeViewerOverlays from './ThreeViewer/ThreeViewerOverlays';
import { useThreeViewerHandlers } from './ThreeViewer/ThreeViewerHandlers';
import * as THREE from 'three';
import type { 
  SunlightSettings, 
  AmbientLightSettings, 
  EnvironmentSettings, 
  LoadedModel,
  BoxDimensions,
  ShadowQuality
} from '../types/model';

interface ThreeViewerProps {
  dimensions: BoxDimensions;
  boxColor: string;
  objectName: string;
  sunlight: SunlightSettings;
  ambientLight: AmbientLightSettings;
  shadowQuality: ShadowQuality;
  environment: EnvironmentSettings;
  onFileUpload?: (file: File) => void;
  onModelsChange?: (models: LoadedModel[], current: LoadedModel | null) => void;
  onSceneReady?: (scene: THREE.Scene) => void;
  showPrimitives?: boolean;
  activeTool?: 'select' | 'point' | 'measure' | 'move';
  onPointCreate?: (point: { x: number; y: number; z: number }) => void;
  onMeasureCreate?: (start: THREE.Vector3, end: THREE.Vector3) => void;
}

const ThreeViewer = memo((props: ThreeViewerProps) => {
  // Core setup
  const {
    scene,
    camera,
    renderer,
    controls,
    currentModel
  } = useModelViewerSetup({
    dimensions: props.dimensions,
    boxColor: props.boxColor,
    objectName: props.objectName,
    sunlight: props.sunlight,
    ambientLight: props.ambientLight,
    shadowQuality: props.shadowQuality,
    environment: props.environment,
    onModelsChange: props.onModelsChange,
    onSceneReady: props.onSceneReady,
    showPrimitives: props.showPrimitives
  });

  // Renderer optimization
  useOptimizedRenderer(renderer);

  // Event handlers
  const {
    handleDoubleTap,
    handlePinchZoom,
    handleZoomIn,
    handleZoomOut,
    handleZoomAll,
    handleResetView
  } = useThreeViewerHandlers({ controls, camera, scene });

  return (
    <div className="relative w-full h-full">
      <ThreeViewerCore
        {...props}
        camera={camera}
        controls={controls}
        onDoubleTap={handleDoubleTap}
        onPinchZoom={handlePinchZoom}
        onThreeFingerTap={handleZoomAll}
      />
      
      <ThreeViewerOverlays
        objectData={null}
        mousePosition={{ x: 0, y: 0 }}
        isHovering={false}
        selectedObjects={[]}
        camera={camera}
        controls={controls}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomAll={handleZoomAll}
        onResetView={handleResetView}
      />
    </div>
  );
});

ThreeViewer.displayName = 'ThreeViewer';

export default ThreeViewer;
