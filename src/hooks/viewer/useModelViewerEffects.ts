import { useEffect } from 'react';
import * as THREE from 'three';
import { useLighting } from '../useLighting';
import { useEnvironment } from '../useEnvironment';
import { useSelectionEffects } from '../useSelectionEffects';
import { useMouseInteraction } from '../useMouseInteraction';
import type { 
  SunlightSettings, 
  AmbientLightSettings, 
  EnvironmentSettings,
  ShadowQuality,
  SceneObject
} from '../../types/model';

interface UseModelViewerEffectsProps {
  // Scene elements
  sceneRef: React.MutableRefObject<THREE.Scene | null>;
  rendererRef: React.MutableRefObject<THREE.WebGLRenderer | null>;
  perspectiveCameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>;
  controlsRef: React.MutableRefObject<any>;
  gridHelperRef: React.MutableRefObject<THREE.GridHelper | null>;
  boxRef: React.MutableRefObject<THREE.Mesh | null>;
  
  // Current model
  currentModel: any;
  
  // Selected objects
  selectedObjects: SceneObject[];
  
  // Settings
  sunlight: SunlightSettings;
  ambientLight: AmbientLightSettings;
  shadowQuality: ShadowQuality;
  environment: EnvironmentSettings;
  performanceMetrics: any;
  
  // Tool settings
  activeTool: 'select' | 'point' | 'measure' | 'move';
  
  // Event handlers
  handleObjectSelect: (object: THREE.Object3D | null, isMultiSelect?: boolean) => void;
  handlePointCreate: (point: { x: number; y: number; z: number }) => void;
  handleMeasureCreate: (start: THREE.Vector3, end: THREE.Vector3) => void;
  onSceneReady?: (scene: THREE.Scene) => void;
}

export const useModelViewerEffects = ({
  sceneRef,
  rendererRef,
  perspectiveCameraRef,
  controlsRef,
  gridHelperRef,
  boxRef,
  currentModel,
  selectedObjects,
  sunlight,
  ambientLight,
  shadowQuality,
  environment,
  performanceMetrics,
  activeTool,
  handleObjectSelect,
  handlePointCreate,
  handleMeasureCreate,
  onSceneReady
}: UseModelViewerEffectsProps) => {
  
  // Apply lighting effects
  useLighting(
    sceneRef.current,
    sunlight,
    ambientLight,
    shadowQuality
  );

  // Apply environment effects
  useEnvironment(
    sceneRef.current,
    environment,
    gridHelperRef.current
  );

  // Apply selection effects
  useSelectionEffects(selectedObjects);

  // Setup mouse interaction
  const { objectData, mousePosition, isHovering } = useMouseInteraction(
    rendererRef.current,
    perspectiveCameraRef.current,
    currentModel ? currentModel.object : boxRef.current,
    sceneRef.current,
    handleObjectSelect,
    activeTool,
    controlsRef.current,
    handlePointCreate,
    handleMeasureCreate
  );

  // Mark box as primitive for scene tree
  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.userData.isPrimitive = true;
    }
  }, [boxRef]);

  // Expose scene to parent components
  useEffect(() => {
    if (sceneRef.current && onSceneReady) {
      onSceneReady(sceneRef.current);
    }
  }, [onSceneReady, sceneRef]);

  // Debug performance metrics in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && performanceMetrics) {
      console.log('Performance Metrics:', performanceMetrics);
    }
  }, [performanceMetrics]);

  return {
    objectData,
    mousePosition,
    isHovering
  };
};