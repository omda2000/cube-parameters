
import { useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { invalidateIntersectableCache } from './utils/raycastUtils';
import { useSelectTool } from './tools/useSelectTool';
import { usePointTool } from './tools/usePointTool';
import { useMeasureTool } from './tools/useMeasureTool';
import { useMousePosition } from './interaction/useMousePosition';
import { useObjectData } from './interaction/useObjectData';
import { useHoverEffects } from './interaction/useHoverEffects';
import { useThrottledEvents } from './interaction/useThrottledEvents';

export const useMouseInteraction = (
  renderer: THREE.WebGLRenderer | null,
  camera: THREE.PerspectiveCamera | null,
  targetObject: THREE.Mesh | THREE.Group | null,
  scene: THREE.Scene | null,
  onObjectSelect?: (object: THREE.Object3D | null, addToSelection?: boolean) => void,
  activeTool: 'select' | 'point' | 'measure' | 'move' = 'select',
  controls?: OrbitControls | null,
  onPointCreate?: (point: { x: number; y: number; z: number }) => void,
  onMeasureCreate?: (start: THREE.Vector3, end: THREE.Vector3) => void
) => {
  const { mousePosition, mousePositionRef, updateMousePosition } = useMousePosition();
  const { objectData, setObjectData, extractObjectData } = useObjectData();
  const { throttledMouseMove } = useThrottledEvents();
  
  const { 
    hoveredObject, 
    initializeMaterialManager, 
    performRaycast, 
    clearHoverEffects, 
    disposeMaterialManager 
  } = useHoverEffects(renderer, camera, scene, setObjectData, extractObjectData);

  // Enhanced object select handler that supports Ctrl+click
  const enhancedObjectSelect = useCallback((object: THREE.Object3D | null, event?: MouseEvent) => {
    if (onObjectSelect) {
      const addToSelection = event?.ctrlKey || event?.metaKey || false;
      onObjectSelect(object, addToSelection);
    }
  }, [onObjectSelect]);

  // Initialize tools with enhanced selection
  const selectTool = useSelectTool(renderer, camera, scene, enhancedObjectSelect);
  const pointTool = usePointTool(renderer, camera, scene, onPointCreate, enhancedObjectSelect);
  const measureTool = useMeasureTool(renderer, camera, scene, onMeasureCreate, enhancedObjectSelect);

  useEffect(() => {
    if (!renderer || !camera || !scene) return;

    initializeMaterialManager();

    const handleMouseMove = throttledMouseMove((event: MouseEvent) => {
      performRaycast(event.clientX, event.clientY);
      updateMousePosition(event);

      // Update cursor based on active tool
      const cursors = {
        point: 'crosshair',
        measure: 'crosshair',
        move: 'move',
        select: 'default'
      };
      renderer.domElement.style.cursor = cursors[activeTool];

      // Handle measure tool preview
      if (activeTool === 'measure') {
        measureTool.handleMouseMove(event);
      }

      // Handle hover effects for select tool
      if (activeTool === 'select') {
        performRaycast(event.clientX, event.clientY);
      }
    });

    const updateHover = () => {
      if (activeTool !== 'select') return;
      performRaycast(mousePositionRef.current.x, mousePositionRef.current.y);
    };

    const handleClick = (event: MouseEvent) => {
      // Clear any existing hover effects before selection
      clearHoverEffects();

      switch (activeTool) {
        case 'select':
          selectTool.handleClick(event);
          break;
        case 'point':
          pointTool.handleClick(event);
          break;
        case 'measure':
          measureTool.handleClick(event);
          break;
      }
    };

    const handleMouseLeave = () => {
      clearHoverEffects();
      measureTool.cleanup();
      renderer.domElement.style.cursor = 'default';
    };

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      measureTool.handleRightClick();
    };

    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('click', handleClick);
    renderer.domElement.addEventListener('mouseleave', handleMouseLeave);
    renderer.domElement.addEventListener('contextmenu', handleContextMenu);
    controls?.addEventListener('change', updateHover);

    return () => {
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.domElement.removeEventListener('mouseleave', handleMouseLeave);
      renderer.domElement.removeEventListener('contextmenu', handleContextMenu);
      controls?.removeEventListener('change', updateHover);
      
      clearHoverEffects();
      measureTool.cleanup();
      disposeMaterialManager();
    };
  }, [renderer, camera, scene, hoveredObject, activeTool, controls, selectTool, pointTool, measureTool, enhancedObjectSelect, onPointCreate, onMeasureCreate, initializeMaterialManager, performRaycast, updateMousePosition, clearHoverEffects, disposeMaterialManager, throttledMouseMove, mousePositionRef]);

  // Invalidate intersection cache when scene changes
  useEffect(() => {
    if (scene) {
      invalidateIntersectableCache();
    }
  }, [scene, targetObject]);

  return { objectData, mousePosition, isHovering: !!hoveredObject };
};
