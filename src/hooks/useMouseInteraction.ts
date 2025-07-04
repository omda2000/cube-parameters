
import { useEffect, useState, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MaterialManager } from './utils/materialManager';
import { createRaycaster, getIntersectableObjects, invalidateIntersectableCache } from './utils/raycastUtils';
import { useSelectTool } from './tools/useSelectTool';
import { usePointTool } from './tools/usePointTool';
import { useMeasureTool } from './tools/useMeasureTool';
import { useMoveTool } from './tools/useMoveTool';

interface ObjectData {
  name: string;
  type: string;
  vertices?: number;
  triangles?: number;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  visible: boolean;
}

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
  const [objectData, setObjectData] = useState<ObjectData | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const materialManagerRef = useRef<MaterialManager | null>(null);

  // Initialize tools
  const selectTool = useSelectTool(renderer, camera, scene, onObjectSelect);
  const pointTool = usePointTool(renderer, camera, scene, onPointCreate, onObjectSelect);
  const measureTool = useMeasureTool(renderer, camera, scene, onMeasureCreate, onObjectSelect);
  const moveTool = useMoveTool(renderer, camera, scene, controls || null, onObjectSelect);

  // Memoize object data extraction to avoid recalculation
  const extractObjectData = useCallback((object: THREE.Object3D): ObjectData => {
    let vertices = 0;
    let triangles = 0;

    if (object instanceof THREE.Mesh && object.geometry) {
      const geometry = object.geometry;
      if (geometry.attributes.position) {
        vertices = geometry.attributes.position.count;
      }
      if (geometry.index) {
        triangles = geometry.index.count / 3;
      } else {
        triangles = vertices / 3;
      }
    }

    return {
      name: object.name || `${object.type}_${object.uuid.slice(0, 8)}`,
      type: object.type,
      vertices: vertices > 0 ? vertices : undefined,
      triangles: triangles > 0 ? Math.floor(triangles) : undefined,
      position: object.position.clone(),
      rotation: object.rotation.clone(),
      scale: object.scale.clone(),
      visible: object.visible
    };
  }, []);

  // Throttle mouse move to improve performance
  const throttledMouseMove = useCallback((callback: (event: MouseEvent) => void) => {
    let isThrottled = false;
    return (event: MouseEvent) => {
      if (!isThrottled) {
        callback(event);
        isThrottled = true;
        requestAnimationFrame(() => {
          isThrottled = false;
        });
      }
    };
  }, []);

  useEffect(() => {
    if (!renderer || !camera || !scene) return;

    materialManagerRef.current = new MaterialManager();

    const performRaycast = (x: number, y: number) => {
      const { raycaster, mouse, dispose } = createRaycaster();
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((x - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((y - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersectableObjects = getIntersectableObjects(scene);
      const intersects = raycaster.intersectObjects(intersectableObjects, true);

      if (intersects.length > 0) {
        const newHoveredObject = intersects[0].object;

        if (hoveredObject !== newHoveredObject) {
          if (hoveredObject && materialManagerRef.current) {
            materialManagerRef.current.setHoverEffect(hoveredObject, false);
          }

          if (materialManagerRef.current) {
            materialManagerRef.current.setHoverEffect(newHoveredObject, true);
          }
          setHoveredObject(newHoveredObject);
          setObjectData(extractObjectData(newHoveredObject));
        }
      } else {
        if (hoveredObject && materialManagerRef.current) {
          materialManagerRef.current.setHoverEffect(hoveredObject, false);
          setHoveredObject(null);
          setObjectData(null);
        }
      }

      dispose();
    };

    const handleMouseMove = throttledMouseMove((event: MouseEvent) => {
      performRaycast(event.clientX, event.clientY);

      const pos = { x: event.clientX, y: event.clientY };
      setMousePosition(pos);
      mousePositionRef.current = pos;

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
        case 'move':
          moveTool.handleClick(event);
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
      moveTool.cleanup();
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
      
      if (hoveredObject && materialManagerRef.current) {
        materialManagerRef.current.setHoverEffect(hoveredObject, false);
      }
      
      measureTool.cleanup();

      moveTool.cleanup();
      
      if (materialManagerRef.current) {
        materialManagerRef.current.dispose();
      }
    };
  }, [renderer, camera, scene, hoveredObject, activeTool, controls, selectTool, pointTool, measureTool, moveTool, onObjectSelect, onPointCreate, onMeasureCreate, extractObjectData, throttledMouseMove]);

  // Invalidate intersection cache when scene changes
  useEffect(() => {
    if (scene) {
      invalidateIntersectableCache();
    }
  }, [scene, targetObject]);

  return { objectData, mousePosition, isHovering: !!hoveredObject };
};
