
import React, { useRef, useEffect, memo, useMemo } from 'react';
import * as THREE from 'three';
import { useThreeScene } from '../hooks/useThreeScene';
import { useBoxMesh } from '../hooks/useBoxMesh';
import { useMouseInteraction } from '../hooks/useMouseInteraction';
import { useLighting } from '../hooks/useLighting';
import { useEnvironment } from '../hooks/useEnvironment';
import { useFBXLoader } from '../hooks/useFBXLoader';
import { useSelectionContext } from '../contexts/SelectionContext';
import { useSelectionEffects } from '../hooks/useSelectionEffects';
import { useZoomControls } from '../hooks/useZoomControls';
import { useViewerKeyboardShortcuts } from '../hooks/useViewerKeyboardShortcuts';
import ObjectDataOverlay from './ObjectDataOverlay';
import SelectionOverlay from './SelectionOverlay/SelectionOverlay';
import type { 
  SunlightSettings, 
  AmbientLightSettings, 
  EnvironmentSettings, 
  LoadedModel,
  BoxDimensions,
  ShadowQuality,
  SceneObject
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

const ThreeViewer = memo(({ 
  dimensions, 
  boxColor, 
  objectName, 
  sunlight,
  ambientLight,
  shadowQuality,
  environment,
  onFileUpload,
  onModelsChange,
  onSceneReady,
  showPrimitives = true,
  activeTool = 'select',
  onPointCreate,
  onMeasureCreate
}: ThreeViewerProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { selectObject, selectedObject, clearSelection } = useSelectionContext();

  const {
    sceneRef,
    cameraRef,
    rendererRef,
    labelRendererRef,
    controlsRef,
    gridHelperRef,
    performanceMetrics
  } = useThreeScene(mountRef);

  // Expose scene to parent components
  useEffect(() => {
    if (sceneRef.current && onSceneReady) {
      onSceneReady(sceneRef.current);
    }
  }, [sceneRef.current, onSceneReady]);

  const { boxRef } = useBoxMesh(
    sceneRef.current,
    dimensions,
    boxColor,
    objectName,
    true // Always show the primitive box
  );

  // Mark box as primitive for scene tree
  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.userData.isPrimitive = true;
    }
  }, [boxRef.current]);

  const {
    loadedModels,
    currentModel,
    isLoading,
    error,
    loadFBXModel,
    switchToModel,
    removeModel
  } = useFBXLoader(sceneRef.current);

  // Expose models to parent component
  useEffect(() => {
    if (onModelsChange) {
      onModelsChange(loadedModels, currentModel);
    }
  }, [loadedModels, currentModel, onModelsChange]);

  // Expose FBX handlers globally for parent components to access
  useEffect(() => {
    (window as any).__fbxUploadHandler = loadFBXModel;
    (window as any).__fbxSwitchHandler = switchToModel;
    (window as any).__fbxRemoveHandler = removeModel;

    return () => {
      delete (window as any).__fbxUploadHandler;
      delete (window as any).__fbxSwitchHandler;
      delete (window as any).__fbxRemoveHandler;
    };
  }, [loadFBXModel, switchToModel, removeModel]);

  // Memoize object selection handler to prevent recreating on each render
  const handleObjectSelect = useMemo(() => (object: THREE.Object3D | null) => {
    if (object) {
      const sceneObject: SceneObject = {
        id: object.userData.isPrimitive ? `primitive_${object.uuid}` : 
            object.userData.isPoint ? `point_${object.uuid}` : `object_${object.uuid}`,
        name: object.name || `${object.type}_${object.uuid.slice(0, 8)}`,
        type: object.userData.isPrimitive ? 'primitive' : 
              object.userData.isPoint ? 'point' : 'mesh',
        object: object,
        children: [],
        visible: object.visible,
        selected: true
      };
      selectObject(sceneObject);
    } else {
      clearSelection();
    }
  }, [selectObject, clearSelection]);

  // Memoize point creation handler
  const handlePointCreate = useMemo(() => (point: { x: number; y: number; z: number }) => {
    if (onPointCreate) {
      onPointCreate(point);
    }
  }, [onPointCreate]);

  // Memoize measure creation handler
  const handleMeasureCreate = useMemo(() => (start: THREE.Vector3, end: THREE.Vector3) => {
    if (onMeasureCreate) {
      onMeasureCreate(start, end);
    }
  }, [onMeasureCreate]);

  // Use selection effects hook for visual feedback
  useSelectionEffects(selectedObject);

  // Mouse interaction and hover effects
  const { objectData, mousePosition, isHovering } = useMouseInteraction(
    rendererRef.current,
    cameraRef.current,
    currentModel ? currentModel.object : boxRef.current,
    sceneRef.current,
    handleObjectSelect,
    activeTool,
    handlePointCreate,
    handleMeasureCreate
  );

  // Zoom controls hook
  const { zoomAll, zoomToSelected, resetView } = useZoomControls(
    sceneRef,
    cameraRef,
    controlsRef,
    selectedObject
  );

  // Keyboard shortcuts
  useViewerKeyboardShortcuts({
    onClearSelection: clearSelection,
    onZoomAll: zoomAll,
    onZoomToSelected: zoomToSelected,
    selectedObject
  });

  useLighting(
    sceneRef.current,
    sunlight,
    ambientLight,
    shadowQuality
  );

  useEnvironment(
    sceneRef.current,
    environment,
    gridHelperRef.current
  );

  // Debug performance metrics in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Metrics:', performanceMetrics);
    }
  }, [performanceMetrics]);

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="w-full h-full" />
      <ObjectDataOverlay 
        objectData={objectData}
        mousePosition={mousePosition}
        visible={isHovering}
      />
      <SelectionOverlay selectedObject={selectedObject} />
    </div>
  );
});

ThreeViewer.displayName = 'ThreeViewer';

export default ThreeViewer;
