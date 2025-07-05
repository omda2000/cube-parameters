
import { useEffect, useState, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MaterialManager } from './utils/materialManager';
import { invalidateIntersectableCache } from './utils/raycastUtils';
import { useSelectTool } from './tools/useSelectTool';
import { usePointTool } from './tools/usePointTool';
import { useMeasureTool } from './tools/useMeasureTool';
import { useMouseTracking } from './mouse/useMouseTracking';
import { useObjectData } from './mouse/useObjectData';
import { performRaycast } from './mouse/raycastPerformance';
import { getCursorForTool, setCursor } from './mouse/cursorUtils';

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
  const [hoveredObject, setHoveredObject] = useState<THREE.Object3D | null>(null);
  const materialManagerRef = useRef<MaterialManager | null>(null);

  // Use the extracted hooks
  const { mousePosition, mousePositionRef, throttledMouseMove, updateMousePosition } = useMouseTracking();
  const { objectData, setObjectData, extractObjectData } = useObjectData();

  // Initialize tools
  const selectTool = useSelectTool(renderer, camera, scene, onObjectSelect);
  const pointTool = usePointTool(renderer, camera, scene, onPointCreate, onObjectSelect);
  const measureTool = useMeasureTool(renderer, camera, scene, onMeasureCreate, onObjectSelect);

  const handleRaycastHover = useCallback((x: number, y: number) => {
    if (!renderer || !camera || !scene) return;

    const intersectedObject = performRaycast(x, y, renderer, camera, scene);

    if (intersectedObject !== hoveredObject) {
      if (hoveredObject && materialManagerRef.current) {
        materialManagerRef.current.setHoverEffect(hoveredObject, false);
      }

      if (intersectedObject && materialManagerRef.current) {
        materialManagerRef.current.setHoverEffect(intersectedObject, true);
        setObjectData(extractObjectData(intersectedObject));
      } else {
        setObjectData(null);
      }

      setHoveredObject(intersectedObject);
    }
  }, [hoveredObject, renderer, camera, scene, extractObjectData]);

  useEffect(() => {
    if (!renderer || !camera || !scene) return;

    materialManagerRef.current = new MaterialManager();

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
      // Clear any existing hover effects before selection
      if (hoveredObject && materialManagerRef.current) {
        materialManagerRef.current.setHoverEffect(hoveredObject, false);
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

    const handleMouseLeave = () => {
      if (hoveredObject && materialManagerRef.current) {
        materialManagerRef.current.setHoverEffect(hoveredObject, false);
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
      
      if (hoveredObject && materialManagerRef.current) {
        materialManagerRef.current.setHoverEffect(hoveredObject, false);
      }
      
      measureTool.cleanup();
      
      if (materialManagerRef.current) {
        materialManagerRef.current.dispose();
      }
    };
  }, [renderer, camera, scene, hoveredObject, activeTool, controls, selectTool, pointTool, measureTool, onObjectSelect, onPointCreate, onMeasureCreate, throttledMouseMove, updateMousePosition, handleRaycastHover]);

  // Invalidate intersection cache when scene changes
  useEffect(() => {
    if (scene) {
      invalidateIntersectableCache();
    }
  }, [scene, targetObject]);

  return { objectData, mousePosition, isHovering: !!hoveredObject };
};
