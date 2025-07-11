
import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useMouseEventHandlers } from './useMouseEventHandlers';
import { useSelectTool } from '../tools/useSelectTool';
import { usePointTool } from '../tools/usePointTool';
import { useMeasureTool } from '../tools/useMeasureTool';
import { useMouseTracking } from './useMouseTracking';

interface UseMouseEventListenersProps {
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
  throttledMouseMove: (callback: (event: MouseEvent) => void) => (event: MouseEvent) => void;
  updateMousePosition: (x: number, y: number) => void;
}

export const useMouseEventListeners = ({
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
}: UseMouseEventListenersProps) => {
  const eventHandlers = useMouseEventHandlers({
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
  });

  useEffect(() => {
    if (!renderer || !camera || !scene) return;

    const handleMouseMove = throttledMouseMove((event: MouseEvent) => {
      updateMousePosition(event.clientX, event.clientY);
      eventHandlers.handleMouseMove(event);
    });

    // Add event listeners with proper priority and options
    renderer.domElement.addEventListener('mousemove', handleMouseMove, { passive: true });
    renderer.domElement.addEventListener('click', eventHandlers.handleClick, { capture: true });
    renderer.domElement.addEventListener('touchend', eventHandlers.handleTouchEnd, { capture: true });
    renderer.domElement.addEventListener('mouseleave', eventHandlers.handleMouseLeave);
    renderer.domElement.addEventListener('contextmenu', eventHandlers.handleContextMenu);
    controls?.addEventListener('change', eventHandlers.updateHover);

    return () => {
      // Cleanup event listeners
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('click', eventHandlers.handleClick, { capture: true } as any);
      renderer.domElement.removeEventListener('touchend', eventHandlers.handleTouchEnd, { capture: true } as any);
      renderer.domElement.removeEventListener('mouseleave', eventHandlers.handleMouseLeave);
      renderer.domElement.removeEventListener('contextmenu', eventHandlers.handleContextMenu);
      controls?.removeEventListener('change', eventHandlers.updateHover);
    };
  }, [
    renderer,
    camera,
    scene,
    controls,
    activeTool,
    hoveredObject,
    throttledMouseMove,
    updateMousePosition,
    eventHandlers
  ]);
};
