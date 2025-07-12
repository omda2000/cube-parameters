
import { useRef, useCallback, useEffect, useState } from 'react';
import * as THREE from 'three';
import { createRaycaster, getIntersectableObjects } from './utils/raycastUtils';
import { useHoverEffects } from './useHoverEffects';
import { useObjectData } from './mouse/useObjectData';

export const useMouseInteraction = (
  renderer: THREE.WebGLRenderer | null,
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera | null,
  targetObject: THREE.Mesh | THREE.Group | null,
  scene: THREE.Scene | null,
  onObjectSelect?: (object: THREE.Object3D | null) => void,
  activeTool: 'select' | 'point' | 'measure' | 'move' = 'select',
  controls?: any,
  onPointCreate?: (point: { x: number; y: number; z: number }) => void,
  onMeasureCreate?: (start: THREE.Vector3, end: THREE.Vector3) => void
) => {
  const lastHoveredObjectRef = useRef<THREE.Object3D | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  const { applyHoverEffect } = useHoverEffects();
  const { objectData, setObjectData, extractObjectData } = useObjectData();

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!renderer || !camera || !scene) return;

    // Update mouse position
    setMousePosition({ x: event.clientX, y: event.clientY });

    const { raycaster, mouse } = createRaycaster();
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersectableObjects = getIntersectableObjects(scene);
    const intersects = raycaster.intersectObjects(intersectableObjects, true);

    const currentHoveredObject = intersects.length > 0 ? intersects[0].object : null;
    const lastHoveredObject = lastHoveredObjectRef.current;

    if (currentHoveredObject !== lastHoveredObject) {
      // Remove hover effect from previously hovered object
      if (lastHoveredObject) {
        applyHoverEffect(lastHoveredObject, false);
      }

      // Apply hover effect to currently hovered object
      if (currentHoveredObject) {
        applyHoverEffect(currentHoveredObject, true);
        setObjectData(extractObjectData(currentHoveredObject));
        setIsHovering(true);
      } else {
        setObjectData(null);
        setIsHovering(false);
      }

      lastHoveredObjectRef.current = currentHoveredObject;
    }
  }, [renderer, camera, scene, applyHoverEffect, setObjectData, extractObjectData]);

  const handleClick = useCallback((event: MouseEvent) => {
    if (!renderer || !camera || !scene || event.button !== 0) return;

    event.stopPropagation();
    event.preventDefault();

    const isCtrlClick = event.ctrlKey || event.metaKey;
    const { raycaster, mouse } = createRaycaster();
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersectableObjects = getIntersectableObjects(scene);
    const intersects = raycaster.intersectObjects(intersectableObjects, true);
    
    if (intersects.length > 0 && onObjectSelect) {
      const hitObject = intersects[0].object;
      onObjectSelect(hitObject);
    } else if (onObjectSelect && !isCtrlClick) {
      onObjectSelect(null);
    }
  }, [renderer, camera, scene, onObjectSelect]);

  // Cleanup hover effects when component unmounts
  useEffect(() => {
    return () => {
      if (lastHoveredObjectRef.current) {
        applyHoverEffect(lastHoveredObjectRef.current, false);
      }
    };
  }, [applyHoverEffect]);

  return { 
    handleMouseMove, 
    handleClick, 
    objectData, 
    mousePosition, 
    isHovering 
  };
};
