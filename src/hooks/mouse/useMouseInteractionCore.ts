
import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { invalidateIntersectableCache } from '../utils/raycastUtils';
import { useSelectTool } from '../tools/useSelectTool';
import { usePointTool } from '../tools/usePointTool';
import { useMeasureTool } from '../tools/useMeasureTool';
import { useMouseTracking } from './useMouseTracking';
import { useObjectData } from './useObjectData';
import { useMouseInteractionState } from './useMouseInteractionState';
import { useRaycastHandling } from './useRaycastHandling';
import { useMaterialManager } from '../useMaterialManager';
import { useMouseEventListeners } from './useMouseEventListeners';

interface UseMouseInteractionCoreProps {
  renderer: THREE.WebGLRenderer | null;
  camera: THREE.PerspectiveCamera | null;
  targetObject: THREE.Mesh | THREE.Group | null;
  scene: THREE.Scene | null;
  onObjectSelect?: (object: THREE.Object3D | null) => void;
  activeTool: 'select' | 'point' | 'measure' | 'move';
  controls?: OrbitControls | null;
  onPointCreate?: (point: { x: number; y: number; z: number }) => void;
  onMeasureCreate?: (start: THREE.Vector3, end: THREE.Vector3) => void;
}

export const useMouseInteractionCore = ({
  renderer,
  camera,
  targetObject,
  scene,
  onObjectSelect,
  activeTool,
  controls,
  onPointCreate,
  onMeasureCreate
}: UseMouseInteractionCoreProps) => {
  // Use enhanced material manager
  const { materialManager, setHoverEffect, setSelectionEffect } = useMaterialManager();
  
  // Use extracted hooks for state management
  const { hoveredObject, setHoveredObject } = useMouseInteractionState();
  const { mousePosition, mousePositionRef, throttledMouseMove, updateMousePosition } = useMouseTracking();
  const { objectData, setObjectData, extractObjectData } = useObjectData();

  // Initialize tools
  const selectTool = useSelectTool(renderer, camera, scene, onObjectSelect);
  const pointTool = usePointTool(renderer, camera, scene, onPointCreate, onObjectSelect);
  const measureTool = useMeasureTool(renderer, camera, scene, onMeasureCreate, onObjectSelect);

  // Enhanced raycast handling with material manager
  const { handleRaycastHover } = useRaycastHandling({
    renderer,
    camera,
    scene,
    hoveredObject,
    setHoveredObject,
    materialManager,
    extractObjectData,
    setObjectData
  });

  // Setup event listeners
  useMouseEventListeners({
    renderer,
    camera,
    scene,
    controls,
    activeTool,
    hoveredObject,
    setHoveredObject,
    handleRaycastHover,
    mousePositionRef,
    selectTool,
    pointTool,
    measureTool,
    setObjectData,
    throttledMouseMove,
    updateMousePosition
  });

  // Invalidate intersection cache when scene changes
  useEffect(() => {
    if (scene) {
      invalidateIntersectableCache();
    }
  }, [scene, targetObject]);

  // Cleanup effects
  useEffect(() => {
    return () => {
      // Cleanup hover effects
      if (hoveredObject && materialManager) {
        setHoverEffect(hoveredObject, false);
      }
      
      // Cleanup tools
      measureTool.cleanup();
    };
  }, [hoveredObject, materialManager, setHoverEffect, measureTool]);

  return { 
    objectData, 
    mousePosition, 
    isHovering: !!hoveredObject 
  };
};
