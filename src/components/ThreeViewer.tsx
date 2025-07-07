
import React, { memo } from 'react';
import { useModelViewerSetup } from '../hooks/viewer/useModelViewerSetup';
import { useModelViewerEffects } from '../hooks/viewer/useModelViewerEffects';
import { useOptimizedRenderer } from '../hooks/viewer/useOptimizedRenderer';
import { useTouchControls } from '../hooks/useTouchControls';
import { useResponsiveMode } from '../hooks/useResponsiveMode';
import ModelViewerOverlays from './ModelViewer/ModelViewerOverlays';
import MobileNavigationControls from './MobileNavigationControls/MobileNavigationControls';
import VirtualJoystick from './VirtualJoystick/VirtualJoystick';
import TouchGestureHandler from './TouchGestureHandler/TouchGestureHandler';
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
  const { isMobile } = useResponsiveMode();
  
  // Core setup
  const {
    mountRef,
    scene,
    camera,
    renderer,
    controls,
    currentModel,
    boxRef,
    isLoading,
    error,
    loadFBXModel,
    switchToModel,
    removeModel,
    performanceMetrics,
    isOrthographic,
    switchCamera
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

  // Effects and interactions
  const {
    objectData,
    mousePosition,
    isHovering,
    selectedObjects
  } = useModelViewerEffects({
    renderer,
    camera,
    scene,
    controls,
    currentModel,
    boxRef,
    activeTool: props.activeTool,
    onPointCreate: props.onPointCreate,
    onMeasureCreate: props.onMeasureCreate,
    loadedModels: currentModel ? [currentModel] : [],
    loadFBXModel,
    switchToModel,
    removeModel,
    onModelsChange: props.onModelsChange,
    switchCamera
  });

  // Mobile touch controls
  const handleDoubleTap = React.useCallback(() => {
    if (controls) {
      controls.reset();
    }
  }, [controls]);

  const handlePinchZoom = React.useCallback((scale: number) => {
    if (camera && camera instanceof THREE.PerspectiveCamera) {
      const newPosition = camera.position.clone();
      newPosition.multiplyScalar(2 - scale);
      camera.position.copy(newPosition);
    }
  }, [camera]);

  const handleJoystickMove = React.useCallback((x: number, y: number) => {
    if (controls && (Math.abs(x) > 0.1 || Math.abs(y) > 0.1)) {
      const rotationSpeed = 0.02;
      
      // Use spherical coordinates to rotate around the target
      const spherical = new THREE.Spherical();
      const offset = new THREE.Vector3();
      
      if (camera) {
        offset.copy(camera.position).sub(controls.target);
        spherical.setFromVector3(offset);
        
        // Apply rotation
        spherical.theta -= x * rotationSpeed;
        spherical.phi += y * rotationSpeed;
        
        // Limit phi to avoid flipping
        spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
        
        offset.setFromSpherical(spherical);
        camera.position.copy(controls.target).add(offset);
        camera.lookAt(controls.target);
      }
      
      controls.update();
    }
  }, [controls, camera]);

  const handleZoomIn = React.useCallback(() => {
    if (controls && camera) {
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      camera.position.add(direction.multiplyScalar(0.5));
      controls.update();
    }
  }, [controls, camera]);

  const handleZoomOut = React.useCallback(() => {
    if (controls && camera) {
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      camera.position.add(direction.multiplyScalar(-0.5));
      controls.update();
    }
  }, [controls, camera]);

  const handleZoomAll = React.useCallback(() => {
    if (controls && scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      controls.target.copy(center);
      
      if (camera) {
        const maxDim = Math.max(size.x, size.y, size.z);
        camera.position.copy(center);
        camera.position.z += maxDim * 2;
        camera.lookAt(center);
      }
      
      controls.update();
    }
  }, [controls, scene, camera]);

  const handleResetView = React.useCallback(() => {
    if (controls) {
      controls.reset();
    }
  }, [controls]);

  // Debug performance in development
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('ThreeViewer Performance Metrics:', performanceMetrics);
    }
  }, [performanceMetrics]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-500">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Model Viewer Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <TouchGestureHandler
        camera={camera}
        controls={controls}
        onDoubleTap={handleDoubleTap}
        onPinchZoom={handlePinchZoom}
        onThreeFingerTap={handleZoomAll}
      >
        <div ref={mountRef} className="w-full h-full" />
      </TouchGestureHandler>
      
      <ModelViewerOverlays
        objectData={objectData}
        mousePosition={mousePosition}
        isHovering={isHovering}
        selectedObjects={selectedObjects}
      />
      
      {/* Mobile-specific controls */}
      {isMobile && (
        <>
          <MobileNavigationControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onZoomAll={handleZoomAll}
            onZoomToSelected={handleZoomAll}
            onResetView={handleResetView}
            hasSelection={selectedObjects.length > 0}
          />
          
          <VirtualJoystick
            onMove={handleJoystickMove}
            size={120}
            maxDistance={50}
          />
        </>
      )}
      
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white flex items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            Loading 3D model...
          </div>
        </div>
      )}
    </div>
  );
});

ThreeViewer.displayName = 'ThreeViewer';

export default ThreeViewer;
