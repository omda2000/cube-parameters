
import { useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useMeasureTool } from '../tools/useMeasureTool';
import { useSelectTool } from '../tools/useSelectTool';
import { usePointTool } from '../tools/usePointTool';
import { setCursor, getCursorForTool } from './cursorUtils';
import { useMaterialManager } from '../useMaterialManager';

interface UseMouseEventHandlersProps {
  renderer: THREE.WebGLRenderer | null;
  camera: THREE.PerspectiveCamera | null;
  scene: THREE.Scene | null;
  controls?: OrbitControls | null;
  activeTool: 'select' | 'point' | 'measure' | 'move';
  hoveredObject: THREE.Object3D | null;
  setHoveredObject: (object: THREE.Object3D | null) => void;
  handleRaycastHover: (x: number, y: number) => void;
  mousePositionRef: React.MutableRefObject<{ x: number; y: number }>;
  selectTool: ReturnType<typeof useSelectTool>;
  pointTool: ReturnType<typeof usePointTool>;
  measureTool: ReturnType<typeof useMeasureTool>;
  setObjectData: (data: any) => void;
}

export const useMouseEventHandlers = ({
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
  setObjectData
}: UseMouseEventHandlersProps) => {
  const { setHoverEffect } = useMaterialManager();

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!renderer || !camera || !scene) return;

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
  }, [renderer, camera, scene, activeTool, measureTool, handleRaycastHover]);

  const updateHover = useCallback(() => {
    if (activeTool !== 'select') return;
    handleRaycastHover(mousePositionRef.current.x, mousePositionRef.current.y);
  }, [activeTool, handleRaycastHover, mousePositionRef]);

  const handleClick = useCallback((event: MouseEvent) => {
    if (!renderer || !camera || !scene) return;

    // Prevent default behavior and stop propagation to avoid conflicts
    event.preventDefault();
    event.stopPropagation();

    // Temporarily disable controls during selection
    if (controls) {
      controls.enabled = false;
      // Re-enable controls after a short delay
      setTimeout(() => {
        if (controls) controls.enabled = true;
      }, 100);
    }

    // Clear any existing hover effects before selection
    if (hoveredObject) {
      setHoverEffect(hoveredObject, false);
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
  }, [renderer, camera, scene, controls, hoveredObject, activeTool, setHoverEffect, setHoveredObject, selectTool, pointTool, measureTool]);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (!renderer || !camera || !scene) return;

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
      setHoveredObject(null);
    }

    if (activeTool === 'select') {
      selectTool.handleTouch(event);
    }
  }, [renderer, camera, scene, controls, hoveredObject, activeTool, setHoverEffect, setHoveredObject, selectTool]);

  const handleMouseLeave = useCallback(() => {
    if (!renderer) return;

    if (hoveredObject) {
      setHoverEffect(hoveredObject, false);
      setHoveredObject(null);
      setObjectData(null);
    }
    measureTool.cleanup();
    setCursor(renderer, 'default');
  }, [renderer, hoveredObject, setHoverEffect, setHoveredObject, setObjectData, measureTool]);

  const handleContextMenu = useCallback((event: MouseEvent) => {
    event.preventDefault();
    measureTool.handleRightClick();
  }, [measureTool]);

  return {
    handleMouseMove,
    updateHover,
    handleClick,
    handleTouchEnd,
    handleMouseLeave,
    handleContextMenu
  };
};
