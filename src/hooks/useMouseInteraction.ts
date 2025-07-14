
import { useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { invalidateIntersectableCache } from './utils/raycastUtils';
import { useSelectTool } from './tools/useSelectTool';
import { usePointTool } from './tools/usePointTool';
import { useMeasureTool } from './tools/useMeasureTool';
import { useMouseTracking } from './mouse/useMouseTracking';
import { useObjectData } from './mouse/useObjectData';
import { useMouseInteractionState } from './mouse/useMouseInteractionState';
import { useRaycastHandling } from './mouse/useRaycastHandling';
import { getCursorForTool, setCursor } from './mouse/cursorUtils';
import { useMaterialManager } from './useMaterialManager';
import { useHoverEffects } from './selection/useHoverEffects';

export const useMouseInteraction = (
  renderer: THREE.WebGLRenderer | null,
  camera: THREE.PerspectiveCamera | null,
  targetObject: THREE.Mesh | THREE.Group | null,
  scene: THREE.Scene | null,
  onObjectSelect?: (object: THREE.Object3D | null) => void,
  activeTool: 'select' | 'point' | 'measure' | 'move' = 'select',
  controls?: OrbitControls | null,
  onPointCreate?: (point: { x: number; y: number; z: number }) => void,
  onMeasureCreate?: (start: THREE.Vector3, end: THREE.Vector3) => void
) => {
  // Use enhanced material manager and hover effects
  const { materialManager, setHoverEffect, setSelectionEffect } = useMaterialManager();
  const { applyHoverEffect } = useHoverEffects();
  
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

  useEffect(() => {
    if (!renderer || !camera || !scene) return;

    const handleMouseMove = throttledMouseMove((event: MouseEvent) => {
      updateMousePosition(event.clientX, event.clientY);

      // Update cursor based on active tool
      setCursor(renderer, getCursorForTool(activeTool));

      // Handle measure tool preview
      if (activeTool === 'measure') {
        measureTool.handleMouseMove(event);
      }

      // Handle hover effects for select tool
      if (activeTool === 'select') {
        handleRaycastHover(event.clientX, event.clientY);
      }
    });

    const updateHover = () => {
      if (activeTool !== 'select') return;
      handleRaycastHover(mousePositionRef.current.x, mousePositionRef.current.y);
    };

    const handleClick = (event: MouseEvent) => {
      // Prevent default behavior and stop propagation to avoid conflicts
      event.preventDefault();
      event.stopPropagation();

      // Temporarily disable controls during selection
      if (controls) {
        controls.enabled = false;
        // Re-enable controls after a short delay
        setTimeout(() => {
          if (controls) controls.enabled = true;
        }, 50);
      }

      // Clear any existing hover effects before selection
      if (hoveredObject) {
        setHoverEffect(hoveredObject, false);
        applyHoverEffect(hoveredObject, false);
        setHoveredObject(null);
      }

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

    const handleTouchEnd = (event: TouchEvent) => {
      // Prevent default behavior and stop propagation
      event.preventDefault();
      event.stopPropagation();

      // Temporarily disable controls during selection
      if (controls) {
        controls.enabled = false;
        setTimeout(() => {
          if (controls) controls.enabled = true;
        }, 100);
      }

      // Clear any existing hover effects before selection
      if (hoveredObject) {
        setHoverEffect(hoveredObject, false);
        applyHoverEffect(hoveredObject, false);
        setHoveredObject(null);
      }

      if (activeTool === 'select') {
        selectTool.handleTouch(event);
      }
    };

    const handleMouseLeave = () => {
      if (hoveredObject) {
        setHoverEffect(hoveredObject, false);
        applyHoverEffect(hoveredObject, false);
        setHoveredObject(null);
        setObjectData(null);
      }
      measureTool.cleanup();
      setCursor(renderer, 'default');
    };

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      measureTool.handleRightClick();
    };

    // Add event listeners with proper priority and options
    renderer.domElement.addEventListener('mousemove', handleMouseMove, { passive: true });
    renderer.domElement.addEventListener('click', handleClick, { capture: true });
    renderer.domElement.addEventListener('touchend', handleTouchEnd, { capture: true });
    renderer.domElement.addEventListener('mouseleave', handleMouseLeave);
    renderer.domElement.addEventListener('contextmenu', handleContextMenu);
    controls?.addEventListener('change', updateHover);

    return () => {
      // Cleanup event listeners
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('click', handleClick, { capture: true } as any);
      renderer.domElement.removeEventListener('touchend', handleTouchEnd, { capture: true } as any);
      renderer.domElement.removeEventListener('mouseleave', handleMouseLeave);
      renderer.domElement.removeEventListener('contextmenu', handleContextMenu);
      controls?.removeEventListener('change', updateHover);
      
      // Cleanup hover effects
      if (hoveredObject) {
        setHoverEffect(hoveredObject, false);
        applyHoverEffect(hoveredObject, false);
      }
      
      // Cleanup tools
      measureTool.cleanup();
    };
  }, [
    renderer, 
    camera, 
    scene, 
    hoveredObject, 
    activeTool, 
    controls, 
    selectTool, 
    pointTool, 
    measureTool, 
    throttledMouseMove, 
    updateMousePosition, 
    handleRaycastHover,
    setHoverEffect,
    applyHoverEffect,
    setHoveredObject,
    setObjectData,
    materialManager
  ]);

  // Invalidate intersection cache when scene changes
  useEffect(() => {
    if (scene) {
      invalidateIntersectableCache();
    }
  }, [scene, targetObject]);

  return { 
    objectData, 
    mousePosition, 
    isHovering: !!hoveredObject 
  };
};
